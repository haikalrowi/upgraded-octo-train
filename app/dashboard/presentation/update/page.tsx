import Update from "@/components/dashboard/presentation/update";
import { jwtVerify } from "@/lib/jose";
import prisma from "@/lib/prisma";
import route from "@/lib/route";
import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Update_Page() {
  const jwt = cookies().get(Prisma.ModelName.User)?.value;
  try {
    if (!jwt) throw [{ jwt }];
    const { userId } = await jwtVerify(jwt);
    const presentations = await prisma.presentation.findMany({
      where: { User: { id: userId } },
    });
    return <Update presentations={presentations} />;
  } catch (error) {
    console.error(error);
    redirect(route.dashboard_home);
  }
}
