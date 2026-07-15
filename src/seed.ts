import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const freeUser = await prisma.user.create({
        data: {
            username: "eda",
            apiKey: "sk_free_123456789", 
            plan: "FREE"
        }
    });

    const paidUser = await prisma.user.create({
        data: {
            username: "ceo",
            apiKey: "sk_paid_987654321", 
            plan: "PAID"
        }
    });

    console.log("Örnek kullanıcılar başarıyla eklendi!");
    console.log(freeUser);
    console.log(paidUser);
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });