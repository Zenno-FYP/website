import { motion } from 'motion/react';
import { Monitor, BarChart2, Layout, Sparkles } from 'lucide-react';

const steps = [
  {
    icon: Monitor,
    title: 'Zenno runs quietly on desktop',
    description: 'Tracks your activity without interrupting your workflow'
  },
  {
    icon: BarChart2,
    title: 'It groups your activity into meaningful signals',
    description: 'Categorizes time into flow, debugging, research, and more'
  },
  {
    icon: Layout,
    title: 'Your dashboard reveals patterns across time, tools, and projects',
    description: 'See exactly where your coding energy goes each week'
  },
  {
    icon: Sparkles,
    title: 'The AI agent nudges you when it can help',
    description: 'Context-aware support at exactly the right moment'
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="landing-section" style={{ background: '#0F0F14' }}>
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
            How It Works
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#A7B0BE', maxWidth: '42rem', margin: '0 auto' }}>
            Simple, automatic, actionable.
          </p>
        </motion.div>

        <div className="landing-grid-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              {index < steps.length - 1 && (
                <div
                  className="hidden lg:block absolute top-12 left-full w-full h-0.5"
                  style={{
                    background: 'linear-gradient(to right, rgba(124, 77, 255, 0.3), transparent)',
                    transform: 'translateX(-50%)'
                  }}
                />
              )}

              <div className="relative">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto"
                  style={{
                    background: 'rgba(91, 111, 216, 0.16)',
                    border: '1px solid rgba(91, 111, 216, 0.3)'
                  }}
                >
                  <step.icon className="w-8 h-8" style={{ color: '#7C4DFF' }} />
                </div>

                <div
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #5B6FD8 0%, #7C4DFF 100%)',
                    color: '#FFFFFF',
                    fontSize: '0.875rem',
                    fontWeight: 700
                  }}
                >
                  {index + 1}
                </div>
              </div>

              <h3
                className="text-center mb-3"
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  color: '#F5F7FA',
                  lineHeight: '1.4'
                }}
              >
                {step.title}
              </h3>

              <p
                className="text-center"
                style={{
                  fontSize: '0.9375rem',
                  color: '#A7B0BE',
                  lineHeight: '1.6'
                }}
              >
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
