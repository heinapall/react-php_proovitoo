import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const NavBar: React.FC = () => {
  const { t } = useTranslation();

  return (
    <nav className="opus-nav">
      <div className="logo">
        <span className="logo-icon">📍</span> OPUS
      </div>
      <div className="nav-links">
        <LanguageSwitcher />
        <a href="http://127.0.0.1:8000/api/doc" target="_blank" rel="noreferrer" className="nav-btn">
          {t('header.api_docs')} →
        </a>
      </div>
    </nav>
  );
};

export default NavBar;