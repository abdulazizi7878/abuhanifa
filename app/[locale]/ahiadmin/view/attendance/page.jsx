"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Ordered sequence strictly starting on Saturday through Friday
const WEEK_DAY_NAMES = [
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday"
];

// Helper: Get Saturday start date for any given reference date
function getCustomWeekStart(dateObj) {
    const d = new Date(dateObj);
    d.setHours(0, 0, 0, 0);
    const day = d.getDay(); // 0 is Sunday, 6 is Saturday
    // Distance back to Saturday
    const diff = (day + 1) % 7;
    d.setDate(d.getDate() - diff);
    return d;
}

// Helper: Format Date to YYYY-MM-DD
function formatDateISO(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export default function AttendancePage() {
    const [currentWeekStart, setCurrentWeekStart] = useState(() => getCustomWeekStart(new Date()));
    const [employees, setEmployees] = useState([]);
    const [attendanceMap, setAttendanceMap] = useState({}); // key format: `${employeeId}_${dateISO}`
    const [loading, setLoading] = useState(true);
    const [savingKey, setSavingKey] = useState(null);

    // Generate 7 days for current active week (Saturday to Friday)
    const weekDays = useMemo(() => {
        return WEEK_DAY_NAMES.map((dayName, idx) => {
            const date = new Date(currentWeekStart);
            date.setDate(date.getDate() + idx);
            const iso = formatDateISO(date);
            return {
                dayName,
                date,
                iso,
                displayDate: date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
            };
        });
    }, [currentWeekStart]);

    // Selected week date range string (e.g., "Sep 25 - Oct 01, 2026")
    const dateRangeLabel = useMemo(() => {
        if (weekDays.length === 0) return "";
        const start = weekDays[0].date;
        const end = weekDays[6].date;
        const startStr = start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        const endStr = end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        return `${startStr} - ${endStr}`;
    }, [weekDays]);

    // Load employees and attendance records for selected week
    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const weekStartDateISO = weekDays[0].iso;

            const [empRes, attRes] = await Promise.all([
                fetch("/api/employees"),
                fetch(`/api/employee-attendance?date=${weekStartDateISO}`)
            ]);

            if (!empRes.ok) throw new Error("Failed to load employees");

            const empData = await empRes.json();
            // Handle { success: true, data: [...] } or direct array or { employees: [...] }
            const fetchedEmpList = Array.isArray(empData)
                ? empData
                : empData?.data || empData?.employees || [];

            setEmployees(fetchedEmpList);

            const map = {};

            if (attRes.ok) {
                const attData = await attRes.json();

                // Case 1: Payload is { success: true, data: { employees: [ { id: 1, attendance: { "2026-09-24": "absent" } } ] } }
                if (attData?.data?.employees && Array.isArray(attData.data.employees)) {
                    attData.data.employees.forEach((emp) => {
                        if (emp.attendance && typeof emp.attendance === "object") {
                            Object.entries(emp.attendance).forEach(([dateStr, status]) => {
                                map[`${emp.id}_${dateStr}`] = status;
                            });
                        }
                    });
                }
                // Case 2: Payload is Array or { attendance: [...] } containing records [{ employeeId, attendanceDate, status }]
                else {
                    const attRecords = Array.isArray(attData) ? attData : attData?.data || attData?.attendance || [];
                    attRecords.forEach((rec) => {
                        const empId = rec.employeeId || rec.employee_id || rec.id;
                        const dateStr = rec.attendanceDate || rec.attendance_date || rec.date;
                        if (empId && dateStr) {
                            const cleanDate = dateStr.split("T")[0];
                            map[`${empId}_${cleanDate}`] = rec.status;
                        }
                    });
                }
            }

            setAttendanceMap(map);
        } catch (err) {
            console.error(err);
            toast.error("Error loading attendance records.");
        } finally {
            setLoading(false);
        }
    }, [weekDays]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Week navigation actions
    const handlePrevWeek = () => {
        const prev = new Date(currentWeekStart);
        prev.setDate(prev.getDate() - 7);
        setCurrentWeekStart(prev);
    };

    const handleNextWeek = () => {
        const next = new Date(currentWeekStart);
        next.setDate(next.getDate() + 7);
        setCurrentWeekStart(next);
    };

    const handleCurrentWeek = () => {
        setCurrentWeekStart(getCustomWeekStart(new Date()));
    };

    // Toggle present / absent status
    const handleToggleAttendance = async (employeeId, dateISO, currentStatus) => {
        const key = `${employeeId}_${dateISO}`;
        const newStatus = currentStatus === "present" ? "absent" : "present";

        // Optimistic UI update
        setAttendanceMap((prev) => ({
            ...prev,
            [key]: newStatus
        }));

        setSavingKey(key);

        try {
            const res = await fetch("/api/employee-attendance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    employeeId,
                    attendanceDate: dateISO,
                    status: newStatus
                })
            });

            if (!res.ok) throw new Error("Failed to save attendance");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update attendance record");
            // Revert status on failure
            setAttendanceMap((prev) => ({
                ...prev,
                [key]: currentStatus
            }));
        } finally {
            setSavingKey(null);
        }
    };

    return (
        <main className="bg-[var(--background)] text-[var(--foreground)] space-y-6">
            {/* Title Header & Week Controller */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-[var(--secondary)]">
                        Abu Hanifa Installation ET
                    </h1>
                    <p className="text-2xl sm:text-3xl font-extrabold mt-1">
                        Weekly Attendance
                    </p>
                </div>

                {/* Week Selector Bar */}
                <div className="flex items-center gap-2 bg-[var(--muted)]/40 p-1.5 rounded-2xl border border-[var(--border)]">
                    <button
                        onClick={handlePrevWeek}
                        className="p-2 rounded-xl hover:bg-[var(--background)] transition cursor-pointer border border-transparent hover:border-[var(--border)] text-[var(--foreground)]"
                        title="Previous Week"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="px-3 py-1 flex items-center gap-2 text-xs font-semibold">
                        <CalendarIcon className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" />
                        <span>{dateRangeLabel}</span>
                    </div>

                    <button
                        onClick={handleCurrentWeek}
                        className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-lg bg-[var(--background)] border border-[var(--border)] hover:bg-[var(--muted)] transition cursor-pointer"
                        title="Go to Current Week"
                    >
                        Current
                    </button>

                    <button
                        onClick={handleNextWeek}
                        className="p-2 rounded-xl hover:bg-[var(--background)] transition cursor-pointer border border-transparent hover:border-[var(--border)] text-[var(--foreground)]"
                        title="Next Week"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-28 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
                    <p className="text-sm font-medium opacity-80">Loading weekly attendance grid...</p>
                </div>
            )}

            {/* Empty State */}
            {!loading && employees.length === 0 && (
                <div className="text-center py-20 p-10 rounded-2xl border border-dashed border-[var(--border)] max-w-md mx-auto space-y-4">
                    <h3 className="text-base font-bold">No employees found</h3>
                    <p className="text-xs opacity-75">Add employees first under Employee Management to record weekly attendance.</p>
                </div>
            )}

            {/* Main Attendance Table Grid */}
            {!loading && employees.length > 0 && (
                <div className="rounded-2xl border border-[var(--border)] shadow-md bg-[var(--background)] overflow-hidden">
                    <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                        <table className="w-full text-left border-collapse text-sm min-w-[720px]">
                            <thead>
                                <tr className="border-b border-[var(--border)] bg-[var(--border)]/15 text-xs font-semibold uppercase tracking-wider">
                                    <th className="py-4 px-4 min-w-[180px] sticky left-0 bg-[var(--background)] z-10 border-r border-[var(--border)] shadow-xs">
                                        Employee
                                    </th>
                                    {weekDays.map((day) => (
                                        <th key={day.iso} className="py-3 px-3 text-center border-r border-[var(--border)] last:border-r-0 min-w-[85px]">
                                            <div className="font-bold text-[var(--foreground)]">{day.dayName.slice(0, 3)}</div>
                                            <div className="text-[10px] text-[var(--muted-foreground)] font-normal">{day.displayDate}</div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)]">
                                {employees.map((emp) => {
                                    const defaultRestDay = (emp.defaultRestDay || emp.default_rest_day || "Friday").trim();

                                    return (
                                        <tr key={emp.id} className="transition hover:bg-[var(--border)]/5">
                                            {/* Employee Name Column */}
                                            <td className="py-3.5 px-4 font-semibold sticky left-0 bg-[var(--background)] z-10 border-r border-[var(--border)]">
                                                <div className="truncate max-w-[170px]">{emp.name}</div>
                                                <div className="text-[10px] text-[var(--muted-foreground)] font-normal">
                                                    Rest: {defaultRestDay}
                                                </div>
                                            </td>

                                            {/* 7 Days Columns (Saturday -> Friday) */}
                                            {weekDays.map((day) => {
                                                const key = `${emp.id}_${day.iso}`;
                                                const status = attendanceMap[key];
                                                const isDefaultRestDay = day.dayName.toLowerCase() === defaultRestDay.toLowerCase();
                                                const isRest = status === "rest" || isDefaultRestDay;
                                                const isPresent = status === "present";
                                                const isSaving = savingKey === key;

                                                return (
                                                    <td
                                                        key={day.iso}
                                                        className="py-3 px-3 text-center border-r border-[var(--border)] last:border-r-0 align-middle"
                                                    >
                                                        {isRest ? (
                                                            <span className="inline-block px-2 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/30">
                                                                REST
                                                            </span>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                disabled={isSaving}
                                                                onClick={() => handleToggleAttendance(emp.id, day.iso, status)}
                                                                className={`
                                                                    w-8 h-8 rounded-lg mx-auto flex items-center justify-center transition-all cursor-pointer border
                                                                    ${isPresent
                                                                        ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-500 font-bold shadow-2xs"
                                                                        : "bg-[var(--background)] border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)]"
                                                                    }
                                                                `}
                                                                title={isPresent ? "Marked Present (Click to mark absent)" : "Marked Absent (Click to mark present)"}
                                                            >
                                                                {isSaving ? (
                                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                                ) : isPresent ? (
                                                                    <Check className="w-4 h-4 stroke-[3]" />
                                                                ) : (
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--border)]" />
                                                                )}
                                                            </button>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </main>
    );
}