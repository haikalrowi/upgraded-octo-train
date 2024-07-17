import Dashboard from "@/components/dashboard";
import Login from "@/components/login";
import { userLogin } from "@/lib/action/user";
import { jwtVerify } from "@/lib/jose";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export default async function Dashboard_Layout({
  children,
}: React.PropsWithChildren) {
  const jwt = cookies().get(userLogin.name)?.value;
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
