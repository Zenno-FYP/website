import { motion } from "motion/react";
import { GlassCard } from "./GlassCard";
import { Bar, BarChart, ResponsiveContainer, XAxis } from "recharts";
import { Bell } from "lucide-react";
import { CATEGORY_COLORS, getAppIconForName, getAppRowVisual } from "./analyticsTheme";

const weekData = [
  { id: "mon", day: "Mon", flow: 6.5, debugging: 2.1, research: 1.3, communication: 0.7, distracted: 0.4 },
  { id: "tue", day: "Tue", flow: 7.2, debugging: 1.8, research: 1.5, communication: 0.6, distracted: 0.3 },
  { id: "wed", day: "Wed", flow: 5.8, debugging: 2.5, research: 2.0, communication: 0.9, distracted: 0.5 },
  { id: "thu", day: "Thu", flow: 8.1, debugging: 1.5, research: 1.2, communication: 0.5, distracted: 0.2 },
  { id: "fri", day: "Fri", flow: 6.9, debugging: 2.0, research: 1.8, communication: 0.8, distracted: 0.4 },
];

const topApps = [
  { name: "Visual Studio Code", hours: 42.3, percent: 71 },
  { name: "Google Chrome", hours: 12.5, percent: 21 },
  { name: "Windows Terminal", hours: 4.8, percent: 8 },
];

const patternStats = [
  { label: "Flow", value: "34.5h", color: CATEGORY_COLORS.flow },
  { label: "Debugging", value: "9.9h", color: CATEGORY_COLORS.debugging },
  { label: "Research", value: "7.8h", color: CATEGORY_COLORS.research },
  { label: "Communication", value: "4.2h", color: CATEGORY_COLORS.communication },
  { label: "Distracted", value: "2.1h", color: CATEGORY_COLORS.distracted },
];

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
            <p style={{ fontSize: "1.125rem", color: "#A7B0BE", lineHeight: "1.7", marginBottom: "2rem" }}>
              Zenno labels active time the same way everywhere: flow, debugging, research, communication, and
              distracted hours—so the landing visuals match Developer Trends on the web and your analytics on mobile.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(9.5rem, 1fr))",
                gap: "0.75rem",
              }}
            >
              {patternStats.map((stat) => (
                <GlassCard key={stat.label} className="p-4">
                  <div style={{ color: "#6F7885", fontSize: "0.8125rem", marginBottom: "0.35rem" }}>
                    {stat.label}
                  </div>
                  <div
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: stat.color,
                      fontFamily: "Space Grotesk, sans-serif",
                    }}
                  >
                    {stat.value}
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <GlassCard className="p-8">
              <div style={{ color: "#6F7885", fontSize: "0.875rem", marginBottom: "1rem" }}>
                Developer Trends · weekly hours
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weekData}>
                  <XAxis dataKey="day" stroke="#6F7885" style={{ fontSize: "0.75rem" }} />
                  <Bar dataKey="flow" stackId="a" fill={CATEGORY_COLORS.flow} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="debugging" stackId="a" fill={CATEGORY_COLORS.debugging} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="research" stackId="a" fill={CATEGORY_COLORS.research} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="communication" stackId="a" fill={CATEGORY_COLORS.communication} radius={[0, 0, 0, 0]} />
                  <Bar
                    dataKey="distracted"
                    stackId="a"
                    fill={CATEGORY_COLORS.distracted}
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
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

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: "1rem",
                  alignItems: "center",
                  marginTop: "2rem",
                  paddingTop: "2rem",
                  borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                  width: "100%",
                }}
              >
                {[
                  { label: "Languages", value: "8" },
                  { label: "Projects", value: "5" },
                  { label: "Files", value: "342" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      gap: "0.25rem",
                      textAlign: "center",
                      minWidth: 0,
                    }}
                  >
                    <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#F5F7FA" }}>{stat.value}</div>
                    <div style={{ color: "#6F7885", fontSize: "0.75rem" }}>{stat.label}</div>
                  </div>
                ))}
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
              focus. Below that, language and project counts mirror what you see in Apps &amp; Languages.
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
            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: 700,
                color: "#F5F7FA",
                fontFamily: "Space Grotesk, sans-serif",
                marginBottom: "1.5rem",
              }}
            >
              Nudges that follow your Zenno Agent settings
            </h2>
            <p style={{ fontSize: "1.125rem", color: "#A7B0BE", lineHeight: "1.7", marginBottom: "2rem" }}>
              Schedules, focus styles, and wellbeing goals come straight from the agent screen—so reminders line up
              with how you actually work, not a generic template.
            </p>

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
