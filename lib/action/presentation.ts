"use server";

import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";
import { jwtVerify } from "../jose";
import prisma from "../prisma";

type Payload = Prisma.PresentationGetPayload<{
  select: {
    title: boolean;
    Slide: {
      select: {
        type: boolean;
        TitleSlide: { select: { title: boolean; subtitle: boolean } };
        TitleAndContent: { select: { title: boolean; content: boolean } };
        SectionHeader: { select: { section: boolean; subsection: boolean } };
        TwoContent: {
          select: {
            title: boolean;
            firstContent: boolean;
            secondContent: boolean;
          };
        };
        Comparison: {
          select: {
            title: boolean;
            firstSubtitle: boolean;
            firstComparison: boolean;
            secondSubtitle: boolean;
            secondComparison: boolean;
          };
        };
        TitleOnly: { select: { title: boolean } };
        Blank: { select: {} };
      };
    };
  };
}>;

async function createPresentation(payload: Payload) {
  const jwt = cookies().get(Prisma.ModelName.User)?.value;
  if (!jwt) throw [{ jwt }];
  const { userId } = await jwtVerify(jwt);
  await prisma.presentation.create({
    data: {
      title: payload.title,
      Slide: {
        create: payload.Slide.map((slide, index) => {
          if (
            slide.type !== Prisma.ModelName.TitleSlide &&
            slide.type !== Prisma.ModelName.TitleAndContent &&
            slide.type !== Prisma.ModelName.SectionHeader &&
            slide.type !== Prisma.ModelName.TwoContent &&
            slide.type !== Prisma.ModelName.Comparison &&
            slide.type !== Prisma.ModelName.TitleOnly &&
            slide.type !== Prisma.ModelName.Blank
          ) {
            throw [slide.type];
          }
          return {
            index,
            type: slide.type,
            [slide.type]: { create: slide[slide.type] ?? undefined },
          };
        }),
      },
      User: { connect: { id: userId } },
    },
  });
}

export { createPresentation, type Payload };
