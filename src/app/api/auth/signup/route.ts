import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function POST(request: NextRequest) {
  // Create a fresh Prisma client for this request to avoid cached plans
  const prisma = new PrismaClient();
  
  try {
    const { username, firstName } = await request.json();

    if (!username || !firstName) {
      return NextResponse.json(
        { error: 'Username and first name are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        username,
        firstName
      }
    });

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        firstName: newUser.firstName
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    // Disconnect the Prisma client to avoid connection issues
    await prisma.$disconnect();
  }
}
