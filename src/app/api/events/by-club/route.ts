import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import Event from '@/lib/models/Event';
import { getServerSession } from 'next-auth';
import User from '@/lib/models/User';

export async function GET() {
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
    
    // Only fetch published events for regular users
    const query: Record<string, unknown> = {};
    if (userRole !== 'superadmin') {
      query.isPublished = true;
    }
    
    // Get list of all clubs
    const clubs = ['IEEE', 'ACM', 'AWS', 'GDG', 'STIC'];
    
    // Object to store events by club
    const eventsByClub: Record<string, Array<Record<string, unknown>>> = {};
    
    // Fetch three events for each club
    for (const club of clubs) {
      const clubEvents = await Event.find({ ...query, club })
        .sort({ createdAt: -1 })
        .limit(3)
        .populate('creatorId', 'name email')
        .lean();
      
      // Format events to include participation status
      const formattedEvents = clubEvents.map((event) => {
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
      
      eventsByClub[club] = formattedEvents;
    }
    
    return NextResponse.json({ eventsByClub }, { status: 200 });
    
  } catch (error: unknown) {
    console.error('Error fetching events by club:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch events by club';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 