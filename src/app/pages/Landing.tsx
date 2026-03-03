import { useState } from 'react';
import { Button } from '../components/Button';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { TopicChip } from '../components/TopicChip';
import { 
  Play, 
  Check, 
  Wifi, 
  FlaskConical, 
  Globe, 
  CheckCircle2, 
  Award, 
  Building,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { Link } from 'react-router';

export default function Landing() {
  const [showPassword, setShowPassword] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const features = [
    {
      icon: '📡',
      title: 'Offline Learning',
      description: 'Download courses, watch videos, take quizzes without internet',
    },
    {
      icon: '🧪',
      title: 'Lab Simulator',
      description: 'Browser-based Wokwi + circuit simulator, no hardware needed',
    },
    {
      icon: '🌐',
      title: 'Multilingual',
      description: 'Full support for English, Hindi (हिंदी), and Marathi (मराठी)',
    },
    {
      icon: '✅',
      title: 'Auto-graded Quizzes',
      description: 'MCQs, code labs, fill-in-the-blank with instant feedback',
    },
    {
      icon: '🎓',
      title: 'Completion Certificates',
      description: 'Branded PDF certificates auto-generated on completion',
    },
    {
      icon: '🏫',
      title: 'White-labeled',
      description: 'Your school logo, colors, and custom domain — zero extra cost',
    },
  ];

  const topics = [
    { name: 'Arduino/AVR', color: 'linear-gradient(135deg, #4CAF50, #66BB6A)' },
    { name: 'Raspberry Pi', color: 'linear-gradient(135deg, #C2185B, #D81B60)' },
    { name: 'ARM Cortex', color: 'linear-gradient(135deg, #9C27B0, #AB47BC)' },
    { name: 'RISC-V', color: 'linear-gradient(135deg, #E91E63, #F06292)' },
    { name: 'Intel 8051', color: 'linear-gradient(135deg, #FF5722, #FF7043)' },
    { name: 'IoT Protocols', color: 'linear-gradient(135deg, #1A73E8, #42A5F5)' },
    { name: 'PCB Design', color: 'linear-gradient(135deg, #00BCD4, #26C6DA)' },
    { name: 'Edge AI', color: 'linear-gradient(135deg, #00ACC1, #00BCD4)' },
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: '₹2,999',
      period: '/year',
      features: ['100 students', '10 courses', 'English only', 'Email support'],
      highlighted: false,
    },
    {
      name: 'School',
      price: '₹8,999',
      period: '/year',
      features: ['500 students', 'Unlimited courses', '3 languages', 'Priority support'],
      highlighted: true,
      badge: 'Most Popular',
    },
    {
      name: 'Institution',
      price: '₹19,999',
      period: '/year',
      features: ['5,000 students', 'Custom domain', 'API access', 'Dedicated support'],
      highlighted: false,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      features: ['Unlimited students', 'On-premise option', 'Custom features', '24/7 support'],
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[var(--color-surface)] border-b border-[var(--color-border)] h-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white font-bold">
              I
            </div>
            <span className="font-bold text-[var(--color-text-primary)] text-xl">IoTLearn</span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-body text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]">
              Features
            </a>
            <a href="#courses" className="text-body text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]">
              Courses
            </a>
            <a href="#pricing" className="text-body text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]">
              Pricing
            </a>
            <a href="#about" className="text-body text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]">
              About
            </a>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
            <Button variant="ghost" size="medium" onClick={() => setShowLogin(!showLogin)}>
              Sign In
            </Button>
            <Link to="/">
              <Button variant="accent" size="medium" className="hidden md:inline-flex">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 1px, transparent 1px),
              radial-gradient(circle at 60% 80%, rgba(255,255,255,0.05) 1px, transparent 1px),
              radial-gradient(circle at 80% 30%, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px, 60px 60px, 50px 50px',
          }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Hero Content */}
            <div className="text-white">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-sm)] bg-white/10 backdrop-blur-sm mb-6">
                <span className="text-xl">🔬</span>
                <span className="text-sm font-medium">India's #1 IoT LMS</span>
              </div>
              
              <h1 className="text-[40px] md:text-[56px] leading-tight mb-4">
                Learn IoT. Build Real Things.
              </h1>
              
              <p className="text-lg md:text-xl text-white/85 mb-8">
                Hands-on courses in Arduino, Raspberry Pi, ARM, RISC-V and more — delivered in English, Hindi & Marathi.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/">
                  <Button variant="primary" size="large" className="bg-white text-[var(--color-primary)] hover:bg-white/90 w-full sm:w-auto">
                    Start Free Trial
                  </Button>
                </Link>
                <Button variant="secondary" size="large" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                  <Play className="w-4 h-4" />
                  Watch Demo
                </Button>
              </div>
              
              {/* Trust Strip */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <img
                    src="https://images.unsplash.com/photo-1758270705641-acf09b68a91f?w=100"
                    alt="Student"
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1770967004881-5e8795cb5fde?w=100"
                    alt="Student"
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1764720573370-5008f1ccc9fa?w=100"
                    alt="Student"
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  />
                </div>
                <p className="text-sm text-white/80">Join 2,000+ students learning IoT</p>
              </div>
            </div>

            {/* Right: Dashboard Mockup or Login Card */}
            <div className="relative">
              {showLogin ? (
                <LoginCard onClose={() => setShowLogin(false)} />
              ) : (
                <div className="bg-[var(--color-surface)] rounded-[var(--radius-xl)] shadow-4 p-6 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="mb-4">
                    <h3 className="mb-4">Dashboard Overview</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[var(--color-surface-alt)] rounded-lg p-3">
                        <div className="text-[24px] font-bold text-[var(--color-primary)]">12</div>
                        <div className="text-caption text-[var(--color-text-secondary)]">Courses</div>
                      </div>
                      <div className="bg-[var(--color-surface-alt)] rounded-lg p-3">
                        <div className="text-[24px] font-bold text-[var(--color-success)]">85%</div>
                        <div className="text-caption text-[var(--color-text-secondary)]">Progress</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <TopicChip topic="Arduino" size="small" />
                    <TopicChip topic="IoT" size="small" />
                    <TopicChip topic="Edge AI" size="small" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-[var(--color-surface)] border-y border-[var(--color-border)] py-6">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:divide-x divide-[var(--color-border)]">
            <StatItem number="2,000+" label="Students" />
            <StatItem number="50+" label="IoT Courses" />
            <StatItem number="3" label="Languages" />
            <StatItem number="99.5%" label="Uptime" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-[var(--color-surface)]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-center mb-12">Everything Your School Needs</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center md:text-left">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="mb-2">{feature.title}</h3>
                <p className="text-body text-[var(--color-text-secondary)]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section id="courses" className="py-16 md:py-24 bg-[#EEF5FF]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="mb-8">What You'll Learn</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {topics.map((topic, index) => (
              <div
                key={index}
                className="h-24 rounded-[var(--radius-lg)] p-4 flex items-center justify-center text-white font-semibold text-center shadow-1 hover:shadow-2 transition-shadow"
                style={{ background: topic.color }}
              >
                {topic.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-24 bg-[var(--color-surface)]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-center mb-12">Choose Your Plan</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`bg-[var(--color-surface)] rounded-[var(--radius-lg)] p-6 relative ${
                  plan.highlighted
                    ? 'border-2 border-[var(--color-primary)] shadow-2'
                    : 'border border-[var(--color-border)] shadow-1'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[var(--color-primary)] text-white text-xs font-medium rounded-[var(--radius-sm)]">
                    {plan.badge}
                  </div>
                )}
                <h3 className="mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-[32px] font-bold text-[var(--color-text-primary)]">{plan.price}</span>
                  <span className="text-[var(--color-text-secondary)]">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-body">
                      <Check className="w-5 h-5 text-[var(--color-success)] flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.highlighted ? 'accent' : 'secondary'}
                  size="medium"
                  className="w-full"
                >
                  Get Started
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-12 bg-gradient-to-r from-[var(--color-accent)] to-[#FF8F00]">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center text-white">
          <h2 className="mb-4">Ready to Transform Your IoT Education?</h2>
          <p className="text-lg mb-6 opacity-90">Get started for ₹2,999/year</p>
          <Link to="/">
            <Button variant="primary" size="large" className="bg-white text-[var(--color-accent)] hover:bg-white/90">
              Start Free Trial
              <ChevronRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--color-primary-dark)] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Logo & Tagline */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold">
                  I
                </div>
                <span className="font-bold text-xl">IoTLearn</span>
              </div>
              <p className="text-sm text-white/70">Empowering the next generation of IoT innovators</p>
            </div>

            {/* Product */}
            <div>
              <h3 className="text-body font-semibold mb-3">Product</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#courses" className="hover:text-white">Courses</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-body font-semibold mb-3">Support</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-body font-semibold mb-3">Company</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/70">© 2026 IoTLearn. All rights reserved.</p>
            <div className="text-sm text-white/70">Powered by IoTLearn</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatItem({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center md:text-left md:pl-6 first:pl-0">
      <div className="text-[28px] md:text-[32px] font-bold text-[var(--color-primary)]">{number}</div>
      <div className="text-caption text-[var(--color-text-secondary)]">{label}</div>
    </div>
  );
}

function LoginCard({ onClose }: { onClose: () => void }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-[var(--color-surface)] rounded-[var(--radius-xl)] shadow-4 p-8 max-w-md mx-auto">
      {/* School Logo Placeholder */}
      <div className="w-20 h-20 mx-auto mb-6 rounded-full border-2 border-dashed border-[var(--color-border)] flex items-center justify-center">
        <Building className="w-8 h-8 text-[var(--color-text-secondary)]" />
      </div>

      <h3 className="text-center mb-6">Welcome back</h3>

      {/* Email/Phone Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
          Email or Phone Number
        </label>
        <input
          type="text"
          className="w-full h-12 px-4 rounded-[var(--radius-md)] border border-[var(--color-border)] focus:border-[var(--color-border-focus)] focus:outline-none bg-[var(--color-surface)]"
          placeholder="Enter your email or phone"
        />
      </div>

      {/* Password Input */}
      <div className="mb-2">
        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            className="w-full h-12 px-4 pr-12 rounded-[var(--radius-md)] border border-[var(--color-border)] focus:border-[var(--color-border-focus)] focus:outline-none bg-[var(--color-surface)]"
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="text-right mb-6">
        <a href="#" className="text-sm text-[var(--color-primary)] hover:underline">
          Forgot Password?
        </a>
      </div>

      <Link to="/">
        <Button variant="primary" size="large" className="w-full mb-4">
          Sign In
        </Button>
      </Link>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-[var(--color-border)]" />
        <span className="text-caption text-[var(--color-text-secondary)]">or</span>
        <div className="flex-1 h-px bg-[var(--color-border)]" />
      </div>

      <Button variant="ghost" size="large" className="w-full mb-6">
        Sign in with OTP
      </Button>

      <p className="text-center text-sm text-[var(--color-text-secondary)]">
        New school?{' '}
        <a href="#" className="text-[var(--color-primary)] hover:underline">
          Contact us →
        </a>
      </p>
    </div>
  );
}
