"use server";

import { scryptPassword } from "@/lib";
import { jwtSign } from "@/lib/jose";
import prisma from "@/lib/prisma";
import route from "@/lib/route";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type Payload = Prisma.UserGetPayload<{
  select: { email: boolean; Password: { select: { password: boolean } } };
}>;

async function userLogin(payload: Payload) {
  if (!payload.email || !payload.Password?.password) {
    throw [payload.email, payload.Password?.password];
  }
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      Password: {
        password: scryptPassword(payload.Password.password, process.env.SALT!),
      },
    },
  });
  cookies().set(Prisma.ModelName.User, await jwtSign({ userId: user.id }));
  revalidatePath(route.dashboard_home);
}

async function userLogout() {
  cookies().delete(Prisma.ModelName.User);
  redirect(route.dashboard_home);
}

export { userLogin, userLogout, type Payload };
