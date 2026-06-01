'use client'
import Link from 'next/link'
import { SimuRobot } from '@/components/ui/simu-robot'
import { DottedSurface } from '@/components/ui/dotted-surface'

export default function SplineTest() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <section style={{ background: 'linear-gradient(135deg, #F0F9FF 0%, #FFFFFF 50%, #F0FDFE 100%)', padding: 'clamp(4rem,8vw,7rem) 2rem', position: 'relative', overflow: 'hidden' }}>

        {/* Teal dot wave background */}
        <DottedSurface />

        {/* glow orbs */}
        <div style={{ position: 'absolute', top: '-10%', right: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(0,188,212,0.12) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 1 }} />
        <div style={{ position: 'absolute', bottom: '-10%', left: '5%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(0,200,150,0.1) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 1 }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div className='animate-fadeUp' style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,188,212,0.08)', border: '1px solid rgba(0,188,212,0.35)', borderRadius: 'var(--radius-full)', padding: '6px 16px', marginBottom: '1.5rem' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00BCD4', display: 'inline-block' }} />
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#67E8F9', fontFamily: 'DM Sans' }}>K-12 AI &amp; IoT Learning Platform</span>
            </div>
            <h1 className='animate-fadeUp delay-100' style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 900, fontSize: 'clamp(3rem,5.5vw,4.5rem)', color: '#1E3A5F', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>Learn AI &amp; IoT</h1>
            <h1 className='animate-fadeUp delay-200' style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 900, fontSize: 'clamp(2.2rem,5vw,3.5rem)', background: 'linear-gradient(135deg, #00BCD4, #4DD0E1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>From Grade 1 to 12</h1>
            <p className='animate-fadeUp delay-300' style={{ fontSize: 'clamp(1rem,2vw,1.15rem)', color: 'rgba(13,27,46,0.6)', lineHeight: 1.7, marginBottom: '2rem', maxWidth: 520, fontFamily: 'DM Sans' }}>Hands-on virtual IoT labs, smart quizzes, gamified badges and verified certificates — built for every Indian school student.</p>
            <div className='animate-fadeUp delay-400' style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'flex-start' }}>
              <Link href='/courses' className='btn-primary' style={{ fontSize: '0.95rem', padding: '0.8rem 1.75rem' }}>Explore Courses →</Link>
              <Link href='/admin-login' style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.8rem 1.75rem', background: 'rgba(15,23,42,0.04)', color: '#0F172A', border: '1px solid rgba(15,23,42,0.12)', borderRadius: 'var(--radius-full)', fontFamily: 'DM Sans', fontWeight: 700, fontSize: '0.95rem', transition: 'all 0.2s' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(15,23,42,0.08)' }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(15,23,42,0.04)' }}>School Login →</Link>
            </div>
          </div>
          <div style={{ flexShrink: 0, position: 'relative', zIndex: 2 }}>
            <SimuRobot width={400} />
          </div>
        </div>
      </section>
    </div>
  )
}
