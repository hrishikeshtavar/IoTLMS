import { useState } from 'react';

type Language = 'EN' | 'हिं' | 'मरा';

export function LanguageSwitcher() {
  const [active, setActive] = useState<Language>('EN');
  
  const languages: Language[] = ['EN', 'हिं', 'मरा'];
  
  return (
    <div className="inline-flex rounded-[var(--radius-md)] bg-[var(--color-surface-alt)] p-1">
      {languages.map((lang) => (
        <button
          key={lang}
          onClick={() => setActive(lang)}
          className={`px-3 py-1.5 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-200 ${
            active === lang
              ? 'bg-[var(--color-primary)] text-white'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}
