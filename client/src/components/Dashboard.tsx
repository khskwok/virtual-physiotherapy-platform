import React, { useState, useEffect } from 'react';
import { User, Appointment } from '../App';
import { useLanguage } from '../contexts/LanguageContext';

interface DashboardProps {
  user: User;
  onStartConsultation: (appointment: Appointment) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onStartConsultation }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`/api/appointments?userId=${user.id}&role=${user.role}`);
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error(t('common.error') + ':', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'scheduled': { 
        text: t('dashboard.scheduled'), 
        class: 'status-scheduled' 
      },
      'in-progress': { 
        text: t('dashboard.inProgress'), 
        class: 'status-in-progress' 
      },
      'completed': { 
        text: t('dashboard.completed'), 
        class: 'status-completed' 
      }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { text: status, class: '' };
    
    return (
      <span className={`status-badge ${statusInfo.class}`}>
        {statusInfo.text}
      </span>
    );
  };

  const formatDate = (date: string) => {
    const locale = language === 'zh-HK' ? 'zh-HK' : 'en-US';
    return new Date(date).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2>
            {user.role === 'therapist' 
              ? t('dashboard.therapistDashboard')
              : t('dashboard.patientDashboard')
            }
          </h2>
          <p style={{ color: '#718096', margin: 0 }}>
            {user.role === 'therapist' 
              ? `${t('dashboard.specialization')}: ${user.specialization}` 
              : `${t('dashboard.treatment')}: ${user.condition}`
            }
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0, color: '#4a5568' }}>
            {t('dashboard.todayDate')}
          </p>
          <p style={{ margin: 0, fontWeight: 'bold' }}>
            {formatDate(new Date().toISOString().split('T')[0])}
          </p>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3>📅 {t('dashboard.appointments')}</h3>
        {appointments.length === 0 ? (
          <div style={{ 
            background: '#f7fafc', 
            padding: '2rem', 
            borderRadius: '8px',
            textAlign: 'center',
            color: '#718096'
          }}>
            <p>{t('dashboard.noAppointments')}</p>
            {user.role === 'patient' && (
              <button 
                style={{
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  marginTop: '1rem'
                }}
                onClick={() => {
                  // Mock booking a new appointment
                  const newAppointment: Appointment = {
                    id: String(Date.now()),
                    patientId: user.id,
                    therapistId: '1',
                    date: new Date().toISOString().split('T')[0],
                    time: '15:00',
                    status: 'scheduled',
                    type: 'initial',
                    patient: user,
                    therapist: {
                      id: '1',
                      email: 'therapist@clinic.hk',
                      name: t('user.drChen'),
                      role: 'therapist',
                      specialization: t('user.physiotherapySpecialist')
                    }
                  };
                  setAppointments([newAppointment]);
                }}
              >
                {t('dashboard.bookConsultation')}
              </button>
            )}
          </div>
        ) : (
          <div className="appointments-grid">
            {appointments.map(appointment => (
              <div key={appointment.id} className="appointment-card">
                <div className="appointment-header">
                  <div className="appointment-time">
                    📅 {formatDate(appointment.date)} {appointment.time}
                  </div>
                  {getStatusBadge(appointment.status)}
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  {user.role === 'therapist' ? (
                    <div>
                      <p><strong>{t('dashboard.patient')}:</strong> {appointment.patient?.name}</p>
                      <p><strong>{t('dashboard.treatmentType')}:</strong> {appointment.type === 'initial' ? t('dashboard.initial') : t('dashboard.followUp')}</p>
                      <p><strong>{t('dashboard.condition')}:</strong> {appointment.patient?.condition}</p>
                    </div>
                  ) : (
                    <div>
                      <p><strong>{t('dashboard.therapist')}:</strong> {appointment.therapist?.name}</p>
                      <p><strong>{t('dashboard.specialization')}:</strong> {appointment.therapist?.specialization}</p>
                      <p><strong>{t('dashboard.consultationType')}:</strong> {appointment.type === 'initial' ? t('dashboard.initial') : t('dashboard.followUp')}</p>
                    </div>
                  )}
                </div>

                {appointment.status === 'scheduled' && (
                  <button 
                    className="start-consultation-btn"
                    onClick={() => onStartConsultation(appointment)}
                  >
                    {t('dashboard.startVideoConsult')}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {user.role === 'therapist' && (
        <div style={{ 
          background: '#f7fafc', 
          padding: '1.5rem', 
          borderRadius: '8px',
          marginTop: '2rem'
        }}>
          <h4>{t('dashboard.aiTools')}</h4>
          <p style={{ color: '#718096', margin: '0.5rem 0' }}>
            {t('dashboard.aiDescription')}
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: '2rem' }}>🏃‍♂️</div>
              <p style={{ margin: '0.5rem 0', fontWeight: 'bold' }}>{t('dashboard.postureAnalysis')}</p>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#718096' }}>
                {t('dashboard.postureDescription')}
              </p>
            </div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: '2rem' }}>📊</div>
              <p style={{ margin: '0.5rem 0', fontWeight: 'bold' }}>{t('dashboard.movementAssessment')}</p>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#718096' }}>
                {t('dashboard.movementDescription')}
              </p>
            </div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: '2rem' }}>⚠️</div>
              <p style={{ margin: '0.5rem 0', fontWeight: 'bold' }}>{t('dashboard.anomalyDetection')}</p>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#718096' }}>
                {t('dashboard.anomalyDescription')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;