'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Play, Cpu, BookOpen, Globe } from 'lucide-react'
import { SplineScene } from '@/components/ui/spline-scene'
import { Spotlight } from '@/components/ui/spotlight'

// ─── Animation variants ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      delay: i * 0.13,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
export function HeroSection() {
  return (
    <section className="relative min-h-screen bg-[#060A0F] overflow-hidden flex items-center">

      {/* ── Hex-grid background pattern ── */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='52' viewBox='0 0 60 52' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L60 17.32 L60 51.96 L30 69.28 L0 51.96 L0 17.32 Z' fill='none' stroke='%2300BCD4' stroke-width='0.8'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 52px',
        }}
      />

      {/* ── Right teal radial glow ── */}
      <div
        className="absolute right-[-80px] top-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0,188,212,0.09) 0%, transparent 65%)',
        }}
      />

      {/* ── Top-left ambient glow ── */}
      <div
        className="absolute left-[-120px] top-[-120px] w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0,188,212,0.045) 0%, transparent 70%)',
        }}
      />

      {/* ── Spotlight beam ── */}
      <Spotlight className="-top-28 left-[28%]" fill="#00BCD4" />

      {/* ── Noise grain overlay for depth ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ── Main content ── */}
      <div className="relative z-10 w-full max-w-[1380px] mx-auto px-8 lg:px-16 flex items-center min-h-screen py-24 gap-8 lg:gap-4">

        {/* ─── LEFT: Text panel ─── */}
        <div className="flex-1 space-y-8 max-w-[580px]">

          {/* Pill badge */}
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-cyan-500/25 bg-cyan-500/[0.06]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span
              className="text-cyan-400 text-[13px] font-semibold tracking-[0.08em] uppercase"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              K-12 AI &amp; IoT Learning Platform
            </span>
          </motion.div>

          {/* H1 */}
          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="leading-[1.06] tracking-[-0.035em]"
            style={{
              fontFamily: "'Syne', 'DM Sans', system-ui, sans-serif",
              fontSize: 'clamp(2.8rem, 4.8vw, 4.6rem)',
              fontWeight: 900,
            }}
          >
            <span className="text-[#EAF2FF]">Where Students</span>
            <br />
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  'linear-gradient(92deg, #00BCD4 0%, #4DD0E1 50%, #80DEEA 100%)',
              }}
            >
              Build Real AI
            </span>
            <br />
            <span className="text-[#EAF2FF]">&amp; Code the Future</span>
          </motion.h1>

          {/* Body copy */}
          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="text-[#5D7D94] text-[1.08rem] leading-[1.78] max-w-[460px]"
          >
            SimuLearning brings hands-on IoT labs, AI projects, and interactive
            lessons to schools across India — in{' '}
            <span className="text-[#7EA8BC] font-medium">English</span>,{' '}
            <span className="text-[#7EA8BC] font-medium">हिंदी</span>, and{' '}
            <span className="text-[#7EA8BC] font-medium">मराठी</span>.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="flex items-center gap-4 flex-wrap"
          >
            {/* Primary */}
            <a
              href="/dashboard"
              className="group inline-flex items-center gap-2.5 px-7 py-[14px] bg-cyan-400 hover:bg-cyan-300 text-[#040810] font-bold text-[1rem] rounded-xl transition-all duration-200 hover:shadow-[0_0_32px_rgba(0,188,212,0.45)] active:scale-95 select-none"
            >
              Start Learning Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </a>

            {/* Secondary */}
            <button className="inline-flex items-center gap-3 px-7 py-[14px] border border-white/[0.09] hover:border-cyan-500/30 text-[#9DBDCF] hover:text-white font-semibold text-[1rem] rounded-xl transition-all duration-200 hover:bg-cyan-500/[0.04] active:scale-95">
              <span className="w-9 h-9 rounded-full border border-cyan-500/30 bg-cyan-500/[0.07] flex items-center justify-center flex-shrink-0">
                <Play className="w-3.5 h-3.5 text-cyan-400 ml-0.5 fill-current" />
              </span>
              Watch Demo
            </button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="flex items-center gap-6 pt-1 flex-wrap"
          >
            {[
              { icon: Cpu, value: '6+', label: 'Courses' },
              { icon: BookOpen, value: '120+', label: 'Lessons' },
              { icon: Globe, value: '3', label: 'Languages' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/[0.07] border border-cyan-500/[0.18] flex items-center justify-center">
                  <Icon className="w-[17px] h-[17px] text-cyan-400" />
                </div>
                <div>
                  <div
                    className="text-[#D6EAFF] font-bold text-[15px] leading-none"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {value}
                  </div>
                  <div className="text-[#334E62] text-[11px] mt-[3px] uppercase tracking-wide">
                    {label}
                  </div>
                </div>
              </div>
            ))}

            {/* Divider */}
            <div className="h-8 w-px bg-white/[0.06]" />

            {/* Powered-by */}
            <div className="text-[11px] leading-relaxed uppercase tracking-[0.06em]">
              <span className="text-[#2C4456]">Powered by</span>
              <br />
              <span className="text-[#4A7A90] font-semibold">Simusoft Technologies</span>
            </div>
          </motion.div>
        </div>

        {/* ─── RIGHT: Spline robot ─── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 relative h-[680px] flex items-center justify-center"
        >
          {/* Bloom glow behind robot */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="w-[520px] h-[520px] rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(0,188,212,0.14) 0%, rgba(0,188,212,0.03) 50%, transparent 70%)',
              }}
            />
          </div>

          {/*
           * ─────────────────────────────────────────────────────────────────────
           * 🤖 SILVER ROBOT — CSS filter approach
           *
           *   grayscale(1)      → strips all colour → neutral grey/silver base
           *   brightness(1.42)  → lifts luminance to chrome/silver level
           *   contrast(1.06)    → adds metallic depth without blowing highlights
           *
           * ─────────────────────────────────────────────────────────────────────
           * 📌 SIMUSOFT LOGO ON CHEST — Spline Editor steps
           *
           *  CSS cannot paint a texture onto a 3D mesh. To do it properly:
           *
           *  1. spline.design → sign in → New Project
           *  2. In the Community tab search "robot" and clone the same
           *     scene (or File → Import the .splinecode you already have)
           *  3. In the scene tree select the chest/torso mesh layer
           *  4. Material panel → Base Color → set to #C8D0DC (silver)
           *     Metalness: 0.90 | Roughness: 0.18
           *  5. Still in Material panel → click "+" → Add Image Map layer
           *     Upload simusoft-logo-white.png (white on transparent PNG)
           *     Blend Mode: "Add" | Opacity: 0.85
           *  6. Use the UV editor to scale & position the logo on the chest
           *  7. Repeat step 4 for all other body meshes (arms, legs, head)
           *  8. File → Publish → copy the new scene.splinecode URL
           *  9. Replace the `scene` prop below with your URL
           * ─────────────────────────────────────────────────────────────────────
           */}
          <div
            className="w-full h-full"
            style={{
              filter: 'grayscale(1) brightness(1.42) contrast(1.06)',
            }}
          >
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>

          {/* Subtle teal overlay tint — enhances the silver with a digital feel */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at 52% 48%, rgba(0,188,212,0.045) 0%, transparent 58%)',
            }}
          />
        </motion.div>
      </div>

      {/* ── Bottom fade to next section ── */}
      <div className="absolute bottom-0 left-0 right-0 h-44 pointer-events-none bg-gradient-to-t from-[#060A0F] to-transparent" />
    </section>
  )
}
