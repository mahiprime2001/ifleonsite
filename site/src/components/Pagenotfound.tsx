"use client";

import { Button } from "./ui/button";
import { useNavigate } from "@/lib/router";
import { useState, useEffect } from "react";

export function NotFoundPage() {
  const navigate = useNavigate();
  const [randomQuote, setRandomQuote] = useState("");

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch("/reasons.json");
        if (!response.ok) throw new Error("Failed to fetch");
        const quotes: string[] = await response.json();
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setRandomQuote(quotes[randomIndex]);
      } catch (error) {
        console.error("Error fetching quotes:", error);
        setRandomQuote("The page took a wrong turn into the void!");
      }
    };

    fetchQuote();
  }, []);

  return (
    <section className="bg-white font-serif min-h-screen flex items-center justify-center">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="w-full sm:w-10/12 md:w-8/12 text-center">
            <div
              className="bg-[url('/paint-spill-404.gif')] h-[250px] sm:h-[350px] md:h-[400px] bg-center bg-no-repeat bg-contain"
              aria-hidden="true"
            >
              <h1 className="text-center text-ink text-6xl sm:text-7xl md:text-8xl pt-6 sm:pt-8">
                404
              </h1>
            </div>

            <div className="mt-[-50px]">
              <h3 className="text-2xl text-ink sm:text-3xl font-bold mb-4">
                Look like you&apos;re lost
              </h3>
              <p className="mb-6 text-ink sm:mb-5">
                The page you are looking for is not available!
              </p>
              {randomQuote && (
                <p className="mb-6 text-ink italic text-lg sm:text-xl font-medium p-4 bg-paper-2 rounded-lg mx-4">
                  &quot;{randomQuote}&quot;
                </p>
              )}

              <Button
                variant="default"
                onClick={() => navigate("/")}
                className="my-5 bg-brand-700 hover:bg-brand-700 "
              >
                Go to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
