import { PrismaClient, Role } from "@prisma/client";
import { hashPassword } from "../src/shared/utils/hashPassword";

const prisma = new PrismaClient();

async function main() {
    const email = process.env.SUPER_ADMIN_EMAIL;
    const password = process.env.SUPER_ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error('SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD are required');
    }


    const existingSuperAdmin = await prisma.user.findFirst({
      where: {
        role: Role.SUPER_ADMIN,
      },
    });

  if (existingSuperAdmin) {
    console.log('Super Admin already exists');
    return;
  }
    
    
    const hashedPassword = (await hashPassword(password))

    await prisma.user.create({
      data: {
        name: 'Super Admin',
        email,
        password: hashedPassword,
        role: Role.SUPER_ADMIN,
        isVerified: true,
      },
    });

}


main()
    .catch((error) => {
        console.error(error);
        process.exit(1)
    })
.finally((async()=>await prisma.$disconnect()))