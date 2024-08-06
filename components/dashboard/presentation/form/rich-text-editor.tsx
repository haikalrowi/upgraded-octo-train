import { Link, RichTextEditor as RichTextEditor_ } from "@mantine/tiptap";
import { useEditor, UseEditorOptions } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function RichTextEditor(props: { options?: UseEditorOptions }) {
  const editor = useEditor({
    ...props.options,
    extensions: [StarterKit, Link],
    immediatelyRender: false,
  });
  return (
    <RichTextEditor_ editor={editor}>
      <RichTextEditor_.Toolbar sticky>
        <RichTextEditor_.ControlsGroup>
          <RichTextEditor_.Bold />
          <RichTextEditor_.Italic />
          <RichTextEditor_.Strikethrough />
          <RichTextEditor_.ClearFormatting />
        </RichTextEditor_.ControlsGroup>
        <RichTextEditor_.ControlsGroup>
          <RichTextEditor_.BulletList />
          <RichTextEditor_.OrderedList />
        </RichTextEditor_.ControlsGroup>
        <RichTextEditor_.ControlsGroup>
          <RichTextEditor_.Undo />
          <RichTextEditor_.Redo />
        </RichTextEditor_.ControlsGroup>
      </RichTextEditor_.Toolbar>
      <RichTextEditor_.Content />
    </RichTextEditor_>
  );
}
