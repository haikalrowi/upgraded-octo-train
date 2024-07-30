import Form from "@/components/dashboard/presentation/form";
import { presentationDefaultArgs } from "@/components/dashboard/presentation/form/_payload";
import prisma from "@/lib/prisma";

type Props = { params: { id: string } };

export default async function Id_Page({ params }: Props) {
  const presentation = await prisma.presentation.findUniqueOrThrow({
    where: { id: params.id },
    select: presentationDefaultArgs.select,
  });
  return (
    <Form
      type="update"
      initialValues={presentation}
    />
  );
}
