import json
import random
import sys

def randomize_options(data):
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
        print()
    
    # Randomize options for each question
    for item in data:
        # Create a copy of the options list
        options = item["options"].copy()
        # Remove the answer from the options
        answer = item["answer"]
        options.remove(answer)
        # Shuffle the remaining options
        random.shuffle(options)
        # Insert the answer at a random position
        insert_pos = random.randint(0, len(options))
        options.insert(insert_pos, answer)
        # Update the options in the item
        item["options"] = options
    
    return data

def main():
    # Read the input file
    input_file = "transformed_questions.json"
    output_file = "randomized_questions.json"
    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Randomize options
        randomized_data = randomize_options(data)
        
        # Write the output file
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(randomized_data, f, indent=4)
        
        print(f"Options randomized and saved to {output_file}")
        
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 