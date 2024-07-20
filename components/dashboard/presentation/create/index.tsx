"use client";

import { createPresentation, Payload } from "@/lib/action/presentation";
import path from "@/lib/path";
import {
  AspectRatio,
  Button,
  Card,
  ComboboxData,
  Fieldset,
  Group,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { Prisma } from "@prisma/client";
import { useEffect, useState } from "react";

export default function Create() {
  const form_initialValues = () => {
    const slide: Payload["Slide"][number] = {
      type: "",
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
    };
    return { title: "", Slide: [slide] } as const satisfies Payload;
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
        path.dashboard_presentation_create,
        JSON.stringify(values),
      );
    },
  });
  useEffect(() => {
    const values = localStorage.getItem(path.dashboard_presentation_create);
    if (values) {
      try {
        form.setValues(JSON.parse(values));
      } catch (error) {
        console.error(error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const currentSlideIndexState = useState(0);
  const pending = useToggle();
  const form_onSubmit = form.onSubmit(async (values, event) => {
    event?.preventDefault();
    pending[1]();
    try {
      await createPresentation(values);
    } catch (error) {
      alert(error);
      location.reload();
    }
    notifications.show({ message: "OK" });
    pending[1]();
    form.reset();
    currentSlideIndexState[1](0);
  });
  const slide_1_action_addBefore = () => {
    form.insertListItem(
      "Slide",
      form_initialValues().Slide[0],
      currentSlideIndexState[0],
    );
  };
  const slide_1_action_addAfter = () => {
    form.insertListItem(
      "Slide",
      form_initialValues().Slide[0],
      currentSlideIndexState[0] + 1,
    );
    slide_1_action_next();
  };
  const slide_1_action_previous = () => {
    currentSlideIndexState[1]((prev) => prev - 1);
  };
  const slide_1_action_next = () => {
    currentSlideIndexState[1]((prev) => prev + 1);
  };
  const slide_1_action_remove = () => {
    form.removeListItem("Slide", currentSlideIndexState[0]);
    if (!form.getValues().Slide[currentSlideIndexState[0]]) {
      slide_1_action_previous();
    }
  };
  const slide_1_action = (
    <Group justify="space-between">
      <Button.Group>
        <Button
          variant="subtle"
          color="green"
          size="compact-xs"
          onClick={slide_1_action_addBefore}
        >
          Add before
        </Button>
        <Button
          variant="subtle"
          color="green"
          size="compact-xs"
          onClick={slide_1_action_addAfter}
        >
          Add after
        </Button>
      </Button.Group>
      <Button.Group>
        <Button
          variant="subtle"
          size="compact-xs"
          disabled={currentSlideIndexState[0] === 0}
          onClick={slide_1_action_previous}
        >
          Previous
        </Button>
        <Button
          variant="subtle"
          size="compact-xs"
          disabled={
            currentSlideIndexState[0] === form.getValues().Slide.length - 1
          }
          onClick={slide_1_action_next}
        >
          Next
        </Button>
      </Button.Group>
    </Group>
  );
  const slide_1_preview = (
    <AspectRatio ratio={16 / 9}>
      <Card
        shadow="sm"
        withBorder
      >
        <Text c="dimmed">Preview</Text>
      </Card>
    </AspectRatio>
  );
  const slide_1_types: ComboboxData = [
    { value: "", label: "Select", disabled: true },
    { value: Prisma.ModelName.TitleSlide, label: "Title Slide" },
    { value: Prisma.ModelName.TitleAndContent, label: "Title and Content" },
    { value: Prisma.ModelName.SectionHeader, label: "Section Header" },
    { value: Prisma.ModelName.TwoContent, label: "Two Content" },
    { value: Prisma.ModelName.Comparison, label: "Comparison" },
    { value: Prisma.ModelName.TitleOnly, label: "Title Only" },
    { value: Prisma.ModelName.Blank, label: "Blank" },
  ];
  const slide_1 = (
    <Fieldset
      legend={`Slide ${currentSlideIndexState[0]}`}
      variant="filled"
    >
      <Stack>
        {slide_1_action}
        {slide_1_preview}
        <Select
          required
          label="Type"
          data={slide_1_types}
          key={form.key(`Slide.${currentSlideIndexState[0]}.type`)}
          {...form.getInputProps(`Slide.${currentSlideIndexState[0]}.type`)}
        />
        <Group justify="end">
          <Button
            variant="subtle"
            color="red"
            size="compact-xs"
            disabled={form.getValues().Slide.length === 1}
            onClick={slide_1_action_remove}
          >
            Remove
          </Button>
        </Group>
      </Stack>
    </Fieldset>
  );
  const slide_2_type = form.getValues().Slide[currentSlideIndexState[0]].type;
  const slide_2_titleSlide = (
    <>
      <TextInput
        required
        label="Title"
        key={form.key(`Slide.${currentSlideIndexState[0]}.TitleSlide.title`)}
        {...form.getInputProps(
          `Slide.${currentSlideIndexState[0]}.TitleSlide.title`,
        )}
      />
      <TextInput
        required
        label="Subtitle"
        key={form.key(`Slide.${currentSlideIndexState[0]}.TitleSlide.subtitle`)}
        {...form.getInputProps(
          `Slide.${currentSlideIndexState[0]}.TitleSlide.subtitle`,
        )}
      />
    </>
  );
  const slide_2_titleAndContent = (
    <>
      <TextInput
        required
        label="Title"
        key={form.key(
          `Slide.${currentSlideIndexState[0]}.TitleAndContent.title`,
        )}
        {...form.getInputProps(
          `Slide.${currentSlideIndexState[0]}.TitleAndContent.title`,
        )}
      />
      <TextInput
        required
        label="Content"
        key={form.key(
          `Slide.${currentSlideIndexState[0]}.TitleAndContent.content`,
        )}
        {...form.getInputProps(
          `Slide.${currentSlideIndexState[0]}.TitleAndContent.content`,
        )}
      />
    </>
  );
  const slide_2_sectionHeader = (
    <>
      <TextInput
        required
        label="Section"
        key={form.key(
          `Slide.${currentSlideIndexState[0]}.SectionHeader.section`,
        )}
        {...form.getInputProps(
          `Slide.${currentSlideIndexState[0]}.SectionHeader.section`,
        )}
      />
      <TextInput
        required
        label="Subsection"
        key={form.key(
          `Slide.${currentSlideIndexState[0]}.SectionHeader.subsection`,
        )}
        {...form.getInputProps(
          `Slide.${currentSlideIndexState[0]}.SectionHeader.subsection`,
        )}
      />
    </>
  );
  const slide_2_twoContent = (
    <>
      <TextInput
        required
        label="Title"
        key={form.key(`Slide.${currentSlideIndexState[0]}.TwoContent.title`)}
        {...form.getInputProps(
          `Slide.${currentSlideIndexState[0]}.TwoContent.title`,
        )}
      />
      <TextInput
        required
        label="First content"
        key={form.key(
          `Slide.${currentSlideIndexState[0]}.TwoContent.firstContent`,
        )}
        {...form.getInputProps(
          `Slide.${currentSlideIndexState[0]}.TwoContent.firstContent`,
        )}
      />
      <TextInput
        required
        label="Second content"
        key={form.key(
          `Slide.${currentSlideIndexState[0]}.TwoContent.secondContent`,
        )}
        {...form.getInputProps(
          `Slide.${currentSlideIndexState[0]}.TwoContent.secondContent`,
        )}
      />
    </>
  );
  const slide_2_comparison = (
    <>
      <TextInput
        required
        label="Title"
        key={form.key(`Slide.${currentSlideIndexState[0]}.Comparison.title`)}
        {...form.getInputProps(
          `Slide.${currentSlideIndexState[0]}.Comparison.title`,
        )}
      />
      <TextInput
        required
        label="First subtitle"
        key={form.key(
          `Slide.${currentSlideIndexState[0]}.Comparison.firstSubtitle`,
        )}
        {...form.getInputProps(
          `Slide.${currentSlideIndexState[0]}.Comparison.firstSubtitle`,
        )}
      />
      <TextInput
        required
        label="First comparison"
        key={form.key(
          `Slide.${currentSlideIndexState[0]}.Comparison.firstComparison`,
        )}
        {...form.getInputProps(
          `Slide.${currentSlideIndexState[0]}.Comparison.firstComparison`,
        )}
      />
      <TextInput
        required
        label="Second subtitle"
        key={form.key(
          `Slide.${currentSlideIndexState[0]}.Comparison.secondSubtitle`,
        )}
        {...form.getInputProps(
          `Slide.${currentSlideIndexState[0]}.Comparison.secondSubtitle`,
        )}
      />
      <TextInput
        required
        label="Second comparison"
        key={form.key(
          `Slide.${currentSlideIndexState[0]}.Comparison.secondComparison`,
        )}
        {...form.getInputProps(
          `Slide.${currentSlideIndexState[0]}.Comparison.secondComparison`,
        )}
      />
    </>
  );
  const slide_2_titleOnly = (
    <TextInput
      required
      label="Title"
      key={form.key(`Slide.${currentSlideIndexState[0]}.TitleOnly.title`)}
      {...form.getInputProps(
        `Slide.${currentSlideIndexState[0]}.TitleOnly.title`,
      )}
    />
  );
  const slide_2 = (
    <Fieldset
      legend="Slide"
      variant="filled"
    >
      <Stack>
        {!slide_2_type && <Text>Select a slide type</Text>}
        {slide_2_type === Prisma.ModelName.TitleSlide && slide_2_titleSlide}
        {slide_2_type === Prisma.ModelName.TitleAndContent &&
          slide_2_titleAndContent}
        {slide_2_type === Prisma.ModelName.SectionHeader &&
          slide_2_sectionHeader}
        {slide_2_type === Prisma.ModelName.TwoContent && slide_2_twoContent}
        {slide_2_type === Prisma.ModelName.Comparison && slide_2_comparison}
        {slide_2_type === Prisma.ModelName.TitleOnly && slide_2_titleOnly}
        {slide_2_type === Prisma.ModelName.Blank && <Text>Blank</Text>}
      </Stack>
    </Fieldset>
  );
  const presentation = (
    <Fieldset
      legend="Presentation"
      variant="filled"
    >
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
            loading={pending[0]}
          >
            Create
          </Button>
        </Group>
      </Stack>
    </Fieldset>
  );
  return (
    <form onSubmit={form_onSubmit}>
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        {slide_1}
        {slide_2}
        {presentation}
      </SimpleGrid>
    </form>
  );
}
