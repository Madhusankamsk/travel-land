"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const AUTH_COOKIE = "auth_session";
const AUTH_ROLE_COOKIE = "auth_role";
const AUTH_USER_ID_COOKIE = "auth_user_id";

export async function logoutAction(): Promise<never> {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, "", { path: "/", maxAge: 0 });
  cookieStore.set(AUTH_ROLE_COOKIE, "", { path: "/", maxAge: 0 });
  cookieStore.set(AUTH_USER_ID_COOKIE, "", { path: "/", maxAge: 0 });
  redirect("/");
}
