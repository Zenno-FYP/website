import { motion } from "motion/react";
import { GlassCard } from "./GlassCard";
import { BarChart3, Code2, Folder, Sparkles } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { CATEGORY_COLORS, LANGUAGE_MOCK } from "./analyticsTheme";

const features = [
  {
    icon: BarChart3,
    title: "Performance & trends",
    description:
      "Flow, debugging, research, communication, and distracted time—same breakdown as Developer Trends in the app.",
  },
  {
    icon: Code2,
    title: "Apps & languages",
    description:
      "See which editors and browsers get your hours, plus how coding time splits across languages.",
  },
  {
    icon: Folder,
    title: "Projects & skills",
    description:
      "Tie activity to projects and skills so you know where attention is going over the week.",
  },
  {
    icon: Sparkles,
    title: "Zenno Agent",
    description:
      "Preferences for schedule, focus style, and wellbeing—nudges that respect quiet hours and your goals.",
  },
];

const activityRows = [
  { id: "flow" as const, category: "Flow", hours: 34.5, fill: CATEGORY_COLORS.flow },
  { id: "debugging" as const, category: "Debugging", hours: 12.3, fill: CATEGORY_COLORS.debugging },
  { id: "research" as const, category: "Research", hours: 8.7, fill: CATEGORY_COLORS.research },
  { id: "communication" as const, category: "Communication", hours: 4.2, fill: CATEGORY_COLORS.communication },
  { id: "distracted" as const, category: "Distracted", hours: 2.1, fill: CATEGORY_COLORS.distracted },
];

export function CorePlatform() {
  return (
    <section id="features" className="landing-section" style={{ background: "#0F0F14" }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center landing-mb-heading"
        >
          <h2
            style={{
              fontSize: "3rem",
              fontWeight: 700,
              color: "#F5F7FA",
              fontFamily: "Space Grotesk, sans-serif",
              marginBottom: "1rem",
            }}
          >
            Everything you need to understand how you code
          </h2>
          <p style={{ fontSize: "1.125rem", color: "#A7B0BE", maxWidth: "42rem", margin: "0 auto" }}>
            Desktop agent, web dashboard, and Zenno Agent—connected the same way as in the product.
          </p>
        </motion.div>

        <div className="landing-grid-2 landing-mb-section">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <GlassCard className="p-8">
              <div className="mb-6">
                <div style={{ color: "#6F7885", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
                  This week · active hours
                </div>
                <div
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: 700,
                    color: "#F5F7FA",
                    fontFamily: "Space Grotesk, sans-serif",
                  }}
                >
                  61.8h
                </div>
              </div>

              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={activityRows} layout="vertical" margin={{ left: 4, right: 8 }}>
                  <XAxis type="number" stroke="#6F7885" style={{ fontSize: "0.75rem" }} />
                  <YAxis
                    type="category"
                    dataKey="category"
                    stroke="#6F7885"
                    style={{ fontSize: "0.8125rem" }}
                    width={108}
                  />
                  <Bar dataKey="hours" radius={[0, 8, 8, 0]}>
                    {activityRows.map((entry) => (
                      <Cell key={entry.id} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: "1rem",
                  marginTop: "1.5rem",
                  width: "100%",
                }}
              >
                {LANGUAGE_MOCK.map((lang) => (
                  <div key={lang.name} style={{ minWidth: 0 }}>
                    <div
                      className="w-full h-2 rounded-full mb-2"
                      style={{ background: "rgba(255, 255, 255, 0.08)" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${lang.value}%`, background: lang.bar }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "nowrap",
                        alignItems: "baseline",
                        justifyContent: "center",
                        gap: "0.35rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <span style={{ fontSize: "0.875rem", color: "#A7B0BE" }}>{lang.name}</span>
                      <span style={{ fontSize: "1.125rem", fontWeight: 700, color: "#F5F7FA" }}>
                        {lang.value}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          <div className="grid gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <GlassCard className="p-6" hover>
                  <div className="flex gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: "rgba(91, 111, 216, 0.16)",
                        border: "1px solid rgba(91, 111, 216, 0.3)",
                      }}
                    >
                      <feature.icon className="w-6 h-6" style={{ color: "#7C4DFF" }} />
                    </div>
                    <div>
                      <h3
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: 700,
                          color: "#F5F7FA",
                          marginBottom: "0.5rem",
                          fontFamily: "Space Grotesk, sans-serif",
                        }}
                      >
                        {feature.title}
                      </h3>
                      <p style={{ fontSize: "1rem", color: "#A7B0BE", lineHeight: "1.6" }}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
