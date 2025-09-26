# Bilingual Design Standard

## Overview

This document establishes the standard patterns and practices for implementing bilingual interfaces in healthcare applications, based on the Virtual Physiotherapy Platform implementation. This standard ensures consistent, accessible, and culturally appropriate multilingual user experiences.

## Supported Languages

### Primary Languages
- **Traditional Chinese (zh-HK)**: Primary language for Hong Kong healthcare context
- **English (en-US)**: Secondary language for international accessibility

### Language Codes
- Use ISO 639-1 language codes with ISO 3166-1 country codes
- Format: `language-COUNTRY` (e.g., `zh-HK`, `en-US`)

## Translation Architecture

### Context-Based Translation System

```typescript
// Language Context Structure
export type Language = 'zh-HK' | 'en-US';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

// Type-safe translation keys
type TranslationKey = keyof typeof translations['zh-HK'];
```

### Translation Key Naming Convention

Use hierarchical dot notation for translation keys:

```
category.subcategory.item
```

**Examples:**
- `header.title` - Main application title
- `login.selectUser` - User selection prompt
- `dashboard.appointments` - Appointments section
- `video.connectionStatus` - Video call connection status
- `common.loading` - Generic loading message

### Translation Dictionary Structure

```typescript
const translations = {
  'zh-HK': {
    // Header
    'header.title': '🏥 虛擬物理治療平台',
    'header.welcome': '歡迎',
    
    // Login Page
    'login.title': '登入系統',
    'login.selectUser': '選擇用戶類型',
    
    // Common
    'common.loading': '載入中...',
    'common.error': '錯誤'
  },
  'en-US': {
    // Header
    'header.title': '🏥 Virtual Physiotherapy Platform',
    'header.welcome': 'Welcome',
    
    // Login Page
    'login.title': 'Login System',
    'login.selectUser': 'Select User Type',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error'
  }
};
```

## UI Component Standards

### Language Toggle Component

**Requirements:**
- Prominent placement in header
- Flag icons for visual recognition
- Hover states with preview of target language
- Persistent language preference storage
- Smooth transition animations

**Implementation Pattern:**
```typescript
const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  
  const toggleLanguage = () => {
    const newLanguage: Language = language === 'zh-HK' ? 'en-US' : 'zh-HK';
    setLanguage(newLanguage);
  };
  
  return (
    <button onClick={toggleLanguage}>
      🇭🇰 中文 → 🇺🇸 EN
    </button>
  );
};
```

### Text Content Guidelines

#### Chinese Text Standards
- Use Traditional Chinese characters for Hong Kong context
- Maintain formal tone for medical/healthcare content
- Include appropriate medical terminology
- Use proper punctuation (，。！？)

#### English Text Standards
- Use clear, professional medical English
- Maintain consistency in terminology
- Follow healthcare communication best practices
- Use proper capitalization and punctuation

### Dynamic Content Handling

For user-generated or dynamic content:

```typescript
// Names and personal information
const userName = language === 'zh-HK' ? '陳醫生' : 'Dr. Chen';

// Status and system messages
const getStatusText = (status: string) => {
  const statusMap = {
    'scheduled': language === 'zh-HK' ? '已預約' : 'Scheduled',
    'in-progress': language === 'zh-HK' ? '進行中' : 'In Progress',
    'completed': language === 'zh-HK' ? '已完成' : 'Completed'
  };
  return statusMap[status] || status;
};
```

## Localization Features

### Date and Time Formatting

```typescript
const formatDate = (date: string) => {
  const locale = language === 'zh-HK' ? 'zh-HK' : 'en-US';
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
```

### Number and Currency Formatting

```typescript
const formatCurrency = (amount: number) => {
  const locale = language === 'zh-HK' ? 'zh-HK' : 'en-US';
  const currency = language === 'zh-HK' ? 'HKD' : 'USD';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount);
};
```

## Accessibility Standards

### Screen Reader Support
- Provide `lang` attribute updates on language change
- Include ARIA labels in both languages where appropriate
- Ensure proper reading order for both text directions

### Keyboard Navigation
- Maintain consistent tab order regardless of language
- Provide keyboard shortcuts that work with both input methods

### Visual Design
- Accommodate text expansion (Chinese text may be shorter/longer)
- Ensure adequate spacing for different character sets
- Use fonts that support both character sets properly

## Implementation Checklist

### Required Components
- [ ] Language Context Provider
- [ ] Language Toggle Component
- [ ] Translation Hook (`useLanguage`)
- [ ] Type-safe translation keys
- [ ] Persistent language storage

### Content Requirements
- [ ] All user-facing text uses translation system
- [ ] No hardcoded strings in components
- [ ] Proper fallback handling for missing translations
- [ ] Consistent terminology across application
- [ ] Cultural appropriateness review

### Technical Requirements
- [ ] TypeScript integration for type safety
- [ ] localStorage persistence
- [ ] Document language attribute updates
- [ ] Build-time translation validation
- [ ] Performance optimization for large translation files

## Error Handling

### Missing Translation Keys
```typescript
const t = (key: TranslationKey): string => {
  return translations[language][key] || key; // Fallback to key
};
```

### Language Detection
```typescript
const getDefaultLanguage = (): Language => {
  // Check localStorage first
  const saved = localStorage.getItem('language') as Language;
  if (saved && ['zh-HK', 'en-US'].includes(saved)) {
    return saved;
  }
  
  // Check browser language
  const browserLang = navigator.language;
  if (browserLang.startsWith('zh')) return 'zh-HK';
  
  // Default fallback
  return 'zh-HK'; // Default to Chinese for HK context
};
```

## Performance Considerations

### Lazy Loading
- Load only active language translations initially
- Implement dynamic loading for additional languages
- Cache translations in memory after first load

### Bundle Optimization
- Split translation files by language
- Use tree-shaking for unused translation keys
- Compress translation files in production

## Testing Standards

### Translation Coverage
- Verify all UI text uses translation system
- Test language switching functionality
- Validate text rendering in both languages
- Check for text overflow/truncation issues

### Accessibility Testing
- Screen reader testing in both languages
- Keyboard navigation testing
- Color contrast validation
- Font rendering verification

## Maintenance Guidelines

### Adding New Translations
1. Add key to both language dictionaries
2. Update TypeScript types
3. Test in both languages
4. Verify cultural appropriateness
5. Update documentation

### Translation Updates
1. Maintain consistency across related terms
2. Review medical terminology accuracy
3. Test UI layout with new text lengths
4. Update version documentation

## Cultural Considerations

### Hong Kong Healthcare Context
- Use appropriate medical titles and honorifics
- Follow local healthcare communication norms
- Include relevant emergency contact information
- Respect cultural preferences for formal/informal language

### International Accessibility
- Use clear, simple English for non-native speakers
- Avoid cultural idioms or references
- Maintain professional medical terminology
- Ensure universal understanding of medical concepts

## Future Enhancements

### Planned Extensions
- Additional language support (Simplified Chinese, etc.)
- Right-to-left language support
- Voice interface localization
- Regional dialect variations

### Integration Points
- Electronic Health Records (EHR) systems
- Government healthcare portals
- Insurance system integration
- Telemedicine platform standards

---

**Version**: 1.0  
**Last Updated**: 2025-09-26  
**Applies To**: All healthcare interface development  
**Review Cycle**: Quarterly