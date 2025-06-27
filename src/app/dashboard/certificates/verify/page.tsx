'use client';

import React from 'react';
import CertificateVerification from '@/components/CertificateVerification';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function VerifyCertificatesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }

    const checkRole = async () => {
      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const data = await response.json();
          setUserRole(data.role);
        }
      } catch (error) {
        console.error('Error checking user role:', error);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      checkRole();
    }
  }, [status, router]);

  // Redirect if user is not admin or superadmin
  useEffect(() => {
    if (!loading && userRole && userRole !== 'admin' && userRole !== 'superadmin') {
      router.push('/dashboard');
    }
  }, [userRole, loading, router]);

  if (loading || status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Certificate Verification</h1>
      <CertificateVerification />
    </div>
  );
} 