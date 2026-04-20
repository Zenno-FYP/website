import { motion } from "motion/react";
import { GlassCard } from "./GlassCard";
import { Bell, Bot } from "lucide-react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CATEGORY_COLORS, getAppIconForName, getAppRowVisual } from "./analyticsTheme";
import { LANDING_DEVELOPER_TRENDS_WEEK } from "./landingChartData";
import { LandingDeveloperTrendsChart } from "./LandingDeveloperTrendsChart";

const topApps = [
  { name: "Visual Studio Code", hours: 32.0, percent: 32 },
  { name: "Brave", hours: 18.0, percent: 22 },
  { name: "MongoDB Compass", hours: 12.5, percent: 16 },
  { name: "AWS Console", hours: 12.5, percent: 16 },
  { name: "ChatGPT", hours: 10.0, percent: 14 },
];

/** Same illustrative week split as before — now as pie slices (hours) */
const CATEGORY_PIE_HOURS = [
  { name: "Flow", hours: 34.5, fill: CATEGORY_COLORS.flow },
  { name: "Debugging", hours: 9.9, fill: CATEGORY_COLORS.debugging },
  { name: "Research", hours: 7.8, fill: CATEGORY_COLORS.research },
  { name: "Communication", hours: 4.2, fill: CATEGORY_COLORS.communication },
  { name: "Distracted", hours: 2.1, fill: CATEGORY_COLORS.distracted },
] as const;

const categoryWeekTotal = CATEGORY_PIE_HOURS.reduce((a, x) => a + x.hours, 0);

const agentPrefs = [
  {
    label: "Work schedule",
    value: "Standard Day",
    hint: "Active 8 AM – 8 PM",
  },
  {
    label: "Focus style",
    value: "Moderate",
    hint: "75-min break reminders",
  },
  {
    label: "Wellbeing goal",
    value: "Stay Focused",
    hint: "Celebrate deep work, flag distractions",
  },
] as const;

const nudgeExamples = [
  {
    time: "10:42",
    message:
      "You've been in flow for about 2 hours. With Moderate focus, consider a short break before the next block.",
  },
  {
    time: "14:05",
    message: "Quiet hours are on — we'll deliver non-urgent nudges after your window ends.",
  },
  {
    time: "16:20",
    message: "Debugging is up vs. last week. Open Developer Trends to compare categories side by side.",
  },
] as const;

