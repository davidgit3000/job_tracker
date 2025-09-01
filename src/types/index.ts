// Prisma types are auto-generated, but we can define additional interfaces if needed
export interface JobApplication {
  id: string;
  userId: string;
  jobTitle: string;
  companyName: string;
  url?: string;
  location?: string;
  dateApplied?: Date;
  status: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateJobApplication {
  job_title: string;
  company_name: string;
  url?: string;
  location?: string;
  date_applied?: string;
  status?: 'Applied' | 'Interview Scheduled' | 'Interview Completed' | 'Offer Received' | 'Rejected' | 'Withdrawn';
  notes?: string;
}

export interface UpdateJobApplication extends Partial<CreateJobApplication> {
  id: string;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      username?: string;
    }
  }

  interface User {
    id: string;
    username: string;
  }
}
