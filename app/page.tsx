import {
  LandingPageFooter,
  LandingPageHero,
  LandingPageNavbar,
  LandingPageServices,
  LandingPageWork,
} from "@/components/landing-page"
import { Logo } from "@/components/ui/logo"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      <LandingPageNavbar />
      <LandingPageHero />
      <LandingPageServices />
      <LandingPageWork />

      <section id="contact" className="relative py-32">
        <div className="relative z-10 container mx-auto px-6 text-center">
          <h2 className="mb-8 text-5xl font-bold tracking-tight md:text-7xl">
            Ready to shape <br />
            <span className="text-gray-300">the future?</span>
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-xl text-white/60">
            Let&apos;s collaborate to build something extraordinary. Your vision, our
            expertise.
          </p>
          <button className="rounded-full bg-white px-10 py-5 text-xl font-bold text-black shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] transition-transform hover:scale-105">
            <div className="flex flex-row items-center justify-center space-x-2">
              <Logo />
              <span>Start a Project</span>
            </div>
          </button>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-1/2 h-125 w-full -translate-x-1/2 bg-linear-to-t from-gray-500/20 to-transparent" />
      </section>

      <LandingPageFooter />
    </main>
  )
}
