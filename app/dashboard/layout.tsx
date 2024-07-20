import Dashboard from "@/components/dashboard";
import Login from "@/components/dashboard/login";
import { jwtVerify } from "@/lib/jose";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";

export default async function Dashboard_Layout({
  children,
}: React.PropsWithChildren) {
  const jwt = cookies().get(Prisma.ModelName.User)?.value;
  try {
    if (!jwt) throw [{ jwt }];
    const { userId } = await jwtVerify(jwt);
    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
    return <Dashboard key={user.id}>{children}</Dashboard>;
  } catch (error) {
    console.error(error);
    return <Login />;
  }
}
