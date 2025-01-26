import { Hero } from './hero/hero'
import { SocialProof } from './social-proof/social-proof-section'
import { Features } from './features/features-section'
import { Testimonials } from './testimonials/testimonials'
import { Faq } from './faq/faq-section'
import CtaSection from './cta-section'

export default function Index() {
  return (
    <>
      <Hero />
      {/* <SocialProof /> */}
      <Features />
      <Testimonials />
      <Faq />
      <CtaSection />
    </>
  )
}
