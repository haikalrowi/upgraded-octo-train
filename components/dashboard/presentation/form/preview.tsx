import { Card } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import { Prisma } from "@prisma/client";
import clsx from "clsx/lite";
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
  const default_style = html`
    <style>
      .root {
        background-color: white;
        height: 100%;
        color: black;
        > .hidden {
          display: none !important;
        }
        > .${Prisma.ModelName.TitleSlide},
        > .${Prisma.ModelName.TitleAndContent},
        > .${Prisma.ModelName.SectionHeader},
        > .${Prisma.ModelName.TwoContent},
        > .${Prisma.ModelName.Comparison},
        > .${Prisma.ModelName.TitleOnly},
        > .${Prisma.ModelName.Blank} {
          height: 100%;
        }
        .${Prisma.ModelName.TitleSlide} {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .${Prisma.TitleSlideScalarFieldEnum.title} {
            font-size: 32px;
            text-align: center;
          }
          .${Prisma.TitleSlideScalarFieldEnum.subtitle} {
            font-size: 16px;
            text-align: center;
          }
        }
        .${Prisma.ModelName.TitleAndContent} {
          display: flex;
          flex-direction: column;
          padding: 12px;
          .${Prisma.TitleAndContentScalarFieldEnum.title} {
            font-size: 32px;
            text-align: center;
          }
          .${Prisma.TitleAndContentScalarFieldEnum.content} {
            font-size: 16px;
          }
        }
        .${Prisma.ModelName.SectionHeader} {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .${Prisma.SectionHeaderScalarFieldEnum.section} {
            font-size: 32px;
            text-align: center;
          }
          .${Prisma.SectionHeaderScalarFieldEnum.subsection} {
            font-size: 16px;
            text-align: center;
          }
        }
        .${Prisma.ModelName.TwoContent} {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .${Prisma.TwoContentScalarFieldEnum.title} {
          }
          .${Prisma.ModelName.TwoContent}-group-1 {
            .${Prisma.TwoContentScalarFieldEnum.firstContent} {
            }
            .${Prisma.TwoContentScalarFieldEnum.secondContent} {
            }
          }
        }
      }
    </style>
  `;
  const default_titleSlide = html`
    <div
      class="${clsx(
        Prisma.ModelName.TitleSlide,
        props.slide.type !== Prisma.ModelName.TitleSlide && "hidden",
      )}"
    >
      <div class="${Prisma.TitleSlideScalarFieldEnum.title}">
        ${escapeHtml(props.slide.TitleSlide?.title)}
      </div>
      <div class="${Prisma.TitleSlideScalarFieldEnum.subtitle}">
        ${escapeHtml(props.slide.TitleSlide?.subtitle)}
      </div>
    </div>
  `;
  const default_titleAndContent = html`
    <div
      class="${clsx(
        Prisma.ModelName.TitleAndContent,
        props.slide.type !== Prisma.ModelName.TitleAndContent && "hidden",
      )}"
    >
      <div class="${Prisma.TitleAndContentScalarFieldEnum.title}">
        ${escapeHtml(props.slide.TitleAndContent?.title)}
      </div>
      <div class="${Prisma.TitleAndContentScalarFieldEnum.content}">
        ${props.slide.TitleAndContent?.content}
      </div>
    </div>
  `;
  const default_sectionHeader = html`
    <div
      class="${clsx(
        Prisma.ModelName.SectionHeader,
        props.slide.type !== Prisma.ModelName.SectionHeader && "hidden",
      )}"
    >
      <div class="${Prisma.SectionHeaderScalarFieldEnum.section}">
        ${escapeHtml(props.slide.SectionHeader?.section)}
      </div>
      <div class="${Prisma.SectionHeaderScalarFieldEnum.subsection}">
        ${escapeHtml(props.slide.SectionHeader?.subsection)}
      </div>
    </div>
  `;
  const default_twoContent = html`
    <div
      class="${clsx(
        Prisma.ModelName.TwoContent,
        props.slide.type !== Prisma.ModelName.TwoContent && "hidden",
      )}"
    >
      <div class="${Prisma.TwoContentScalarFieldEnum.title}">
        ${escapeHtml(props.slide.TwoContent?.title)}
      </div>
      <div class="${Prisma.ModelName.TwoContent}-group-1">
        <div class="${Prisma.TwoContentScalarFieldEnum.firstContent}">
          ${props.slide.TwoContent?.firstContent}
        </div>
        <div class="${Prisma.TwoContentScalarFieldEnum.secondContent}">
          ${props.slide.TwoContent?.secondContent}
        </div>
      </div>
    </div>
  `;
  const default_comparison = html`
    <div
      class="${clsx(
        Prisma.ModelName.Comparison,
        props.slide.type !== Prisma.ModelName.Comparison && "hidden",
      )}"
    >
      <div class="${Prisma.ComparisonScalarFieldEnum.title}">
        ${escapeHtml(props.slide.Comparison?.title)}
      </div>
      <div class="${Prisma.ComparisonScalarFieldEnum.firstSubtitle}">
        ${escapeHtml(props.slide.Comparison?.firstSubtitle)}
      </div>
      <div class="${Prisma.ComparisonScalarFieldEnum.firstComparison}">
        ${props.slide.Comparison?.firstComparison}
      </div>
      <div class="${Prisma.ComparisonScalarFieldEnum.secondSubtitle}">
        ${escapeHtml(props.slide.Comparison?.secondSubtitle)}
      </div>
      <div class="${Prisma.ComparisonScalarFieldEnum.secondSubtitle}">
        ${props.slide.Comparison?.secondComparison}
      </div>
    </div>
  `;
  const default_titleOnly = html`
    <div
      class="${clsx(
        Prisma.ModelName.TitleOnly,
        props.slide.type !== Prisma.ModelName.TitleOnly && "hidden",
      )}"
    >
      <div class="${Prisma.TitleOnlyScalarFieldEnum.title}">
        ${escapeHtml(props.slide.TitleOnly?.title)}
      </div>
    </div>
  `;
  const default_blank = html`
    <div
      class="${clsx(
        Prisma.ModelName.Blank,
        props.slide.type !== Prisma.ModelName.Blank && "hidden",
      )}"
    ></div>
  `;
  const theme_default = html`
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${width}"
      height="${height}"
    >
      ${default_style}
      <foreignObject
        width="${width}"
        height="${height}"
      >
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          class="root"
        >
          <!--  -->
          ${default_titleSlide}
          <!--  -->
          ${default_titleAndContent}
          <!--  -->
          ${default_sectionHeader}
          <!--  -->
          ${default_twoContent}
          <!--  -->
          ${default_comparison}
          <!--  -->
          ${default_titleOnly}
          <!--  -->
          ${default_blank}
        </div>
      </foreignObject>
    </svg>
  `;
  const src = useState("");
  useEffect(() => {
    const blob = new Blob([theme_default], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
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
