// import { NextResponse } from 'next/server';
// import { connectToDatabase } from '@/lib/mongoose';
// import User from '@/lib/models/User';
// import Event from '@/lib/models/Event';
// import { getServerSession } from 'next-auth';

// export async function GET() {
//   try {
//     await connectToDatabase();
    
//     // Get user session
//     const session = await getServerSession();
    
//     if (!session?.user?.email) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }
    
//     // Find user
//     const user = await User.findOne(
//       { email: session.user.email },
//       'name email image role club creditScore certificates createdAt _id'
//     ).lean();
    
//     if (!user) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     }
    
//     // Find events created by user
//     const createdEvents = await Event.find(
//       { creatorId: user._id },
//       'name description startDate endDate location imageUrl isPublished participants'
//     )
//     .sort({ createdAt: -1 })
//     .lean();
    
//     // Find events user is participating in
//     const participatingEvents = await Event.find(
//       { participants: user._id, isPublished: true },
//       'name description startDate endDate location imageUrl'
//     )
//     .sort({ startDate: 1 })
//     .lean();
    
//     // Count upcoming and past events
//     const now = new Date();
//     const upcomingEvents = participatingEvents.filter(
//       (event) => new Date(event.startDate) > now
//     );
//     const pastEvents = participatingEvents.filter(
//       (event) => new Date(event.endDate) < now
//     );
    
//     // Format stats
//     const stats = {
//       eventsCreated: createdEvents.length,
//       eventsParticipating: participatingEvents.length,
//       upcomingEvents: upcomingEvents.length,
//       pastEvents: pastEvents.length,
//     };
    
//     // Format the response
//     return NextResponse.json({
//       user: {
//         ...user,
//         certificates: user.certificates || []
//       },
//       stats,
//       createdEvents: createdEvents.map(event => ({
//         ...event,
//         participantCount: event.participants?.length || 0,
//         participants: undefined // Don't expose participant details
//       })),
//       participatingEvents: participatingEvents
//     }, { status: 200 });
    
//   } catch (error) {
//     console.error('Error fetching profile:', error);
//     const errorMessage = error instanceof Error ? error.message : 'Failed to fetch profile';
//     return NextResponse.json({ error: errorMessage }, { status: 500 });
//   }
// } 
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import User from '@/lib/models/User';
import Event from '@/lib/models/Event';
import { getServerSession } from 'next-auth';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Get user session
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Find user - ✅ Include ALL profile fields
    const user = await User.findOne(
      { email: session.user.email },
      'name email image role club creditScore certificates bio enrollmentNumber year contactNumber createdAt _id'
    ).lean();
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Find events created by user
    const createdEvents = await Event.find(
      { creatorId: user._id },
      'name description startDate endDate location imageUrl isPublished participants'
    )
    .sort({ createdAt: -1 })
    .lean();
    
    // Find events user is participating in
    const participatingEvents = await Event.find(
      { participants: user._id, isPublished: true },
      'name description startDate endDate location imageUrl'
    )
    .sort({ startDate: 1 })
    .lean();
    
    // Count upcoming and past events
    const now = new Date();
    const upcomingEvents = participatingEvents.filter(
      (event) => new Date(event.startDate) > now
    );
    const pastEvents = participatingEvents.filter(
      (event) => new Date(event.endDate) < now
    );
    
    // Format stats
    const stats = {
      eventsCreated: createdEvents.length,
      eventsParticipating: participatingEvents.length,
      upcomingEvents: upcomingEvents.length,
      pastEvents: pastEvents.length,
    };
    
    // Format the response - ✅ Include all profile fields
    return NextResponse.json({
      user: {
        ...user,
        certificates: user.certificates || [],
        bio: user.bio || '',
        enrollmentNumber: user.enrollmentNumber || '',
        year: user.year || '',
        contactNumber: user.contactNumber || ''
      },
      stats,
      createdEvents: createdEvents.map(event => ({
        ...event,
        participantCount: event.participants?.length || 0,
        participants: undefined // Don't expose participant details
      })),
      participatingEvents: participatingEvents
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching profile:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch profile';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { name, bio, enrollmentNumber, year, contactNumber } = body;
    
    // Validate required fields
    if (!name || !enrollmentNumber || !year || !contactNumber) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, enrollmentNumber, year, contactNumber' 
      }, { status: 400 });
    }
    
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        name,
        bio: bio || '',
        enrollmentNumber,
        year,
        contactNumber,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      message: 'Profile updated successfully',
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio,
        enrollmentNumber: updatedUser.enrollmentNumber,
        year: updatedUser.year,
        contactNumber: updatedUser.contactNumber,
        role: updatedUser.role,
        club: updatedUser.club,
        creditScore: updatedUser.creditScore
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error updating profile:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}