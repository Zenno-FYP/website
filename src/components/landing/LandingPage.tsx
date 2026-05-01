import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { SocialProof } from './SocialProof';
import { ProblemToOutcome } from './ProblemToOutcome';
import { CorePlatform } from './CorePlatform';
import { FeatureDeepDive } from './FeatureDeepDive';
import { HowItWorks } from './HowItWorks';
import { WhyDifferent } from './WhyDifferent';
import { LandingProfilePreview } from './LandingProfilePreview';
import { FinalCTA } from './FinalCTA';
import { Footer } from './Footer';

export function LandingPage() {
  return (
    <div
      className="landing-page"
      style={{
        background: '#0A0A0F',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <Navbar />
      <Hero />
      <SocialProof />
      <ProblemToOutcome />
      <CorePlatform />
      <FeatureDeepDive />
      <LandingProfilePreview />
      <HowItWorks />
      <WhyDifferent />
      <FinalCTA />
      <Footer />
    </div>
  );
}
