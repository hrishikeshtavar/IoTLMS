'use client'
import React from 'react'
interface SplineSceneProps { scene: string; className?: string }
export function SplineScene({ className }: SplineSceneProps) {
  return React.createElement('div', { className })
}