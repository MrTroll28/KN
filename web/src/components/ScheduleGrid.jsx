import React, { useEffect, useMemo, useState } from "react";
import { api, Slots, SlotLabels } from "../lib/fetcher";
import SlotCell from "./SlotCell.jsx";

// ---- Helpers: luôn xử lý ngày theo LOCAL (không dùng ISO UTC) ----
function ymdLocal(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}
function startOfWeekLocal(d) {
  const x = new Date(d);
  const day = x.getDay(); // 0=CN..6=Th7
  const diff = (day === 0 ? -6 : 1) - day; // về thứ 2
  x.setDate(x.getDate() + diff);
  x.setHours(0, 0, 0, 0);
  return x;
}

export default function ScheduleGrid() {
  const [week, setWeek] = useState(startOfWeekLocal(new Date()));
  // data: { 'YYYY-MM-DD': Set<string> }
  const [data, setData] = useState({});

  const weekDays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const d = new Date(week);
        d.setDate(week.getDate() + i);
        d.setHours(0, 0, 0, 0);
        return d;
      }),
    [week]
  );

  async function fetchWeek() {
    const from = ymdLocal(week);
    const toD = new Date(week);
    toD.setDate(week.getDate() + 6);
    const to = ymdLocal(toD);

    const res = await api(`/schedules/me?from=${from}&to=${to}`, {
      auth: true,
    });
    const map = {};
    for (const r of res) {
      // Backend trả ISO có "Z", cắt 10 ký tự đầu vẫn là YYYY-MM-DD
      const key = r.date.slice(0, 10);
      if (!map[key]) map[key] = new Set();
      map[key].add(r.slot);
    }
    setData(map);
  }

  useEffect(() => {
    fetchWeek();
  }, [week]);

  async function toggle(dateStr, slot) {
    const set = new Set(data[dateStr] || []);
    set.has(slot) ? set.delete(slot) : set.add(slot);
    // Optimistic update
    setData((prev) => ({ ...prev, [dateStr]: set }));

    try {
      await api("/schedules/set-day", {
        method: "POST",
        auth: true,
        body: { date: dateStr, slots: Array.from(set) },
      });
    } catch (err) {
      alert("Lỗi lưu lịch: " + err.message);
      // fallback refetch nếu cần
      fetchWeek();
    }
  }

  async function applyMultiWeeks() {
    const weeks = parseInt(prompt("Số tuần muốn nhân lịch (2–52):", "4")) || 1;
    if (weeks < 2) return alert("Cần ít nhất 2 tuần để nhân lịch.");

    const startDate = ymdLocal(week);
    const ops = [];

    // Duyệt 7 ngày của tuần hiện tại, lấy slot đã chọn ở từng ngày
    for (const d of weekDays) {
      const dateStr = ymdLocal(d);
      const slotSet = data[dateStr];
      if (!slotSet || slotSet.size === 0) continue;

      const dayOfWeek = d.getDay(); // lấy trực tiếp từ đối tượng Date (LOCAL)
      const body = {
        startDate, // thứ Hai của tuần gốc (local)
        weeks, // số tuần nhân
        daysOfWeek: [dayOfWeek],
        slots: Array.from(slotSet),
      };
      ops.push(
        api("/schedules/bulk-weeks", { method: "POST", auth: true, body })
      );
    }

    try {
      await Promise.all(ops);
      alert(`Đã nhân lịch tuần hiện tại cho ${weeks - 1} tuần sau.`);
    } catch (e) {
      alert("Lỗi khi áp dụng nhiều tuần: " + e.message);
    }
  }

  const dayTitle = (d) =>
    d.toLocaleDateString("vi-VN", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
    });

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-2">
          <button
            className="px-3 py-1 border rounded"
            onClick={() =>
              setWeek((prev) => {
                const d = new Date(prev);
                d.setDate(prev.getDate() - 7); // tránh mutate trực tiếp object state
                return startOfWeekLocal(d);
              })
            }
          >
            ← Tuần trước
          </button>
          <button
            className="px-3 py-1 border rounded"
            onClick={() => setWeek(startOfWeekLocal(new Date()))}
          >
            Hôm nay
          </button>
          <button
            className="px-3 py-1 border rounded"
            onClick={() =>
              setWeek((prev) => {
                const d = new Date(prev);
                d.setDate(prev.getDate() + 7);
                return startOfWeekLocal(d);
              })
            }
          >
            Tuần sau →
          </button>
        </div>
        <button
          className="px-3 py-1 border rounded bg-indigo-600 text-white"
          onClick={applyMultiWeeks}
        >
          Áp dụng cho nhiều tuần
        </button>
      </div>

      <div
        className="grid"
        style={{ gridTemplateColumns: "160px repeat(7, 1fr)", gap: "8px" }}
      >
        <div className="font-semibold">Khung giờ / Ngày</div>
        {weekDays.map((d, i) => (
          <div key={i} className="text-center font-semibold">
            {dayTitle(d)}
          </div>
        ))}

        {Slots.map((slot) => (
          <React.Fragment key={slot}>
            <div className="font-medium">{SlotLabels[slot]}</div>
            {weekDays.map((d, i) => {
              const dateStr = ymdLocal(d); // dùng local Y-M-D
              const active = data[dateStr]?.has(slot);
              return (
                <div key={slot + ":" + i} className="flex justify-center">
                  <SlotCell
                    active={!!active}
                    label=""
                    onToggle={() => toggle(dateStr, slot)}
                  />
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
