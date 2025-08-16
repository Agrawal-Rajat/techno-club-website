// 
import { Metadata } from 'next';
import { clubsData } from '@/lib/data/clubs';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const club = clubsData[slug]; // Access club directly by slug if clubsData is an object
  
  if (!club) {
    return {
      title: 'Club Not Found'
    };
  }
  
  return {
    title: `${club.name} - Medi-Caps University`,
    description: club.description,
  };
}

export default function ClubLayout({ children }: { children: React.ReactNode }) {
  return children;
}
