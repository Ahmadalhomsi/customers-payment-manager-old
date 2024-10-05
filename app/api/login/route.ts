import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (username === adminUsername && password === adminPassword) {
    // Set a session cookie
    const response = NextResponse.json({ message: 'Login successful' });
    response.cookies.set('admin', 'logged-in', {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day session duration
    });
    return response;
  } else {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }
}
