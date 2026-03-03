import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '../../components/Button';

type Language = 'en' | 'hi' | 'mr' | null;

export default function Onboarding() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const languages = [
    {
      code: 'en' as Language,
      flag: '🇬🇧',
      name: 'English',
      subtitle: 'Learn in English',
    },
    {
      code: 'hi' as Language,
      flag: '🇮🇳',
      name: 'हिंदी',
      subtitle: 'हिंदी में सीखें',
    },
    {
      code: 'mr' as Language,
      flag: '🇮🇳',
      name: 'मराठी',
      subtitle: 'मराठीत शिका',
    },
  ];

  return (
    <div className="min-h-screen bg-white max-w-[375px] mx-auto flex flex-col">
      {/* Illustration */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-b from-[#EEF5FF] to-white">
        <svg
          className="w-full max-w-[280px]"
          viewBox="0 0 280 280"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Robot Body */}
          <rect
            x="90"
            y="120"
            width="100"
            height="120"
            rx="12"
            fill="#1A73E8"
            opacity="0.1"
            stroke="#1A73E8"
            strokeWidth="2"
          />
          
          {/* Robot Head */}
          <rect
            x="100"
            y="80"
            width="80"
            height="60"
            rx="8"
            fill="white"
            stroke="#1A73E8"
            strokeWidth="2"
          />
          
          {/* Eyes */}
          <circle cx="125" cy="105" r="6" fill="#1A73E8" />
          <circle cx="155" cy="105" r="6" fill="#1A73E8" />
          
          {/* Antenna */}
          <line
            x1="140"
            y1="80"
            x2="140"
            y2="60"
            stroke="#1A73E8"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="140" cy="55" r="5" fill="#FF6F00" />
          
          {/* Circuit Board */}
          <rect
            x="110"
            y="160"
            width="60"
            height="50"
            rx="4"
            fill="white"
            stroke="#1A73E8"
            strokeWidth="2"
          />
          
          {/* Circuit Lines */}
          <line x1="120" y1="175" x2="160" y2="175" stroke="#1A73E8" strokeWidth="1.5" />
          <line x1="120" y1="185" x2="150" y2="185" stroke="#FF6F00" strokeWidth="1.5" />
          <line x1="130" y1="195" x2="160" y2="195" stroke="#1A73E8" strokeWidth="1.5" />
          <circle cx="125" cy="175" r="2" fill="#FF6F00" />
          <circle cx="155" cy="185" r="2" fill="#1A73E8" />
          <circle cx="145" cy="195" r="2" fill="#FF6F00" />
          
          {/* Arms */}
          <rect
            x="70"
            y="140"
            width="15"
            height="40"
            rx="4"
            fill="white"
            stroke="#1A73E8"
            strokeWidth="2"
          />
          <rect
            x="195"
            y="140"
            width="15"
            height="40"
            rx="4"
            fill="white"
            stroke="#1A73E8"
            strokeWidth="2"
          />
          
          {/* Legs */}
          <rect
            x="105"
            y="240"
            width="25"
            height="30"
            rx="4"
            fill="white"
            stroke="#1A73E8"
            strokeWidth="2"
          />
          <rect
            x="150"
            y="240"
            width="25"
            height="30"
            rx="4"
            fill="white"
            stroke="#1A73E8"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="px-6 pb-8">
        <h1 className="text-2xl font-bold text-center mb-2">
          Welcome to IoTLearn! 🎉
        </h1>
        <p className="text-center text-sm text-[var(--color-text-secondary)] mb-6">
          Choose your language / अपनी भाषा चुनें / आपली भाषा निवडा
        </p>

        {/* Language Cards */}
        <div className="space-y-3 mb-6">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLanguage(lang.code)}
              className={`w-full h-20 px-4 rounded-[var(--radius-lg)] border-2 flex items-center gap-4 transition-all ${
                selectedLanguage === lang.code
                  ? 'border-[var(--color-primary)] bg-[#EEF5FF]'
                  : 'border-[var(--color-border)] bg-white hover:border-[var(--color-primary)]/50'
              }`}
            >
              <span className="text-3xl">{lang.flag}</span>
              <div className="flex-1 text-left">
                <p className="font-semibold text-lg">{lang.name}</p>
                <p className="text-sm text-[var(--color-text-secondary)]">{lang.subtitle}</p>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedLanguage === lang.code
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]'
                    : 'border-[var(--color-border)]'
                }`}
              >
                {selectedLanguage === lang.code && (
                  <div className="w-3 h-3 rounded-full bg-white" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Step Dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-2 rounded-full transition-all ${
                step === currentStep
                  ? 'w-8 bg-[var(--color-primary)]'
                  : 'w-2 bg-[var(--color-border)]'
              }`}
            />
          ))}
        </div>

        {/* Continue Button */}
        <Button
          variant="primary"
          size="large"
          disabled={!selectedLanguage}
          className="w-full"
        >
          Continue
          <ChevronRight className="w-5 h-5" />
        </Button>

        {/* Step Indicator */}
        <p className="text-center text-xs text-[var(--color-text-secondary)] mt-4">
          Step 1 of 4
        </p>
      </div>
    </div>
  );
}
