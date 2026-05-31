'use client'
import React from 'react'
import dynamic from 'next/dynamic'
const Spline = dynamic(() => import('@splinetool/react-spline'), { ssr: false })
interface SplineSceneProps { scene: string; className?: string }
export function SplineScene({ scene, className }: SplineSceneProps) {
  return React.createElement(Spline, { scene, className })
}