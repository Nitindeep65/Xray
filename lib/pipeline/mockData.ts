// Mock candidate data for hiring screener demo

export interface Candidate {
  id: string;
  name: string;
  email: string;
  resumeText: string;
  rawData: {
    skills: string[];
    yearsExperience: number;
    bio: string;
  };
}

export const mockCandidates: Candidate[] = [
  {
    id: 'C001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    resumeText: 'Senior developer with 2 years of experience in React and modern web technologies. Passionate about building user-friendly applications.',
    rawData: {
      skills: ['React', 'JavaScript', 'CSS', 'HTML'],
      yearsExperience: 2,
      bio: 'I love working in teams and believe in continuous learning. I take ownership of my projects and always strive for excellence.'
    }
  },
  {
    id: 'C002',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    resumeText: 'Full-stack engineer with 5 years of experience specializing in Next.js, TypeScript, and Node.js. Strong focus on performance and scalability.',
    rawData: {
      skills: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS'],
      yearsExperience: 5,
      bio: 'Team player with a passion for mentorship and knowledge sharing. I believe in building products that make a real impact. Strong advocate for code quality and best practices.'
    }
  },
  {
    id: 'C003',
    name: 'Mike Johnson',
    email: 'mike.j@example.com',
    resumeText: 'Frontend specialist with 4 years working on Vue.js and Angular applications. Experience with component libraries and design systems.',
    rawData: {
      skills: ['Vue.js', 'Angular', 'JavaScript', 'SASS', 'Webpack'],
      yearsExperience: 4,
      bio: 'Independent worker who prefers solo projects. Focused on technical excellence and clean code architecture.'
    }
  },
  {
    id: 'C004',
    name: 'Sarah Williams',
    email: 'sarah.w@example.com',
    resumeText: 'React expert with 6 years building enterprise applications. Led multiple teams and mentored junior developers.',
    rawData: {
      skills: ['React', 'Next.js', 'TypeScript', 'GraphQL', 'Docker', 'Kubernetes'],
      yearsExperience: 6,
      bio: 'Natural leader who thrives in collaborative environments. I take full ownership of deliverables and love helping team members grow. Passionate about creating inclusive and supportive team cultures.'
    }
  },
  {
    id: 'C005',
    name: 'Alex Chen',
    email: 'alex.chen@example.com',
    resumeText: 'Backend-focused engineer with 3 years in Python and Django. Some frontend experience with React.',
    rawData: {
      skills: ['Python', 'Django', 'React', 'PostgreSQL', 'Redis'],
      yearsExperience: 3,
      bio: 'Problem solver who enjoys tackling complex challenges. I work well both independently and in teams, adapting to project needs.'
    }
  },
  {
    id: 'C006',
    name: 'Emily Brown',
    email: 'emily.brown@example.com',
    resumeText: 'Junior developer with 1 year of experience. Recently completed bootcamp with focus on React and Next.js.',
    rawData: {
      skills: ['React', 'Next.js', 'JavaScript', 'Tailwind CSS'],
      yearsExperience: 1,
      bio: 'Eager learner with strong communication skills. I love collaborating with others and bringing fresh perspectives to the team.'
    }
  }
];

// Company values for culture fit evaluation
export const companyValues = {
  teamwork: 'We value collaboration and believe the best solutions come from diverse perspectives',
  ownership: 'We take responsibility for our work and see projects through to completion',
  growth: 'We foster continuous learning and support each other\'s development',
  impact: 'We build products that matter and make a real difference for users'
};

// Technical requirements
export const technicalRequirements = {
  minExperience: 3,
  requiredSkills: ['React', 'Next.js'],
  preferredSkills: ['TypeScript', 'Node.js', 'PostgreSQL']
};
