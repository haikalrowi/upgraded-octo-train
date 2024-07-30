"use server";

import {
  Payload,
  validateSlideType,
} from "@/components/dashboard/presentation/form/_payload";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { jwtVerify } from "../jose";
import prisma from "../prisma";
import route from "../route";

async function createPresentation(payload: Pick<Payload, "title" | "Slide">) {
  const jwt = cookies().get(Prisma.ModelName.User)?.value;
  if (!jwt) throw [{ jwt }];
  const { userId } = await jwtVerify(jwt);
  await prisma.presentation.create({
    data: {
      title: payload.title,
      Slide: {
        create: payload.Slide.map((slide, index) => {
          const type = validateSlideType(slide.type);
          return {
            index,
            type,
            [type]: { create: type === "Blank" ? {} : slide[type] },
          };
        }),
      },
      User: { connect: { id: userId } },
    },
  });
  revalidatePath(route.dashboard_presentation_home);
}

async function updatePresentation(payload: Payload) {
  const jwt = cookies().get(Prisma.ModelName.User)?.value;
  if (!jwt) throw [{ jwt }];
  const { userId } = await jwtVerify(jwt);
  await prisma.presentation.update({
    where: { id: payload.id },
    data: {
      title: payload.title,
      Slide: {
        deleteMany: {},
        create: payload.Slide.map((slide, index) => {
          const type = validateSlideType(slide.type);
          return {
            index,
            type,
            [type]: { create: type === "Blank" ? {} : slide[type] },
          };
        }),
      },
      User: { connect: { id: userId } },
    },
  });
  revalidatePath(route.dashboard_presentation_home);
}

export { createPresentation, updatePresentation };
