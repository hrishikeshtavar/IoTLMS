import Image from 'next/image'

export default function Logo({ width = 96, alt = 'SimuLearning' }: { width?: number; alt?: string }) {
  return (
    // Use a plain img so the public path works in both client and server components
    <img src="/icons/simu-logo.svg" alt={alt} width={width} style={{ height: 'auto', display: 'block' }} />
  )
}
