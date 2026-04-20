import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { SocialProof } from './SocialProof';
import { ProblemToOutcome } from './ProblemToOutcome';
import { CorePlatform } from './CorePlatform';
import { FeatureDeepDive } from './FeatureDeepDive';
import { HowItWorks } from './HowItWorks';
import { WhyDifferent } from './WhyDifferent';
import { FinalCTA } from './FinalCTA';
import { Footer } from './Footer';

export function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{
      background: '#0A0A0F',
      fontFamily: 'Inter, sans-serif'
    }}>
      <Navbar />
      <Hero />
      <SocialProof />
      <ProblemToOutcome />
      <CorePlatform />
      <FeatureDeepDive />
      <HowItWorks />
      <WhyDifferent />
      <FinalCTA />
      <Footer />
    </div>
  );
}
