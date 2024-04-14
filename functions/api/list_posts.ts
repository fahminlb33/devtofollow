import { z } from "zod";

import { Env, USER_AGENT } from "../utils/types";

const DevtoListArticleResponse = z
  .object({
    title: z.string(),
    url: z.string().url(),
    published_timestamp: z.coerce.date(),
    tag_list: z.array(z.string()),
    user: z.object({
      username: z.string(),
      name: z.string().optional(),
      github_username: z.string().optional(),
      profile_image_90: z.string().url().optional(),
    }),
  })
  .array();

export const onRequestGet: PagesFunction<Env> = async (context) => {
  // parse URL to get the username
  const url = new URL(context.request.url);
  if (!url.searchParams.get("username")) {
    return new Response("Missing username", { status: 400 });
  }

  // list posts by username
  const res = await fetch(
    "https://dev.to/api/articles?username=" + url.searchParams.get("username"),
    {
      method: "GET",
      headers: { "User-Agent": USER_AGENT },
    },
  );

  // check if request is successful
  if (!res.ok) {
    console.error(
      `Failed to fetch posts: ${res.status} ${res.statusText}. URL: ${res.url}`,
    );
    return new Response("Failed to fetch posts", { status: 400 });
  }

  // select the articles
  const resBody = DevtoListArticleResponse.parse(await res.json());

  return Response.json({
    user: {
      name: resBody[0].user.name,
      username: resBody[0].user.username,
      githubUsername: resBody[0].user.github_username,
      profileImageUrl: resBody[0].user.profile_image_90,
    },
    articles: resBody.map((x) => ({
      title: x.title,
      url: x.url,
      publishedAt: x.published_timestamp,
      tags: x.tag_list,
    })),
  });
};
