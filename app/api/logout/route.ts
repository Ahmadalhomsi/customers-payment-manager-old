import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ message: "Logged out" });
  response.cookies.set("admin", "", { maxAge: 0 });
  return response;
}
