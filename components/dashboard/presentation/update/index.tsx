"use client";

import route from "@/lib/route";
import { Card, SimpleGrid, Text } from "@mantine/core";
import { Prisma } from "@prisma/client";
import Link from "next/link";

type Props = { presentations: Prisma.PresentationGetPayload<{}>[] };

export default function Update(props: Props) {
  const presentations = props.presentations.map((presentation) => (
    <Card
      key={presentation.id}
      shadow="md"
      withBorder
      component={Link}
      href={route.dashboard_presentation_update_id(presentation.id)}
    >
      <Text>{presentation.title}</Text>
    </Card>
  ));
  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }}>
      {presentations.length === 0 && (
        <Text c="dimmed">No presentation(s) found</Text>
      )}
      {presentations}
    </SimpleGrid>
  );
}
