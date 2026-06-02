'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import Logo from './Logo'

type SectionNavProps = {
  href: string
  badge: string
  right: ReactNode
  leftAction?: ReactNode
  leftActionHref?: string
  leftActionOnClick?: () => void
  leftActionLabel?: string
  className?: string
}

export default function SectionNav({
  href,
  badge,
  right,
  leftAction,
  leftActionHref,
  leftActionOnClick,
  leftActionLabel,
  className,
}: SectionNavProps) {
  const leftActionNode = leftAction ? (
    leftAction
  ) : leftActionHref ? (
    <Link href={leftActionHref} className="sl-nav-link">
      {leftActionLabel}
    </Link>
  ) : leftActionOnClick ? (
    <button type="button" onClick={leftActionOnClick} className="sl-nav-link">
      {leftActionLabel}
    </button>
  ) : null

  return (
    <nav className={className ?? 'sl-nav'} style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
      <div className="sl-nav-inner" style={{ gap: 20 }}>
        <Link href={href} className="sl-logo">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Logo width={72} />
            <div style={{ width: 1, height: 42, background: 'rgba(0,0,0,0.06)', margin: '0 8px' }} />
            <div>
              <div className="sl-logo-name">SimuLearning</div>
              <div className="sl-logo-sub">by SimuSoft Technologies</div>
            </div>
          </div>
        </Link>

        {leftActionNode}

        <span style={{ padding: '3px 10px', background: 'rgba(26,115,232,0.12)', color: '#1A73E8', borderRadius: 999, fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
          {badge}
        </span>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {right}
        </div>
      </div>
    </nav>
  )
}