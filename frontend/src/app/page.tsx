'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth';

export default function Home() {
  const router = useRouter();
  const { state } = useAuth();

  useEffect(() => {
    if (state.user) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [state.user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}