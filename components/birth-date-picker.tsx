"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";

/** Monday-first row — 3-letter Italian labels (equal width, no ambiguous “Ma/Me”) */
const WEEKDAY_LABELS_IT = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"] as const;

const GAP = 8;
const CALENDAR_HEIGHT_ESTIMATE = 400;

/** Italian month names (long) for <select> */
const MONTHS_IT = Array.from({ length: 12 }, (_, i) =>
  new Date(2000, i, 1).toLocaleDateString("it-IT", { month: "long" })
);

const selectClass =
  "min-h-11 w-full rounded-lg border-[1.5px] border-[var(--color-bone)] bg-[var(--color-travertine)] px-3 py-2.5 text-[14px] text-[var(--color-obsidian)] shadow-sm transition-colors hover:border-[#C0B098] focus:border-[var(--color-obsidian)] focus:outline-none focus:ring-[3px] focus:ring-[var(--color-obsidian)]/10";

function parseIsoDate(s: string): Date | null {
  if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return null;
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;
  return date;
}

function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getDaysInMonth(year: number, month: number) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const daysInMonth = last.getDate();
  /** Monday-first grid: convert Sunday=0 to Monday=0 index for header alignment */
  const startDayMon = (first.getDay() + 6) % 7;
  return { daysInMonth, startDay: startDayMon };
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

type BirthDatePickerProps = {
  id: string;
  value: string;
  onChange: (iso: string) => void;
  required?: boolean;
  disabled?: boolean;
  /** Merged onto the trigger (match form input styles) */
  triggerClassName: string;
  /** Placeholder when empty */
  placeholder?: string;
};

