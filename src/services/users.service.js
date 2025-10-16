import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

export function listUsers() {
  return prisma.user.findMany({ select: { id: true, email: true, name: true, role: true, createdAt: true } });
}

export async function createUser({ email, password, name, role = 'USER' }) {
  const hash = await bcrypt.hash(password, 10);
  return prisma.user.create({ data: { email, passwordHash: hash, name, role: role === 'ADMIN' ? 'ADMIN' : 'USER' } });
}
