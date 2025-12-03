import requests
from bs4 import BeautifulSoup
import os
import re
import shutil

URLS = [
    "https://hamexam.org/view_pool/18-Technician",
    "https://hamexam.org/view_pool/19-General",
    "https://hamexam.org/view_pool/20-Extra"
]

FIGURES_DIR = "figures"
SCHEMA_FILE = "database/schema.sql"

def main():
    # 1. Scrape questions and images
    if not os.path.exists(FIGURES_DIR):
        os.makedirs(FIGURES_DIR)

    question_images = {} # Map question_id -> image_filename

    for url in URLS:
        print(f"Processing {url}...")
        response = requests.get(url, verify=False)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Find all links to popup_image
        links = soup.find_all('a', href=re.compile(r'popup_image'))
        
        for link in links:
            popup_url = link['href']
            if not popup_url.startswith('http'):
                popup_url = 'https://hamexam.org' + popup_url if popup_url.startswith('/') else 'https://hamexam.org/' + popup_url
            
            # Fetch the popup page to get the real image URL
            print(f"  Fetching popup {popup_url}...")
            try:
                popup_resp = requests.get(popup_url, verify=False)
                popup_soup = BeautifulSoup(popup_resp.content, 'html.parser')
                img_tag = popup_soup.find('img')
                if not img_tag:
                    print(f"    No image found in {popup_url}")
                    continue
                    
                real_image_url = img_tag['src']
                if not real_image_url.startswith('http'):
                    real_image_url = 'https://hamexam.org' + real_image_url if real_image_url.startswith('/') else 'https://hamexam.org/' + real_image_url
                
                filename = real_image_url.split('/')[-1]
                filepath = os.path.join(FIGURES_DIR, filename)
                
                # Download image if not exists
                if not os.path.exists(filepath):
                    print(f"    Downloading {filename}...")
                    img_resp = requests.get(real_image_url, stream=True, verify=False)
                    with open(filepath, 'wb') as f:
                        shutil.copyfileobj(img_resp.raw, f)
                
                # Find the question ID associated with this link
                current = link
                found_qid = None
                for _ in range(20): # Look ahead a bit
                    current = current.next_element
                    if not current:
                        break
                    if isinstance(current, str):
                        text = current.strip()
                        # Pattern: [EGT][0-9][A-Z][0-9]{2}
                        match = re.search(r'([EGT][0-9][A-Z][0-9]{2})', text)
                        if match:
                            found_qid = match.group(1)
                            break
                
                if found_qid:
                    print(f"    Mapped {found_qid} to {filename}")
                    question_images[found_qid] = filename
                else:
                    print(f"    Could not find question ID for {popup_url}")
            except Exception as e:
                print(f"    Error processing {popup_url}: {e}")

    # 2. Modify schema.sql
    print("Modifying schema.sql...")
    with open(SCHEMA_FILE, 'r') as f:
        schema_content = f.read()

    # Add figure column to CREATE TABLE question
    if "figure VARCHAR" not in schema_content:
        schema_content = schema_content.replace(
            "content JSONB NOT NULL\n);",
            "content JSONB NOT NULL,\n  figure VARCHAR(255)\n);"
        )

    # Update INSERT statements
    schema_content = schema_content.replace(
        "INSERT INTO question (code, subsection_id, content) VALUES",
        "INSERT INTO question (code, subsection_id, content, figure) VALUES"
    )
    
    new_lines = []
    lines = schema_content.splitlines()
    
    in_question_insert = False
    
    for line in lines:
        if "INSERT INTO question" in line:
            in_question_insert = True
            new_lines.append(line)
            continue
            
        if in_question_insert:
            stripped = line.strip()
            if not stripped:
                new_lines.append(line)
                continue

            is_last = stripped.endswith(';')
            
            # Extract code
            match = re.search(r"\('([EGT][0-9][A-Z][0-9]{2})'", line)
            if match:
                qid = match.group(1)
                figure = question_images.get(qid)
                
                # Split at the last ')'
                parts = line.rsplit(')', 1)
                if len(parts) == 2:
                    prefix = parts[0]
                    suffix = parts[1] # contains ; or ,
                    
                    if figure:
                        new_line = f"{prefix}, '{figure}'){suffix}"
                    else:
                        new_line = f"{prefix}, NULL){suffix}"
                    new_lines.append(new_line)
                else:
                    new_lines.append(line)
            else:
                # Might be the end of the block or something else
                if is_last:
                    in_question_insert = False
                new_lines.append(line)
        else:
            new_lines.append(line)

    with open(SCHEMA_FILE, 'w') as f:
        f.write('\n'.join(new_lines))

if __name__ == "__main__":
    main()
