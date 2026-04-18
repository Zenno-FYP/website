import { ChevronLeft, ChevronRight } from "lucide-react";

export type WeekPeriod = "current_week" | "previous_week";

interface WeekToggleProps {
  period: WeekPeriod;
  onChange: (period: WeekPeriod) => void;
  theme: "light" | "dark";
}

export function WeekToggle({ period, onChange, theme }: WeekToggleProps) {
  const isPrev = period === "previous_week";

  const base =
    "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all select-none";

  const active =
    theme === "dark"
      ? "bg-[#5B6FD8]/20 border border-[#5B6FD8]/50 text-[#8B9FE8]"
      : "bg-[#5B6FD8]/10 border border-[#5B6FD8]/40 text-[#5B6FD8]";

  const inactive =
    theme === "dark"
      ? "border border-white/10 text-gray-400 hover:text-gray-200 hover:border-white/20 cursor-pointer"
      : "border border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300 cursor-pointer";

  return (
    <div className="flex items-center gap-1">
      <button
        className={`${base} ${isPrev ? active : inactive}`}
        onClick={() => onChange("previous_week")}
        title="Previous week (8–14 days ago)"
      >
        <ChevronLeft className="w-3 h-3" />
        Prev week
      </button>
      <button
        className={`${base} ${!isPrev ? active : inactive}`}
        onClick={() => onChange("current_week")}
        title="Current week (last 7 days)"
      >
        This week
        <ChevronRight className="w-3 h-3" />
      </button>
    </div>
  );
}
