import { KycStatus, ListingStatus, PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const owner = await prisma.user.upsert({
    where: { phone: '+919111111111' },
    update: {},
    create: {
      phone: '+919111111111',
      name: 'Demo Owner',
      role: UserRole.owner,
      kycStatus: KycStatus.verified,
      verifiedAt: new Date(),
    },
  });

  await prisma.kycProfile.upsert({
    where: { userId: owner.id },
    update: {},
    create: {
      userId: owner.id,
      panNumber: 'ABCDE1234F',
      providerRef: 'seed',
    },
  });

  const existing = await prisma.listing.findFirst({ where: { ownerId: owner.id } });
  if (!existing) {
    await prisma.listing.create({
      data: {
        ownerId: owner.id,
        title: 'Canon EOS R6 Camera',
        description: 'Full-frame mirrorless with 24-105mm kit lens. Perfect for events.',
        dailyPricePaise: 250000,
        depositPaise: 5000000,
        category: 'electronics',
        city: 'Mumbai',
        status: ListingStatus.active,
        media: {
          create: [{ url: 'https://picsum.photos/400/300', sortOrder: 0 }],
        },
      },
    });
  }

  console.log('Seed complete. Owner phone: +919111111111 (KYC verified)');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
