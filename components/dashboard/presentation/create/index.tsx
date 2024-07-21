"use client";

import { createPresentation, Payload } from "@/lib/action/presentation";
import {
  ActionIcon,
  AspectRatio,
  Button,
  Card,
  Divider,
  Fieldset,
  Group,
  NativeSelect,
  SimpleGrid,
  Space,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { Prisma } from "@prisma/client";
import {
  IconCaretLeft,
  IconCaretRight,
  IconMinus,
  IconPlus,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

export default function Create() {
  const form_initialValues = () => {
    return {
      title: "",
      Slide: [
        {
          type: Prisma.ModelName.TitleSlide,
          TitleSlide: { title: "", subtitle: "" },
          TitleAndContent: { title: "", content: "" },
          SectionHeader: { section: "", subsection: "" },
          TwoContent: { title: "", firstContent: "", secondContent: "" },
          Comparison: {
            title: "",
            firstSubtitle: "",
            firstComparison: "",
            secondSubtitle: "",
            secondComparison: "",
          },
          TitleOnly: { title: "" },
          Blank: {},
        },
      ],
    } as const satisfies Payload;
  };
  const form = useForm<Payload>({
    mode: "controlled",
    initialValues: form_initialValues(),
    validate: {
      Slide: {
        type: (value) =>
          value === Prisma.ModelName.TitleSlide ||
          value === Prisma.ModelName.TitleAndContent ||
          value === Prisma.ModelName.SectionHeader ||
          value === Prisma.ModelName.TwoContent ||
          value === Prisma.ModelName.Comparison ||
          value === Prisma.ModelName.TitleOnly ||
          value === Prisma.ModelName.Blank
            ? null
            : "Invalid",
      },
    },
    onValuesChange(values) {
      localStorage.setItem(
        "dashboard_presentation_create_form",
        JSON.stringify(values),
      );
    },
  });
  useEffect(() => {
    const values = localStorage.getItem("dashboard_presentation_create_form");
    if (values) {
      try {
        form.setValues(JSON.parse(values));
      } catch (error) {
        console.error(error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const currentSlideIndex = useState(0);
  const preview_card = (
    <AspectRatio ratio={16 / 9}>
      <Card
        shadow="sm"
        withBorder
      >
        <Text c="dimmed">Preview</Text>
      </Card>
    </AspectRatio>
  );
  const preview_action_addBefore = () => {
    form.insertListItem(
      "Slide",
      form_initialValues().Slide[0],
      currentSlideIndex[0],
    );
  };
  const preview_action_addAfter = () => {
    form.insertListItem(
      "Slide",
      form_initialValues().Slide[0],
      currentSlideIndex[0] + 1,
    );
    preview_action_next();
  };
  const preview_action_previous = () => {
    currentSlideIndex[1]((prev) => prev - 1);
  };
  const preview_action_next = () => {
    currentSlideIndex[1]((prev) => prev + 1);
  };
  const preview_action_remove = () => {
    form.removeListItem("Slide", currentSlideIndex[0]);
    if (!form.getValues().Slide[currentSlideIndex[0]]) {
      preview_action_previous();
    }
  };
  const preview_action = (
    <Group justify="space-between">
      <ActionIcon
        variant="light"
        color="red"
        disabled={form.getValues().Slide.length === 1}
        onClick={preview_action_remove}
      >
        <IconMinus />
      </ActionIcon>
      <Group>
        <ActionIcon
          variant="default"
          onClick={preview_action_addBefore}
        >
          <IconPlus />
        </ActionIcon>
        <ActionIcon.Group>
          <ActionIcon
            variant="light"
            disabled={currentSlideIndex[0] === 0}
            onClick={preview_action_previous}
          >
            <IconCaretLeft />
          </ActionIcon>
          <ActionIcon
            variant="light"
            disabled={
              currentSlideIndex[0] === form.getValues().Slide.length - 1
            }
            onClick={preview_action_next}
          >
            <IconCaretRight />
          </ActionIcon>
        </ActionIcon.Group>
        <ActionIcon
          variant="default"
          onClick={preview_action_addAfter}
        >
          <IconPlus />
        </ActionIcon>
      </Group>
    </Group>
  );
  const form_pending = useToggle();
  const preview = (
    <Fieldset legend={`Slide ${currentSlideIndex[0] + 1}`}>
      <Stack>
        {preview_card}
        {preview_action}
      </Stack>
    </Fieldset>
  );
  const slide_selectType = (
    <NativeSelect
      required
      label="Type"
      data={[
        { value: Prisma.ModelName.TitleSlide, label: "Title Slide" },
        { value: Prisma.ModelName.TitleAndContent, label: "Title and Content" },
        { value: Prisma.ModelName.SectionHeader, label: "Section Header" },
        { value: Prisma.ModelName.TwoContent, label: "Two Content" },
        { value: Prisma.ModelName.Comparison, label: "Comparison" },
        { value: Prisma.ModelName.TitleOnly, label: "Title Only" },
        { value: Prisma.ModelName.Blank, label: "Blank" },
      ]}
      key={form.key(`Slide.${currentSlideIndex[0]}.type`)}
      {...form.getInputProps(`Slide.${currentSlideIndex[0]}.type`)}
    />
  );
  const slide_titleSlide = (
    <>
      <TextInput
        required
        label="Title"
        key={form.key(`Slide.${currentSlideIndex[0]}.TitleSlide.title`)}
        {...form.getInputProps(
          `Slide.${currentSlideIndex[0]}.TitleSlide.title`,
        )}
      />
      <TextInput
        required
        label="Subtitle"
        key={form.key(`Slide.${currentSlideIndex[0]}.TitleSlide.subtitle`)}
        {...form.getInputProps(
          `Slide.${currentSlideIndex[0]}.TitleSlide.subtitle`,
        )}
      />
    </>
  );
  const slide_titleAndContent = (
    <>
      <TextInput
        required
        label="Title"
        key={form.key(`Slide.${currentSlideIndex[0]}.TitleAndContent.title`)}
        {...form.getInputProps(
          `Slide.${currentSlideIndex[0]}.TitleAndContent.title`,
        )}
      />
      <TextInput
        required
        label="Content"
        key={form.key(`Slide.${currentSlideIndex[0]}.TitleAndContent.content`)}
        {...form.getInputProps(
          `Slide.${currentSlideIndex[0]}.TitleAndContent.content`,
        )}
      />
    </>
  );
  const slide_sectionHeader = (
    <>
      <TextInput
        required
        label="Section"
        key={form.key(`Slide.${currentSlideIndex[0]}.SectionHeader.section`)}
        {...form.getInputProps(
          `Slide.${currentSlideIndex[0]}.SectionHeader.section`,
        )}
      />
      <TextInput
        required
        label="Subsection"
        key={form.key(`Slide.${currentSlideIndex[0]}.SectionHeader.subsection`)}
        {...form.getInputProps(
          `Slide.${currentSlideIndex[0]}.SectionHeader.subsection`,
        )}
      />
    </>
  );
  const slide_twoContent = (
    <>
      <TextInput
        required
        label="Title"
        key={form.key(`Slide.${currentSlideIndex[0]}.TwoContent.title`)}
        {...form.getInputProps(
          `Slide.${currentSlideIndex[0]}.TwoContent.title`,
        )}
      />
      <TextInput
        required
        label="First content"
        key={form.key(`Slide.${currentSlideIndex[0]}.TwoContent.firstContent`)}
        {...form.getInputProps(
          `Slide.${currentSlideIndex[0]}.TwoContent.firstContent`,
        )}
      />
      <TextInput
        required
        label="Second content"
        key={form.key(`Slide.${currentSlideIndex[0]}.TwoContent.secondContent`)}
        {...form.getInputProps(
          `Slide.${currentSlideIndex[0]}.TwoContent.secondContent`,
        )}
      />
    </>
  );
  const slide_comparison = (
    <>
      <TextInput
        required
        label="Title"
        key={form.key(`Slide.${currentSlideIndex[0]}.Comparison.title`)}
        {...form.getInputProps(
          `Slide.${currentSlideIndex[0]}.Comparison.title`,
        )}
      />
      <TextInput
        required
        label="First subtitle"
        key={form.key(`Slide.${currentSlideIndex[0]}.Comparison.firstSubtitle`)}
        {...form.getInputProps(
          `Slide.${currentSlideIndex[0]}.Comparison.firstSubtitle`,
        )}
      />
      <TextInput
        required
        label="First comparison"
        key={form.key(
          `Slide.${currentSlideIndex[0]}.Comparison.firstComparison`,
        )}
        {...form.getInputProps(
          `Slide.${currentSlideIndex[0]}.Comparison.firstComparison`,
        )}
      />
      <TextInput
        required
        label="Second subtitle"
        key={form.key(
          `Slide.${currentSlideIndex[0]}.Comparison.secondSubtitle`,
        )}
        {...form.getInputProps(
          `Slide.${currentSlideIndex[0]}.Comparison.secondSubtitle`,
        )}
      />
      <TextInput
        required
        label="Second comparison"
        key={form.key(
          `Slide.${currentSlideIndex[0]}.Comparison.secondComparison`,
        )}
        {...form.getInputProps(
          `Slide.${currentSlideIndex[0]}.Comparison.secondComparison`,
        )}
      />
    </>
  );
  const slide_titleOnly = (
    <TextInput
      required
      label="Title"
      key={form.key(`Slide.${currentSlideIndex[0]}.TitleOnly.title`)}
      {...form.getInputProps(`Slide.${currentSlideIndex[0]}.TitleOnly.title`)}
    />
  );
  const slide_type = form.getValues().Slide[currentSlideIndex[0]].type;
  const slide = (
    <Fieldset
      legend="Slide"
      variant="filled"
    >
      <Stack>
        {slide_selectType}
        <Space />
        <Divider />
        {slide_type === Prisma.ModelName.TitleSlide && slide_titleSlide}
        {slide_type === Prisma.ModelName.TitleAndContent &&
          slide_titleAndContent}
        {slide_type === Prisma.ModelName.SectionHeader && slide_sectionHeader}
        {slide_type === Prisma.ModelName.TwoContent && slide_twoContent}
        {slide_type === Prisma.ModelName.Comparison && slide_comparison}
        {slide_type === Prisma.ModelName.TitleOnly && slide_titleOnly}
        {slide_type === Prisma.ModelName.Blank && <Text c="dimmed">Blank</Text>}
      </Stack>
    </Fieldset>
  );
  const presentation = (
    <Fieldset variant="filled">
      <Stack>
        <TextInput
          required
          label="Title"
          key={form.key("title")}
          {...form.getInputProps("title")}
        />
        <Group justify="end">
          <Button
            type="submit"
            loading={form_pending[0]}
          >
            Create
          </Button>
        </Group>
      </Stack>
    </Fieldset>
  );
  const form_onSubmit = form.onSubmit(async (values, event) => {
    event?.preventDefault();
    form_pending[1]();
    try {
      await createPresentation(values);
    } catch (error) {
      alert(error);
      location.reload();
    }
    notifications.show({ message: "OK" });
    form_pending[1]();
    form.reset();
    currentSlideIndex[1](0);
  });
  return (
    <form onSubmit={form_onSubmit}>
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <Stack>
          {preview}
          {presentation}
        </Stack>
        {slide}
      </SimpleGrid>
    </form>
  );
}
