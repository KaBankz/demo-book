"use server";

import {
  generateObject,
  experimental_generateImage as generateImage,
} from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

const storyModel = openai("gpt-4o");
const imageModel = openai.image("dall-e-3");

const storySchema = z.object({
  title: z.string(),
  pages: z
    .array(
      z.object({
        pageNumber: z.number(),
        text: z.string(),
        imagePrompt: z.string(),
      }),
    )
    .length(5),
});

type StoryData = z.infer<typeof storySchema>;

async function generateStoryText(prompt: string): Promise<StoryData> {
  const { object } = await generateObject({
    model: storyModel,
    schema: storySchema,
    prompt: `Create a 5-page children's picture book based on the following prompt.

Prompt: ${prompt}

Remember to keep the language simple and engaging for young children. Focus on colorful descriptions, repetition, and a clear, easy-to-follow plot. Ensure that the image prompts create a cohesive visual style throughout the book.`,
    temperature: 0.7,
    maxTokens: 2000,
  });

  return object;
}

async function generateStoryImage(imagePrompt: string) {
  const { image } = await generateImage({
    model: imageModel,
    prompt: `Create a child-friendly illustration for a children's picture book. The style should be colorful, whimsical, and appealing to young children. ${imagePrompt}`,
    size: "1024x1024",
  });

  return image.base64;
}

export async function generateStory(prompt: string) {
  const storyData = await generateStoryText(prompt);
  const storyWithImages = await Promise.all(
    storyData.pages.map(async (page) => {
      const imageBase64 = await generateStoryImage(page.imagePrompt);
      return {
        pageNumber: page.pageNumber,
        text: page.text,
        image: `data:image/png;base64,${imageBase64}`,
      };
    }),
  );

  return {
    title: storyData.title,
    pages: storyWithImages,
  };
}
