'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login, getUser } from '../lib/auth';

const SimuSoftLogo = ({ height = 32 }: { height?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" height={height}
    viewBox="0 0 14400 6000"
    style={{ shapeRendering: 'geometricPrecision', imageRendering: 'optimizeQuality' as React.CSSProperties['imageRendering'], fillRule: 'evenodd' }}>
    <defs>
      <style>{`.al0{fill:#2B2A29;fill-rule:nonzero}.al1{fill:var(--primary);fill-rule:nonzero}.al2{fill:url(#alg)}.al3{fill:#FEFEFE;fill-rule:nonzero}.ast0{stroke:#FEFEFE;stroke-width:26.46;stroke-linecap:square;stroke-linejoin:round;stroke-miterlimit:5.01585;fill:none;fill-rule:nonzero}`}</style>
      <linearGradient id="alg" gradientUnits="userSpaceOnUse" x1="3333.69" y1="162.8" x2="4519.22" y2="1736.95">
        <stop offset="0" stopColor="#B0D35A"/>
        <stop offset="0.49" stopColor="#3FAB99"/>
        <stop offset="1" stopColor="var(--secondary)"/>
      </linearGradient>
    </defs>
    <path className="al0" d="M2637.45 2948.38l-360.37 -145.77c-137.54,-56.87 -230.14,-130.22 -277.84,-220.09 -47.68,-89.86 -63.27,-202.65 -46.77,-338.36 27.53,-201.73 97.67,-336.98 210.44,-405.74 112.79,-68.77 288.39,-103.16 526.81,-103.16 236.57,0 442.88,25.67 618.94,77.03l-41.26 283.33c-165.07,-5.51 -361.29,-8.25 -588.69,-8.25 -111.87,-1.85 -187.97,6.87 -228.32,26.14 -40.34,19.24 -66.94,71.05 -79.78,155.43 -9.16,62.33 -4.12,105.89 15.13,130.66 19.27,24.77 64.65,50.88 136.16,78.4l341.1 132.04c144.89,56.84 240.25,127.89 286.1,213.17 45.86,85.29 59.61,202.21 41.26,350.76 -27.51,209.06 -94.89,349.82 -202.17,422.25 -107.29,72.43 -289.31,108.65 -546.05,108.65 -212.74,0 -430.06,-24.75 -651.96,-74.27l44.01 -299.84c388.79,9.17 585.93,13.76 591.43,13.76 128.38,0 215.49,-12.4 261.34,-37.15 45.84,-24.74 75.18,-77.49 88.03,-158.18 7.33,-62.34 1.84,-105.43 -16.5,-129.28 -18.34,-23.84 -58.69,-47.69 -121.04,-71.53zm1079.59 720.74l-404.38 0 189.82 -1356.2 404.37 0 -189.81 1356.2zm757.74 -1356.2l0 244.85c99.03,-99.04 191.19,-171.02 276.47,-215.95 85.28,-44.93 174.68,-67.39 268.21,-67.39 99.03,0 176.96,22 233.82,66.02 56.85,44.01 89.86,106.36 99.04,187.05 170.55,-168.71 341.11,-253.07 511.65,-253.07 124.71,0 215.94,34.38 273.7,103.17 57.78,68.76 78.42,162.73 61.9,281.94l-140.29 1009.58 -404.37 0 126.54 -899.54c7.34,-56.85 2.74,-96.28 -13.76,-118.28 -16.5,-22.01 -44.93,-33.01 -85.28,-33.01 -45.84,0 -94.44,14.67 -145.79,44.02 -51.36,29.33 -121.04,83.43 -209.06,162.29l-118.3 844.52 -390.61 0 123.78 -899.54c9.18,-55.03 6.42,-93.98 -8.25,-116.91 -14.67,-22.92 -44.02,-34.38 -88.02,-34.38 -47.68,0 -97.66,14.21 -149.93,42.63 -52.27,28.42 -120.57,79.32 -204.94,152.67l-118.29 855.53 -404.37 0 189.81 -1356.2 316.34 0zm3288.53 0l-187.05 1356.2 -313.6 0 0 -255.82c-201.73,194.39 -397.04,291.57 -585.93,291.57 -130.22,0 -225.11,-33.92 -284.71,-101.78 -59.61,-67.85 -80.24,-161.38 -61.9,-280.58l140.29 -1009.59 407.13 0 -129.3 899.56c-7.33,55.01 -3.21,93.97 12.4,116.92 15.58,22.91 45.38,34.36 89.4,34.36 58.67,0 115.98,-15.57 171.92,-46.76 55.93,-31.17 130.67,-86.18 224.2,-165.04l115.53 -839.04 401.62 0zm887.04 635.46l-360.36 -145.77c-137.56,-56.87 -230.16,-130.22 -277.85,-220.09 -47.68,-89.86 -63.26,-202.65 -46.76,-338.36 27.52,-201.73 97.67,-336.98 210.44,-405.74 112.79,-68.77 288.39,-103.16 526.8,-103.16 236.56,0 442.89,25.67 618.93,77.03l-41.26 283.33c-165.05,-5.51 -361.27,-8.25 -588.68,-8.25 -111.88,-1.85 -187.97,6.87 -228.32,26.14 -40.35,19.24 -66.93,71.05 -79.77,155.43 -9.17,62.33 -4.13,105.89 15.13,130.66 19.25,24.77 64.64,50.88 136.15,78.4l341.11 132.04c144.88,56.84 240.24,127.89 286.09,213.17 45.85,85.29 59.6,202.21 41.26,350.76 -27.5,209.06 -94.9,349.82 -202.17,422.25 -107.28,72.43 -289.31,108.65 -546.05,108.65 -212.73,0 -430.06,-24.75 -651.96,-74.27l44.02 -299.84c388.79,9.17 585.92,13.76 591.43,13.76 128.37,0 215.48,-12.4 261.33,-37.15 45.85,-24.74 75.19,-77.49 88.02,-158.18 7.33,-62.34 1.85,-105.43 -16.5,-129.28 -18.34,-23.84 -58.68,-47.69 -121.03,-71.53zm1478.47 -673.95c251.24,0 426.38,56.84 525.41,170.54 99.04,113.7 130.2,301.69 93.54,563.92 -34.85,254.93 -110.5,434.66 -226.94,539.18 -116.47,104.55 -297.56,156.8 -543.31,156.8 -249.4,0 -425,-56.85 -526.78,-170.55 -101.8,-113.7 -134.34,-299.85 -97.65,-558.43 36.66,-256.75 112.77,-437.82 228.31,-543.28 115.53,-105.46 298.01,-158.18 547.42,-158.18zm-2.75 305.35c-111.88,0 -192.1,28.41 -240.69,85.28 -48.61,56.83 -84.83,171.47 -108.66,343.83 -22.01,157.73 -19.26,262.28 8.24,313.62 27.51,51.34 94.45,77.02 200.82,77.02 110.04,0 188.88,-28.88 236.56,-86.65 47.7,-57.77 83.45,-170.11 107.28,-336.99 23.85,-157.71 21.56,-263.16 -6.86,-316.35 -28.42,-53.18 -94,-79.76 -196.69,-79.76zm1896.6 -594.19l-242.07 0c-71.53,0 -123.34,12.38 -155.43,37.15 -32.09,24.74 -53.63,72.88 -64.64,144.42l-19.26 145.76 371.38 0 -35.78 272.36 -376.86 0 -181.82 1418.14c-41.36,322.73 -200.15,485.68 -480.52,534.68 -79.23,13.83 -205.69,26.02 -379.06,36.48l45.22 -309.48 206.05 -50.73c83.77,-20.61 131.13,-82.25 164.96,-131.09 33.8,-48.77 58.41,-127.38 72.47,-244.11l151.07 -1253.89 -233.82 0 33.01 -258.59 239.33 -13.77 30.25 -211.79c38.52,-275.08 197.15,-412.63 475.9,-412.63 181.55,0 330.11,9.16 445.64,27.5l-66.02 269.59zm493.66 599.69l-90.77 649.19c-7.33,51.36 -3.21,85.73 12.37,103.17 15.58,17.43 50.89,26.12 105.9,26.12l181.57 0 19.25 286.09c-97.19,34.84 -223.73,52.28 -379.61,52.28 -128.37,0 -223.74,-35.31 -286.1,-105.91 -62.34,-70.61 -84.36,-168.26 -66.02,-292.98l104.55 -717.96 -228.21 0 36.84 -269.95 229.86 -2.41 55.03 -379.6 398.87 0 -52.28 379.6 374.13 0 -38.5 272.36 -376.88 0z"/>
    <path className="al1" d="M1965.05 4410.25l-126.36 -45.95c-45.95,-17.23 -77.22,-41.33 -93.82,-72.28 -16.59,-30.96 -21.7,-70.36 -15.31,-118.23 10.2,-70.2 33.82,-116.63 70.84,-139.28 37.01,-22.65 94.77,-33.99 173.27,-33.99 81.69,0 150.62,7.66 206.78,22.97l-12.44 84.26c-75.31,-2.57 -139.78,-3.84 -193.38,-3.84 -20.43,0 -34.95,0.16 -43.56,0.47 -8.61,0.33 -18.99,1.76 -31.12,4.31 -12.12,2.57 -20.73,6.71 -25.84,12.45 -5.1,5.74 -9.89,13.56 -14.36,23.45 -4.47,9.89 -7.98,22.83 -10.53,38.77 -3.83,27.44 -2.07,45.96 5.26,55.53 7.34,9.57 24.74,19.14 52.18,28.72l122.53 44.04c49.15,17.87 81.54,41.47 97.17,70.84 15.63,29.35 19.94,69.56 12.92,120.62 -9.57,72.11 -32.39,120.3 -68.44,144.55 -36.06,24.25 -97.49,36.37 -184.28,36.37 -72.76,0 -144.24,-7.34 -214.44,-22.01l13.4 -87.12c111.69,2.56 177.1,3.83 196.25,3.83 51.69,0 86.47,-5.1 104.34,-15.31 17.87,-10.22 29.04,-33.18 33.51,-68.93 3.83,-27.44 2.07,-46.11 -5.26,-56 -7.34,-9.89 -23.78,-19.31 -49.31,-28.24zm383.88 -410.69l52.65 0c11.49,0 19.95,3.2 25.37,9.57 5.42,6.39 7.5,15.01 6.22,25.85l-6.7 52.65c-3.83,21.06 -15.96,31.59 -36.37,31.59l-52.66 0c-24.25,0 -34.78,-12.12 -31.59,-36.37l7.66 -51.7c1.91,-21.06 13.72,-31.59 35.42,-31.59zm-7.66 672.99l-115.83 0 66.06 -469.08 114.87 0 -65.1 469.08z"/>
    <path className="al2" d="M4588.77 1177.76c0,4.52 0,9.34 0.27,13.87 0.26,4.81 0.53,9.33 0.53,14.13 0,4.83 -0.27,9.35 -0.53,14.14 -0.27,4.55 -0.27,9.35 -0.27,13.89l202.3 125.98 -124.1 299.43 -232.18 -53.11c-12.57,13.63 -25.63,26.69 -39.26,38.97l53.11 232.46 -299.43 124.1 -125.97 -202.29c-4.55,0 -9.35,0 -13.89,0.26 -4.8,0.26 -9.32,0.53 -14.12,0.53 -4.84,0 -9.35,-0.27 -14.16,-0.53 -4.53,-0.26 -9.34,-0.26 -13.88,-0.26l-125.98 202.29 -299.43 -124.1 53.11 -232.46c-13.62,-12.28 -26.69,-25.34 -38.97,-38.97l-232.46 53.11 -124.11 -299.43 202.3 -125.98c0,-4.54 0,-9.34 -0.27,-13.89 -0.26,-4.79 -0.53,-9.31 -0.53,-14.14 0,-4.8 0.27,-9.32 0.53,-14.13 0.27,-4.53 0.27,-9.35 0.27,-13.87l-202.3 -125.99 124.11 -299.43 232.46 53.1c12.28,-13.6 25.35,-26.68 38.97,-39.24l-53.11 -232.18 299.43 -124.11 125.98 202.3c4.54,0 9.35,0 13.88,-0.27 4.81,-0.26 9.32,-0.53 14.16,-0.53 4.8,0 9.32,0.27 14.12,0.53 4.54,0.27 9.34,0.27 13.89,0.27l125.97 -202.3 299.43 124.11 -53.11 232.18c13.63,12.56 26.69,25.64 39.26,39.24l232.18 -53.1 124.1 299.43 -202.3 125.99z"/>
    <path className="al3" d="M3995.22 1013.48c26.51,0 51.46,5.06 74.85,15.17 23.38,9.96 43.8,23.74 61.08,41.18 17.44,17.29 31.23,37.71 41.18,61.09 10.12,23.39 15.18,48.34 15.18,74.85 0,26.52 -5.06,51.48 -15.18,74.86 -9.95,23.38 -23.74,43.81 -41.18,61.09 -17.28,17.44 -37.7,31.06 -61.08,41.17 -23.39,10.13 -48.34,15.18 -74.85,15.18 -26.53,0 -51.48,-5.05 -74.87,-15.18 -23.38,-10.11 -43.79,-23.73 -61.07,-41.17 -17.45,-17.28 -31.06,-37.71 -41.19,-61.09 -10.12,-23.38 -15.18,-48.34 -15.18,-74.86 0,-26.51 5.06,-51.46 15.18,-74.85 10.13,-23.38 23.74,-43.8 41.19,-61.09 17.28,-17.44 37.69,-31.22 61.07,-41.18 23.39,-10.11 48.34,-15.17 74.87,-15.17z"/>
    <path className="ast0" d="M4139.59 1552.76l28.74 66.39m-321.38 -66.39l-28.74 66.39m350.12 -66.39c-9.31,21.51 -31.28,36.54 -56.74,36.54l-209.19 0c-25.45,0 -47.43,-15.03 -56.74,-36.54"/>
  </svg>
);

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [role, setRole] = useState<'admin' | 'super'>('admin');

  useEffect(() => {
    const user = getUser();
    if (user) {
      if (user.role === 'super_admin') router.push('/super-admin');
      else if (user.role === 'admin') router.push('/admin');
      else router.push('/dashboard');
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { ok, data } = await login(email, password, role === 'super' ? 'super_admin' : 'admin');
      if (!ok) {
        setError(data.message || 'Invalid credentials');
      } else {
        const userRole = data?.user?.role;
        if (userRole === 'super_admin') router.push('/super-admin');
        else if (userRole === 'admin') router.push('/admin');
        else setError('This login is for school admins and super admins only. Students should use the Student Login.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: "'DM Sans', sans-serif", display: 'flex', flexDirection: 'column' }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@700;800;900&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float { from{transform:translateY(0)} to{transform:translateY(-12px)} }
        @keyframes gradShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        .al-input:focus { border-color:var(--primary) !important; box-shadow:0 0 0 4px rgba(26,115,232,0.1) !important; outline:none; }
        .al-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 10px 28px rgba(26,115,232,0.35) !important; }
        .al-btn:disabled { opacity:0.7; cursor:not-allowed; }
      `}</style>

      {/* NAV */}
      <nav style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)', padding: '0 2.5rem', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 12px rgba(26,115,232,0.06)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <SimuSoftLogo height={30} />
          <div style={{ width: 1, height: 24, background: '#D0E4F0', margin: '0 2px' }} />
          <div>
            <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: '1rem', color: 'var(--primary)', lineHeight: 1 }}>SimuLearning</div>
            <div style={{ fontSize: '0.58rem', color: 'var(--text3)', letterSpacing: '0.07em', fontWeight: 700 }}>by SimuSoft Technologies</div>
          </div>
        </Link>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link href="/login" style={{ padding: '7px 16px', borderRadius: 9, color: 'var(--text2)', fontWeight: 700, fontSize: '0.83rem', textDecoration: 'none' }}>Student Login</Link>
          <Link href="/" style={{ padding: '7px 14px', borderRadius: 8, color: 'var(--text2)', fontWeight: 700, fontSize: '0.83rem', textDecoration: 'none' }}>← Back to Home</Link>
        </div>
      </nav>

      {/* MAIN */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', overflow: 'hidden' }}>

        {/* BG chip */}
        <svg style={{ position: 'absolute', top: '8%', right: '6%', opacity: 0.09, animation: 'float 5s ease-in-out infinite alternate', pointerEvents: 'none' }} width="90" height="90" viewBox="0 0 90 90" fill="none">
          <rect x="22" y="22" width="46" height="46" rx="6" stroke="var(--primary)" strokeWidth="2.5" fill="rgba(26,115,232,0.06)"/>
          <rect x="30" y="30" width="30" height="30" rx="3" stroke="var(--secondary)" strokeWidth="2" fill="rgba(0,171,200,0.08)"/>
          {[33,45,57].map(x=><line key={x} x1={x} y1="22" x2={x} y2="10" stroke="#3FAB99" strokeWidth="2" strokeLinecap="round"/>)}
          {[33,45,57].map(x=><line key={x+'b'} x1={x} y1="68" x2={x} y2="80" stroke="#3FAB99" strokeWidth="2" strokeLinecap="round"/>)}
          {[33,45,57].map(y=><line key={y+'l'} x1="22" y1={y} x2="10" y2={y} stroke="var(--primary)" strokeWidth="2" strokeLinecap="round"/>)}
          {[33,45,57].map(y=><line key={y+'r'} x1="68" y1={y} x2="80" y2={y} stroke="var(--primary)" strokeWidth="2" strokeLinecap="round"/>)}
        </svg>

        <svg style={{ position: 'absolute', bottom: '10%', left: '5%', opacity: 0.08, animation: 'float 6s ease-in-out 1s infinite alternate', pointerEvents: 'none' }} width="80" height="60" viewBox="0 0 80 60" fill="none">
          <path d="M40 50 L40 52" stroke="var(--primary)" strokeWidth="4" strokeLinecap="round"/>
          <path d="M28 38 Q40 28 52 38" stroke="var(--primary)" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
          <path d="M18 28 Q40 12 62 28" stroke="var(--secondary)" strokeWidth="3" strokeLinecap="round" fill="none"/>
          <path d="M8 18 Q40 -4 72 18" stroke="#3FAB99" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        </svg>

        <div style={{ width: '100%', maxWidth: 420, animation: 'fadeUp 0.5s ease both' }}>

          {/* Gradient top bar */}
          <div style={{ height: 4, borderRadius: '12px 12px 0 0', background: 'linear-gradient(90deg,var(--primary),var(--secondary),#3FAB99,#B0D35A)', backgroundSize: '200%', animation: 'gradShift 4s ease infinite' }}/>

          <div style={{ background: '#fff', borderRadius: '0 0 20px 20px', padding: '36px 40px 32px', boxShadow: '0 8px 40px rgba(26,115,232,0.1)', border: '1px solid var(--border)', borderTop: 'none' }}>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg,var(--primary-light),#E0F5FA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', margin: '0 auto 12px', border: '1px solid var(--border)' }}>🏫</div>
              <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: '1.2rem', color: 'var(--text)', lineHeight: 1.2 }}>Admin Portal</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text3)', fontWeight: 600, marginTop: 4 }}>SimuLearning · SimuSoft Technologies</div>
            </div>

            {/* Role tabs */}
            <div style={{ display: 'flex', background: 'var(--primary-light)', borderRadius: 12, padding: 4, marginBottom: 24, border: '1px solid var(--border)' }}>
              {([{ k: 'admin', icon: '🏫', label: 'School Admin' }, { k: 'super', icon: '⚙️', label: 'Super Admin' }] as {k:'admin'|'super',icon:string,label:string}[]).map(r => (
                <div key={r.k} onClick={() => setRole(r.k)}
                  style={{ flex: 1, padding: '9px 8px', borderRadius: 9, background: role === r.k ? 'var(--primary)' : 'transparent', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', userSelect: 'none' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: role === r.k ? '#fff' : 'var(--text2)' }}>{r.icon} {r.label}</div>
                </div>
              ))}
            </div>

            {/* Role hint */}
            <div style={{ background: 'var(--primary-light)', borderRadius: 10, padding: '10px 14px', marginBottom: 20, border: '1px solid var(--border)', fontSize: '0.78rem', color: 'var(--text2)', lineHeight: 1.5 }}>
              {role === 'admin'
                ? '🏫 Sign in with your school administrator email. You will be taken to the school management dashboard.'
                : '⚙️ SimuSoft super admin access only. Grants access to all schools and platform-wide settings.'}
            </div>

            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '10px 14px', borderRadius: 10, fontSize: '0.875rem', marginBottom: 20, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span>⚠️</span><span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>
                  {role === 'admin' ? 'School Admin Email' : 'Super Admin Email'}
                </label>
                <input className="al-input" type="email" value={email} onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                  placeholder={role === 'admin' ? 'admin@yourschool.edu' : 'super@iotlearn.in'}
                  required
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 11, border: `1.5px solid ${focusedField === 'email' ? 'var(--primary)' : 'var(--border)'}`, fontSize: '0.95rem', fontFamily: 'inherit', background: 'var(--surface)', color: 'var(--text)', boxSizing: 'border-box', transition: 'all 0.2s' }}
                />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text2)' }}>Password</label>
                  <Link href="/forgot-password" style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Forgot?</Link>
                </div>
                <input className="al-input" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)}
                  placeholder="••••••••" required
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 11, border: `1.5px solid ${focusedField === 'password' ? 'var(--primary)' : 'var(--border)'}`, fontSize: '0.95rem', fontFamily: 'inherit', background: 'var(--surface)', color: 'var(--text)', boxSizing: 'border-box', transition: 'all 0.2s' }}
                />
              </div>
              <button type="submit" disabled={loading} className="al-btn"
                style={{ width: '100%', padding: '13px', borderRadius: 12, background: loading ? '#94B8D9' : 'linear-gradient(135deg,var(--primary),var(--secondary))', color: '#fff', fontWeight: 800, fontSize: '1rem', border: 'none', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 6px 20px rgba(26,115,232,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit' }}>
                {loading ? 'Signing in…' : <><span>{role === 'super' ? '⚙️' : '🏫'}</span> Sign In as {role === 'super' ? 'Super Admin' : 'School Admin'}</>}
              </button>
            </form>

            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>Not an admin? </span>
              <Link href="/login" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Student Login →</Link>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
            {['🔒 Secure access', '🏫 School admins only', '⚙️ SimuSoft super admin'].map(b => (
              <span key={b} style={{ fontSize: '0.72rem', color: '#B0C8D8', fontWeight: 600 }}>{b}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
