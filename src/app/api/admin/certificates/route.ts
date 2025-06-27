import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongoose';
import User from '@/lib/models/User';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Get user session
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if user is admin
    const adminUser = await User.findOne({ email: session.user.email });
    
    if (!adminUser || (adminUser.role !== 'admin' && adminUser.role !== 'superadmin')) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }
    
    // Find all users with pending certificates
    const users = await User.find(
      { 'certificates.isVerified': false },
      'name email certificates'
    ).lean();
    
    // Format the certificates with user information
    const pendingCertificates = users.flatMap(user => 
      user.certificates
        .filter((cert: any) => !cert.isVerified)
        .map((cert: any) => ({
          _id: `${user._id}-${cert._id}`, // Composite ID for React keys
          userId: user._id,
          userName: user.name,
          userEmail: user.email,
          certificateId: cert._id,
          name: cert.name,
          url: cert.url,
          submittedAt: cert.submittedAt,
          isVerified: cert.isVerified
        }))
    );
    
    // Sort by submission date (newest first)
    pendingCertificates.sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
    
    return NextResponse.json({
      certificates: pendingCertificates
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching pending certificates:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch certificates';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 