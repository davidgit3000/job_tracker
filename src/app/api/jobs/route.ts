import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

export async function GET() {
  const prisma = new PrismaClient();
  
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !('id' in session.user) || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id as string;
    const jobs = await prisma.jobApplication.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  const prisma = new PrismaClient();
  
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !('id' in session.user) || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const userId = session.user.id as string;
    
    const newJob = await prisma.jobApplication.create({
      data: {
        userId,
        jobTitle: body.job_title,
        companyName: body.company_name,
        url: body.url || null,
        location: body.location || null,
        dateApplied: body.date_applied ? new Date(body.date_applied) : null,
        status: body.status || 'Applied',
        notes: body.notes || null
      }
    });

    return NextResponse.json(newJob);
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
