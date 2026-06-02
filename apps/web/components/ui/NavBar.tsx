'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from './Logo'

const DEFAULT_LOCALE = 'en'

export default function NavBar() {
  const pathname = usePathname()
  const [locale, setLocale] = useState<string>(DEFAULT_LOCALE)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('simulearning_locale')
      if (saved && ['en','hi','mr'].includes(saved)) setLocale(saved)
    } catch {}
  }, [])

  function switchLocale(l: string) {
    try {
      localStorage.setItem('simulearning_locale', l)
    } catch {}
    setLocale(l)
    // dispatch an event so pages can react if they listen
    window.dispatchEvent(new CustomEvent('simu:locale-changed', { detail: l }))
  }

  if (pathname && ['/dashboard', '/admin-login', '/super-admin', '/super-admin/profile'].includes(pathname)) return null

  return (
    <nav className="sl-nav">
      <div className="sl-nav-inner">
        <Link href="/" className="sl-logo">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Logo />
            <div style={{ width: 1, height: 48, background: 'rgba(0,0,0,0.06)', margin: '0 8px' }} />
            <div>
              <div className="sl-logo-name">SimuLearning</div>
              <div className="sl-logo-sub">by SimuSoft Technologies</div>
            </div>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/courses" className="sl-nav-link">Courses</Link>
          <button className="sl-nav-link" onClick={() => switchLocale(locale === 'en' ? 'hi' : locale === 'hi' ? 'mr' : 'en')}>
            {locale === 'en' ? 'हिं' : locale === 'hi' ? 'मरा' : 'EN'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link href="/login" className="sl-nav-link">Student Login</Link>
          <Link href="/admin-login" className="sl-nav-cta">School Login</Link>
        </div>
      </div>
    </nav>
  )
}
