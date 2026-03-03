import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Upload,
  HelpCircle,
  Eye,
  Rocket,
  Image as ImageIcon,
  FileText,
  Globe,
} from 'lucide-react';
import { Button } from '../components/Button';

type WizardStep = 1 | 2 | 3 | 4 | 5;

export default function BrandWizard() {
  const [currentStep, setCurrentStep] = useState<WizardStep>(2);
  const [schoolNameEn, setSchoolNameEn] = useState('DY Patil Institute');
  const [schoolNameHi, setSchoolNameHi] = useState('');
  const [schoolNameMr, setSchoolNameMr] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#1976D2');
  const [secondaryColor, setSecondaryColor] = useState('#0D47A1');
  const [accentColor, setAccentColor] = useState('#FF6F00');
  const [backgroundColor, setBackgroundColor] = useState('#F4F7FF');
  const [headingFont, setHeadingFont] = useState('Inter');
  const [logoUploaded, setLogoUploaded] = useState(false);
  const [subdomain, setSubdomain] = useState('dypatil');

  const steps = [
    { number: 1, label: 'School Info', icon: FileText },
    { number: 2, label: 'Brand Colors', icon: Eye },
    { number: 3, label: 'Logo & Assets', icon: ImageIcon },
    { number: 4, label: 'Domain Setup', icon: Globe },
    { number: 5, label: 'Preview & Launch', icon: Rocket },
  ];

  const isStepCompleted = (step: number) => step < currentStep;
  const isStepCurrent = (step: number) => step === currentStep;

  return (
    <div className="min-h-screen bg-[var(--color-surface-alt)] flex flex-col">
      {/* Progress Stepper */}
      <div className="bg-white border-b border-[var(--color-border)] py-8">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                {/* Step Circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                      isStepCompleted(step.number)
                        ? 'bg-[var(--color-primary)] text-white'
                        : isStepCurrent(step.number)
                        ? 'bg-[var(--color-primary)] text-white ring-4 ring-[var(--color-primary)]/20'
                        : 'bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)]'
                    }`}
                  >
                    {isStepCompleted(step.number) ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <span>{step.number}</span>
                    )}
                  </div>
                  <p
                    className={`mt-2 text-sm ${
                      isStepCurrent(step.number)
                        ? 'font-semibold text-[var(--color-text-primary)]'
                        : 'text-[var(--color-text-secondary)]'
                    }`}
                  >
                    {step.label}
                  </p>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 h-1 mx-4 mb-8">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isStepCompleted(step.number + 1)
                          ? 'bg-[var(--color-primary)]'
                          : 'bg-[var(--color-border)]'
                      }`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-8">
        {currentStep === 2 && (
          <StepTwoBrandColors
            schoolNameEn={schoolNameEn}
            setSchoolNameEn={setSchoolNameEn}
            schoolNameHi={schoolNameHi}
            setSchoolNameHi={setSchoolNameHi}
            schoolNameMr={schoolNameMr}
            setSchoolNameMr={setSchoolNameMr}
            primaryColor={primaryColor}
            setPrimaryColor={setPrimaryColor}
            secondaryColor={secondaryColor}
            setSecondaryColor={setSecondaryColor}
            accentColor={accentColor}
            setAccentColor={setAccentColor}
            backgroundColor={backgroundColor}
            setBackgroundColor={setBackgroundColor}
            headingFont={headingFont}
            setHeadingFont={setHeadingFont}
          />
        )}

        {currentStep === 5 && (
          <StepFivePreview
            schoolNameEn={schoolNameEn}
            primaryColor={primaryColor}
            accentColor={accentColor}
            subdomain={subdomain}
            logoUploaded={logoUploaded}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-[var(--color-border)] py-4">
        <div className="max-w-6xl mx-auto px-8 flex items-center justify-between">
          <Button
            variant="ghost"
            size="medium"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1) as WizardStep)}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>

          {currentStep < 5 && (
            <Button
              variant="primary"
              size="medium"
              onClick={() => setCurrentStep(Math.min(5, currentStep + 1) as WizardStep)}
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepTwoBrandColors({
  schoolNameEn,
  setSchoolNameEn,
  schoolNameHi,
  setSchoolNameHi,
  schoolNameMr,
  setSchoolNameMr,
  primaryColor,
  setPrimaryColor,
  secondaryColor,
  setSecondaryColor,
  accentColor,
  setAccentColor,
  backgroundColor,
  setBackgroundColor,
  headingFont,
  setHeadingFont,
}: any) {
  return (
    <div className="max-w-6xl mx-auto px-8">
      <div className="grid grid-cols-2 gap-8">
        {/* Left Panel - Form */}
        <div className="bg-white rounded-[var(--radius-xl)] shadow-2 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Brand Your School</h2>
            <p className="text-[var(--color-text-secondary)]">
              Your students will see these colors across the platform
            </p>
          </div>

          {/* School Name Section */}
          <div className="mb-8">
            <label className="block text-sm font-semibold mb-3">School Name</label>
            <div className="space-y-3">
              <input
                type="text"
                value={schoolNameEn}
                onChange={(e) => setSchoolNameEn(e.target.value)}
                placeholder="English"
                className="w-full h-12 px-4 rounded-[var(--radius-md)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              />
              <input
                type="text"
                value={schoolNameHi}
                onChange={(e) => setSchoolNameHi(e.target.value)}
                placeholder="हिंदी में नाम"
                className="w-full h-12 px-4 rounded-[var(--radius-md)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
              />
              <input
                type="text"
                value={schoolNameMr}
                onChange={(e) => setSchoolNameMr(e.target.value)}
                placeholder="मराठीत नाव"
                className="w-full h-12 px-4 rounded-[var(--radius-md)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
              />
            </div>
          </div>

          {/* Color Pickers */}
          <div className="mb-8 space-y-4">
            <ColorPicker
              label="Primary Color"
              color={primaryColor}
              onChange={setPrimaryColor}
            />
            <ColorPicker
              label="Secondary Color"
              color={secondaryColor}
              onChange={setSecondaryColor}
            />
            <ColorPicker
              label="Accent Color"
              color={accentColor}
              onChange={setAccentColor}
            />
            <ColorPicker
              label="Background Color"
              color={backgroundColor}
              onChange={setBackgroundColor}
            />
          </div>

          {/* Font Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold mb-3">Heading Font</label>
            <div className="flex items-center gap-4">
              <select
                value={headingFont}
                onChange={(e) => setHeadingFont(e.target.value)}
                className="flex-1 h-12 px-4 pr-8 rounded-[var(--radius-md)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              >
                <option value="Inter">Inter</option>
                <option value="Poppins">Poppins</option>
                <option value="Roboto">Roboto</option>
                <option value="Mukta">Mukta</option>
                <option value="Noto Sans Devanagari">Noto Sans Devanagari</option>
              </select>
              <div
                className="w-16 h-16 flex items-center justify-center text-3xl rounded-[var(--radius-md)] border border-[var(--color-border)]"
                style={{ fontFamily: headingFont }}
              >
                Aa
              </div>
            </div>
          </div>

          {/* Next Step Preview */}
          <div className="p-4 rounded-[var(--radius-md)] bg-[var(--color-surface-alt)] border border-[var(--color-border)]">
            <p className="text-sm text-[var(--color-text-secondary)] mb-2">
              <strong>Next Step:</strong> Upload Brand Assets
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              School logo, favicon, and cover images
            </p>
          </div>
        </div>

        {/* Right Panel - Live Preview */}
        <div className="bg-[#F4F7FF] rounded-[var(--radius-xl)] p-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Live Preview</h3>
              <span className="text-xs text-[var(--color-text-secondary)]">
                Refreshes automatically
              </span>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)]">
              This is how your students will see the platform
            </p>
          </div>

          {/* Preview Mockup */}
          <div className="bg-white rounded-[var(--radius-lg)] shadow-2 overflow-hidden">
            {/* Header */}
            <div
              className="h-14 px-6 flex items-center justify-between"
              style={{ backgroundColor: primaryColor }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                  {schoolNameEn.charAt(0)}
                </div>
                <span className="text-white font-semibold">{schoolNameEn}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20" />
              </div>
            </div>

            {/* Content Preview */}
            <div className="p-6">
              <div className="mb-4">
                <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
                <div className="h-6 bg-gray-300 rounded w-48" />
              </div>

              {/* Sample Course Cards */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-gray-50 rounded-lg overflow-hidden">
                    <div className="h-24 bg-gray-200" />
                    <div className="p-3">
                      <div className="h-3 bg-gray-300 rounded w-3/4 mb-2" />
                      <div className="h-2 bg-gray-200 rounded w-1/2 mb-3" />
                      <button
                        className="w-full h-8 rounded text-white text-xs font-medium"
                        style={{ backgroundColor: accentColor }}
                      >
                        View Course
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-50 rounded p-3">
                    <div className="h-2 bg-gray-200 rounded w-full mb-2" />
                    <div className="h-4 bg-gray-300 rounded w-2/3" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Info Caption */}
          <p className="text-xs text-center text-[var(--color-text-secondary)] mt-4">
            Preview updates in real-time as you change colors
          </p>
        </div>
      </div>
    </div>
  );
}

