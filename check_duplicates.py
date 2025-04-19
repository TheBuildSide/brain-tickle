import json
import sys

def check_duplicates(data):
    # Check for duplicate questions
    questions = {}
    duplicates = []
    
    for i, item in enumerate(data):
        question = item["question"]
        if question in questions:
            duplicates.append((i, questions[question], question))
        else:
            questions[question] = i
    
    if duplicates:
        print("Duplicate questions found:")
        for i, j, question in duplicates:
            print(f"  - Question at index {i} is a duplicate of question at index {j}:")
            print(f"    '{question}'")
        print(f"Total duplicates found: {len(duplicates)}")
    else:
        print("No duplicate questions found.")
    
    return duplicates

def main():
    # Read the input file
    input_file = "transformed_questions.json"
    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Check for duplicates
        duplicates = check_duplicates(data)
        
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 