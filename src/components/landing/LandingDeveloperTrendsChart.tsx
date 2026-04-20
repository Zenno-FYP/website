import type { CSSProperties } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CATEGORY_COLORS } from "./analyticsTheme";
import type { LandingTrendPoint } from "./landingChartData";

type SeriesMode = "all" | "flow_only";

const TOOLTIP_STYLE: CSSProperties = {
  backgroundColor: "rgba(17, 24, 39, 0.95)",
  border: "none",
  borderRadius: "12px",
  boxShadow: "0 10px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
  padding: "12px",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  color: "#F3F4F6",
};

type Props = {
  data: LandingTrendPoint[];
  height?: number;
  /** `flow_only`: single series — matches hero “flow hours” card. `all`: same as web/mobile Developer Trends */
  mode?: SeriesMode;
  title?: string;
  showLegend?: boolean;
  className?: string;
};

/**
 * Mirrors web `DeveloperTrendsCard` (grid, axes, tooltip, legend) and mobile
 * `DeveloperTrendsChart` (smooth monotone curves, 8% fill under lines, 2px stroke).
 */
export function LandingDeveloperTrendsChart({
  data,
  height = 300,
  mode = "all",
  title,
  showLegend = true,
  className,
}: Props) {
  const show = (key: keyof Omit<LandingTrendPoint, "time">) =>
    mode === "all" ? true : key === "flow_hours";

  return (
    <div className={className}>
      {title ? (
        <div style={{ color: "#6F7885", fontSize: "0.875rem", marginBottom: "1rem" }}>{title}</div>
      ) : null}
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={data} margin={{ top: 12, right: 8, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
          <XAxis
            dataKey="time"
            stroke="#9CA3AF"
            axisLine={false}
            tickLine={false}
            style={{ fontSize: "12px" }}
          />
          <YAxis stroke="#9CA3AF" axisLine={false} tickLine={false} style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(value: number | string) => `${Number(value).toFixed(2)}h`}
            labelFormatter={(label) => String(label)}
          />
          {showLegend && mode === "all" ? (
            <Legend
              wrapperStyle={{ fontSize: "12px", paddingTop: "8px", color: "#9CA3AF" }}
            />
          ) : null}

          {show("flow_hours") ? (
            <Area
              type="monotone"
              dataKey="flow_hours"
              name="Flow"
              stroke={CATEGORY_COLORS.flow}
              strokeWidth={2}
              fill={CATEGORY_COLORS.flow}
              fillOpacity={0.08}
              dot={false}
              activeDot={{ r: 5, fill: CATEGORY_COLORS.flow }}
            />
          ) : null}
          {show("debugging_hours") ? (
            <Area
              type="monotone"
              dataKey="debugging_hours"
              name="Debugging"
              stroke={CATEGORY_COLORS.debugging}
              strokeWidth={2}
              fill={CATEGORY_COLORS.debugging}
              fillOpacity={0.08}
              dot={false}
              activeDot={{ r: 5, fill: CATEGORY_COLORS.debugging }}
            />
          ) : null}
          {show("research_hours") ? (
            <Area
              type="monotone"
              dataKey="research_hours"
              name="Research"
              stroke={CATEGORY_COLORS.research}
              strokeWidth={2}
              fill={CATEGORY_COLORS.research}
              fillOpacity={0.08}
              dot={false}
              activeDot={{ r: 5, fill: CATEGORY_COLORS.research }}
            />
          ) : null}
          {show("communication_hours") ? (
            <Area
              type="monotone"
              dataKey="communication_hours"
              name="Communication"
              stroke={CATEGORY_COLORS.communication}
              strokeWidth={2}
              fill={CATEGORY_COLORS.communication}
              fillOpacity={0.08}
              dot={false}
              activeDot={{ r: 5, fill: CATEGORY_COLORS.communication }}
            />
          ) : null}
          {show("distracted_hours") ? (
            <Area
              type="monotone"
              dataKey="distracted_hours"
              name="Distracted"
              stroke={CATEGORY_COLORS.distracted}
              strokeWidth={2}
              fill={CATEGORY_COLORS.distracted}
              fillOpacity={0.08}
              dot={false}
              activeDot={{ r: 5, fill: CATEGORY_COLORS.distracted }}
            />
          ) : null}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
