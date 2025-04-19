import { NextResponse } from "next/server";

// Mark this route as dynamic to prevent caching
export const dynamic = "force-dynamic";

// Cache for storing today's events
let cachedEvents: any = null;
let lastFetchDate: string | null = null;

export async function GET() {
  try {
    // Get current date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    // Return cached response if available and from today
    if (cachedEvents && lastFetchDate === today) {
      return NextResponse.json(cachedEvents, {
        headers: {
          "Cache-Control": "public, max-age=86400", // Cache for 24 hours
          "X-Cache": "HIT",
        },
      });
    }

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
        // Transform all events into the expected format
        const formattedEvents = events.map((event) => ({
          text: event.text || event.description || "",
          html: event.html || `<p>${event.text || event.description || ""}</p>`,
        }));

        // Cache the results
        cachedEvents = formattedEvents;
        lastFetchDate = today;

        return NextResponse.json(formattedEvents, {
          headers: {
            "Cache-Control": "public, max-age=86400", // Cache for 24 hours
            "X-Cache": "MISS",
          },
        });
      }
    }

    console.log("No valid events found in response");
    return NextResponse.json(
      {
        error: "No events available",
        text: "Come back tomorrow for new historical events.",
        html: "<p>Come back tomorrow for new historical events.</p>",
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
        text: "Failed to load historical events. Please try again.",
        html: "<p>Failed to load historical events. Please try again.</p>",
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
