import React, { useState, useEffect } from 'react';
import './App.css';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import VideoConsultation from './components/VideoConsultation';

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

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'login' | 'dashboard' | 'consultation'>('login');
  const [activeAppointment, setActiveAppointment] = useState<Appointment | null>(null);

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
        <h1>🏥 虛擬物理治療平台</h1>
        {currentUser && (
          <div className="user-info">
            <span>歡迎, {currentUser.name}</span>
            <button onClick={handleLogout} className="logout-btn">登出</button>
          </div>
        )}
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
}

export default App;