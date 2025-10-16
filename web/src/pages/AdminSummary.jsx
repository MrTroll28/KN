import React, { useEffect, useState, useMemo } from "react";
import { api, Slots, SlotLabels } from "../lib/fetcher";
import Navbar from "../components/Navbar.jsx";

export default function AdminSummary() {
  const [week, setWeek] = useState(() => {
    const now = new Date();
    now.setDate(now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1)); // về thứ 2
    now.setHours(0, 0, 0, 0);
    return now;
  });
  const [summary, setSummary] = useState({});

  const weekDays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const d = new Date(week);
        d.setDate(week.getDate() + i);
        return d;
      }),
    [week]
  );

  useEffect(() => {
    const from = week.toISOString().slice(0, 10);
    const toD = new Date(week);
    toD.setDate(week.getDate() + 6);
    const to = toD.toISOString().slice(0, 10);
    api(`/schedules/summary?from=${from}&to=${to}`, { auth: true }).then(
      (res) => {
        const map = {};
        for (const r of res) {
          const key = r.date.slice(0, 10);
          if (!map[key]) map[key] = {};
          map[key][r.slot] = r.count;
        }
        setSummary(map);
      }
    );
  }, [week]);

  const dayLabel = (d) =>
    d.toLocaleDateString("vi-VN", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
    });

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto p-4">
        <h2 className="text-lg font-semibold mb-4">Tổng hợp lịch nhóm</h2>
        <div className="flex gap-2 mb-3">
          <button
            className="px-3 py-1 border rounded"
            onClick={() => setWeek(new Date(week.setDate(week.getDate() - 7)))}
          >
            ← Tuần trước
          </button>
          <button
            className="px-3 py-1 border rounded"
            onClick={() => setWeek(new Date(week.setDate(week.getDate() + 7)))}
          >
            Tuần sau →
          </button>
        </div>
        <div
          className="grid"
          style={{ gridTemplateColumns: "160px repeat(7, 1fr)", gap: "8px" }}
        >
          <div className="font-semibold">Khung giờ / Ngày</div>
          {weekDays.map((d, i) => (
            <div key={i} className="text-center font-semibold">
              {dayLabel(d)}
            </div>
          ))}
          {Slots.map((slot) => (
            <React.Fragment key={slot}>
              <div className="font-medium">{SlotLabels[slot]}</div>
              {weekDays.map((d, i) => {
                const dateStr = d.toISOString().slice(0, 10);
                const count = summary[dateStr]?.[slot] || 0;
                return (
                  <div
                    key={slot + ":" + i}
                    className={`flex justify-center ${
                      count ? "bg-green-100" : "bg-gray-50"
                    } p-2 rounded`}
                  >
                    {count > 0 ? `${count} ng` : "-"}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
