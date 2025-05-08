import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
  try {
    const body = await request.json();

  
    // 1. INPUT VALIDATION
   if (!body.email || typeof body.email !== 'string') {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Normalize and validate email format
    const email = body.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (!body.newPassword || body.newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }


    // 2. DEBUG LOGS (TEMPORARY)
    console.log("Reset request for:", email);
    const allUsers = await prisma.user.findMany();
    console.log("All users in DB:", allUsers.map(u => u.email));

 
    // 3. USER VERIFICATION
    // const user = await prisma.user.findUnique({
    //   where: { email },
    // });

    // if (!user) {
    //   console.log("User not found for email:", email);
    //   return NextResponse.json(
    //     { error: "No account found with this email" },
    //     { status: 404 }
    //   );
    // }
    // 3. USER VERIFICATION
const user = await prisma.user.findFirst({
    where: {
      email: {
        equals: email,
        mode: 'insensitive',
      },
    },
  });
  
  if (!user) {
    console.log("User not found for email:", email);
    return NextResponse.json(
      { error: "No account found with this email" },
      { status: 404 }
    );
  }
  
// 4. PASSWORD UPDATE

    const hashedPassword = await bcrypt.hash(body.newPassword, 12);
    await prisma.user.update({
      where: { id: user.id }, // More reliable than email
      data: { hashedPassword },
    });

    return NextResponse.json({ 
      success: true,
      message: "Password updated successfully" 
    });

  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}