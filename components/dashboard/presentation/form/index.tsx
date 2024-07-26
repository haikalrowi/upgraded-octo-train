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
  Stack,
  Stepper,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useLocalStorage, useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { Prisma } from "@prisma/client";
import {
  IconCaretLeft,
  IconCaretRight,
  IconMinus,
  IconPlus,
} from "@tabler/icons-react";
import { useState } from "react";
import Preview from "./preview";

type Props = { type: "create" } | { type: "update"; initialValues: Payload };

export default function Form(props: Props) {
  const form_initialSlide = () => {
    return {
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
    } satisfies Payload["Slide"][number];
  };
  const form_localStorage = useLocalStorage({
    key: "dashboard_presentation_create_form_localStorage",
    defaultValue: JSON.stringify({ title: "", Slide: [form_initialSlide()] }),
    getInitialValueInEffect: false,
  });
  const form = useForm<Payload>({
    mode: "controlled",
    initialValues:
      props.type === "create"
        ? JSON.parse(form_localStorage[0])
        : props.initialValues,
    onValuesChange(values) {
      form_localStorage[1](JSON.stringify(values));
    },
  });
  const step_activeState = useState(0);
  const step_next = () => {
    step_activeState[1]((current) => current + 1);
  };
  const step_previous = () => {
    step_activeState[1]((current) => current - 1);
  };
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
          <Button onClick={step_next}>Next</Button>
        </Group>
      </Stack>
    </Fieldset>
  );
  const currentSlideIndex = useState(0);
  const preview_currentSlide = form.getValues().Slide[currentSlideIndex[0]];
  const preview_card = (
    <AspectRatio ratio={16 / 9}>
      <Card
        shadow="sm"
        withBorder
      >
        <Preview />
      </Card>
    </AspectRatio>
  );
  const preview_action_insertBefore = () => {
    form.insertListItem("Slide", form_initialSlide(), currentSlideIndex[0]);
  };
  const preview_action_insertAfter = () => {
    form.insertListItem("Slide", form_initialSlide(), currentSlideIndex[0] + 1);
    preview_action_next();
  };
  const preview_action_previous = () => {
    currentSlideIndex[1]((current) => current - 1);
  };
  const preview_action_next = () => {
    currentSlideIndex[1]((current) => current + 1);
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
          onClick={preview_action_insertBefore}
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
          onClick={preview_action_insertAfter}
        >
          <IconPlus />
        </ActionIcon>
      </Group>
    </Group>
  );
  const preview = (
    <Stack>
      {preview_card}
      {preview_action}
    </Stack>
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
  const form_pending = useToggle();
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
    form.reset();
    currentSlideIndex[1](0);
    form_pending[1]();
  });
  const slide = (
    <Fieldset variant="filled">
      <Stack>
        {slide_selectType}
        <Divider />
        {preview_currentSlide.type === Prisma.ModelName.TitleSlide &&
          slide_titleSlide}
        {preview_currentSlide.type === Prisma.ModelName.TitleAndContent &&
          slide_titleAndContent}
        {preview_currentSlide.type === Prisma.ModelName.SectionHeader &&
          slide_sectionHeader}
        {preview_currentSlide.type === Prisma.ModelName.TwoContent &&
          slide_twoContent}
        {preview_currentSlide.type === Prisma.ModelName.Comparison &&
          slide_comparison}
        {preview_currentSlide.type === Prisma.ModelName.TitleOnly &&
          slide_titleOnly}
        {preview_currentSlide.type === Prisma.ModelName.Blank && (
          <Text c="dimmed">Blank</Text>
        )}
        <Group justify="end">
          <Button
            variant="subtle"
            onClick={step_previous}
          >
            Previous
          </Button>
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
  return (
    <form onSubmit={form_onSubmit}>
      <Stepper
        active={step_activeState[0]}
        onStepClick={step_activeState[1]}
      >
        <Stepper.Step label="Presentation">
          <Group justify="center">{presentation}</Group>
        </Stepper.Step>
        <Stepper.Step label="Slide">
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            {preview}
            {slide}
          </SimpleGrid>
        </Stepper.Step>
      </Stepper>
    </form>
  );
}
