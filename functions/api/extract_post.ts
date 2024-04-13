import { z } from "zod";
import { Ai } from "@cloudflare/ai";

import { Env, USER_AGENT } from "../utils/types";
import { extractTextFromHTML } from "../utils/html_extractor";

const RequestSchema = z.object({
  url: z.string().url(),
});

export const onRequestPost: PagesFunction<Env> = async (context) => {
  // parse request body
  const body = RequestSchema.safeParse(await context.request.json());
  if (!body.success) {
    return new Response("Missing url", { status: 400 });
  }

  // fetch the dev.to post
  const res = await fetch(body.data.url, {
    method: "GET",
    headers: { "User-Agent": USER_AGENT },
  });

  // extract the contents
  const contents = await extractTextFromHTML(res);

  // summarize the post
  const ai = new Ai(context.env.AI);
  const summarized = await ai.run("@cf/facebook/bart-large-cnn", {
    input_text: contents,
  });

  return new Response(summarized.summary);
};
