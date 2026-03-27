import { NextResponse } from "next/server";
import { CMS_COOKIE_NAME } from "@/lib/cms/auth";

export async function POST(request: Request) {
  const response = NextResponse.redirect(
    new URL("/cms/login", request.url),
    303,
  );

  response.cookies.set({
    name: CMS_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });

  return response;
}
