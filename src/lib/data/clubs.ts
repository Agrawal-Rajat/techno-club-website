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
      { id: 'ieee-1', name: 'Rajat Agrawal', position: 'President', initials: 'RA', image: '' },
      { id: 'ieee-2', name: 'Harshwardhan Singh Sengar', position: 'Vice president', initials: 'HS', image: 'Harshwardhan singh sengar, Vice President IEEE.jpg' },
      { id: 'ieee-3', name: 'Anusha Singh', position: 'Vice president', initials: 'AS', image: 'Anusha Singh , Vice-president IEEE_1(1).jpg' }
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
      { id: 'acm-1', name: 'Atharv Untwale', position: 'President', initials: 'AU', image: 'Atharv Untwale, President , MUACM (8269481880).jpg' },
      { id: 'acm-2', name: 'Kasak Tolani', position: 'Vice president', initials: 'KT', image: 'Kasak Tolani, Vice President, 7869391715.jpg' },
      { id: 'acm-3', name: 'Hemant Sharma', position: 'Vice president', initials: 'HS', image: 'Hemant Sharma _ Vice President_.jpg' }
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
      { id: 'aws-1', name: 'Shivam Verma', position: 'President', initials: 'SV', image: 'Shivam verma, President, AWS CC.jpg' },
      { id: 'aws-2', name: 'Tanish Mishra', position: 'Vice president', initials: 'TM', image: 'Tanish Mishra , Vice President , AWS (9098355701).jpg' },
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
      { id: 'gdg-1', name: 'Devanshu Pal', position: 'President', initials: 'DP', image: '' },
      { id: 'gdg-2', name: 'Anushka Patidar', position: 'Vice president', initials: 'AP', image: 'Anushka Patidar, Vice President- GDG, 9754725500.jpg' },
      { id: 'gdg-3', name: 'Bhaskar Mishra', position: 'Vice president', initials: 'BM', image: '' }
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
      { id: 'stic-1', name: 'Rudra Chitnis', position: 'President', initials: 'RC', image: 'Rudra Chitnis,President, STIC,8450071921.jpg' },
      { id: 'stic-2', name: 'Sadgi Garg', position: 'Vice president', initials: 'SG', image: 'Sadgi Garg , Vice-President STIC, 9826053334.jpg' }
    ]
  }
}