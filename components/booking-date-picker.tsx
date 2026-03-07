"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DOW = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const GAP = 8;
const CALENDAR_HEIGHT_ESTIMATE = 380;

function formatDisplayDate(d: Date | null): string {
  if (!d) return "Select date";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function getDaysInMonth(year: number, month: number) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const daysInMonth = last.getDate();
  const startDay = first.getDay();
  return { daysInMonth, startDay };
}

function isSameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isBefore(a: Date, b: Date): boolean {
  return a.getTime() < b.getTime();
}

type BookingDatePickerProps = {
  /** When the hero search is expanded, we re-position the calendar after the transition so it stays under the trigger. */
  searchExpanded?: boolean;
  /** When the calendar is open, show the trigger as selected (clicked state). */
  isSelected?: boolean;
  /** Notify parent when the calendar opens or closes. */
  onOpenChange?: (open: boolean) => void;
};

export function BookingDatePicker({ searchExpanded, isSelected, onOpenChange }: BookingDatePickerProps = {}) {
  const [open, setOpen] = useState(false);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [view, setView] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [popoverStyle, setPopoverStyle] = useState<{
    top: number;
    bottom: number;
    left: number;
    width: number;
    placement: "above" | "below";
  }>({ top: 0, bottom: 0, left: 0, width: 320, placement: "below" });

  const updatePosition = () => {
    if (!triggerRef.current || typeof window === "undefined") return;
    const rect = triggerRef.current.getBoundingClientRect();
    const vh = window.innerHeight;
    const spaceAbove = rect.top;
    const spaceBelow = vh - rect.bottom;
    const width = Math.max(rect.width, 320);

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
      // Above: pin calendar bottom to (field top - GAP) so the gap matches the "below" spacing
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
  };

  useEffect(() => {
    if (!open) return;
    updatePosition();
    if (searchExpanded) {
      const t = setTimeout(updatePosition, 520);
      return () => clearTimeout(t);
    }
  }, [open, searchExpanded]);

  useEffect(() => {
    if (!open || !triggerRef.current) return;
    const el = triggerRef.current;
    const onMove = () => updatePosition();
    window.addEventListener("scroll", onMove, true);
    window.addEventListener("resize", onMove);
    const ro = new ResizeObserver(onMove);
    ro.observe(el);
    return () => {
      window.removeEventListener("scroll", onMove, true);
      window.removeEventListener("resize", onMove);
      ro.disconnect();
    };
  }, [open]);

  useEffect(() => {
    onOpenChange?.(open);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      const inTrigger = triggerRef.current?.contains(target);
      const inCalendar = containerRef.current?.contains(target);
      if (!inTrigger && !inCalendar) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick, true);
    return () => document.removeEventListener("mousedown", onDocClick, true);
  }, [open]);

  const { daysInMonth, startDay } = getDaysInMonth(view.year, view.month);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleSelect = (d: number) => {
    const day = new Date(view.year, view.month, d);
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(day);
      setCheckOut(null);
    } else {
      if (isBefore(day, checkIn)) {
        setCheckIn(day);
        setCheckOut(null);
      } else {
        setCheckOut(day);
      }
    }
  };

  const displayLabel = checkIn && checkOut
    ? `${formatDisplayDate(checkIn)} – ${formatDisplayDate(checkOut)}`
    : formatDisplayDate(checkIn);
  const hasSelection = !!checkIn;

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let i = 1; i <= daysInMonth; i++) cells.push(i);

  const shadowDown = "0 24px 64px rgba(26,23,20,0.18), 0 8px 24px rgba(26,23,20,0.10)";
  const shadowUp = "0 -24px 64px rgba(26,23,20,0.18), 0 -8px 24px rgba(26,23,20,0.10)";

  const calendarPopover = open && typeof document !== "undefined" && (
    <div
      ref={containerRef}
      className="fixed z-[9999] min-w-[320px] overflow-hidden rounded-xl border border-bone bg-white ring-1 ring-black/[0.06]"
      style={{
        ...(popoverStyle.placement === "below"
          ? { top: popoverStyle.top }
          : { bottom: popoverStyle.bottom }),
        left: popoverStyle.left,
        width: popoverStyle.width,
        boxShadow: popoverStyle.placement === "below" ? shadowDown : shadowUp,
      }}
    >
          <div className="border-b border-bone bg-parchment px-4 py-3">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() =>
                  setView((v) =>
                    v.month === 0 ? { year: v.year - 1, month: 11 } : { year: v.year, month: v.month - 1 }
                  )
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg text-obsidian/60 transition-colors hover:bg-white/80 hover:text-obsidian"
                aria-label="Previous month"
              >
                ‹
              </button>
              <span className="font-[family-name:var(--font-cormorant)] text-lg font-medium text-obsidian">
                {MONTHS[view.month]} {view.year}
              </span>
              <button
                type="button"
                onClick={() =>
                  setView((v) =>
                    v.month === 11 ? { year: v.year + 1, month: 0 } : { year: v.year, month: v.month + 1 }
                  )
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg text-obsidian/60 transition-colors hover:bg-white/80 hover:text-obsidian"
                aria-label="Next month"
              >
                ›
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-7 gap-1">
              {DOW.map((day) => (
                <div
                  key={day}
                  className="py-2 text-center text-[11px] font-semibold uppercase tracking-wider text-[#7A7060]"
                >
                  {day}
                </div>
              ))}
              {cells.map((day, i) => {
                if (day === null) {
                  return <div key={`empty-${i}`} />;
                }
                const date = new Date(view.year, view.month, day);
                const isPast = date.getTime() < today.getTime();
                const isCheckIn = checkIn && isSameDay(date, checkIn);
                const isCheckOut = checkOut && isSameDay(date, checkOut);
                const inRange =
                  checkIn &&
                  checkOut &&
                  date.getTime() > checkIn.getTime() &&
                  date.getTime() < checkOut.getTime();
                const isSelected = isCheckIn || isCheckOut;

                return (
                  <button
                    key={day}
                    type="button"
                    disabled={isPast}
                    onClick={() => !isPast && handleSelect(day)}
                    className={`flex h-9 items-center justify-center rounded-md text-[13px] transition-colors ${
                      isPast
                        ? "cursor-not-allowed text-[#B5A890]/40"
                        : "cursor-pointer hover:bg-parchment"
                    } ${
                      isCheckIn
                        ? "bg-obsidian text-white hover:bg-obsidian"
                        : isCheckOut
                          ? "bg-obsidian text-white hover:bg-obsidian"
                          : inRange
                            ? "bg-obsidian/10 text-obsidian"
                            : "text-obsidian"
                    }`}
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
    <div className="relative h-full w-full">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex h-full w-full flex-col justify-center rounded-lg p-4 text-left transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-oro focus-visible:outline-offset-2 active:scale-[0.99] sm:border-r sm:border-black/6 ${
          isSelected
            ? "bg-bone/80 hover:bg-bone/90 border-l-2 border-l-bone"
            : "hover:bg-white/50 active:bg-parchment/80"
        }`}
      >
        <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-terracotta">
          Check In
        </span>
        <span className={`block text-[15px] ${hasSelection ? "font-medium text-obsidian" : "text-[#B5A890]"}`}>
          {displayLabel}
        </span>
      </button>
      {typeof document !== "undefined" && createPortal(open ? calendarPopover : null, document.body)}
    </div>
  );
}
