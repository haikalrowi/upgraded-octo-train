import { AspectRatio, Card } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import { Prisma } from "@prisma/client";
import Konva from "konva";
import { useEffect, useRef } from "react";
import { Layer, Rect, Stage, Text } from "react-konva";
import { Payload } from "./_payload";

type Props = { slide: Payload["Slide"][number] };

export default function Preview(props: Props) {
  const { ref, width, height } = useElementSize();
  const stage_ref = useRef<Konva.Stage>(null);
  const effect_deps = JSON.stringify(props);
  useEffect(() => {
    const stage = stage_ref.current;
    if (!stage) return;
    stage.width(width).height(height);
  }, [effect_deps, width, height]);
  const slide_background_ref = useRef<Konva.Rect>(null);
  useEffect(() => {
    const background = slide_background_ref.current;
    if (!background) return;
    background.width(width).height(height);
  }, [effect_deps, width, height]);
  const slide_titleSlide_title_ref = useRef<Konva.Text>(null);
  const slide_titleSlide_subtitle_ref = useRef<Konva.Text>(null);
  useEffect(() => {
    const title = slide_titleSlide_title_ref.current;
    const subtitle = slide_titleSlide_subtitle_ref.current;
    if (!title || !subtitle) return;
    title
      .width(width)
      .height(height * 0.55)
      .align("center")
      .verticalAlign("bottom")
      .fontSize(height * 0.15);
    subtitle
      .position({ x: title.position().x, y: title.height() })
      .width(width)
      .height(height - title.height())
      .align("center")
      .fontSize(height * 0.07);
  }, [effect_deps, width, height]);
  const slide_titleAndContent_title_ref = useRef<Konva.Text>(null);
  const slide_titleAndContent_content_ref = useRef<Konva.Text>(null);
  useEffect(() => {
    const title = slide_titleAndContent_title_ref.current;
    const content = slide_titleAndContent_content_ref.current;
    if (!title || !content) return;
    title
      .width(width)
      .height(height * 0.12)
      .fontSize(height * 0.1)
      .padding(16);
    content
      .position({ x: title.position().x, y: title.height() })
      .width(width)
      .height(height - title.height())
      .fontSize(height * 0.06)
      .padding(title.padding());
  }, [effect_deps, width, height]);
  return (
    <AspectRatio
      ref={ref}
      ratio={16 / 9}
    >
      <Card
        shadow="sm"
        withBorder
        padding={0}
      >
        <Stage ref={stage_ref}>
          <Layer>
            <Rect
              ref={slide_background_ref}
              fill={"white"}
            />
            {props.slide.type === Prisma.ModelName.TitleSlide && (
              <>
                <Text
                  text={props.slide.TitleSlide?.title}
                  ref={slide_titleSlide_title_ref}
                />
                <Text
                  text={props.slide.TitleSlide?.subtitle}
                  ref={slide_titleSlide_subtitle_ref}
                />
              </>
            )}
            {props.slide.type === Prisma.ModelName.TitleAndContent && (
              <>
                <Text
                  text={props.slide.TitleAndContent?.title}
                  ref={slide_titleAndContent_title_ref}
                />
                <Text
                  text={props.slide.TitleAndContent?.content}
                  ref={slide_titleAndContent_content_ref}
                />
              </>
            )}
          </Layer>
        </Stage>
      </Card>
    </AspectRatio>
  );
}
