'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    
    if (session) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [session, status, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <LoadingSpinner 
        size="lg" 
        text="Welcome to Job Tracker..." 
        variant="default"
      />
    </div>
  );
}
