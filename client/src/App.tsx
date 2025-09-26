import React, { useState, useEffect } from 'react';
import './App.css';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import VideoConsultation from './components/VideoConsultation';
import BuildInfo from './components/BuildInfo';
import LanguageToggle from './components/LanguageToggle';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'therapist' | 'patient';
  specialization?: string;
  condition?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  therapistId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'in-progress' | 'completed';
  type: 'initial' | 'follow-up';
  patient?: User;
  therapist?: User;
}

const AppContent: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'login' | 'dashboard' | 'consultation'>('login');
  const [activeAppointment, setActiveAppointment] = useState<Appointment | null>(null);
  const { t } = useLanguage();

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleStartConsultation = (appointment: Appointment) => {
    setActiveAppointment(appointment);
    setCurrentView('consultation');
  };

  const handleEndConsultation = () => {
    setActiveAppointment(null);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('login');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>{t('header.title')}</h1>
        <div className="header-right">
          {currentUser && (
            <div className="user-info">
              <span>{t('header.welcome')}, {currentUser.name}</span>
              <button onClick={handleLogout} className="logout-btn">{t('header.logout')}</button>
            </div>
          )}
          <LanguageToggle position="header" />
          <BuildInfo show={true} position="header" />
        </div>
      </header>

      <main className="App-main">
        {currentView === 'login' && (
          <LoginPage onLogin={handleLogin} />
        )}
        
        {currentView === 'dashboard' && currentUser && (
          <Dashboard 
            user={currentUser} 
            onStartConsultation={handleStartConsultation}
          />
        )}
        
        {currentView === 'consultation' && currentUser && activeAppointment && (
          <VideoConsultation 
            user={currentUser}
            appointment={activeAppointment}
            onEndConsultation={handleEndConsultation}
          />
        )}
      </main>
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;