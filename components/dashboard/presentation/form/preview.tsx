import { Payload } from "@/lib/action/presentation";
import { Prisma } from "@prisma/client";
import { useEffect, useRef } from "react";

type Props = {
  slide: Payload["Slide"][number];
};

export default function Preview(props: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio;
    const initialize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    const main = () => {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      switch (props.slide.type) {
        case Prisma.ModelName.TitleSlide:
          ctx.fillText(
            props.slide.TitleSlide?.title!,
            canvas.width / (2 * dpr),
            canvas.height / (2 * dpr),
          );
          break;
        case Prisma.ModelName.TitleAndContent:
          break;
        default:
          break;
      }
    };

    initialize();
    main();

    const resizeObserver = new ResizeObserver(() => {
      ctx.reset();
      initialize();
      main();
    });

    resizeObserver.observe(canvas);

    return () => {
      ctx.reset();
      resizeObserver.disconnect();
    };
  }, [props]);
  return (
    <canvas
      style={{ width: "100%", height: "100%" }}
      ref={canvasRef}
    />
  );
}
