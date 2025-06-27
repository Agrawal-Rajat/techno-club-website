import { Metadata } from 'next';
import { clubsData } from '@/lib/data/clubs';

// Define metadata generator
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const club = clubsData[params.slug];
  
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

export default function ClubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 