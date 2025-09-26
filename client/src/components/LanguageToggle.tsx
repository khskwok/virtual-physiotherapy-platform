import React from 'react';
import { useLanguage, Language } from '../contexts/LanguageContext';

interface LanguageToggleProps {
  position?: 'header' | 'standalone';
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ position = 'header' }) => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    const newLanguage: Language = language === 'zh-HK' ? 'en-US' : 'zh-HK';
    setLanguage(newLanguage);
  };

  const getLanguageDisplay = (lang: Language) => {
    switch (lang) {
      case 'zh-HK':
        return { flag: '🇭🇰', text: '中文', fullText: t('language.chinese') };
      case 'en-US':
        return { flag: '🇺🇸', text: 'EN', fullText: t('language.english') };
      default:
        return { flag: '🌐', text: 'Lang', fullText: 'Language' };
    }
  };

  const currentLang = getLanguageDisplay(language);
  const nextLang = getLanguageDisplay(language === 'zh-HK' ? 'en-US' : 'zh-HK');

  if (position === 'header') {
    return (
      <button
        onClick={toggleLanguage}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          color: '#667eea',
          border: '1px solid rgba(102, 126, 234, 0.3)',
          padding: '6px 10px',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          marginLeft: '8px'
        }}
        title={`${t('language.switchTo')} ${nextLang.fullText}`}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(102, 126, 234, 0.2)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(102, 126, 234, 0.1)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <span style={{ fontSize: '12px' }}>{currentLang.flag}</span>
        <span style={{ fontWeight: 'bold' }}>{currentLang.text}</span>
        <span style={{ fontSize: '10px', opacity: 0.7 }}>→</span>
        <span style={{ fontSize: '10px' }}>{nextLang.flag}</span>
      </button>
    );
  }

  // Standalone version for other uses
  return (
    <button
      onClick={toggleLanguage}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: '#667eea',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
      title={`Switch to ${nextLang.fullText}`}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#5a67d8';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#667eea';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <span style={{ fontSize: '16px' }}>{currentLang.flag}</span>
      <span>{currentLang.text}</span>
      <span style={{ fontSize: '12px', opacity: 0.8 }}>→</span>
      <span style={{ fontSize: '14px' }}>{nextLang.flag}</span>
    </button>
  );
};

export default LanguageToggle;