import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongoose';
import User, { UserRole, ClubType } from '@/lib/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

type BulkUploadUser = {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  club?: ClubType;
  creditScore?: number;
};

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only admin and superadmin can upload users
    if (!['admin', 'superadmin'].includes(session.user.role as string)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Get data from request
    const { users } = await request.json();
    
    if (!users || !Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        { error: 'No users provided or invalid format' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Process users
    const results = {
      successCount: 0,
      failedCount: 0,
      errors: [] as Array<{ rowNumber: number; error: string; data: Record<string, any> }>
    };

    // Regular admins can only add users to their own club
    const adminClub = session.user.role === 'admin' ? session.user.club as ClubType : null;

    // Process users one by one
    for (let i = 0; i < users.length; i++) {
      const userData = users[i] as BulkUploadUser;
      const rowNumber = i + 1;

      try {
        // Check required fields
        if (!userData.name || !userData.email || !userData.password) {
          results.failedCount++;
          results.errors.push({
            rowNumber,
            error: 'Missing required fields',
            data: userData
          });
          continue;
        }

        // Check email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
          results.failedCount++;
          results.errors.push({
            rowNumber,
            error: 'Invalid email format',
            data: userData
          });
          continue;
        }

        // Check if email exists
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
          results.failedCount++;
          results.errors.push({
            rowNumber,
            error: 'User with this email already exists',
            data: userData
          });
          continue;
        }

        // Handle club restrictions for regular admins
        if (adminClub && userData.club && userData.club !== adminClub) {
          // Regular admins can only add users to their own club
          results.failedCount++;
          results.errors.push({
            rowNumber,
            error: `As admin of ${adminClub}, you can only add users to your club`,
            data: userData
          });
          continue;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(userData.password, 12);

        // Create new user
        const newUser = new User({
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          role: userData.role || 'user',
          club: adminClub || userData.club || '',
          creditScore: userData.creditScore || 0
        });

        await newUser.save();
        results.successCount++;
      } catch (error) {
        console.error(`Error processing user at row ${rowNumber}:`, error);
        results.failedCount++;
        results.errors.push({
          rowNumber,
          error: `Server error: ${(error as Error).message}`,
          data: userData
        });
      }
    }

    // Return results
    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('Bulk upload error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing the upload' },
      { status: 500 }
    );
  }
} 