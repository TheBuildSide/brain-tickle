import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { validate } from "deep-email-validator";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, feedback } = body;

    // Validate the input
    if (!name || !email || !feedback) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format and existence
    const validationResult = await validate({
      email,
      validateRegex: true,
      validateMx: true,
      validateTypo: true,
      validateDisposable: true,
      validateSMTP: true,
    });

    if (!validationResult.valid) {
      return NextResponse.json(
        {
          error: "Invalid email address",
          reason: validationResult.reason,
        },
        { status: 400 }
      );
    }

    // Insert feedback into the database
    const { error } = await supabase
      .from("feedback")
      .insert([{ name, email, feedback }]);

    if (error) {
      console.error("Error inserting feedback:", error);
      return NextResponse.json(
        { error: "Failed to submit feedback" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Feedback submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing feedback:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
