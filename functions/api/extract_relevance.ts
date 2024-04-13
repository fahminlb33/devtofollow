import { z } from "zod";
import { Ai } from "@cloudflare/ai";

import { Env } from "../utils/types";

const RequestSchema = z.object({
  summaries: z.string().array(),
  topics: z.string().array(),
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
          "You are an expert in measuring the relevance between a given context and topics. " +
          "You must summarize whether the provided topic is relevant within the given context. " +
          "For example, if the context is about graphic design and the topics are about backend, then the context is not relevant. " +
          "If the context is about frontend development and the topic is CSS, then the context is relevant.",
      },
      {
        role: "user",
        content:
          "Context:\n" +
          body.data.summaries.map((summary) => `- ${summary}`).join("\n") +
          "\n\nTopics: " +
          body.data.topics.join(", "),
      },
    ],
  });

  // @ts-expect-error
  return new Response(summarized.response);
};
