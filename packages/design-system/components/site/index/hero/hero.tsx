import HeroImage from './hero-image'
import HeroPitch from './hero-pitch'
import { HeroText } from './hero-text'
import HeroActions from './hero-actions'

export function Hero() {
  return (
    <section className="sm:gap-10 relative z-10 w-full min-h-screen">
      <div className="flex flex-col items-center gap-20 px-8 grid-cols-1 justify-center flex-grow pt-[30vh]">
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <HeroText />
          <HeroActions />
        </div>
        <HeroPitch />
      </div>
      <HeroImage />
    </section>
  )
}
