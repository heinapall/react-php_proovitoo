import React from 'react';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'et', label: 'EST' },
  { code: 'en', label: 'ENG' },
  { code: 'fi', label: 'FIN' }
];

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  return (
    <div className="language-switcher">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          className={`lang-btn ${i18n.language === lang.code ? 'active' : ''}`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;