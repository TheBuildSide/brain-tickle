import requests
import json
import os
from typing import List, Dict

def fetch_trivia_questions() -> List[Dict]:
    """Fetch trivia questions from the API."""
    url = "https://the-trivia-api.com/v2/questions?limit=49"
    response = requests.get(url)
    return response.json()

def transform_question(api_question: Dict) -> Dict:
    """Transform API question format to desired format."""
    # Combine correct and incorrect answers
    all_options = api_question["incorrectAnswers"] + [api_question["correctAnswer"]]
    
    return {
        "question": api_question["question"]["text"],
        "answer": api_question["correctAnswer"],
        "options": all_options
    }

def load_existing_questions() -> List[Dict]:
    """Load existing questions from JSON file if it exists."""
    if os.path.exists("trivia_questions.json"):
        with open("trivia_questions.json", "r", encoding="utf-8") as f:
            return json.load(f)
    return []

def save_questions(questions: List[Dict]):
    """Save questions to JSON file."""
    with open("trivia_questions.json", "w", encoding="utf-8") as f:
        json.dump(questions, f, indent=4)

def is_duplicate_question(new_question: Dict, existing_questions: List[Dict]) -> bool:
    """Check if a question already exists in the list."""
    return any(q["question"] == new_question["question"] for q in existing_questions)

def main():
    # Load existing questions
    existing_questions = load_existing_questions()
    
    # Fetch new questions
    api_questions = fetch_trivia_questions()
    
    # Transform and filter new questions
    new_questions = []
    for api_question in api_questions:
        transformed_question = transform_question(api_question)
        if not is_duplicate_question(transformed_question, existing_questions):
            new_questions.append(transformed_question)
    
    # Add new questions to existing ones
    existing_questions.extend(new_questions)
    
    # Save updated questions
    save_questions(existing_questions)
    
    print(f"Added {len(new_questions)} new questions. Total questions: {len(existing_questions)}")

if __name__ == "__main__":
    main() 