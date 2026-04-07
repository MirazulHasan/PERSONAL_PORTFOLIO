import { PrismaClient } from '../src/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Create Admin User
  const hashedPassword = await bcrypt.hash('Mirazul@2911', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'mirazulhasanhimel19@gmail.com' },
    update: {},
    create: {
      email: 'mirazulhasanhimel19@gmail.com',
      password: hashedPassword,
      name: 'Md. Mirazul Hasan',
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created/verified');

  // 2. Create Profile
  const profile = await prisma.profile.upsert({
    where: { id: 'default-profile' },
    update: {},
    create: {
      id: 'default-profile',
      name: 'Md. Mirazul Hasan',
      title: 'Full Stack Developer & AI Enthusiast',
      heroHeadline1: 'AI Engineer',
      heroHeadline2: 'Photographer',
      heroGreetingPrefix: "👋 Hi, I'm",
      heroGreetingSuffix: "and I build",
      bio: "A passionate full-stack developer based in Bangladesh, specializing in Next.js, TypeScript, and AI integration. I love building scalable applications and exploring the latest tech in the smart tech guide world.",
      aboutTitle: 'Passionate about building things that matter',
      address: 'Dhaka, Bangladesh',
      email: 'mirazulhasanhimel19@gmail.com',
      avatarUrl: 'https://res.cloudinary.com/du9pcsi12/image/upload/v1741369389/portfolio/avatars/avatar_placeholder.webp',
      aboutImageUrl: 'https://res.cloudinary.com/du9pcsi12/image/upload/v1741369389/portfolio/about/about_placeholder.webp',
      availability: 'Available for new opportunities',

      socialLinks: {
        create: [
          { platform: 'GitHub', url: 'https://github.com', order: 0 },
          { platform: 'LinkedIn', url: 'https://linkedin.com', order: 1 },
          { platform: 'Twitter', url: 'https://twitter.com', order: 2 },
        ]
      }
    },
  });
  console.log('✅ Profile created/verified');

  // 3. Create initial Skills
  const skillsData = [
    { name: 'Next.js', category: 'Frontend', level: 90, order: 0 },
    { name: 'React', category: 'Frontend', level: 95, order: 1 },
    { name: 'TypeScript', category: 'Languages', level: 85, order: 2 },
    { name: 'Node.js', category: 'Backend', level: 80, order: 3 },
    { name: 'Prisma', category: 'Backend', level: 85, order: 4 },
    { name: 'Tailwind CSS', category: 'Frontend', level: 90, order: 5 },
  ];

  for (const skill of skillsData) {
    await prisma.skill.create({ data: skill });
  }
  console.log('✅ Base skills seeded');

  // 4. Create a Sample Project
  await prisma.project.create({
    data: {
      title: 'Next.js Portfolio',
      description: 'A high-performance portfolio website built with Next.js 15, Prisma, and Framer Motion. Featuring a sleek dark mode and dynamic database integration.',
      tags: 'Next.js, Prisma, SQLite, Framer Motion',
      githubUrl: 'https://github.com',
      liveUrl: 'https://mirazulhasan.vercel.app',
      featured: true,
      order: 0
    }
  });
  console.log('✅ Sample project seeded');

  console.log('🚀 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
