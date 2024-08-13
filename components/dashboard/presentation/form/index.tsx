"use client";

import {
  createPresentation,
  updatePresentation,
} from "@/lib/action/presentation";
import route from "@/lib/route";
import {
  ActionIcon,
  AspectRatio,
  Button,
  Divider,
  Fieldset,
  Group,
  NativeSelect,
  SimpleGrid,
  Skeleton,
  Stack,
  Stepper,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useSessionStorage, useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { Prisma } from "@prisma/client";
import {
  IconCaretLeft,
  IconCaretRight,
  IconMinus,
  IconPlus,
} from "@tabler/icons-react";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Payload, validateSlideType } from "./_payload";

const Preview = dynamic(() => import("./preview"), {
  ssr: false,
  loading: () => <Skeleton />,
});
const RichTextEditor = dynamic(() => import("./rich-text-editor"), {
  ssr: false,
});

type Props = { type: "create" } | { type: "update"; initialValues: Payload };

export default function Form(props: Props) {
  const form_getInitialSlide = useCallback<() => Payload["Slide"][number]>(
    () => ({
      type: Prisma.ModelName.TitleSlide,
      TitleSlide: { title: "Title", subtitle: "Subtitle" },
      TitleAndContent: { title: "Title", content: "<p>Content</p>" },
      SectionHeader: { section: "Section", subsection: "Subsection" },
      TwoContent: {
        title: "Title",
        firstContent: "<p>First content</p>",
        secondContent: "<p>Second content</p>",
      },
      Comparison: {
        title: "Title",
        firstSubtitle: "First subtitle",
        firstComparison: "<p>First comparison</p>",
        secondSubtitle: "Second subtitle",
        secondComparison: "<p>Second comparison</p>",
      },
      TitleOnly: { title: "Title" },
      Blank: null,
    }),
    [],
  );
  const form_initialValues: Payload =
    props.type === "create"
      ? { id: "id", title: "Untitled", Slide: [form_getInitialSlide()] }
      : {
          id: props.initialValues.id,
          title: props.initialValues.title,
          Slide: props.initialValues.Slide.map((slide) => {
            const type = validateSlideType(slide.type);
            return {
              ...form_getInitialSlide(),
              type,
              [type]: type === "Blank" ? null : slide[type],
            };
          }),
        };
  const pathname = usePathname();
  const form_values_localStorage = useSessionStorage<Payload>({
    key: `${pathname}_form_values`,
  });
  const form = useForm<Payload>({
    initialValues: form_initialValues,
    onValuesChange(values) {
      form_values_localStorage[1](values);
    },
  });
  const form_effectDeps = JSON.stringify(form_values_localStorage[0]);
  useEffect(() => {
    if (!form_values_localStorage[0]) return;
    form.setValues(form_values_localStorage[0]);
  }, [form_effectDeps]);
  const step_index_localStorage = useSessionStorage({
    key: `${pathname}_step_index`,
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
  const slide_index_localStorage = useSessionStorage({
    key: `${pathname}_slide_index`,
    defaultValue: 0,
  });
  const slide_index = useState(slide_index_localStorage[0]);
  const slide_current = useState(
    form.getValues().Slide[slide_index_localStorage[0]],
  );
  const slide_index_effectDeps = slide_index_localStorage[0];
  useEffect(() => {
    slide_index[1](slide_index_localStorage[0]);
    slide_current[1](form.getValues().Slide[slide_index_localStorage[0]]);
  }, [form_effectDeps, slide_index_effectDeps]);
  const slide_preview = (
    <AspectRatio ratio={16 / 9}>
      <Preview slide={slide_current[0]} />
    </AspectRatio>
  );
  const slide_preview_action_insertAfter = () => {
    form.insertListItem("Slide", form_getInitialSlide(), slide_index[0] + 1);
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
      <RichTextEditor
        options={{
          content:
            form.getValues().Slide[slide_index[0]].TitleAndContent?.content,
          onUpdate(props) {
            form.setFieldValue(
              `Slide.${slide_index[0]}.TitleAndContent.content`,
              props.editor.getHTML(),
            );
          },
        }}
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
      <RichTextEditor
        options={{
          content:
            form.getValues().Slide[slide_index[0]].TwoContent?.firstContent,
          onUpdate(props) {
            form.setFieldValue(
              `Slide.${slide_index[0]}.TwoContent.firstContent`,
              props.editor.getHTML(),
            );
          },
        }}
      />
      <RichTextEditor
        options={{
          content:
            form.getValues().Slide[slide_index[0]].TwoContent?.secondContent,
          onUpdate(props) {
            form.setFieldValue(
              `Slide.${slide_index[0]}.TwoContent.secondContent`,
              props.editor.getHTML(),
            );
          },
        }}
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
      <RichTextEditor
        options={{
          content:
            form.getValues().Slide[slide_index[0]].Comparison?.firstComparison,
          onUpdate(props) {
            form.setFieldValue(
              `Slide.${slide_index[0]}.Comparison.firstComparison`,
              props.editor.getHTML(),
            );
          },
        }}
      />
      <TextInput
        required
        label="Second subtitle"
        key={form.key(`Slide.${slide_index[0]}.Comparison.secondSubtitle`)}
        {...form.getInputProps(
          `Slide.${slide_index[0]}.Comparison.secondSubtitle`,
        )}
      />
      <RichTextEditor
        options={{
          content:
            form.getValues().Slide[slide_index[0]].Comparison?.secondComparison,
          onUpdate(props) {
            form.setFieldValue(
              `Slide.${slide_index[0]}.Comparison.secondComparison`,
              props.editor.getHTML(),
            );
          },
        }}
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
    <Fieldset variant="unstyled">
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
            {props.type === "create" && "Create"}
            {props.type === "update" && "Update"}
          </Button>
        </Group>
      </Stack>
    </Fieldset>
  );
  const router = useRouter();
  const form_onSubmit = form.onSubmit(async (values, event) => {
    event?.preventDefault();
    form_pending[1]();
    try {
      if (props.type === "create") {
        await createPresentation(values);
      } else if (props.type === "update") {
        await updatePresentation(values);
      }
    } catch (error) {
      alert(error);
      router.refresh();
    }
    form_values_localStorage[2]();
    step_index_localStorage[2]();
    slide_index_localStorage[2]();
    if (props.type === "create") {
      step_index_localStorage[1](0);
      slide_index_localStorage[1](0);
      form.setInitialValues(form_initialValues);
      form.reset();
    } else if (props.type === "update") {
      router.replace(route.dashboard_presentation_update);
    }
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
