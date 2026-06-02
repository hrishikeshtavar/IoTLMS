'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from './Logo'
import { getUser, logout } from '@/lib/auth'

const DEFAULT_LOCALE = 'en'

export default function NavBar() {
  const pathname = usePathname()
  const [locale, setLocale] = useState<string>(DEFAULT_LOCALE)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('simulearning_locale')
      if (saved && ['en','hi','mr'].includes(saved)) setLocale(saved)
    } catch {}
    setUser(getUser())
  }, [pathname])

  function switchLocale(l: string) {
    try { localStorage.setItem('simulearning_locale', l) } catch {}
    setLocale(l)
    window.dispatchEvent(new CustomEvent('simu:locale-changed', { detail: l }))
  }

  if (pathname && (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/super-admin') ||
    pathname === '/admin-login'
  )) return null

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

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/courses" className="sl-nav-link">Courses</Link>
          <div style={{ display: 'flex', gap: 4 }}>
            {(['en', 'mr', 'hi'] as string[]).map(l => (
              <button
                key={l}
                onClick={() => switchLocale(l)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 999,
                  border: '1.5px solid',
                  borderColor: locale === l ? 'var(--primary)' : 'var(--border)',
                  background: locale === l ? 'var(--primary)' : 'transparent',
                  color: locale === l ? '#fff' : 'var(--text2)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: l !== 'en' ? 'Noto Sans Devanagari, DM Sans' : 'DM Sans',
                  transition: 'all 0.15s',
                }}
              >
                {l === 'en' ? 'English' : l === 'mr' ? 'मराठी' : 'हिंदी'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {user ? (
            <>
              <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.75rem', borderRadius: '999px', background: 'rgba(0,188,212,0.1)', color: 'var(--primary)', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none' }}>
                <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800 }}>
                  {user.name?.[0]?.toUpperCase() ?? 'U'}
                </span>
                {user.name?.split(' ')[0]}
              </Link>
              <button onClick={() => logout()} className="sl-nav-cta" style={{ border: 'none' }}>Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/login" className="sl-nav-link">Student Login</Link>
              <Link href="/admin-login" className="sl-nav-cta">School Login</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
