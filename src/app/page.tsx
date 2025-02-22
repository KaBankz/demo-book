"use client";

import { useState } from "react";
import { generateStory } from "./actions";
import { z } from "zod";

const storySchema = z.object({
  title: z.string(),
  pages: z
    .array(
      z.object({
        pageNumber: z.number(),
        text: z.string(),
        image: z.string(),
      }),
    )
    .length(5),
});

type StoryData = z.infer<typeof storySchema>;

export default function StoryGenerator() {
  const [prompt, setPrompt] = useState("");
  const [story, setStory] = useState<StoryData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const generatedStory = await generateStory(prompt);
      const parsedStory = storySchema.parse(generatedStory);
      setStory(parsedStory);
    } catch (error) {
      console.error("Error generating story:", error);
    }
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-center text-4xl font-bold text-purple-800">
          Story Generator
        </h1>
        <form onSubmit={handleSubmit} className="mb-8">
          <label
            htmlFor="prompt"
            className="mb-2 block text-lg font-medium text-gray-700"
          >
            Enter a story prompt:
          </label>
          <div className="flex gap-4">
            <input
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Once upon a time in a magical forest..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
            <button
              type="submit"
              disabled={isGenerating}
              className="rounded-lg bg-purple-600 px-6 py-2 font-semibold text-white shadow-sm transition hover:bg-purple-700 disabled:bg-purple-300"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Generating...
                </span>
              ) : (
                "Generate Story"
              )}
            </button>
          </div>
        </form>
        {story && (
          <div className="space-y-8">
            <h2 className="text-center text-3xl font-bold text-purple-800">
              {story.title}
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {story.pages.map((page) => (
                <div
                  key={page.pageNumber}
                  className="overflow-hidden rounded-xl border bg-white p-6 shadow-lg transition hover:shadow-xl"
                >
                  <h3 className="mb-4 text-2xl font-bold text-purple-800">
                    Page {page.pageNumber}
                  </h3>
                  <p className="mb-4 leading-relaxed text-gray-700">
                    {page.text}
                  </p>
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={page.image}
                      alt={`Illustration for page ${page.pageNumber}`}
                      className="rounded-lg object-cover shadow-md"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
