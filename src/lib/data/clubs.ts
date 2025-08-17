// Define the club data type
export type ClubDetails = {
  id: string;
  name: string;
  slug: string;
  description: string;
  mission: string;
  vision: string;
  team: Array<{
    id: string;
    name: string;
    position: string;
    initials: string;
    image?: string;
  }>;
  color?: string;
  tagline?: string;
};

// Club data
export const clubsData: Record<string, ClubDetails> = {
  'ieee': {
    id: 'ieee',
    name: 'IEEE',
    slug: 'ieee',
    description: 'The IEEE Student Branch is dedicated to developing professional and technical abilities of its student members through various activities including technical talks, workshops, industrial visits, and social activities.',
    mission: 'To foster technological innovation and excellence for the benefit of humanity by helping members network and collaborate, and to provide professional growth opportunities in the field of electrical and electronic engineering.',
    vision: 'To be the most recognized and respected platform for technology enthusiasts; a body which would not only foster professional skills but also inculcate a sense of social and ethical responsibility.',
    color: 'from-blue-600 to-blue-800',
    tagline: 'Advancing Technology for Humanity',
    team: [
      { id: 'aj', name: 'Aditi Pathak', position: 'president', initials: 'AP', image: 'aditi.jpg' },
      { id: 'sw', name: 'Akshat Agrawl', position: 'Vice President', initials: 'AA', image: 'akshatagrawal.jpg' },
      { id: 'mb', name: 'Krish Lehjaria', position: 'Secretary', initials: 'KL', image: 'krrishlenjhara.jpg' },
      { id: 'ed', name: 'Yuvraj Singh', position: 'Treasurer', initials: 'ED', image: 'Yuvrajsingh.jpg' }
    ]
  },
  'acm': {
    id: 'acm',
    name: 'ACM',
    slug: 'acm',
    description: 'The Association for Computing Machinery promotes increased knowledge and interest in computing science and applications.',
    mission: 'To advance computing as a science and profession by enabling professional growth and connecting computing educators, researchers, and professionals.',
    vision: 'To be a leading platform for advancing the art, science, engineering, and application of computing, serving both professional and public interests.',
    color: 'from-green-600 to-green-800',
    tagline: 'Advancing Computing as a Science & Profession',
    team: [
      { id: 'js', name: 'Priyanka Toke', position: 'President', initials: 'PT', image: 'PriyankaToke.jpg' },
      { id: 'lw', name: 'Damita Pathak', position: 'Vice President', initials: 'DP', image: 'DamitaPathak.jpeg' },
      { id: 'rj', name: 'Vedant Soni', position: 'Secretary', initials: 'VS', image: 'VedantSoni.jpg' },
      { id: 'km', name: 'Tanya Somwanshi', position: 'Treasurer', initials: 'KM', image: 'TanyaSomwanshi.jpg' }
    ]
  },
  'aws': {
    id: 'aws',
    name: 'AWS',
    slug: 'aws',
    description: 'The AWS Student Club focuses on cloud computing technologies and offers hands-on experience with Amazon Web Services.',
    mission: 'To provide students with practical knowledge and skills in cloud computing through Amazon Web Services, empowering them to build innovative solutions and accelerate their careers.',
    vision: 'To create a community of cloud-native developers who are ready to tackle real-world challenges and drive technological innovation forward.',
    color: 'from-orange-600 to-orange-800',
    tagline: 'Building in the Cloud',
    team: [
      { id: 'tr', name: 'Anekant Jain', position: 'President', initials: 'AJ', image: 'AnekantJain.jpg' },
      { id: 'sv', name: 'Shivam Verma', position: 'Techical Lead', initials: 'SV' },
      { id: 'lv', name: 'Lochan Vaidya', position: 'Vice President', initials: 'LV', image: 'LochanVaidya.jpg' },
      { id: 'dd', name: 'Dolly Malviya', position: 'Operation Head', initials: 'DM' }
    ]
  },
  'gdg': {
    id: 'gdg',
    name: 'GDG',
    slug: 'gdg',
    description: 'Google Developer Group connects students passionate about Google technologies and provides learning opportunities through workshops and events.',
    mission: 'To create a space for developers to connect, learn, and grow together while exploring Google technologies and building innovative solutions.',
    vision: 'To foster a vibrant community of student developers who contribute to the technology ecosystem and drive positive change through Google technologies.',
    color: 'from-red-600 to-red-800',
    tagline: 'Learn. Connect. Build.',
    team: [
      { id: 'rp', name: 'Vipul Jat', position: 'President', initials: 'RP', image: 'VipulJat.jpg' },
      { id: 'ml', name: 'Anurag Agrawal', position: 'Cloud Mentor', initials: 'AA' },
      { id: 'ys', name: 'Yash Sharma', position: 'Technical Lead', initials: 'YS' },
      { id: 'pc', name: 'Parakh Maheshwari', position: 'Graphics Head', initials: 'PM' }
    ]
  },
  'stic': {
    id: 'stic',
    name: 'STIC',
    slug: 'stic',
    description: 'Student Technical Innovation Club encourages innovation and practical application of technology through projects and competitions.',
    mission: 'To cultivate a culture of innovation and practical problem-solving using technology, inspiring students to apply their knowledge to create real-world solutions.',
    vision: 'To be the catalyst for student-led technical innovation on campus, enabling future leaders to develop both technical expertise and entrepreneurial mindset.',
    color: 'from-purple-600 to-indigo-800',
    tagline: 'Innovate. Create. Transform.',
    team: [
      { id: 'as', name: 'Samvardha Khandwe', position: 'President', initials: 'SK', image: 'SamvardhaKhandwe.png' },
      { id: 'lt', name: 'Yuvraj Singh', position: 'technical Lead', initials: 'YS' },
      { id: 'dc', name: 'Khadija Saifee', position: 'Secretary', initials: 'DC', image: 'khadijasaifee.png' },
      { id: 'hr', name: 'Sujal Dhandre', position: 'Treasurer', initials: 'HR', image: 'SujalDhandre.png' }
    ]
  }
};
