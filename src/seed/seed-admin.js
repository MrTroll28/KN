import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

(async () => {
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@hub.dev';
  const password = process.env.SEED_ADMIN_PASSWORD || 'Admin@123';
  const exist = await prisma.user.findUnique({ where: { email } });
  if (exist) {
    console.log('Admin exists');
    process.exit(0);
  }
  const hash = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { email, passwordHash: hash, role: 'ADMIN', name: 'Administrator' } });
  console.log('Admin created:', email, password);
  process.exit(0);
})();
