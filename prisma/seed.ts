import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const users = [
        {
            username: 'admin',
            displayName: 'Administrator',
            role: 'admin',
            email: 'admin@ichibot.id'
        },
        {
            username: 'user',
            displayName: 'Customer',
            role: 'user',
            email: 'user@ichibot.id'
        }
    ];

    for (const user of users) {
        await prisma.user.upsert({
            where: { username: user.username },
            update: {},
            create: user,
        });
    }

    console.log('Seed successful');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

export { };
