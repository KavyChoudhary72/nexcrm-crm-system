import React, { useState } from "react";
import { FollowUp } from "../../types/followUp.types";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User, CheckCircle, AlertCircle } from "lucide-react";
import { formatDateTime } from "../../utils/formatters";

interface FollowUpCalendarProps {
  followUps: FollowUp[];
  onComplete: (id: string, notes?: string) => Promise<void>;
}

export const FollowUpCalendar: React.FC<FollowUpCalendarProps> = ({
  followUps,
  onComplete,
}) => {
  const now = new Date();
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(now);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  // Previous month days to fill start of grid
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    return (
      selectedDate !== null &&
      day === selectedDate.getDate() &&
      currentMonth === selectedDate.getMonth() &&
      currentYear === selectedDate.getFullYear()
    );
  };

  const getFollowUpsForDate = (year: number, month: number, day: number) => {
    return followUps.filter((f) => {
      const fDate = new Date(f.date);
      return (
        fDate.getDate() === day &&
        fDate.getMonth() === month &&
        fDate.getFullYear() === year
      );
    });
  };

  // Build grid calendar cells
  const calendarCells = [];

  // Fill in empty slots with previous month's final days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarCells.push({
      day: prevMonthDays - i,
      isCurrentMonth: false,
      month: currentMonth === 0 ? 11 : currentMonth - 1,
      year: currentMonth === 0 ? currentYear - 1 : currentYear,
    });
  }

  // Fill current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push({
      day: i,
      isCurrentMonth: true,
      month: currentMonth,
      year: currentYear,
    });
  }

  // Fill next month days to complete grid (multiples of 7)
  const totalCells = Math.ceil(calendarCells.length / 7) * 7;
  const nextMonthCellsCount = totalCells - calendarCells.length;
  for (let i = 1; i <= nextMonthCellsCount; i++) {
    calendarCells.push({
      day: i,
      isCurrentMonth: false,
      month: currentMonth === 11 ? 0 : currentMonth + 1,
      year: currentMonth === 11 ? currentYear + 1 : currentYear,
    });
  }

  // Follow-ups for selected date
  const selectedDateFollowUps = selectedDate
    ? getFollowUpsForDate(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
    : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar Grid */}
      <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div className="text-left">
            <h4 className="font-bold text-gray-900 dark:text-white text-base">
              {monthNames[currentMonth]} {currentYear}
            </h4>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              Follow-ups Schedule
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-50 dark:hover:bg-slate-800/60 rounded-xl border border-gray-100 dark:border-slate-800/60 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all"
            >
              <ChevronLeft className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-50 dark:hover:bg-slate-800/60 rounded-xl border border-gray-100 dark:border-slate-800/60 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all"
            >
              <ChevronRight className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {daysOfWeek.map((day) => (
            <span key={day} className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase py-1">
              {day}
            </span>
          ))}
        </div>

        {/* Calendar Day Grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {calendarCells.map((cell, index) => {
            const dateFollowUps = getFollowUpsForDate(cell.year, cell.month, cell.day);
            const isCurr = cell.isCurrentMonth;
            const isTodayDate = isToday(cell.day) && isCurr;
            const isSel = isSelected(cell.day) && isCurr;

            return (
              <div
                key={index}
                onClick={() => {
                  if (isCurr) {
                    setSelectedDate(new Date(cell.year, cell.month, cell.day));
                  } else {
                    // Navigate to that month and select day
                    setCurrentMonth(cell.month);
                    setCurrentYear(cell.year);
                    setSelectedDate(new Date(cell.year, cell.month, cell.day));
                  }
                }}
                className={`relative min-h-[60px] p-1.5 border rounded-2xl cursor-pointer flex flex-col justify-between transition-all text-left ${
                  isSel
                    ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
                    : isTodayDate
                    ? "border-amber-500 bg-amber-50/20 dark:bg-amber-950/10"
                    : "border-transparent hover:border-gray-200 dark:hover:border-slate-800 hover:bg-gray-50/40 dark:hover:bg-slate-800/20"
                } ${isCurr ? "text-gray-800 dark:text-slate-100" : "text-gray-300 dark:text-slate-650"}`}
              >
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-bold w-5.5 h-5.5 rounded-lg flex items-center justify-center ${
                    isTodayDate
                      ? "bg-amber-500 text-white shadow-md shadow-amber-500/10"
                      : isSel
                      ? "bg-blue-500 text-white shadow-md shadow-blue-500/10"
                      : ""
                  }`}>
                    {cell.day}
                  </span>
                </div>

                {/* Event indicators */}
                {dateFollowUps.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {dateFollowUps.slice(0, 3).map((f) => (
                      <span
                        key={f._id}
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          f.status === "Completed"
                            ? "bg-green-500"
                            : new Date(f.date) < now
                            ? "bg-red-500 animate-pulse"
                            : "bg-blue-500"
                        }`}
                        title={f.title}
                      />
                    ))}
                    {dateFollowUps.length > 3 && (
                      <span className="text-[8px] font-bold text-gray-400 leading-none">
                        +{dateFollowUps.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Panel */}
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm flex flex-col text-left">
        <div className="border-b border-gray-50 dark:border-slate-800/50 pb-4 mb-4 shrink-0">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
            <CalendarIcon className="w-4.5 h-4.5 text-blue-500" />
            <span className="text-xs font-bold uppercase tracking-wide">
              {selectedDate ? selectedDate.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' }) : "Select a date"}
            </span>
          </div>
          <h4 className="font-bold text-gray-950 dark:text-white text-base">
            {selectedDateFollowUps.length} Scheduled Task{selectedDateFollowUps.length !== 1 ? "s" : ""}
          </h4>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar min-h-[220px]">
          {selectedDateFollowUps.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="p-3 bg-gray-50 dark:bg-slate-800/40 rounded-2xl text-gray-400 mb-2.5">
                <CheckCircle className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </div>
              <h5 className="font-bold text-xs text-gray-700 dark:text-slate-300">No events today</h5>
              <p className="text-[11px] text-gray-400 mt-1 max-w-[200px] leading-relaxed">
                Enjoy your day! No scheduled follow-up tasks on this date.
              </p>
            </div>
          ) : (
            selectedDateFollowUps.map((f) => {
              const leadName = typeof f.leadId === "object" ? f.leadId?.name : "Unknown Lead";
              const isOverdue = f.status === "Pending" && new Date(f.date) < now;

              return (
                <div
                  key={f._id}
                  className={`p-3.5 border rounded-2xl space-y-2.5 text-left ${
                    f.status === "Completed"
                      ? "border-green-100 dark:border-green-950/20 bg-green-50/10 dark:bg-green-950/5"
                      : isOverdue
                      ? "border-red-150 dark:border-red-950/20 bg-red-50/10 dark:bg-red-950/5"
                      : "border-gray-100 dark:border-slate-800/60"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <h5 className="font-bold text-xs text-gray-900 dark:text-white leading-tight">
                      {f.title}
                    </h5>
                    <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[8px] font-bold border shrink-0 ${
                      f.status === "Completed"
                        ? "bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 border-green-200/50"
                        : isOverdue
                        ? "bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 border-red-200/50 animate-pulse"
                        : "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-200/50"
                    }`}>
                      {f.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-[11px] text-gray-500 dark:text-slate-400 font-semibold">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{formatDateTime(f.date).split("at")[1] || formatDateTime(f.date)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">Lead: {leadName}</span>
                    </div>
                  </div>

                  {f.notes && (
                    <div className="p-2 bg-gray-50/60 dark:bg-slate-800/20 border border-gray-100 dark:border-slate-800/40 rounded-xl text-[10px] text-gray-500 leading-normal">
                      {f.notes}
                    </div>
                  )}

                  {f.status === "Pending" && (
                    <button
                      onClick={() => onComplete(f._id, "Completed from Calendar view")}
                      className="w-full py-1.5 px-2 bg-gray-50 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/20 border border-gray-150 dark:border-slate-750 text-[10px] font-bold text-gray-700 hover:text-emerald-500 dark:text-slate-300 dark:hover:text-emerald-450 rounded-xl transition-all"
                    >
                      Mark Completed
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
