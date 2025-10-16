import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export function normalizeDateISO(d) {
  if (typeof d === "string") return d; // luôn là "YYYY-MM-DD"
  if (d instanceof Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }
}

/**
 * Lấy lịch của người dùng theo khoảng ngày
 */
export function listMySchedules(userId, from, to) {
  const where = { userId };
  if (from || to) {
    where.date = {};
    if (from) where.date.gte = normalizeDateISO(from);
    if (to) where.date.lte = normalizeDateISO(to);
  }
  return prisma.schedule.findMany({
    where,
    orderBy: [{ date: "asc" }, { slot: "asc" }],
  });
}

/**
 * Cập nhật slot trong 1 ngày (ghi đè hoàn toàn)
 */
export async function upsertDaySlots(userId, date, slots = [], note) {
  const day = normalizeDateISO(date);
  // Xóa lịch cũ trong ngày đó
  await prisma.schedule.deleteMany({ where: { userId, date: day } });

  // Tạo lại tất cả slot mới
  const ops = slots.map((slot) =>
    prisma.schedule.create({
      data: { userId, date: day, slot, note },
    })
  );
  return prisma.$transaction(ops);
}

/**
 * Nhân bản lịch nhiều tuần liền kề từ 1 tuần gốc
 */
export async function bulkCreateWeeks(
  userId,
  startDate,
  weeks = 1,
  daysOfWeek = [1, 2, 3, 4, 5],
  slots = [],
  note
) {
  const start = new Date(normalizeDateISO(startDate));
  const results = [];

  for (let w = 0; w < weeks; w++) {
    for (const dow of daysOfWeek) {
      const d = new Date(start);
      // (dow: 0=CN,1=T2,...6=T7)
      const offset = (dow - d.getDay() + 7) % 7;
      d.setDate(start.getDate() + w * 7 + offset);

      const day = normalizeDateISO(d);

      for (const slot of slots) {
        const r = await prisma.schedule.upsert({
          where: { userId_date_slot: { userId, date: day, slot } },
          update: { note },
          create: { userId, date: day, slot, note },
        });
        results.push(r);
      }
    }
  }

  return results;
}

/**
 * Tổng hợp lịch của tất cả người dùng (ADMIN)
 */
export async function summarizeWeek(from, to) {
  const where = {};
  if (from || to) {
    where.date = {};
    if (from) where.date.gte = normalizeDateISO(from);
    if (to) where.date.lte = normalizeDateISO(to);
  }

  const rows = await prisma.schedule.groupBy({
    by: ["date", "slot"],
    _count: { id: true },
    where,
  });

  return rows.map((r) => ({
    date: r.date,
    slot: r.slot,
    count: r._count.id,
  }));
}
