import { motion } from 'motion/react';
import { X, Check } from 'lucide-react';

const comparisons = [
  {
    typical: 'Raw logs',
    zenno: 'Behavior insights'
  },
  {
    typical: 'Passive charts',
    zenno: 'Actionable nudges'
  },
  {
    typical: 'Generic productivity',
    zenno: 'Developer-first analytics'
  },
  {
    typical: 'More noise',
    zenno: 'Preference-aware support'
  }
];

export function WhyDifferent() {
  return (
    <section className="landing-section">
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
            Why Zenno Feels Different
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#A7B0BE', maxWidth: '42rem', margin: '0 auto' }}>
            Built specifically for developers who want clarity, not clutter.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="text-center pb-4 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
              <h3
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#6F7885',
                  fontFamily: 'Space Grotesk, sans-serif'
                }}
              >
                Typical trackers
              </h3>
            </div>
            <div className="text-center pb-4 border-b" style={{ borderColor: 'rgba(124, 77, 255, 0.3)' }}>
              <h3
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#7C4DFF',
                  fontFamily: 'Space Grotesk, sans-serif'
                }}
              >
                Zenno
              </h3>
            </div>
          </div>

          {comparisons.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="grid md:grid-cols-2 gap-8 py-6 border-b"
              style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}
            >
              <div className="flex items-center gap-3">
                <X className="w-5 h-5 flex-shrink-0" style={{ color: '#6F7885' }} />
                <span style={{ fontSize: '1.125rem', color: '#A7B0BE' }}>
                  {item.typical}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 flex-shrink-0" style={{ color: '#7C4DFF' }} />
                <span style={{ fontSize: '1.125rem', color: '#F5F7FA', fontWeight: 600 }}>
                  {item.zenno}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
