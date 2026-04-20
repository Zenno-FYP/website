import { motion } from 'motion/react';
import { GlassCard } from './GlassCard';
import { BarChart, Bar, ResponsiveContainer, XAxis } from 'recharts';
import { Bell, Code2 } from 'lucide-react';

const weekData = [
  { id: 'mon', day: 'Mon', flow: 6.5, debug: 2.1, research: 1.3 },
  { id: 'tue', day: 'Tue', flow: 7.2, debug: 1.8, research: 1.5 },
  { id: 'wed', day: 'Wed', flow: 5.8, debug: 2.5, research: 2.0 },
  { id: 'thu', day: 'Thu', flow: 8.1, debug: 1.5, research: 1.2 },
  { id: 'fri', day: 'Fri', flow: 6.9, debug: 2.0, research: 1.8 },
];

const apps = [
  { id: 'vscode', name: 'VS Code', hours: 42.3, percentage: 71 },
  { id: 'chrome', name: 'Chrome', hours: 12.5, percentage: 21 },
  { id: 'terminal', name: 'Terminal', hours: 4.8, percentage: 8 },
];

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
                fontSize: '2.5rem',
                fontWeight: 700,
                color: '#F5F7FA',
                fontFamily: 'Space Grotesk, sans-serif',
                marginBottom: '1.5rem'
              }}
            >
              See Your Work Patterns
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#A7B0BE', lineHeight: '1.7', marginBottom: '2rem' }}>
              Understand how your week was actually spent. Zenno categorizes your time into flow, debugging, research, communication, and distraction—giving you a clear picture of where your energy goes.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Flow Hours', value: '34.5h', color: '#7C4DFF' },
                { label: 'Debugging', value: '9.9h', color: '#5B6FD8' },
                { label: 'Research', value: '7.8h', color: '#8B9FE8' },
                { label: 'Distracted', value: '2.1h', color: '#6F7885' },
              ].map((stat) => (
                <GlassCard key={stat.label} className="p-4">
                  <div style={{ color: '#6F7885', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    {stat.label}
                  </div>
                  <div
                    style={{
                      fontSize: '2rem',
                      fontWeight: 700,
                      color: stat.color,
                      fontFamily: 'Space Grotesk, sans-serif'
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
              <div style={{ color: '#6F7885', fontSize: '0.875rem', marginBottom: '1rem' }}>
                Weekly Breakdown
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weekData}>
                  <XAxis dataKey="day" stroke="#6F7885" style={{ fontSize: '0.75rem' }} />
                  <Bar dataKey="flow" stackId="a" fill="#7C4DFF" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="debug" stackId="a" fill="#5B6FD8" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="research" stackId="a" fill="#8B9FE8" radius={[8, 8, 0, 0]} />
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
              <div style={{ color: '#6F7885', fontSize: '0.875rem', marginBottom: '1rem' }}>
                Top Apps This Week
              </div>

              <div className="space-y-6">
                {apps.map((app) => (
                  <div key={app.name}>
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Code2 className="w-4 h-4" style={{ color: '#7C4DFF' }} />
                        <span style={{ fontSize: '1rem', color: '#F5F7FA' }}>{app.name}</span>
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 600, color: '#F5F7FA' }}>
                        {app.hours}h
                      </div>
                    </div>
                    <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255, 255, 255, 0.08)' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${app.percentage}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="h-full rounded-full"
                        style={{ background: 'linear-gradient(90deg, #5B6FD8 0%, #7C4DFF 100%)' }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                  gap: '1rem',
                  alignItems: 'center',
                  marginTop: '2rem',
                  paddingTop: '2rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  width: '100%',
                }}
              >
                {[
                  { label: 'Languages', value: '8' },
                  { label: 'Projects', value: '5' },
                  { label: 'Files', value: '342' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      gap: '0.25rem',
                      textAlign: 'center',
                      minWidth: 0,
                    }}
                  >
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#F5F7FA' }}>
                      {stat.value}
                    </div>
                    <div style={{ color: '#6F7885', fontSize: '0.75rem' }}>{stat.label}</div>
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
                fontSize: '2.5rem',
                fontWeight: 700,
                color: '#F5F7FA',
                fontFamily: 'Space Grotesk, sans-serif',
                marginBottom: '1.5rem'
              }}
            >
              Know Which Tools, Languages, and Projects Shape Your Day
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#A7B0BE', lineHeight: '1.7' }}>
              Connect your coding output with the tools and projects behind it. See your top apps, language distribution, and which projects are getting your attention right now.
            </p>
          </motion.div>
        </div>

        {/* Section C: AI Nudges */}
        <div className="landing-grid-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2
              style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                color: '#F5F7FA',
                fontFamily: 'Space Grotesk, sans-serif',
                marginBottom: '1.5rem'
              }}
            >
              Get Nudges That Respect Your Rhythm
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#A7B0BE', lineHeight: '1.7', marginBottom: '2rem' }}>
              Not noisy reminders. Context-aware support. Zenno's AI agent learns your work schedule, focus style, and wellbeing preferences to deliver nudges at the right moment.
            </p>

            <div className="space-y-4">
              {[
                { label: 'Work Schedule', value: '9AM - 6PM' },
                { label: 'Focus Style', value: 'Deep blocks' },
                { label: 'Wellbeing Goal', value: 'Prevent burnout' },
              ].map((pref) => (
                <div
                  key={pref.label}
                  className="flex justify-between items-center p-4 rounded-2xl"
                  style={{ background: 'rgba(91, 111, 216, 0.1)', border: '1px solid rgba(91, 111, 216, 0.3)' }}
                >
                  <span style={{ color: '#A7B0BE', fontSize: '1rem' }}>{pref.label}</span>
                  <span style={{ color: '#F5F7FA', fontSize: '1rem', fontWeight: 600 }}>{pref.value}</span>
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
              {[
                { time: '10:42 AM', message: "You've been in deep focus for 2 hours. Consider a quick break." },
                { time: '2:15 PM', message: 'Lunch break detected. Ready to resume?' },
                { time: '4:30 PM', message: 'Context switches are up 40% today. Want to review your focus patterns?' },
              ].map((nudge, index) => (
                <motion.div
                  key={index}
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
                          background: 'rgba(91, 111, 216, 0.16)',
                          border: '1px solid rgba(91, 111, 216, 0.3)'
                        }}
                      >
                        <Bell className="w-5 h-5" style={{ color: '#7C4DFF' }} />
                      </div>
                      <div>
                        <div style={{ color: '#6F7885', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                          {nudge.time}
                        </div>
                        <div style={{ color: '#F5F7FA', fontSize: '0.9375rem', lineHeight: '1.5' }}>
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
