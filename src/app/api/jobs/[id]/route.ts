import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const prisma = new PrismaClient();
  
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !('id' in session.user) || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const jobId = params.id;
    const userId = session.user.id as string;

    // Verify job belongs to user
    const existingJob = await prisma.jobApplication.findFirst({
      where: { id: jobId, userId: userId }
    });

    if (!existingJob) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const updatedJob = await prisma.jobApplication.update({
      where: { id: jobId },
      data: {
        jobTitle: body.job_title || existingJob.jobTitle,
        companyName: body.company_name || existingJob.companyName,
        url: body.url !== undefined ? body.url : existingJob.url,
        location: body.location !== undefined ? body.location : existingJob.location,
        dateApplied: body.date_applied !== undefined ? (body.date_applied ? new Date(body.date_applied) : null) : existingJob.dateApplied,
        status: body.status || existingJob.status,
        notes: body.notes !== undefined ? body.notes : existingJob.notes
      }
    });

    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const prisma = new PrismaClient();
  
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !('id' in session.user) || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const jobId = params.id;
    const userId = session.user.id as string;

    const deletedJob = await prisma.jobApplication.deleteMany({
      where: { id: jobId, userId: userId }
    });

    if (deletedJob.count === 0) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
