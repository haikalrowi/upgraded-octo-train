import { Payload } from "@/lib/action/presentation";
import { Prisma } from "@prisma/client";
import Konva from "konva";
import { useEffect, useRef } from "react";
import { Layer, Rect, Stage, Text } from "react-konva";

type Props = {
  slide: Payload["Slide"][number];
};

export default function Preview(props: Props) {
  const stage_ref = useRef<Konva.Stage>(null);
  useEffect(() => {
    const stage = stage_ref.current!;
    const stage_setFullContainer = () => {
      const { width, height } = stage.container().getBoundingClientRect();
      stage.width(width);
      stage.height(height);
    };
    stage_setFullContainer();
    const resizeObserver = new ResizeObserver(stage_setFullContainer);
    resizeObserver.observe(stage.container());
    return () => {
      resizeObserver.disconnect();
    };
  }, []);
  const slide_effect_deps = JSON.stringify(props);
  const slide_background_ref = useRef<Konva.Rect>(null);
  useEffect(() => {
    const stage = stage_ref.current!;
    const slide_background = slide_background_ref.current!;
    slide_background.width(stage.width());
    slide_background.height(stage.height());
    slide_background.fill("white");
  }, [slide_effect_deps]);
  const slide_titleSlide_title_ref = useRef<Konva.Text>(null);
  const slide_titleSlide_subtitle_ref = useRef<Konva.Text>(null);
  useEffect(() => {
    const stage = stage_ref.current!;
    const slide_setPosition = () => {
      switch (props.slide.type) {
        case Prisma.ModelName.TitleSlide:
          const text = slide_titleSlide_title_ref.current!;
          const subtitle = slide_titleSlide_subtitle_ref.current!;
          text.width(stage.width());
          text.height(stage.height() / 2);
          text.align("center");
          text.verticalAlign("middle");
          subtitle.y(stage.height() / 2);
          subtitle.width(stage.width());
          subtitle.height(stage.height() / 2);
          subtitle.align("center");
          subtitle.verticalAlign("middle");
          break;
        case Prisma.ModelName.TitleAndContent:
          break;
        default:
          break;
      }
    };
    slide_setPosition();
    const resizeObserver = new ResizeObserver(slide_setPosition);
    resizeObserver.observe(stage.container());
    return () => {
      resizeObserver.disconnect();
    };
  }, [slide_effect_deps]);
  return (
    <Stage
      style={{ width: "100%", height: "100%" }}
      ref={stage_ref}
    >
      <Layer>
        <Rect ref={slide_background_ref} />
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
      </Layer>
    </Stage>
  );
}
