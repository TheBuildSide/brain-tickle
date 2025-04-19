import { supabase } from "../lib/supabase";
import { readFileSync } from "fs";
import { join } from "path";

interface Question {
  question: string;
  answer: string;
  options: string[];
  dateToShow: string;
}

async function populateQuestions() {
  try {
    // Read the questions from the JSON file
    const questionsPath = join(process.cwd(), "trivia_questions.json");
    const questionsData = readFileSync(questionsPath, "utf-8");
    const questions: Question[] = JSON.parse(questionsData);

    console.log(`Found ${questions.length} questions to insert`);

    // Insert questions in batches to avoid overwhelming the database
    const batchSize = 100;
    for (let i = 0; i < questions.length; i += batchSize) {
      const batch = questions.slice(i, i + batchSize);
      const { error } = await supabase.from("questions").insert(
        batch.map((q) => ({
          question: q.question,
          answer: q.answer,
          options: q.options.join(","),
          isDone: false,
        }))
      );

      if (error) {
        console.error(`Error inserting batch ${i / batchSize + 1}:`, error);
      } else {
        console.log(`Successfully inserted batch ${i / batchSize + 1}`);
      }
    }

    console.log("Finished populating questions");
  } catch (error) {
    console.error("Error populating questions:", error);
  }
}

// Run the population script
populateQuestions(); 