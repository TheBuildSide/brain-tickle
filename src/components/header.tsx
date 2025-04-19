"use client";

import { useMemo } from "react";

const adjectives = [
  "magnificent",
  "glorious",
  "wonderful",
  "splendid",
  "delightful",
  "charming",
  "peaceful",
  "energetic",
  "vibrant",
  "inspiring",
  "amazing",
  "brilliant",
  "fantastic",
  "marvelous",
  "outstanding",
  "perfect",
  "remarkable",
  "spectacular",
  "superb",
  "terrific",
];

export function Header() {
  const { day, adjective } = useMemo(() => {
    const today = new Date();
    const dayName = today.toLocaleString("en-US", { weekday: "long" });
    // Use the date as seed to get the same adjective for the whole day
    const dateString = today.toISOString().slice(0, 10); // YYYY-MM-DD
    const seed = dateString
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const adjective = adjectives[seed % adjectives.length];
    return { day: dayName, adjective };
  }, []);

  return (
    <header className="text-center mb-4">
      <h1 className="text-4xl font-bold mb-2">
        What a {adjective} {day}!
      </h1>
      <p className="text-lg text-muted-foreground">Flex Your Fact Muscles</p>
    </header>
  );
}
