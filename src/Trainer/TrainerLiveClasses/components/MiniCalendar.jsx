import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FONT_FAMILY, FONT_WEIGHT } from "../data/theme";

export default function MiniCalendar({
  t,
  isDark,
  selectedDate,
  onSelectDate,
  sessionEvents = [],
  onMonthChange,
}) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMon = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrev = new Date(viewYear, viewMonth, 0).getDate();

  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--)
    cells.push({ day: daysInPrev - i, thisMonth: false, prev: true });
  for (let d = 1; d <= daysInMon; d++) cells.push({ day: d, thisMonth: true });
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++)
    cells.push({ day: d, thisMonth: false, next: true });

  const isToday = (cell) =>
    cell.thisMonth &&
    cell.day === today.getDate() &&
    viewMonth === today.getMonth() &&
    viewYear === today.getFullYear();
  const isSelected = (cell) => {
    if (!selectedDate || !cell.thisMonth) return false;
    const [y, m, d] = selectedDate.split("-").map(Number);
    return cell.day === d && viewMonth === m - 1 && viewYear === y;
  };
  const hasEvent = (cell) => {
    if (!cell.thisMonth) return false;
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(cell.day).padStart(2, "0")}`;
    return sessionEvents.some((e) => e.date === dateStr);
  };

  // const prevMonth = () => {
  //   if (viewMonth === 0) {
  //     setViewMonth(11);
  //     setViewYear((y) => y - 1);
  //   } else setViewMonth((m) => m - 1);
  // };
  const prevMonth = () => {
    let newMonth, newYear;
    if (viewMonth === 0) {
      newMonth = 11;
      newYear = viewYear - 1;
    } else {
      newMonth = viewMonth - 1;
      newYear = viewYear;
    }
    setViewMonth(newMonth);
    setViewYear(newYear);
    onMonthChange?.(newYear, newMonth);
  };
  // const nextMonth = () => {
  //   if (viewMonth === 11) {
  //     setViewMonth(0);
  //     setViewYear((y) => y + 1);
  //   } else setViewMonth((m) => m + 1);
  // };
  const nextMonth = () => {
    let newMonth, newYear;
    if (viewMonth === 11) {
      newMonth = 0;
      newYear = viewYear + 1;
    } else {
      newMonth = viewMonth + 1;
      newYear = viewYear;
    }
    setViewMonth(newMonth);
    setViewYear(newYear);
    onMonthChange?.(newYear, newMonth);
  };
  const handleClick = (cell) => {
    if (!cell.thisMonth) return;
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(cell.day).padStart(2, "0")}`;
    onSelectDate(dateStr);
  };

  return (
    <div style={{ userSelect: "none" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 12px 8px",
          background: t.calMiniHeaderBg,
          borderBottom: `1px solid ${t.calDivider}`,
        }}
      >
        <button
          onClick={prevMonth}
          style={{
            width: 22,
            height: 22,
            borderRadius: 5,
            border: `1px solid ${t.calDivider}`,
            background: "transparent",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: t.textMuted,
          }}
        >
          <ChevronLeft size={11} />
        </button>
        <span
          style={{
            fontSize: 11,
            fontWeight: FONT_WEIGHT.bold,
            color: t.text,
            fontFamily: FONT_FAMILY,
          }}
        >
          {monthNames[viewMonth]} {viewYear}
        </span>
        <button
          onClick={nextMonth}
          style={{
            width: 22,
            height: 22,
            borderRadius: 5,
            border: `1px solid ${t.calDivider}`,
            background: "transparent",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: t.textMuted,
          }}
        >
          <ChevronRight size={11} />
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7,1fr)",
          padding: "5px 6px 2px",
        }}
      >
        {dayNames.map((d) => (
          <div
            key={d}
            style={{
              textAlign: "center",
              fontSize: 8,
              fontWeight: FONT_WEIGHT.bold,
              color: t.textMuted,
              fontFamily: FONT_FAMILY,
              padding: "1px 0",
            }}
          >
            {d}
          </div>
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7,1fr)",
          padding: "0 6px 8px",
          gap: "1px 0",
        }}
      >
        {cells.map((cell, i) => {
          const tod = isToday(cell),
            sel = isSelected(cell),
            evt = hasEvent(cell);
          const isWeekend = i % 7 === 0 || i % 7 === 6;
          return (
            <div
              key={i}
              onClick={() => handleClick(cell)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: 24,
                borderRadius: 5,
                cursor: cell.thisMonth ? "pointer" : "default",
                background: tod
                  ? "#0078d4"
                  : sel
                    ? t.calMiniSelectedBg
                    : "transparent",
                transition: "background 0.15s",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                if (!tod && !sel && cell.thisMonth)
                  e.currentTarget.style.background = t.calMiniDayHov;
              }}
              onMouseLeave={(e) => {
                if (!tod && !sel)
                  e.currentTarget.style.background = "transparent";
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  fontWeight: tod || sel ? 700 : 500,
                  color: tod
                    ? "#fff"
                    : !cell.thisMonth
                      ? t.calMiniDayOther
                      : isWeekend
                        ? t.calMiniWeekend
                        : t.text,
                  fontFamily: FONT_FAMILY,
                  lineHeight: 1,
                }}
              >
                {cell.day}
              </span>
              {evt && !tod && (
                <span
                  style={{
                    width: 3,
                    height: 3,
                    borderRadius: "50%",
                    background: t.calMiniEventDot,
                    marginTop: 1,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
      <div
        style={{
          borderTop: `1px solid ${t.calDivider}`,
          padding: "5px 12px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <button
          onClick={() => {
            setViewMonth(today.getMonth());
            setViewYear(today.getFullYear());
            const d = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
            onSelectDate(d);
          }}
          style={{
            fontSize: 10,
            fontWeight: FONT_WEIGHT.bold,
            color: "#0078d4",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontFamily: FONT_FAMILY,
          }}
        >
          Today
        </button>
      </div>
    </div>
  );
}
