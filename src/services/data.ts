import { z } from "zod";

export type ResultOk<T> = { ok: true; data: T };
export type ResultError = { ok: false; error: string };
export type Result<T> = ResultError | ResultOk<T>;

const ListPostSchema = z.object({
  user: z.object({
    username: z.string(),
    name: z.string().optional(),
    githubUsername: z.string().optional(),
    profileImageUrl: z.string().url().optional(),
  }),
  articles: z.array(
    z.object({
      title: z.string(),
      url: z.string().url(),
      publishedAt: z.coerce.date(),
      tags: z.array(z.string()),
    }),
  ),
});

export type PostResponse = z.infer<typeof ListPostSchema>;

export async function listPosts(
  username: string,
): Promise<Result<PostResponse>> {
  const res = await fetch(`/api/list_posts?username=${username}`, {
    method: "GET",
  });
  if (!res.ok) {
    return { ok: false, error: await res.text() };
  }

  const data = ListPostSchema.parse(await res.json());
  return { ok: true, data };
}

export async function summarize(url: string): Promise<Result<string>> {
  const res = await fetch(`/api/extract_post`, {
    method: "POST",
    body: JSON.stringify({ url }),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    return { ok: false, error: await res.text() };
  }

  return { ok: true, data: await res.text() };
}

export async function extractTopics(
  summaries: string[],
): Promise<Result<string>> {
  const res = await fetch(`/api/extract_topics`, {
    method: "POST",
    body: JSON.stringify({ summaries }),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    return { ok: false, error: await res.text() };
  }

  return { ok: true, data: await res.text() };
}

export async function extractRelevance(
  summaries: string[],
  topics: string[],
): Promise<Result<string>> {
  const res = await fetch(`/api/extract_relevance`, {
    method: "POST",
    body: JSON.stringify({ summaries, topics }),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    return { ok: false, error: await res.text() };
  }

  return { ok: true, data: await res.text() };
}
