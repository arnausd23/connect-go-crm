const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function main() {
  const saltRounds = 10;
  const plainPassword = 'C0NN3CT22';
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

  const uniqueCi = 'cosounico2' + new Date().getTime().toString();  // Asegurar un valor único para ci

  try {
    const newUser = await prisma.user.create({
      data: {
        id: undefined,  // Deja que Prisma genere automáticamente el id con cuid()
        ci: uniqueCi,
        name: 'p.mcatney',
        password: hashedPassword,
        phoneNumber: '1234567890',
        updatedBy: 'admin',
        createdAt: new Date(),
      },
    });
    console.log('Nuevo usuario creado:', newUser);
  } catch (error) {
    console.error('Error al crear el usuario:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();