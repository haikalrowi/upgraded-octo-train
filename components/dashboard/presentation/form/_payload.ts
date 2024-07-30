import { Prisma } from "@prisma/client";

const presentationDefaultArgs = {
  select: {
    id: true,
    title: true,
    Slide: {
      select: {
        type: true,
        TitleSlide: { select: { title: true, subtitle: true } },
        TitleAndContent: { select: { title: true, content: true } },
        SectionHeader: { select: { section: true, subsection: true } },
        TwoContent: {
          select: { title: true, firstContent: true, secondContent: true },
        },
        Comparison: {
          select: {
            title: true,
            firstSubtitle: true,
            firstComparison: true,
            secondSubtitle: true,
            secondComparison: true,
          },
        },
        TitleOnly: { select: { title: true } },
      },
    },
  },
} satisfies Prisma.PresentationDefaultArgs;

type Payload = Prisma.PresentationGetPayload<typeof presentationDefaultArgs>;

function validateSlideType(type: string) {
  if (
    type !== Prisma.ModelName.TitleSlide &&
    type !== Prisma.ModelName.TitleAndContent &&
    type !== Prisma.ModelName.SectionHeader &&
    type !== Prisma.ModelName.TwoContent &&
    type !== Prisma.ModelName.Comparison &&
    type !== Prisma.ModelName.TitleOnly &&
    type !== Prisma.ModelName.Blank
  ) {
    throw [type];
  }
  return type;
}

export { presentationDefaultArgs, validateSlideType, type Payload };
