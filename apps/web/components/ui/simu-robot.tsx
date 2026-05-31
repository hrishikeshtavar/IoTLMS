'use client'

import { useEffect, useRef } from 'react'

export function SimuRobot({ width = 380 }: { width?: number }) {
  const height = Math.round(width * (902 / 682))
  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef       = useRef<number>(0)
  const animRef      = useRef<any>(null)
  const wrapRef      = useRef<SVGGElement | null>(null)
  const S            = useRef({ mx: 0, my: 0, ex: 0, ey: 0 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const onMove = (e: MouseEvent) => { S.current.mx = e.clientX; S.current.my = e.clientY }
    window.addEventListener('mousemove', onMove, { passive: true })

    import('lottie-web').then((mod) => {
      const lottie = (mod as any).default ?? mod
      const anim   = lottie.loadAnimation({
        container, renderer: 'svg', loop: true, autoplay: true,
        path: '/simu-robot.json',
      })
      animRef.current = anim

      anim.addEventListener('DOMLoaded', () => {
        // Seed cursor to robot centre
        const r = container.getBoundingClientRect()
        S.current.mx = r.left + r.width / 2
        S.current.my = r.top  + r.height / 2

        // ── find the eye layer element ───────────────────────────────
        // Primary: lottie renderer API  (works on lottie-web ≥ 5.7)
        let eyeEl: SVGGElement | null =
          anim.renderer?.elements?.[0]?.layerElement ?? null

        // Fallback A: elements may live one level deeper in some builds
        if (!eyeEl)
          eyeEl = anim.renderer?.elements?.[0]?.baseElement ?? null

        // Fallback B: query the SVG directly.
        // Lottie renders layers as siblings inside a root <g>.
        // elements[0] = eyes layer = LAST <g> child of SVG root
        // (last because lottie appends in layers-array order and the
        //  eyes layer, being index 0, is painted on top = last in DOM).
        if (!eyeEl) {
          const svg = container.querySelector('svg')
          const svgRoot = svg?.querySelector(':scope > g') as SVGGElement | null
          if (svgRoot) {
            const children = Array.from(svgRoot.children) as SVGGElement[]
            eyeEl = children[children.length - 1] ?? null   // last = top layer
          }
        }

        console.log('[SimuRobot] eyeEl found:', !!eyeEl, eyeEl)
        if (!eyeEl) return

        const parent = eyeEl.parentElement
        if (!parent) return

        // ── wrap with appendChild only — zero insertBefore calls ─────
        const wrap = document.createElementNS('http://www.w3.org/2000/svg', 'g')
        wrap.id = 'simu-eye-wrap'
        wrap.appendChild(eyeEl)  // auto-detaches eyeEl from parent
        parent.appendChild(wrap) // re-attaches wrap at end (eyes stay on top)
        wrapRef.current = wrap
        console.log('[SimuRobot] wrap created and mounted')
      })
    })

    // ── rAF loop ───────────────────────────────────────────────────────
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const tick = () => {
      const s    = S.current
      const rect = container.getBoundingClientRect()

      if (rect.width > 0 && wrapRef.current) {
        const cx = rect.left + rect.width  * 0.5
        const cy = rect.top  + rect.height * 0.5
        const nx = Math.max(-1, Math.min(1, (s.mx - cx) / (window.innerWidth  * 0.5)))
        const ny = Math.max(-1, Math.min(1, (s.my - cy) / (window.innerHeight * 0.5)))

        s.ex = lerp(s.ex, nx * 25, 0.15)
        s.ey = lerp(s.ey, ny * 16, 0.15)

        wrapRef.current.setAttribute(
          'transform',
          `translate(${s.ex.toFixed(2)} ${s.ey.toFixed(2)})`,
        )
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', onMove)
      animRef.current?.destroy?.()
      wrapRef.current = null
    }
  }, [])

  return (
    <div ref={containerRef} style={{ width: `${width}px`, height: `${height}px` }} />
  )
}

export default SimuRobot
