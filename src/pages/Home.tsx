import { useState } from "react";
import { Container, TagsInput, TextInput, Title, rem } from "@mantine/core";
import { IconAt } from "@tabler/icons-react";

export default function Home() {
  const [username, setUsername] = useState<string>("");
  const [relevantTags, setRelevantTags] = useState<string[]>([]);

  return (
    <>
      <Container>
        <Title order={1}>Who's Dev.to Creator to Follow?</Title>
        <TextInput
          label="Dev.to Username"
          placeholder="For example: fahminlb33"
          leftSectionPointerEvents="none"
          leftSection={<IconAt style={{ width: rem(16), height: rem(16) }} />}
          value={username}
          onChange={(e) => setUsername(e.currentTarget.value)}
        />
        <TagsInput
          label="Relevant tags"
          data={[]}
          value={relevantTags}
          onChange={setRelevantTags}
        />
      </Container>
    </>
  );
}
