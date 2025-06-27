import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import User from '@/lib/models/User';
import { getServerSession } from 'next-auth';

// Define the certificate type from Mongoose lean queries
interface CertificateDocument {
  _id?: string | { toString(): string };
  name: string;
  url: string;
  isVerified: boolean;
  creditsAwarded: number;
  submittedAt: Date;
  verifiedAt?: Date;
}

export async function GET() {
  try {
    await connectToDatabase();
    
    // Get user session
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if user is admin or superadmin
    const adminUser = await User.findOne(
      { email: session.user.email },
      'role'
    );
    
    if (!adminUser || (adminUser.role !== 'admin' && adminUser.role !== 'superadmin')) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }
    
    // Find all users with pending certificates
    const users = await User.find(
      { 'certificates.isVerified': false },
      'name email certificates'
    ).lean();
    
    // Format the response
    const pendingCertificates = users.flatMap(user => {
      // Handle potentially undefined certificates
      const certificates = user.certificates || [];
      const pendingCerts = certificates.filter(cert => !cert.isVerified) as CertificateDocument[];
      
      return pendingCerts.map(cert => ({
        userId: user._id?.toString(),
        userName: user.name,
        userEmail: user.email,
        certificateId: cert._id?.toString(),
        certificateName: cert.name,
        submittedAt: cert.submittedAt,
        url: cert.url
      }));
    });
    
    return NextResponse.json({
      pendingCertificates,
      count: pendingCertificates.length
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching pending certificates:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch pending certificates';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 