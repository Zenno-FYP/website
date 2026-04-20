import { motion } from 'motion/react';
import { GlassCard } from './GlassCard';
import { BarChart3, Code2, Folder, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const features = [
  {
    icon: BarChart3,
    title: 'Performance Metrics',
    description: 'Track flow hours, debugging time, and productivity patterns across your week.'
  },
  {
    icon: Code2,
    title: 'Tool & Language Analytics',
    description: 'See which apps and languages dominate your workflow with usage breakdowns.'
  },
  {
    icon: Folder,
    title: 'Projects & Skills Insight',
    description: 'Understand your strongest skills and which projects get your attention.'
  },
  {
    icon: Sparkles,
    title: 'AI Nudge Agent',
    description: 'Get context-aware reminders based on your schedule, focus style, and wellbeing preferences.'
  }
];

const activityData = [
  { id: 'flow', category: 'Flow', hours: 34.5, fill: '#7C4DFF' },
  { id: 'debug', category: 'Debug', hours: 12.3, fill: '#5B6FD8' },
  { id: 'research', category: 'Research', hours: 8.7, fill: '#8B9FE8' },
  { id: 'comms', category: 'Comms', hours: 4.2, fill: '#6F7885' },
];

const languageData = [
  { id: 'ts', name: 'TypeScript', value: 62, color: '#7C4DFF' },
  { id: 'py', name: 'Python', value: 24, color: '#5B6FD8' },
  { id: 'go', name: 'Go', value: 14, color: '#8B9FE8' },
];

export function CorePlatform() {
  return (
    <section id="features" className="landing-section" style={{ background: '#0F0F14' }}>
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
              fontSize: '3rem',
              fontWeight: 700,
              color: '#F5F7FA',
              fontFamily: 'Space Grotesk, sans-serif',
              marginBottom: '1rem'
            }}
          >
            Everything you need to understand how you code
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#A7B0BE', maxWidth: '42rem', margin: '0 auto' }}>
            Desktop tracking, project insights, language analytics, and AI nudges—all in one place.
          </p>
        </motion.div>

        <div className="landing-grid-2 landing-mb-section">
          {/* Dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <GlassCard className="p-8">
              <div className="mb-6">
                <div style={{ color: '#6F7885', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  This Week's Activity
                </div>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  color: '#F5F7FA',
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  59.7 hours
                </div>
              </div>

              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={activityData} layout="vertical">
                  <XAxis type="number" stroke="#6F7885" style={{ fontSize: '0.75rem' }} />
                  <YAxis type="category" dataKey="category" stroke="#6F7885" style={{ fontSize: '0.875rem' }} />
                  <Bar dataKey="hours" fill="#F4D628" radius={[0, 8, 8, 0]}>
                    {activityData.map((entry) => (
                      <Cell key={`cell-${entry.category}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                  gap: '1rem',
                  marginTop: '1.5rem',
                  width: '100%',
                }}
              >
                {languageData.map((lang) => (
                  <div key={lang.name} style={{ minWidth: 0 }}>
                    <div
                      className="w-full h-2 rounded-full mb-2"
                      style={{ background: 'rgba(255, 255, 255, 0.08)' }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${lang.value}%`, background: lang.color }}
                      />
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'nowrap',
                        alignItems: 'baseline',
                        justifyContent: 'center',
                        gap: '0.35rem',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <span style={{ fontSize: '0.875rem', color: '#A7B0BE' }}>{lang.name}</span>
                      <span style={{ fontSize: '1.125rem', fontWeight: 700, color: '#F5F7FA' }}>
                        {lang.value}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Feature cards */}
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
                        background: 'rgba(91, 111, 216, 0.16)',
                        border: '1px solid rgba(91, 111, 216, 0.3)'
                      }}
                    >
                      <feature.icon className="w-6 h-6" style={{ color: '#7C4DFF' }} />
                    </div>
                    <div>
                      <h3
                        style={{
                          fontSize: '1.25rem',
                          fontWeight: 700,
                          color: '#F5F7FA',
                          marginBottom: '0.5rem',
                          fontFamily: 'Space Grotesk, sans-serif'
                        }}
                      >
                        {feature.title}
                      </h3>
                      <p style={{ fontSize: '1rem', color: '#A7B0BE', lineHeight: '1.6' }}>
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
