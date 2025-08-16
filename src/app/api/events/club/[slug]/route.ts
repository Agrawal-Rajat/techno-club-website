import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import Event from '@/lib/models/Event';
import { getServerSession } from 'next-auth';
import User from '@/lib/models/User';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase();
    
    // Get user session to check role
    const session = await getServerSession();
    let userId = null;
    let userRole = 'user';
    
    if (session?.user?.email) {
      const user = await User.findOne({ email: session.user.email });
      if (user) {
        userId = user._id;
        userRole = user.role;
      }
    }
    
    // Get club name from slug (convert slug to proper club name format)
    const resolvedParams = await params;
    const club = resolvedParams.slug.toUpperCase();
    
    // Only fetch published events for regular users
    const query: Record<string, unknown> = { club };
    if (userRole !== 'superadmin') {
      query.isPublished = true;
    }
    
    // Fetch events for the specific club
    const events = await Event.find(query)
      .sort({ startDate: -1 }) // Sort by date descending (newest first)
      .populate('creatorId', 'name email')
      .lean();
    
    // Format events to include participation status
    const formattedEvents = events.map((event) => {
      // Check if current user is participating
      const isParticipating = userId ? 
        event.participants?.some((id) => 
          id.toString() === userId.toString()
        ) : false;
      
      return {
        ...event,
        isParticipating,
        participantCount: event.participants?.length || 0,
        // Only include full participants list for admins/superadmins
        participants: ['admin', 'superadmin'].includes(userRole) ? event.participants : undefined
      };
    });
    
    return NextResponse.json({ events: formattedEvents }, { status: 200 });
    
  } catch (error: unknown) {
    console.error('Error fetching club events:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch club events';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 