import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


const MAX_ATTEMPTS = 5;
const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  const ipAddress = req.headers.get("x-forwarded-for") || req.ip || "unknown"; // Get user's IP address
  
  // Fetch record for this IP
  
  const failedAttempt = await prisma.failedLoginAttempt.findUnique({
    where: { ipAddress },
  });

  // If the IP is blocked
  if (failedAttempt && failedAttempt.blockedUntil && new Date() < failedAttempt.blockedUntil) {
    return NextResponse.json(
      { message: "Too many failed attempts. Try again later." },
      { status: 429 }
    );
  }

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  // Check credentials
  if (username === adminUsername && password === adminPassword) {
    // Reset failed attempts on successful login
    if (failedAttempt) {
      await prisma.failedLoginAttempt.delete({
        where: { ipAddress },
      });
    }

    // Set a session cookie
    const response = NextResponse.json({ message: "Login successful" });
    response.cookies.set("admin", "logged-in", {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day session
    });
    return response;
  }

  // Handle invalid login attempt
  if (failedAttempt) {
    let newAttempts = failedAttempt.attempts + 1;
    let blockTime = null;

    // If max attempts exceeded, block for a duration
    if (newAttempts >= MAX_ATTEMPTS) {
      blockTime = new Date(Date.now() + BLOCK_DURATION);
    }

    await prisma.failedLoginAttempt.update({
      where: { ipAddress },
      data: {
        attempts: newAttempts,
        blockedUntil: blockTime,
      },
    });
  } else {
    // First failed attempt from this IP
    await prisma.failedLoginAttempt.create({
      data: {
        ipAddress,
        attempts: 1,
      },
    });
  }

  return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
}
