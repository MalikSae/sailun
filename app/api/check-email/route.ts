import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const existingUser = await db.user.findUnique({ where: { email } });

  if (existingUser) {
    return NextResponse.json({ available: false });
  }

  return NextResponse.json({ available: true });
}
