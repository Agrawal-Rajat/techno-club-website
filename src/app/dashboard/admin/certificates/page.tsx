"use client";

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import CertificateVerification from '@/components/CertificateVerification';

const CertificateVerificationPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    // Redirect if not authenticated or not an admin
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated' && !['admin', 'superadmin'].includes(session?.user?.role as string)) {
      router.push('/dashboard');
    }
  }, [status, session, router]);
  
  // Show loading or unauthorized messages based on the session status
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (!session || !['admin', 'superadmin'].includes(session?.user?.role as string)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-900 border-l-4 border-red-500 text-red-100 p-4 rounded">
          <div className="flex items-center">
            <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Access denied. Admin privileges required.</span>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Certificate Verification</h1>
        <p className="text-gray-400">Verify user certificates and award credits to users</p>
      </div>
      
      <CertificateVerification />
    </div>
  );
};

export default CertificateVerificationPage; 