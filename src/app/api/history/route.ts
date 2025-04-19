import { NextResponse } from "next/server";

// Mark this route as dynamic to prevent caching
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await fetch("https://today.zenquotes.io/api", {
      cache: "no-store",
      next: { revalidate: 0 },
    });
    const data = await response.json();

    // Log the entire response to see its structure
    console.log("API Response:", JSON.stringify(data, null, 2));

    // More defensive checking of the response structure
    if (data && typeof data === "object") {
      // Check if Events exists directly in data or in data.data
      const events = data.Events || (data.data && data.data.Events);

      if (Array.isArray(events) && events.length > 0) {
        const randomIndex = Math.floor(Math.random() * events.length);
        const randomEvent = events[randomIndex];
        console.log("Selected event:", randomEvent);

        // Ensure we return the data in the expected format
        const formattedEvent = {
          text: randomEvent.text || randomEvent.description || "",
          html:
            randomEvent.html ||
            `<p>${randomEvent.text || randomEvent.description || ""}</p>`,
        };

        return NextResponse.json(formattedEvent, {
          headers: {
            "Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        });
      }
    }

    console.log("No valid events found in response");
    return NextResponse.json(
      {
        error: "No events available",
        text: "Come back tomorrow for a new historical event.",
        html: "<p>Come back tomorrow for a new historical event.</p>",
      },
      {
        status: 404,
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching history:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch history",
        text: "Failed to load historical event. Please try again.",
        html: "<p>Failed to load historical event. Please try again.</p>",
        details: error instanceof Error ? error.message : String(error),
      },
      {
        status: 500,
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  }
}
