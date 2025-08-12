import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import User from '@/lib/models/User';
import { getServerSession } from 'next-auth';

export async function POST(request: Request) {
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
    
    // Get request body
    const body = await request.json();
    const { userId, certificateId, creditsAwarded } = body;
    
    if (!userId || !certificateId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    if (creditsAwarded === undefined || isNaN(parseInt(creditsAwarded)) || parseInt(creditsAwarded) < 0) {
      return NextResponse.json({ error: 'Invalid credits amount' }, { status: 400 });
    }
    
    // Find user and update certificate
    const creditsToAward = parseInt(creditsAwarded);
    
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Find the certificate to verify
    const certificateIndex = user.certificates.findIndex(
      cert => cert._id.toString() === certificateId
    );
    
    if (certificateIndex === -1) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }
    
    // If already verified, return error
    if (user.certificates[certificateIndex].isVerified) {
      return NextResponse.json({ error: 'Certificate already verified' }, { status: 400 });
    }
    
    // Update the certificate
    user.certificates[certificateIndex].isVerified = true;
    user.certificates[certificateIndex].creditsAwarded = creditsToAward;
    user.certificates[certificateIndex].verifiedAt = new Date();
    
    // Update user's total credit score
    user.creditScore += creditsToAward;
    
    // Save the user
    await user.save();
    
    return NextResponse.json({
      success: true,
      message: 'Certificate verified successfully',
      certificate: user.certificates[certificateIndex],
      certificates: user.certificates,
      userId: user._id,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        creditScore: user.creditScore
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error verifying certificate:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to verify certificate';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 