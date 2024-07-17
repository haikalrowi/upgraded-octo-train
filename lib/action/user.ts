"use server";

import { scryptPassword } from "@/lib";
import { jwtSign } from "@/lib/jose";
import path from "@/lib/path";
import prisma from "@/lib/prisma";
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
  cookies().set(userLogin.name, await jwtSign({ userId: user.id }));
  revalidatePath(path.dashboard_home);
}

export async function userLogout() {
  cookies().delete(userLogin.name);
  redirect(path.dashboard_home);
}
