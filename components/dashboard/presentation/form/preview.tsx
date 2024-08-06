import { Card } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { Payload } from "./_payload";

type Props = { slide: Payload["Slide"][number] };

const html = String.raw;

export default function Preview(props: Props) {
  const effectDeps = JSON.stringify(props);
  const { ref, width, height } = useElementSize();
  const titleSlide = html`<svg
    xmlns="http://www.w3.org/2000/svg"
    width="${width}"
    height="${height}"
  >
    <style>
      #background {
        display: flex;
        flex-direction: column;
        background-color: white;
        color: black;
        #title {
          font-size: 24px;
        }
        #subtitle {
          font-size: 16px;
        }
      }
    </style>
    <foreignObject
      width="${width}"
      height="${height}"
    >
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        id="background"
      >
        <div id="title">${props.slide.TitleSlide?.title}</div>
        <div id="subtitle">${props.slide.TitleSlide?.subtitle}</div>
      </div>
    </foreignObject>
  </svg>`;
  const src = useState("");
  useEffect(() => {
    const url = URL.createObjectURL(
      new Blob([titleSlide], { type: "image/svg+xml" }),
    );
    src[1](url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [effectDeps, width, height]);
  return (
    <Card
      ref={ref}
      padding={0}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src[0]}
        alt=""
      />
    </Card>
  );
}
