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
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Preview = dynamic(() => import("./preview"), { ssr: false });

type Props = { type: "create" } | { type: "update"; initialValues: Payload };

export default function Form(props: Props) {
  const form_initialSlide: () => Payload["Slide"][number] = () => {
    return {
      type: Prisma.ModelName.TitleSlide,
      TitleSlide: { title: "Title", subtitle: "Subtitle" },
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
  };
  const form_initialValues: Payload =
    props.type === "create"
      ? { title: "Untitled", Slide: [form_initialSlide()] }
      : props.initialValues;
  const form_values_localStorage = useLocalStorage<Payload>({
    key: "dashboard_presentation_create_form_values",
  });
  const form = useForm<Payload>({
    initialValues: form_initialValues,
    onValuesChange(values) {
      form_values_localStorage[1](values);
    },
  });
  const form_effect_deps = JSON.stringify(form_values_localStorage[0]);
  useEffect(() => {
    if (props.type === "update" || !form_values_localStorage[0]) return;
    form.setValues(form_values_localStorage[0]);
  }, [form_effect_deps]);
  const step_index_localStorage = useLocalStorage({
    key: "dashboard_presentation_create_step_index",
    defaultValue: 0,
  });
  const step_next = () => {
    step_index_localStorage[1](step_index_localStorage[0] + 1);
  };
  const step_previous = () => {
    step_index_localStorage[1](step_index_localStorage[0] - 1);
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
  const slide_index_localStorage = useLocalStorage({
    key: "dashboard_presentation_create_slide_index",
    defaultValue: 0,
  });
  const slide_index = useState(slide_index_localStorage[0]);
  const slide_index_effect_deps = slide_index_localStorage[0];
  useEffect(() => {
    slide_index[1](slide_index_localStorage[0]);
  }, [form_effect_deps, slide_index_effect_deps]);
  const slide_current = useState(
    form.getValues().Slide[slide_index_localStorage[0]],
  );
  const slide_current_effect_deps = slide_index_localStorage[0];
  useEffect(() => {
    slide_current[1](form.getValues().Slide[slide_index_localStorage[0]]);
  }, [form_effect_deps, slide_current_effect_deps]);
  const slide_preview = (
    <AspectRatio ratio={16 / 9}>
      <Card
        shadow="sm"
        withBorder
        padding={0}
      >
        <Preview slide={slide_current[0]} />
      </Card>
    </AspectRatio>
  );
  const slide_preview_action_insertAfter = () => {
    form.insertListItem("Slide", form_initialSlide(), slide_index[0] + 1);
    slide_preview_action_next();
  };
  const slide_preview_action_previous = () => {
    const minusOne = slide_index_localStorage[0] - 1;
    slide_index_localStorage[1](minusOne);
    slide_index[1](minusOne);
  };
  const slide_preview_action_next = () => {
    const plusOne = slide_index_localStorage[0] + 1;
    slide_index_localStorage[1](plusOne);
    slide_index[1](plusOne);
  };
  const slide_preview_action_remove = () => {
    form.removeListItem("Slide", slide_index[0]);
    if (!form.getValues().Slide[slide_index[0]]) {
      slide_preview_action_previous();
    }
  };
  const slide_preview_action = (
    <Group justify="space-between">
      <ActionIcon
        variant="light"
        color="red"
        disabled={form.getValues().Slide.length === 1}
        onClick={slide_preview_action_remove}
      >
        <IconMinus />
      </ActionIcon>
      <Group>
        <ActionIcon.Group>
          <ActionIcon
            variant="light"
            disabled={slide_index[0] === 0}
            onClick={slide_preview_action_previous}
          >
            <IconCaretLeft />
          </ActionIcon>
          <ActionIcon
            variant="light"
            disabled={form.getValues().Slide.length - 1 === slide_index[0]}
            onClick={slide_preview_action_next}
          >
            <IconCaretRight />
          </ActionIcon>
        </ActionIcon.Group>
        <ActionIcon
          variant="light"
          color="green"
          onClick={slide_preview_action_insertAfter}
        >
          <IconPlus />
        </ActionIcon>
      </Group>
    </Group>
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
      key={form.key(`Slide.${slide_index[0]}.type`)}
      {...form.getInputProps(`Slide.${slide_index[0]}.type`)}
    />
  );
  const slide_titleSlide = (
    <>
      <TextInput
        required
        label="Title"
        key={form.key(`Slide.${slide_index[0]}.TitleSlide.title`)}
        {...form.getInputProps(`Slide.${slide_index[0]}.TitleSlide.title`)}
      />
      <TextInput
        required
        label="Subtitle"
        key={form.key(`Slide.${slide_index[0]}.TitleSlide.subtitle`)}
        {...form.getInputProps(`Slide.${slide_index[0]}.TitleSlide.subtitle`)}
      />
    </>
  );
  const slide_titleAndContent = (
    <>
      <TextInput
        required
        label="Title"
        key={form.key(`Slide.${slide_index[0]}.TitleAndContent.title`)}
        {...form.getInputProps(`Slide.${slide_index[0]}.TitleAndContent.title`)}
      />
      <TextInput
        required
        label="Content"
        key={form.key(`Slide.${slide_index[0]}.TitleAndContent.content`)}
        {...form.getInputProps(
          `Slide.${slide_index[0]}.TitleAndContent.content`,
        )}
      />
    </>
  );
  const slide_sectionHeader = (
    <>
      <TextInput
        required
        label="Section"
        key={form.key(`Slide.${slide_index[0]}.SectionHeader.section`)}
        {...form.getInputProps(`Slide.${slide_index[0]}.SectionHeader.section`)}
      />
      <TextInput
        required
        label="Subsection"
        key={form.key(`Slide.${slide_index[0]}.SectionHeader.subsection`)}
        {...form.getInputProps(
          `Slide.${slide_index[0]}.SectionHeader.subsection`,
        )}
      />
    </>
  );
  const slide_twoContent = (
    <>
      <TextInput
        required
        label="Title"
        key={form.key(`Slide.${slide_index[0]}.TwoContent.title`)}
        {...form.getInputProps(`Slide.${slide_index[0]}.TwoContent.title`)}
      />
      <TextInput
        required
        label="First content"
        key={form.key(`Slide.${slide_index[0]}.TwoContent.firstContent`)}
        {...form.getInputProps(
          `Slide.${slide_index[0]}.TwoContent.firstContent`,
        )}
      />
      <TextInput
        required
        label="Second content"
        key={form.key(`Slide.${slide_index[0]}.TwoContent.secondContent`)}
        {...form.getInputProps(
          `Slide.${slide_index[0]}.TwoContent.secondContent`,
        )}
      />
    </>
  );
  const slide_comparison = (
    <>
      <TextInput
        required
        label="Title"
        key={form.key(`Slide.${slide_index[0]}.Comparison.title`)}
        {...form.getInputProps(`Slide.${slide_index[0]}.Comparison.title`)}
      />
      <TextInput
        required
        label="First subtitle"
        key={form.key(`Slide.${slide_index[0]}.Comparison.firstSubtitle`)}
        {...form.getInputProps(
          `Slide.${slide_index[0]}.Comparison.firstSubtitle`,
        )}
      />
      <TextInput
        required
        label="First comparison"
        key={form.key(`Slide.${slide_index[0]}.Comparison.firstComparison`)}
        {...form.getInputProps(
          `Slide.${slide_index[0]}.Comparison.firstComparison`,
        )}
      />
      <TextInput
        required
        label="Second subtitle"
        key={form.key(`Slide.${slide_index[0]}.Comparison.secondSubtitle`)}
        {...form.getInputProps(
          `Slide.${slide_index[0]}.Comparison.secondSubtitle`,
        )}
      />
      <TextInput
        required
        label="Second comparison"
        key={form.key(`Slide.${slide_index[0]}.Comparison.secondComparison`)}
        {...form.getInputProps(
          `Slide.${slide_index[0]}.Comparison.secondComparison`,
        )}
      />
    </>
  );
  const slide_titleOnly = (
    <TextInput
      required
      label="Title"
      key={form.key(`Slide.${slide_index[0]}.TitleOnly.title`)}
      {...form.getInputProps(`Slide.${slide_index[0]}.TitleOnly.title`)}
    />
  );
  const form_pending = useToggle();
  const slide = (
    <Fieldset>
      <Stack>
        {slide_selectType}
        <Divider />
        {slide_current[0].type === Prisma.ModelName.TitleSlide &&
          slide_titleSlide}
        {slide_current[0].type === Prisma.ModelName.TitleAndContent &&
          slide_titleAndContent}
        {slide_current[0].type === Prisma.ModelName.SectionHeader &&
          slide_sectionHeader}
        {slide_current[0].type === Prisma.ModelName.TwoContent &&
          slide_twoContent}
        {slide_current[0].type === Prisma.ModelName.Comparison &&
          slide_comparison}
        {slide_current[0].type === Prisma.ModelName.TitleOnly &&
          slide_titleOnly}
        {slide_current[0].type === Prisma.ModelName.Blank && (
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
  const form_onSubmit = form.onSubmit(async (values, event) => {
    event?.preventDefault();
    form_pending[1]();
    try {
      await createPresentation(values);
    } catch (error) {
      alert(error);
      location.reload();
    }
    step_index_localStorage[2]();
    step_index_localStorage[1](0);
    slide_index_localStorage[2]();
    slide_index_localStorage[1](0);
    form.setInitialValues(form_initialValues);
    form.reset();
    notifications.show({ message: "OK" });
    form_pending[1]();
  });
  return (
    <form onSubmit={form_onSubmit}>
      <Stepper
        styles={{ steps: { display: "none" } }}
        active={step_index_localStorage[0]}
        onStepClick={step_index_localStorage[1]}
      >
        <Stepper.Step>
          <Group justify="center">{presentation}</Group>
        </Stepper.Step>
        <Stepper.Step>
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <Stack>
              {slide_preview}
              {slide_preview_action}
            </Stack>
            {slide}
          </SimpleGrid>
        </Stepper.Step>
      </Stepper>
    </form>
  );
}
