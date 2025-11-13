#!/usr/bin/env python3

import json
from pathlib import Path

def sql_escape(text):
    return text.replace("'", "''")

def main():
    json_dir = Path(__file__).parent
    schema_file = Path(__file__).parent.parent / 'config' / 'schema.sql'
    
    json_files = ['technician.json', 'general.json', 'extra.json']
    
    license_classes = {
        'T': ('Technician', 'Entry-level amateur radio license'),
        'G': ('General', 'Intermediate amateur radio license'),
        'E': ('Extra', 'Highest class amateur radio license')
    }
    
    all_questions = []
    subsections = set()
    
    for filename in json_files:
        with open(json_dir / filename, 'r') as f:
            questions = json.load(f)
            all_questions.extend(questions)
            for q in questions:
                subsections.add(q['id'][:3])
    
    all_questions.sort(key=lambda q: q['id'])
    subsections = sorted(subsections)
    
    with open(schema_file, 'w') as f:
        f.write('CREATE TABLE license_class (\n')
        f.write('  id SERIAL PRIMARY KEY,\n')
        f.write('  code CHAR(1) NOT NULL UNIQUE,\n')
        f.write('  name VARCHAR(50) NOT NULL,\n')
        f.write('  description TEXT\n')
        f.write(');\n\n')
        
        f.write('CREATE TABLE subsection (\n')
        f.write('  id SERIAL PRIMARY KEY,\n')
        f.write('  code VARCHAR(3) NOT NULL UNIQUE,\n')
        f.write('  license_class_id INTEGER NOT NULL REFERENCES license_class(id)\n')
        f.write(');\n\n')
        
        f.write('CREATE TABLE question (\n')
        f.write('  id SERIAL PRIMARY KEY,\n')
        f.write('  code VARCHAR(5) NOT NULL UNIQUE,\n')
        f.write('  subsection_id INTEGER NOT NULL REFERENCES subsection(id),\n')
        f.write('  content JSONB NOT NULL\n')
        f.write(');\n\n')
        
        f.write('CREATE TABLE "user" (\n')
        f.write('  id SERIAL PRIMARY KEY,\n')
        f.write('  username VARCHAR(100) NOT NULL UNIQUE\n')
        f.write(');\n\n')
        
        f.write('CREATE TABLE user_question_mastery (\n')
        f.write('  id SERIAL PRIMARY KEY,\n')
        f.write('  user_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,\n')
        f.write('  question_id INTEGER NOT NULL REFERENCES question(id) ON DELETE CASCADE,\n')
        f.write('  mastery DECIMAL(5,2) NOT NULL DEFAULT 0.00,\n')
        f.write('  last_asked_time TIME,\n')
        f.write('  last_asked_date DATE,\n')
        f.write('  UNIQUE(user_id, question_id)\n')
        f.write(');\n\n')
        
        f.write('CREATE INDEX idx_subsection_license ON subsection(license_class_id);\n')
        f.write('CREATE INDEX idx_question_subsection ON question(subsection_id);\n')
        f.write('CREATE INDEX idx_uqm_user ON user_question_mastery(user_id);\n')
        f.write('CREATE INDEX idx_uqm_question ON user_question_mastery(question_id);\n\n')
        
        f.write('INSERT INTO "user" (username) VALUES (\'testuser\');\n\n')
        
        f.write('INSERT INTO license_class (code, name, description) VALUES\n')
        values = [f"  ('{code}', '{name}', '{desc}')" 
                  for code, (name, desc) in sorted(license_classes.items())]
        f.write(',\n'.join(values) + ';\n\n')
        
        f.write('INSERT INTO subsection (code, license_class_id) VALUES\n')
        values = []
        for sub_code in subsections:
            lc_code = sub_code[0]
            lc_id = {'E': 1, 'G': 2, 'T': 3}[lc_code]
            values.append(f"  ('{sub_code}', {lc_id})")
        f.write(',\n'.join(values) + ';\n\n')
        
        f.write('INSERT INTO question (code, subsection_id, content) VALUES\n')
        values = []
        for q in all_questions:
            sub_code = q['id'][:3]
            sub_id = subsections.index(sub_code) + 1
            content = json.dumps(q).replace("'", "''")
            values.append(f"  ('{q['id']}', {sub_id}, '{content}')")
        f.write(',\n'.join(values) + ';\n')
    
    print(f'✓ Generated {schema_file}')
    print(f'  - License classes: {len(license_classes)}')
    print(f'  - Subsections: {len(subsections)}')
    print(f'  - Questions: {len(all_questions)}')

if __name__ == '__main__':
    exit(main())