export function FeatureDeepDive() {
  return (
    <section className="landing-section">
      <div className="max-w-7xl mx-auto landing-deep-dive-stack">
        {/* Section A: Work Patterns */}
        <div className="landing-grid-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: 700,
                color: "#F5F7FA",
                fontFamily: "Space Grotesk, sans-serif",
                marginBottom: "1.5rem",
              }}
            >
              See your work patterns
            </h2>
            <p style={{ fontSize: "1.125rem", color: "#A7B0BE", lineHeight: "1.7", marginBottom: "1.5rem" }}>
              Zenno labels active time the same way everywhere: flow, debugging, research, communication, and
              distracted hours—so the landing visuals match Developer Trends on the web and your analytics on mobile.
            </p>

            <GlassCard className="p-6">
              <div style={{ color: "#6F7885", fontSize: "0.875rem", marginBottom: "0.5rem" }}>This week · hours by category</div>
              <div className="flex flex-wrap items-end justify-between gap-4 mb-2">
                <span
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: 700,
                    color: "#F5F7FA",
                    fontFamily: "Space Grotesk, sans-serif",
                  }}
                >
                  {categoryWeekTotal.toFixed(1)}h
                </span>
                <span style={{ fontSize: "0.8125rem", color: "#6F7885" }}>Tracked active time</span>
              </div>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={CATEGORY_PIE_HOURS.map((d) => ({ name: d.name, value: d.hours }))}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius="58%"
                      outerRadius="88%"
                      paddingAngle={2}
                      stroke="rgba(15, 15, 20, 0.9)"
                      strokeWidth={2}
                    >
                      {CATEGORY_PIE_HOURS.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [`${value.toFixed(1)}h`, "Time"]}
                      contentStyle={{
                        backgroundColor: "rgba(17, 24, 39, 0.95)",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                        color: "#F3F4F6",
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: "12px", color: "#9CA3AF", paddingTop: "8px" }}
                      formatter={(value) => <span style={{ color: "#A7B0BE" }}>{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <GlassCard className="p-8">
              <LandingDeveloperTrendsChart
                data={LANDING_DEVELOPER_TRENDS_WEEK}
                height={300}
                title="Developer Trends · weekly hours"
              />
            </GlassCard>
          </motion.div>
        </div>

        {/* Section B: Tools & Languages */}
        <div className="landing-grid-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="landing-fd-swap-a"
          >
            <GlassCard className="p-8">
              <div style={{ color: "#6F7885", fontSize: "0.875rem", marginBottom: "1rem" }}>
                Top apps · this week
              </div>

              <div className="space-y-4">
                {topApps.map((app) => {
                  const Icon = getAppIconForName(app.name);
                  const { color, linearGradient } = getAppRowVisual(app.name);
                  return (
                    <div
                      key={app.name}
                      className="p-4 rounded-2xl"
                      style={{
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                        background: "rgba(255, 255, 255, 0.02)",
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md"
                          style={{ background: linearGradient }}
                        >
                          <Icon className="w-5 h-5 text-white" aria-hidden />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-3 mb-2">
                            <span style={{ fontSize: "1rem", color: "#F5F7FA" }} className="truncate font-medium">
                              {app.name}
                            </span>
                            <div className="text-right flex-shrink-0">
                              <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#F5F7FA" }}>
                                {app.hours}h
                              </div>
                              <div style={{ fontSize: "0.75rem", color: "#6F7885" }}>{app.percent.toFixed(0)}%</div>
                            </div>
                          </div>
                          <div className="relative w-full h-1.5 rounded-full overflow-hidden bg-gray-700/80">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${app.percent}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: 0.2 }}
                              className="absolute top-0 left-0 h-full rounded-full"
                              style={{
                                background: `linear-gradient(to right, ${color}, ${color}dd)`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="landing-fd-swap-b"
          >
            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: 700,
                color: "#F5F7FA",
                fontFamily: "Space Grotesk, sans-serif",
                marginBottom: "1.5rem",
              }}
            >
              Tools, languages, and projects in one place
            </h2>
            <p style={{ fontSize: "1.125rem", color: "#A7B0BE", lineHeight: "1.7" }}>
              The same top-apps treatment as the dashboard and mobile: hashed colours per app, hours, and share of
              focus.
            </p>
          </motion.div>
        </div>

        {/* Section C: Zenno Agent */}
        <div className="landing-grid-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start">
              <div
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl shadow-xl"
                style={{
                  background: "linear-gradient(to bottom right, #7C4DFF, #5B6FD8)",
                }}
                aria-hidden
              >
                <Bot className="w-8 h-8 text-white drop-shadow-lg" />
              </div>
              <div className="min-w-0 flex-1">
                <h2
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: 700,
                    color: "#F5F7FA",
                    fontFamily: "Space Grotesk, sans-serif",
                    marginBottom: "1rem",
                  }}
                >
                  Nudges that follow your Zenno Agent settings
                </h2>
                <p style={{ fontSize: "1.125rem", color: "#A7B0BE", lineHeight: "1.7", margin: 0 }}>
                  Schedules, focus styles, and wellbeing goals come straight from the agent screen—so reminders line up
                  with how you actually work, not a generic template.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {agentPrefs.map((pref) => (
                <div
                  key={pref.label}
                  className="p-4 rounded-2xl"
                  style={{
                    background: "rgba(91, 111, 216, 0.1)",
                    border: "1px solid rgba(91, 111, 216, 0.3)",
                  }}
                >
                  <div className="flex justify-between items-start gap-4">
                    <span style={{ color: "#A7B0BE", fontSize: "0.9375rem" }}>{pref.label}</span>
                    <div className="text-right">
                      <div style={{ color: "#F5F7FA", fontSize: "1rem", fontWeight: 600 }}>{pref.value}</div>
                      <div style={{ color: "#6F7885", fontSize: "0.75rem", marginTop: "0.25rem" }}>{pref.hint}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="mb-6 flex items-start gap-4">
              <div
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl shadow-xl"
                style={{
                  background: "linear-gradient(to bottom right, #7C4DFF, #5B6FD8)",
                }}
                aria-hidden
              >
                <Bot className="w-8 h-8 text-white drop-shadow-lg" />
              </div>
              <div className="min-w-0 pt-1">
                <div
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: 600,
                    color: "#F5F7FA",
                    fontFamily: "Space Grotesk, sans-serif",
                    marginBottom: "0.25rem",
                  }}
                >
                  Nudge feed
                </div>
                <p style={{ fontSize: "0.875rem", color: "#6F7885", lineHeight: "1.5", margin: 0 }}>
                  Examples from a typical day—timing and tone follow your agent settings.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {nudgeExamples.map((nudge, index) => (
                <motion.div
                  key={nudge.time}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                >
                  <GlassCard className="p-4">
                    <div className="flex gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: "rgba(91, 111, 216, 0.16)",
                          border: "1px solid rgba(91, 111, 216, 0.3)",
                        }}
                      >
                        <Bell className="w-5 h-5" style={{ color: "#7C4DFF" }} />
                      </div>
                      <div>
                        <div style={{ color: "#6F7885", fontSize: "0.75rem", marginBottom: "0.25rem" }}>
                          {nudge.time}
                        </div>
                        <div style={{ color: "#F5F7FA", fontSize: "0.9375rem", lineHeight: "1.5" }}>
                          {nudge.message}
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
