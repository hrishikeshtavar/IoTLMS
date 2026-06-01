'use client'
import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function DottedSurface() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const W = rect.width  || window.innerWidth
    const H = rect.height || window.innerHeight
    const SEPARATION = 150, AMOUNTX = 40, AMOUNTY = 60
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, W / H, 1, 10000)
    camera.position.set(0, 355, 1220)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(W, H)
    renderer.setClearColor(0x000000, 0)
    const canvas = renderer.domElement
    canvas.style.position = 'absolute'
    canvas.style.top = '0'
    canvas.style.left = '0'
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    container.appendChild(canvas)
    const positions: number[] = [], colors: number[] = []
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        positions.push(ix * SEPARATION - (AMOUNTX * SEPARATION) / 2, 0, iy * SEPARATION - (AMOUNTY * SEPARATION) / 2)
        colors.push(0, 0, 0)
      }
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.setAttribute('color',    new THREE.Float32BufferAttribute(colors, 3))
    const material = new THREE.PointsMaterial({ size: 6, vertexColors: true, transparent: true, opacity: 0.55, sizeAttenuation: true })
    scene.add(new THREE.Points(geometry, material))
    let count = 0, rafId: number
    const animate = () => {
      rafId = requestAnimationFrame(animate)
      const pos = geometry.attributes.position.array as Float32Array
      let i = 0
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          pos[i * 3 + 1] = Math.sin((ix + count) * 0.3) * 50 + Math.sin((iy + count) * 0.5) * 50
          i++
        }
      }
      geometry.attributes.position.needsUpdate = true
      renderer.render(scene, camera)
      count += 0.1
    }
    const onResize = () => {
      const r = container.getBoundingClientRect()
      const nW = r.width || window.innerWidth
      const nH = r.height || window.innerHeight
      camera.aspect = nW / nH
      camera.updateProjectionMatrix()
      renderer.setSize(nW, nH)
    }
    window.addEventListener('resize', onResize)
    animate()
    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(rafId)
      scene.traverse(obj => { if (obj instanceof THREE.Points) { obj.geometry.dispose(); (obj.material as THREE.Material).dispose() } })
      renderer.dispose()
      if (container.contains(canvas)) container.removeChild(canvas)
    }
  }, [])

  return <div ref={containerRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }} />
}