function StepFivePreview({
  schoolNameEn,
  primaryColor,
  accentColor,
  subdomain,
  logoUploaded,
}: any) {
  const checklistItems = [
    { label: 'School info added in 3 languages', completed: true },
    { label: 'Brand colors configured', completed: true },
    { label: 'Logo uploaded', completed: logoUploaded },
    { label: `Subdomain: ${subdomain}.iotlearn.in`, completed: true },
    { label: 'DNS configured', completed: false, helpLink: true },
  ];

  return (
    <div className="max-w-5xl mx-auto px-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Preview & Launch</h2>
        <p className="text-[var(--color-text-secondary)]">
          Review your setup and launch your branded school platform
        </p>
      </div>

      {/* Large Preview */}
      <div className="bg-white rounded-[var(--radius-xl)] shadow-2 overflow-hidden mb-8">
        <div className="bg-[#F4F7FF] p-8">
          <div className="bg-white rounded-[var(--radius-lg)] shadow-2 overflow-hidden max-w-4xl mx-auto">
            {/* Preview Header */}
            <div
              className="h-16 px-8 flex items-center justify-between"
              style={{ backgroundColor: primaryColor }}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-white/20 flex items-center justify-center text-white font-bold">
                  {schoolNameEn.charAt(0)}
                </div>
                <span className="text-white font-bold text-lg">{schoolNameEn}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-white text-sm">EN | हिं | मरा</div>
                <div className="w-10 h-10 rounded-full bg-white/20" />
              </div>
            </div>

            {/* Preview Content */}
            <div className="p-8">
              <div className="mb-6">
                <div className="h-6 bg-gray-200 rounded w-48 mb-3" />
                <div className="h-4 bg-gray-300 rounded w-64" />
              </div>

              <div className="grid grid-cols-3 gap-6 mb-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-50 rounded-lg overflow-hidden">
                    <div className="h-32 bg-gray-200" />
                    <div className="p-4">
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4" />
                      <button
                        className="w-full h-10 rounded text-white font-medium"
                        style={{ backgroundColor: accentColor }}
                      >
                        Enroll Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-4">
                    <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                    <div className="h-6 bg-gray-300 rounded w-2/3" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-white rounded-[var(--radius-xl)] shadow-2 p-8 mb-8">
        <h3 className="font-semibold mb-6">Setup Checklist</h3>
        <div className="space-y-4">
          {checklistItems.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  item.completed
                    ? 'bg-[var(--color-success)] text-white'
                    : 'bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)]'
                }`}
              >
                {item.completed ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-sm">○</span>
                )}
              </div>
              <span
                className={
                  item.completed
                    ? 'text-[var(--color-text-primary)]'
                    : 'text-[var(--color-text-secondary)]'
                }
              >
                {item.label}
              </span>
              {item.helpLink && (
                <a
                  href="#"
                  className="ml-auto text-sm text-[var(--color-primary)] hover:underline flex items-center gap-1"
                >
                  How to set up DNS?
                  <HelpCircle className="w-4 h-4" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Launch Buttons */}
      <div className="flex flex-col items-center gap-4">
        <Button variant="accent" size="large" className="w-full max-w-md h-14 text-lg">
          <Rocket className="w-5 h-5" />
          🚀 Launch School
        </Button>
        <Button variant="outline" size="medium" className="w-full max-w-md">
          <FileText className="w-4 h-4" />
          DNS Setup Guide
        </Button>
      </div>
    </div>
  );
}

function ColorPicker({ label, color, onChange }: any) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-2">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg border-2 border-[var(--color-border)] cursor-pointer"
          style={{ backgroundColor: color }}
        />
        <input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 h-10 px-4 rounded-[var(--radius-md)] border border-[var(--color-border)] font-mono text-sm uppercase focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
          placeholder="#000000"
        />
      </div>
    </div>
  );
}