export function BirthDatePicker({
  id,
  value,
  onChange,
  required,
  disabled,
  triggerClassName,
  placeholder = "Seleziona la data",
}: BirthDatePickerProps) {
  const [open, setOpen] = useState(false);
  const selected = parseIsoDate(value);

  /** Stable bounds (avoids unstable deps / re-render loops) */
  const { today, minDate, minYear, maxYear, minMonthIdx, maxMonthIdx } = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    const min = new Date();
    min.setFullYear(min.getFullYear() - 120);
    min.setHours(0, 0, 0, 0);
    return {
      today: t,
      minDate: min,
      minYear: min.getFullYear(),
      maxYear: t.getFullYear(),
      minMonthIdx: min.getMonth(),
      maxMonthIdx: t.getMonth(),
    };
  }, []);

  const initialView = () => {
    if (selected) return { year: selected.getFullYear(), month: selected.getMonth() };
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return { year: d.getFullYear(), month: d.getMonth() };
  };

  const [view, setView] = useState(initialView);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /** Descending years — recent first (fast jump for most users) */
  const yearOptions = useMemo(() => {
    const years: number[] = [];
    for (let y = maxYear; y >= minYear; y--) years.push(y);
    return years;
  }, [minYear, maxYear]);

  const clampMonthForYear = useCallback(
    (year: number, month: number) => {
      let m = month;
      if (year === maxYear && m > maxMonthIdx) m = maxMonthIdx;
      if (year === minYear && m < minMonthIdx) m = minMonthIdx;
      return m;
    },
    [maxYear, minYear, maxMonthIdx, minMonthIdx]
  );

  const [popoverStyle, setPopoverStyle] = useState<{
    top: number;
    bottom: number;
    left: number;
    width: number;
    placement: "above" | "below";
  }>({ top: 0, bottom: 0, left: 0, width: 300, placement: "below" });

  useEffect(() => {
    if (!value) return;
    const parsed = parseIsoDate(value);
    if (!parsed) return;
    const y = parsed.getFullYear();
    const mo = parsed.getMonth();
    setView({ year: y, month: clampMonthForYear(y, mo) });
  }, [value, clampMonthForYear]);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || typeof window === "undefined") return;
    const rect = triggerRef.current.getBoundingClientRect();
    const vh = window.innerHeight;
    const spaceBelow = vh - rect.bottom;
    const spaceAbove = rect.top;
    const width = Math.max(rect.width, 280);

    const showBelow =
      spaceBelow >= CALENDAR_HEIGHT_ESTIMATE
        ? true
        : spaceAbove >= CALENDAR_HEIGHT_ESTIMATE
          ? false
          : spaceBelow >= spaceAbove;

    if (showBelow) {
      let top = rect.bottom + GAP;
      const maxTop = vh - CALENDAR_HEIGHT_ESTIMATE - GAP;
      top = Math.max(GAP, Math.min(maxTop, top));
      setPopoverStyle({
        top,
        bottom: 0,
        left: rect.left,
        width,
        placement: "below",
      });
    } else {
      const bottom = vh - (rect.top - GAP);
      const maxBottom = vh - GAP - CALENDAR_HEIGHT_ESTIMATE;
      const clampedBottom = Math.max(GAP, Math.min(maxBottom, bottom));
      setPopoverStyle({
        top: 0,
        bottom: clampedBottom,
        left: rect.left,
        width,
        placement: "above",
      });
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    updatePosition();
    const onMove = () => updatePosition();
    window.addEventListener("scroll", onMove, true);
    window.addEventListener("resize", onMove);
    return () => {
      window.removeEventListener("scroll", onMove, true);
      window.removeEventListener("resize", onMove);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    /** Bubble phase so native &lt;select&gt; option picks register as inside the popover */
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t) || containerRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const { daysInMonth, startDay } = getDaysInMonth(view.year, view.month);

  const handleSelect = (day: number) => {
    const date = new Date(view.year, view.month, day);
    date.setHours(0, 0, 0, 0);
    if (date.getTime() > today.getTime() || date.getTime() < minDate.getTime()) return;
    onChange(toIsoDate(date));
    setOpen(false);
  };

  const displayText = selected
    ? selected.toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })
    : placeholder;

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let i = 1; i <= daysInMonth; i++) cells.push(i);

  const calendarPopover = open && typeof document !== "undefined" && (
    <div
      ref={containerRef}
      id={`${id}-calendar`}
      className="fixed z-[9999] min-w-[280px] overflow-hidden rounded-xl border border-bone bg-white shadow-[var(--shadow-xl)] ring-1 ring-black/6"
      style={{
        ...(popoverStyle.placement === "below"
          ? { top: popoverStyle.top }
          : { bottom: popoverStyle.bottom }),
        left: popoverStyle.left,
        width: popoverStyle.width,
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Calendario data di nascita"
    >
      <div className="border-b border-bone bg-parchment px-3 py-3 sm:px-4">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-terracotta">
          Mese e anno
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-3">
          <div className="min-w-0 flex-1">
            <label className="sr-only" htmlFor={`${id}-month`}>
              Mese
            </label>
            <select
              id={`${id}-month`}
              value={view.month}
              onChange={(e) => {
                const m = Number(e.target.value);
                setView((v) => ({ year: v.year, month: clampMonthForYear(v.year, m) }));
              }}
              className={selectClass}
            >
              {MONTHS_IT.map((name, idx) => {
                const disabled =
                  (view.year === maxYear && idx > maxMonthIdx) ||
                  (view.year === minYear && idx < minMonthIdx);
                return (
                  <option key={idx} value={idx} disabled={disabled}>
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="w-full shrink-0 sm:w-[6.5rem]">
            <label className="sr-only" htmlFor={`${id}-year`}>
              Anno
            </label>
            <select
              id={`${id}-year`}
              value={view.year}
              onChange={(e) => {
                const y = Number(e.target.value);
                setView((v) => {
                  const m = clampMonthForYear(y, v.month);
                  return { year: y, month: m };
                });
              }}
              className={selectClass}
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="mt-2 text-[11px] leading-snug text-[#7A7060]">
          Scegli mese e anno, poi il giorno nella griglia.
        </p>
      </div>
      <div className="p-3 sm:p-4">
        {/* Header: own grid so labels never share flow with date cells (fixes broken columns) */}
        <div className="mb-1 grid grid-cols-7 gap-1 sm:gap-1.5">
          {WEEKDAY_LABELS_IT.map((label, i) => (
            <div
              key={`dow-${i}`}
              className="min-w-0 select-none py-1.5 text-center text-[10px] font-semibold uppercase tracking-wide text-[#7A7060] sm:text-[11px]"
            >
              <span className="block whitespace-nowrap">{label}</span>
            </div>
          ))}
        </div>
        {/* Dates: separate grid — 7 columns per row */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
          {cells.map((day, i) => {
            if (day === null) {
              return <div key={`pad-${view.year}-${view.month}-${i}`} className="min-h-8 sm:min-h-9" aria-hidden />;
            }
            const date = new Date(view.year, view.month, day);
            date.setHours(0, 0, 0, 0);
            const outOfRange = date.getTime() > today.getTime() || date.getTime() < minDate.getTime();
            const isSelected = selected && isSameDay(date, selected);

            return (
              <button
                key={`${view.year}-${view.month}-${day}`}
                type="button"
                disabled={outOfRange}
                onClick={() => !outOfRange && handleSelect(day)}
                className={`flex min-h-8 min-w-0 items-center justify-center rounded-md text-[13px] font-medium tabular-nums transition-colors sm:min-h-9 ${
                  outOfRange
                    ? "cursor-not-allowed text-[#B5A890]/35"
                    : "cursor-pointer text-obsidian hover:bg-parchment"
                } ${isSelected ? "bg-obsidian text-[#F0EAE0] hover:bg-obsidian" : ""}`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative w-full">
      <button
        ref={triggerRef}
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={open ? `${id}-calendar` : undefined}
        aria-required={required}
        aria-label={selected ? `Data di nascita: ${displayText}` : placeholder}
        className={`${triggerClassName} flex w-full cursor-pointer items-center justify-between gap-2 text-left ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
      >
        <span className={selected ? "text-[var(--color-obsidian)]" : "text-[#B5A890]"}>{displayText}</span>
        <span className="pointer-events-none ml-2 shrink-0 text-terracotta" aria-hidden>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      {typeof document !== "undefined" && createPortal(calendarPopover, document.body)}
    </div>
  );
}
