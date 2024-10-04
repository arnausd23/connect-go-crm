const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Fetch all users
    const users = await prisma.user.findMany();

    for (const user of users) {
      // Check if the image field is missing or null
      if (user.image === null || user.image === undefined) {
        // Update user to set the image field to an empty string
        await prisma.user.update({
          where: { id: user.id },
          data: { image: '' },
        });
        console.log(`Updated user ${user.id} to have an empty string for the image field.`);
      }
    }
  } catch (error) {
    console.error('Error updating users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
