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
        #${Prisma.TitleSlideScalarFieldEnum.title} {
          font-size: 32px;
          text-align: center;
        }
        #${Prisma.TitleSlideScalarFieldEnum.subtitle} {
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
        <div id="${Prisma.TitleSlideScalarFieldEnum.title}">
          ${escapeHtml(props.slide.TitleSlide?.title)}
        </div>
        <div id="${Prisma.TitleSlideScalarFieldEnum.subtitle}">
          ${escapeHtml(props.slide.TitleSlide?.subtitle)}
        </div>
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
        #${Prisma.TitleAndContentScalarFieldEnum.title} {
          font-size: 32px;
          text-align: center;
        }
        #${Prisma.TitleAndContentScalarFieldEnum.content} {
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
        <div id="${Prisma.TitleAndContentScalarFieldEnum.title}">
          ${escapeHtml(props.slide.TitleAndContent?.title)}
        </div>
        <div id="${Prisma.TitleAndContentScalarFieldEnum.content}">
          ${props.slide.TitleAndContent?.content}
        </div>
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
        #${Prisma.SectionHeaderScalarFieldEnum.section} {
          font-size: 32px;
          text-align: center;
        }
        #${Prisma.SectionHeaderScalarFieldEnum.subsection} {
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
        <div id="${Prisma.SectionHeaderScalarFieldEnum.section}">
          ${escapeHtml(props.slide.SectionHeader?.section)}
        </div>
        <div id="${Prisma.SectionHeaderScalarFieldEnum.subsection}">
          ${escapeHtml(props.slide.SectionHeader?.subsection)}
        </div>
      </div>
    </foreignObject>
  </svg>`;
  const twoContent = html`<svg
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
        #${Prisma.TwoContentScalarFieldEnum.title} {
          font-size: 32px;
          text-align: center;
        }
        #group {
          display: flex;
          #${Prisma.TwoContentScalarFieldEnum.firstContent},
          #${Prisma.TwoContentScalarFieldEnum.secondContent} {
            flex: 1;
          }
          #${Prisma.TwoContentScalarFieldEnum.firstContent} {
            font-size: 16px;
          }
          #${Prisma.TwoContentScalarFieldEnum.secondContent} {
            font-size: 16px;
          }
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
        <div id="${Prisma.TwoContentScalarFieldEnum.title}">
          ${escapeHtml(props.slide.TwoContent?.title)}
        </div>
        <div id="group">
          <div id="${Prisma.TwoContentScalarFieldEnum.firstContent}">
            ${props.slide.TwoContent?.firstContent}
          </div>
          <div id="${Prisma.TwoContentScalarFieldEnum.secondContent}">
            ${props.slide.TwoContent?.secondContent}
          </div>
        </div>
      </div>
    </foreignObject>
  </svg>`;
  const comparison = html`<svg
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
        #${Prisma.ComparisonScalarFieldEnum.title} {
          font-size: 32px;
          text-align: center;
        }
        #group-1 {
          display: flex;
          #group-2,
          #group-3 {
            flex: 1;
          }
          #group-2 {
            #${Prisma.ComparisonScalarFieldEnum.firstSubtitle} {
              font-size: 16px;
            }
            #${Prisma.ComparisonScalarFieldEnum.firstComparison} {
              font-size: 16px;
            }
          }
          #group-3 {
            #${Prisma.ComparisonScalarFieldEnum.secondSubtitle} {
              font-size: 16px;
            }
            #${Prisma.ComparisonScalarFieldEnum.secondComparison} {
              font-size: 16px;
            }
          }
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
        <div id="${Prisma.ComparisonScalarFieldEnum.title}">
          ${escapeHtml(props.slide.Comparison?.title)}
        </div>
        <div id="group-1">
          <div id="group-2">
            <div id="${Prisma.ComparisonScalarFieldEnum.firstSubtitle}">
              ${props.slide.Comparison?.firstSubtitle}
            </div>
            <div id="${Prisma.ComparisonScalarFieldEnum.firstComparison}">
              ${props.slide.Comparison?.firstComparison}
            </div>
          </div>
          <div id="group-3">
            <div id="${Prisma.ComparisonScalarFieldEnum.secondSubtitle}">
              ${props.slide.Comparison?.secondSubtitle}
            </div>
            <div id="${Prisma.ComparisonScalarFieldEnum.secondComparison}">
              ${props.slide.Comparison?.secondComparison}
            </div>
          </div>
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
        blob = new Blob([twoContent], { type: "image/svg+xml" });
        break;
      case Prisma.ModelName.Comparison:
        blob = new Blob([comparison], { type: "image/svg+xml" });
        break;
      case Prisma.ModelName.TitleOnly:
        break;
      case Prisma.ModelName.Blank:
        break;
    }
    if (!blob) return;
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
