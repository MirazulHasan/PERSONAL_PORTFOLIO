import { PrismaClient } from '../src/generated/prisma'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const password = await hash('Mirazul@2911', 12)
    
    // Create or update the admin user
    const user = await prisma.user.upsert({
        where: { email: 'mirazulhasanhimel19@gmail.com' },
        update: {
            password,
        },
        create: {
            email: 'mirazulhasanhimel19@gmail.com',
            name: 'Md. Mirazul Hasan',
            password,
            role: 'ADMIN',
        },
    })

    // Delete existing profile and create a fresh one
    await (prisma as any).profile.deleteMany();
    const profile = await (prisma as any).profile.create({
        data: {
            name: 'Md. Mirazul Hasan',
            title: 'AI Engineer',
            bio: 'A passionate developer building amazing things.',
            aboutTitle: 'Passionate about building things that matter',
            address: 'House No 224, Road No 02, Block F Basundhara R/A',
            email: 'mirazulhasanhimel19@gmail.com'
        }
    })

    console.log({ user, profile })
}


main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
