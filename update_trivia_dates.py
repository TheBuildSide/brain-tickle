import json
from datetime import datetime, timedelta

def update_trivia_dates():
    # Read the JSON file
    with open('trivia_questions.json', 'r', encoding='utf-8') as file:
        questions = json.load(file)
    
    # Get today's date
    current_date = datetime.now()
    
    # Update each question with a date
    for i, question in enumerate(questions):
        # Calculate the date for this question
        # Every 5 questions, increment the date by 1 day
        days_to_add = i // 5
        question_date = current_date + timedelta(days=days_to_add)
        
        # Format the date as YYYY-MM-DD
        formatted_date = question_date.strftime('%Y-%m-%d')
        
        # Add the dateToShow field
        question['dateToShow'] = formatted_date
    
    # Write the updated questions back to the file
    with open('trivia_questions.json', 'w', encoding='utf-8') as file:
        json.dump(questions, file, indent=4, ensure_ascii=False)

if __name__ == '__main__':
    update_trivia_dates()
    print("Trivia questions have been updated with dates successfully!") 