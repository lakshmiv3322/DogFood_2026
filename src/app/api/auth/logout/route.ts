import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const response = NextResponse.redirect(new URL("/login", url.origin));
  response.cookies.set("session", "", {
    maxAge: 0,
    path: "/",
  });
  return response;
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  const response = NextResponse.redirect(new URL("/login", url.origin));
  response.cookies.set("session", "", {
    maxAge: 0,
    path: "/",
  });
  return response;
}
