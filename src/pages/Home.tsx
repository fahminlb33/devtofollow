import { useState } from "react";
import {
  Anchor,
  Button,
  Container,
  Flex,
  Group,
  List,
  NumberInput,
  Stack,
  TagsInput,
  Text,
  TextInput,
  Title,
  rem,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconAt, IconWand } from "@tabler/icons-react";
import dayjs from "dayjs";

import UserCard from "~/components/UserCard";
import {
  PostResponse,
  listPosts,
  summarize,
  extractTopics,
  extractRelevance,
  ResultOk,
} from "~/services/data";

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // inputs
  const [username, setUsername] = useState<string>("");
  const [numberOfPosts, setnumberOfPosts] = useState<string | number>(3);
  const [relevantTags, setRelevantTags] = useState<string[]>([]);
  // outputs
  const [posts, setPosts] = useState<PostResponse | null>(null);
  const [summary, setSummary] = useState<string>("");
  const [relevance, setRelevance] = useState<string>("");

  async function analyze() {
    // check if username is not empty
    if (username === "") {
      notifications.show({
        title: "Missing username",
        message: "Please enter a Dev.to username",
        color: "red",
      });
      return;
    }

    setIsLoading(true);
    setSummary("Loading...");
    setRelevance("Loading...");

    // list posts
    const posts = await listPosts(username);
    if (!posts.ok) {
      notifications.show({
        title: "Retrieving posts",
        message: posts.error,
        color: "red",
      });
      return;
    }

    setPosts(posts.data);

    // get all posts and summarize
    const summaries = await Promise.all(
      posts.data.articles.map((post) => summarize(post.url)),
    );
    const successSummaries = summaries
      .filter((s): s is ResultOk<string> => s.ok)
      .map((s) => s.data)
      .slice(0, Number(numberOfPosts));
    console.log("Posts summary", summaries);

    // check if we have any posts
    if (successSummaries.length < 1) {
      notifications.show({
        title: "Post summarization",
        message: "No posts found",
        color: "red",
      });
      return;
    }

    // extract topics from summaries
    const topicSummary = await extractTopics(successSummaries);
    if (!topicSummary.ok) {
      notifications.show({
        title: "Post summarization",
        message: topicSummary.error,
        color: "red",
      });
      return;
    }

    console.log("Topic summary", topicSummary);
    setSummary(topicSummary.data);

    // extract relevance
    if (relevantTags.length > 0) {
      const relevanceSummary = await extractRelevance(
        successSummaries,
        relevantTags.map((x) => x.trim()),
      );
      if (!relevanceSummary.ok) {
        notifications.show({
          title: "Relevance extraction",
          message: relevanceSummary.error,
          color: "red",
        });
        return;
      }

      console.log("Relevance summary", relevanceSummary);
      setRelevance(relevanceSummary.data);
    }

    setIsLoading(false);
  }

  return (
    <>
      <Container mt="xl" mb="xl">
        {/* Title */}
        <Flex align="center" justify="center" mb="xl">
          <Text
            component="h1"
            size={rem(50)}
            fw={900}
            variant="gradient"
            gradient={{ from: "cyan", to: "lime", deg: 45 }}
          >
            Who's Dev.to Writer to Follow?
          </Text>
        </Flex>

        {/* Inputs */}
        <Group align="center" justify="center">
          <TextInput
            label="Dev.to Username"
            placeholder="For example: fahminlb33"
            description="I want to follow this user..."
            disabled={isLoading}
            leftSectionPointerEvents="none"
            leftSection={<IconAt style={{ width: rem(16), height: rem(16) }} />}
            value={username}
            onChange={(e) => setUsername(e.currentTarget.value)}
          />
          <NumberInput
            label="Number of posts to analyze"
            description="...based on his/her latest number of posts..."
            disabled={isLoading}
            value={numberOfPosts}
            onChange={setnumberOfPosts}
            defaultValue={3}
            min={1}
            max={30}
          />
          <TagsInput
            label="Relevant topics"
            placeholder="For example: web dev, backend"
            description="...and I have preference for these topics... (optional)"
            disabled={isLoading}
            data={[]}
            value={relevantTags}
            onChange={setRelevantTags}
          />
        </Group>

        <Stack align="center" justify="center" mt="xl">
          <Text>Is this user posts relevant articles for me to follow?</Text>
          <Button
            size="lg"
            disabled={isLoading}
            variant="gradient"
            gradient={{ from: "cyan", to: "lime", deg: 82 }}
            leftSection={<IconWand size={24} />}
            onClick={analyze}
          >
            Check Match!
          </Button>
        </Stack>

        {/* Results */}
        <Stack align="center" mt="xl">
          {isLoading && <Text>Checking profile...</Text>}

          {posts && (
            <>
              <Title order={2} mt="lg">
                User Info
              </Title>
              <UserCard
                username={posts.user.username}
                name={posts.user.name}
                githubUsername={posts.user.githubUsername}
                imageUrl={posts.user.profileImageUrl}
              />

              <Title order={2} mt="lg">
                Latest Posts
              </Title>
              <List>
                {posts.articles.map((post) => (
                  <List.Item>
                    {dayjs(post.publishedAt).format("DD MMM YYYY")}
                    {" - "}
                    <Anchor href={post.url}>{post.title}</Anchor>
                  </List.Item>
                ))}
              </List>

              <Title order={2} mt="lg">
                Posts Summary
              </Title>
              <Text style={{ whiteSpace: "pre-line" }}>{summary}</Text>

              {relevantTags.length > 0 && (
                <>
                  <Title order={2} mt="lg">
                    Relevance
                  </Title>
                  <Text style={{ whiteSpace: "pre-line" }}>{relevance}</Text>
                </>
              )}
            </>
          )}
        </Stack>
      </Container>
    </>
  );
}
