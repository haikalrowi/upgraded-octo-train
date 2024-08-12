import { Card } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import { Prisma } from "@prisma/client";
import { useEffect, useState } from "react";
import { Payload } from "./_payload";

type Props = { slide: Payload["Slide"][number] };

const html = String.raw;
const escapeHtml = (text?: string) => {
  if (!text) return "";
  const element = document.createElement("p");
  const textNode = document.createTextNode(text);
  element.appendChild(textNode);
  return element.innerHTML;
};

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
        justify-content: center;
        align-items: center;
        background-color: white;
        height: 100%;
        color: black;
        #title {
          font-size: 32px;
          text-align: center;
        }
        #subtitle {
          font-size: 16px;
          text-align: center;
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
        <div id="title">${escapeHtml(props.slide.TitleSlide?.title)}</div>
        <div id="subtitle">${escapeHtml(props.slide.TitleSlide?.subtitle)}</div>
      </div>
    </foreignObject>
  </svg>`;
  const titleAndContent = html`<svg
    xmlns="http://www.w3.org/2000/svg"
    width="${width}"
    height="${height}"
  >
    <style>
      #background {
        display: flex;
        flex-direction: column;
        background-color: white;
        padding: 12px;
        height: 100%;
        color: black;
        #title {
          font-size: 32px;
          text-align: center;
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
        <div id="title">${escapeHtml(props.slide.TitleAndContent?.title)}</div>
        <div id="subtitle">${props.slide.TitleAndContent?.content}</div>
      </div>
    </foreignObject>
  </svg>`;
  const sectionHeader = html`<svg
    xmlns="http://www.w3.org/2000/svg"
    width="${width}"
    height="${height}"
  >
    <style>
      #background {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: white;
        height: 100%;
        color: black;
        #title {
          font-size: 32px;
          text-align: center;
        }
        #subtitle {
          font-size: 16px;
          text-align: center;
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
        <div id="title">${escapeHtml(props.slide.SectionHeader?.section)}</div>
        <div id="subtitle">
          ${escapeHtml(props.slide.SectionHeader?.subsection)}
        </div>
      </div>
    </foreignObject>
  </svg>`;
  const src = useState("");
  useEffect(() => {
    let blob;
    switch (props.slide.type) {
      case Prisma.ModelName.TitleSlide:
        blob = new Blob([titleSlide], { type: "image/svg+xml" });
        break;
      case Prisma.ModelName.TitleAndContent:
        blob = new Blob([titleAndContent], { type: "image/svg+xml" });
        break;
      case Prisma.ModelName.SectionHeader:
        blob = new Blob([sectionHeader], { type: "image/svg+xml" });
        break;
      case Prisma.ModelName.TwoContent:
        break;
      case Prisma.ModelName.Comparison:
        break;
      case Prisma.ModelName.TitleOnly:
        break;
      case Prisma.ModelName.Blank:
        break;
    }
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    console.log({ url });
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
