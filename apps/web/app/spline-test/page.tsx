'use client'
import { SimuRobot } from '@/components/ui/simu-robot'
export default function SplineTest() {
  return (
    <div style={{ width:'100vw', height:'100vh', background:'#0D1B2E', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ width: 380 }}>
        <SimuRobot />
      </div>
    </div>
  )
}
