"use server";

import { scryptPassword } from "@/lib";
import { jwtSign } from "@/lib/jose";
import path from "@/lib/path";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function userLogin(email: string, password: string) {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email,
      Password: { password: scryptPassword(password, process.env.SALT!) },
    },
  });
  cookies().set(Prisma.ModelName.User, await jwtSign({ userId: user.id }));
  revalidatePath(path.dashboard_home);
}

export async function userLogout() {
  cookies().delete(Prisma.ModelName.User);
  redirect(path.dashboard_home);
}
