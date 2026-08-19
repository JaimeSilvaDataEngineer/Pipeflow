"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { DEFAULT_WORKSPACE } from "@/lib/mock/workspace";

const SESSION_COOKIE = "pipeflow_mock_session";

export async function mockSignIn() {
  cookies().set(SESSION_COOKIE, "1", { httpOnly: true, path: "/" });
  redirect(`/${DEFAULT_WORKSPACE.slug}/dashboard`);
}

export async function mockSignOut() {
  cookies().delete(SESSION_COOKIE);
  redirect("/login");
}
