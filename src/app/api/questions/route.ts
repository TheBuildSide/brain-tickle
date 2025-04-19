import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { initializeDatabase } from "@/lib/init-db";

interface Question {
  id: string;
  question: string;
  answer: string;
  options: string;
  isDone: boolean;
  created_at?: string;
  updated_at?: string;
}

// Initialize database on first API call
if (!global.__dbInitialized) {
  initializeDatabase().catch(console.error);
}

export async function GET() {
  try {
    // Get current date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    // Query questions for today's date
    const { data: questionsData, error: selectError } = await supabase
      .from("questions")
      .select("*")
      .eq("datetoshow", today)
      .eq("isdone", false);

    if (selectError) {
      return NextResponse.json({ error: selectError.message }, { status: 500 });
    }

    if (!questionsData || questionsData.length === 0) {
      return NextResponse.json(
        { error: "No questions available for today" },
        { status: 404 }
      );
    }

    // Update all retrieved questions to mark them as done
    // const questionIds = questionsData.map((q) => q.id);
    // const { error: updateError } = await supabase
    //   .from("questions")
    //   .update({ isdone: true })
    //   .in("id", questionIds);

    // if (updateError) {
    //   return NextResponse.json({ error: updateError.message }, { status: 500 });
    // }

    // Transform the data to parse options string into array for all questions
    const transformedData = questionsData.map((question) => ({
      ...question,
      options: question.options
        ? question.options.split(",").map((opt: string) => opt.trim())
        : [],
    }));

    return NextResponse.json({ data: transformedData });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const questions = await request.json();

    // Validate input
    if (!Array.isArray(questions)) {
      return NextResponse.json(
        { error: "Request body must be an array of questions" },
        { status: 400 }
      );
    }

    // Process each question
    const processedQuestions = questions.map((question) => ({
      options: Array.isArray(question.options)
        ? question.options.join(", ")
        : question.options,
      isdone: false,
      datetoshow: question.dateToShow,
      question: question.question,
      answer: question.answer,
    }));

    // Start a transaction
    const { data, error } = await supabase
      .from("questions")
      .insert(processedQuestions)
      .select();

    if (error) {
      console.error("Error inserting questions:", error);
      return NextResponse.json(
        { error: "Failed to insert questions", details: error.message },
        { status: 500 }
      );
    }

    // Transform the returned data to match the expected format
    const transformedData = (data as Question[]).map((question) => ({
      ...question,
      options: question.options
        ? question.options.split(",").map((opt: string) => opt.trim())
        : [],
    }));

    return NextResponse.json({ data: transformedData });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
