"use client";

import type { ReportDatePreset } from "@/types/report";

type Props = {
  preset: ReportDatePreset;
  startDate: string;
  endDate: string;
  onPresetChange: (value: ReportDatePreset) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
};

export function ReportsDateFilter({
  preset,
  startDate,
  endDate,
  onPresetChange,
  onStartDateChange,
  onEndDateChange,
}: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm lg:flex-row lg:items-end">
      <label className="min-w-[180px]">
        <span className="text-xs font-medium text-zinc-500">Rango</span>
        <select
          value={preset}
          onChange={(e) => onPresetChange(e.target.value as ReportDatePreset)}
          className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
        >
          <option value="7d">Ultimos 7 dias</option>
          <option value="30d">Ultimos 30 dias</option>
          <option value="month">Este mes</option>
          <option value="custom">Personalizado</option>
        </select>
      </label>
      {preset === "custom" ? (
        <>
          <label className="min-w-[160px]">
            <span className="text-xs font-medium text-zinc-500">Desde</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="min-w-[160px]">
            <span className="text-xs font-medium text-zinc-500">Hasta</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            />
          </label>
        </>
      ) : null}
    </div>
  );
}
