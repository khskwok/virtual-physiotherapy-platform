import React from 'react';
import { User } from '../App';
import { useLanguage } from '../contexts/LanguageContext';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const { t, language } = useLanguage();
  
  const mockUsers: User[] = [
    {
      id: '1',
      email: 'therapist@clinic.hk',
      name: t('user.drChen'),
      role: 'therapist',
      specialization: t('user.physiotherapySpecialist')
    },
    {
      id: '2',
      email: 'patient@email.hk', 
      name: t('user.mrLee'),
      role: 'patient',
      condition: t('user.lowerBackPainTreatment')
    }
  ];

  const features = [
    t('login.feature.appointments'),
    t('login.feature.videoConsult'),
    t('login.feature.aiAnalysis'),
    t('login.feature.bilingual')
  ];

  return (
    <div className="login-container">
      <h2>{t('login.title')}</h2>
      <p style={{ color: '#718096', marginBottom: '2rem' }}>
        {t('login.demoNotice')}
      </p>
      
      <div className="user-selection">
        {mockUsers.map(user => (
          <div 
            key={user.id}
            className="user-card"
            onClick={() => onLogin(user)}
          >
            <h3>{user.name}</h3>
            <p>
              {user.role === 'therapist' 
                ? `🩺 ${t('login.therapist')}` 
                : `👤 ${t('login.patient')}`
              }
            </p>
            <p>
              {user.specialization || user.condition}
            </p>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#718096' }}>
        <p>💡 {t('login.featuresInclude')}</p>
        <ul style={{ textAlign: 'left', paddingLeft: '1.5rem' }}>
          {features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LoginPage;