import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth-utils";
import { RegisterSchema } from "@/lib/schemas";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Validate request using Zod
    const validation = RegisterSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid input fields", errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }

    // 3. Hash password using bcrypt
    const hashedPassword = await hashPassword(password);

    // 4. Create user in database
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER", // Default role
      },
    });

    // 5. Return success response (excluding password for security)
    return NextResponse.json(
      { 
        message: "User registered successfully", 
        user: { id: user.id, name: user.name, email: user.email } 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
