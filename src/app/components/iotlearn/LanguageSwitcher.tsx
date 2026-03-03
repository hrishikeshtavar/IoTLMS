import { useState } from 'react';

type Language = 'EN' | 'हिं' | 'मरा';

interface LanguageSwitcherProps {
  onChange?: (lang: Language) => void;
}

export function LanguageSwitcher({ onChange }: LanguageSwitcherProps) {
  const [active, setActive] = useState<Language>('EN');

  const handleChange = (lang: Language) => {
    setActive(lang);
    onChange?.(lang);
  };

  const languages: Language[] = ['EN', 'हिं', 'मरा'];

  return (
    <div className="inline-flex items-center bg-[#EEF2FB] rounded-full p-1">
      {languages.map((lang) => (
        <button
          key={lang}
          onClick={() => handleChange(lang)}
          className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
            active === lang
              ? 'bg-[#1A73E8] text-white'
              : 'text-[#5C6880] hover:text-[#0F1626]'
          }`}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}
