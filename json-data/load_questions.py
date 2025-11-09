#!/usr/bin/env python3
"""
Load ham radio exam questions from JSON files and generate SQL insert statements.
"""

import json
from pathlib import Path
from typing import Dict, List, Set

def load_json_file(filepath: Path) -> List[Dict]:
    """Load and parse a JSON file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def extract_subsection_id(question_id: str) -> str:
    """Extract the 3-character subsection ID (e.g., 'T1A' from 'T1A01')."""
    return question_id[:3]

def sql_escape(text: str) -> str:
    """Escape single quotes for SQL."""
    return text.replace("'", "''")

def generate_sql(json_files: List[Path], output_file: Path):
    """Generate SQL insert statements from JSON files."""
    
    # License class mapping
    license_classes = {
        'T': {'name': 'Technician', 'description': 'Entry-level amateur radio license'},
        'G': {'name': 'General', 'description': 'Intermediate amateur radio license'},
        'E': {'name': 'Extra', 'description': 'Highest class amateur radio license'}
    }
    
    # Collect all unique subsections
    subsections: Set[str] = set()
    all_questions = []
    
    # Load all questions from JSON files
    for json_file in json_files:
        questions = load_json_file(json_file)
        all_questions.extend(questions)
        for q in questions:
            subsections.add(extract_subsection_id(q['id']))
    
    # Sort for consistent output
    subsections = sorted(subsections)
    all_questions.sort(key=lambda q: q['id'])
    
    # Generate SQL file
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("-- Ham Radio Exam Question Data\n")
        f.write("-- Generated from JSON files\n\n")
        
        # Insert license classes
        f.write("-- Insert license classes\n")
        f.write("INSERT INTO license_classes (code, name, description) VALUES\n")
        license_values = []
        for code in sorted(license_classes.keys()):
            lc = license_classes[code]
            license_values.append(
                f"  ('{code}', '{lc['name']}', '{lc['description']}')"
            )
        f.write(',\n'.join(license_values) + ';\n\n')
        
        # Insert subsections
        f.write("-- Insert subsections\n")
        f.write("INSERT INTO subsections (id, license_class, section_number, subsection_letter) VALUES\n")
        subsection_values = []
        for sub_id in subsections:
            license_class = sub_id[0]
            section_num = sub_id[1]
            subsection_letter = sub_id[2]
            subsection_values.append(
                f"  ('{sub_id}', '{license_class}', '{section_num}', '{subsection_letter}')"
            )
        f.write(',\n'.join(subsection_values) + ';\n\n')
        
        # Insert questions
        f.write("-- Insert questions\n")
        f.write("INSERT INTO questions (id, subsection_id, question_text, fcc_refs) VALUES\n")
        question_values = []
        for q in all_questions:
            question_id = q['id']
            subsection_id = extract_subsection_id(question_id)
            question_text = sql_escape(q['question'])
            fcc_refs = sql_escape(q.get('refs', ''))
            question_values.append(
                f"  ('{question_id}', '{subsection_id}', '{question_text}', '{fcc_refs}')"
            )
        f.write(',\n'.join(question_values) + ';\n\n')
        
        # Insert answers
        f.write("-- Insert answers\n")
        f.write("INSERT INTO answers (question_id, answer_text, is_correct, answer_order) VALUES\n")
        answer_values = []
        for q in all_questions:
            question_id = q['id']
            correct_index = q['correct']
            for idx, answer_text in enumerate(q['answers']):
                escaped_answer = sql_escape(answer_text)
                is_correct = 'TRUE' if idx == correct_index else 'FALSE'
                answer_values.append(
                    f"  ('{question_id}', '{escaped_answer}', {is_correct}, {idx})"
                )
        f.write(',\n'.join(answer_values) + ';\n')
    
    # Print summary
    print(f"✓ Generated {output_file}")
    print(f"  - License classes: {len(license_classes)}")
    print(f"  - Subsections: {len(subsections)}")
    print(f"  - Questions: {len(all_questions)}")
    print(f"  - Answers: {sum(len(q['answers']) for q in all_questions)}")

def main():
    """Main entry point."""
    json_dir = Path(__file__).parent
    output_file = Path(__file__).parent / 'data.sql'
    
    json_files = [
        json_dir / 'technician.json',
        json_dir / 'general.json',
        json_dir / 'extra.json'
    ]
    
    # Verify all files exist
    for json_file in json_files:
        if not json_file.exists():
            print(f"Error: {json_file} not found")
            return 1
    
    generate_sql(json_files, output_file)
    return 0

if __name__ == '__main__':
    exit(main())
