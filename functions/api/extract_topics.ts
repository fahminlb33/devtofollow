import { z } from "zod";
import { Ai } from "@cloudflare/ai";

import { Env } from "../utils/types";

const RequestSchema = z.object({
  summaries: z.string().array(),
});

export const onRequestPost: PagesFunction<Env> = async (context) => {
  // parse request body
  const body = RequestSchema.safeParse(await context.request.json());
  if (!body.success) {
    return new Response("Missing summaries", { status: 400 });
  }

  // summarize the post
  const ai = new Ai(context.env.AI);
  // @ts-expect-error
  const summarized = await ai.run("@hf/mistral/mistral-7b-instruct-v0.2", {
    stream: false,
    prompt: [
      {
        role: "system",
        content:
          "You are an expert in extracting key topic from multiple blog posts summary to describe the common topic used in the context. " +
          "Example of these topics are web development, software engineering, or graphic design. " +
          "Keep the topic short and concise, no longer than 5 sentences.",
      },
      {
        role: "user",
        content:
          "Context:\n" +
          body.data.summaries.map((summary) => `- ${summary}`).join("\n"),
      },
    ],
  });

  // @ts-expect-error
  return new Response(summarized.response);
};
