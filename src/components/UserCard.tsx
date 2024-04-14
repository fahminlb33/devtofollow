import { Group, Paper, Image, Stack, Text, Anchor } from "@mantine/core";

export interface UserCardProps {
  username: string;
  name?: string;
  githubUsername?: string;
  imageUrl?: string;
}

export default function UserCard(props: UserCardProps) {
  return (
    <Paper>
      <Group>
        <Image
          radius="md"
          h="90px"
          w="90px"
          src={props.imageUrl}
          fallbackSrc="https://placehold.co/120x120?text=No+Image"
        />
        <Stack gap={0}>
          <Text fw={700} size="xl">
            {props.name}
          </Text>
          <Text>Dev.to: {props.username}</Text>
          <Text>
            GitHub:{" "}
            <Anchor
              href={`https://github.com/${props.githubUsername}`}
              target="_blank"
            >
              {props.githubUsername}
            </Anchor>
          </Text>
        </Stack>
      </Group>
    </Paper>
  );
}
