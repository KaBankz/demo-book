import { type Message, streamText } from "ai";
import { groq } from "@ai-sdk/groq";
import { z } from "zod";
export async function POST(request: Request) {
  const { messages }: { messages: Array<Message> } = await request.json();

  const result = await streamText({
    model: groq("deepseek-r1-distill-llama-70b"),
    messages,
    tools: {
      getWeatherInformation: {
        description: "show the weather in a given city to the user",
        parameters: z.object({ city: z.string() }),
        // tool has execute function:
        execute: async ({}: { city: string }) => {
          const weatherOptions = ["sunny", "cloudy", "rainy", "snowy", "windy"];
          return weatherOptions[
            Math.floor(Math.random() * weatherOptions.length)
          ];
        },
      },
    },
    maxSteps: 5,
  });

  return result.toDataStreamResponse();
}
