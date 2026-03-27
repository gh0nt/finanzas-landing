import { NextResponse } from "next/server";
import {
  CMS_COOKIE_NAME,
  createCmsSessionToken,
  validateCmsCredentials,
} from "@/lib/cms/auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const account = String(formData.get("account") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const isValid = validateCmsCredentials(account, password);
  const token = createCmsSessionToken();

  if (!isValid || !token) {
    return NextResponse.redirect(
      new URL("/cms/login?error=1", request.url),
      303,
    );
  }

  const response = NextResponse.redirect(new URL("/cms", request.url), 303);

  response.cookies.set({
    name: CMS_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}
