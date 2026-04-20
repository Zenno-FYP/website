import { motion } from 'motion/react';
import { Clock, Code2, BarChart3, Zap } from 'lucide-react';
import { fadeUp, landingViewport, staggerDelay } from './landingMotion';

const proofChips = [
  { icon: Clock, text: 'Tracks focus time' },
  { icon: BarChart3, text: 'Analyzes projects' },
  { icon: Code2, text: 'Maps tools & languages' },
  { icon: Zap, text: 'Personalized nudges' },
];

export function SocialProof() {
  return (
    <section className="landing-social">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={landingViewport}
          transition={fadeUp(0.75, 0)}
          className="flex flex-wrap justify-center items-center gap-5 md:gap-6"
        >
          {proofChips.map((chip, index) => (
            <motion.div
              key={chip.text}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={landingViewport}
              transition={fadeUp(0.65, staggerDelay(index, 0.08))}
              className="flex items-center gap-2 px-6 py-3 rounded-full"
              style={{
                background: 'rgba(91, 111, 216, 0.1)',
                border: '1px solid rgba(91, 111, 216, 0.3)',
                color: '#F5F7FA',
                fontSize: '0.9375rem'
              }}
            >
              <chip.icon className="w-4 h-4" style={{ color: '#7C4DFF' }} />
              <span>{chip.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
