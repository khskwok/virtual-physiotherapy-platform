import React, { useState, useEffect } from 'react';
import { User, Appointment } from '../App';

interface DashboardProps {
  user: User;
  onStartConsultation: (appointment: Appointment) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onStartConsultation }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`/api/appointments?userId=${user.id}&role=${user.role}`);
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('獲取預約失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'scheduled': { text: '已預約', class: 'status-scheduled' },
      'in-progress': { text: '進行中', class: 'status-in-progress' },
      'completed': { text: '已完成', class: 'status-completed' }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { text: status, class: '' };
    
    return (
      <span className={`status-badge ${statusInfo.class}`}>
        {statusInfo.text}
      </span>
    );
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('zh-HK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2>
            {user.role === 'therapist' ? '🩺 治療師控制台' : '👤 病人控制台'}
          </h2>
          <p style={{ color: '#718096', margin: 0 }}>
            {user.role === 'therapist' 
              ? `專科: ${user.specialization}` 
              : `治療項目: ${user.condition}`
            }
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0, color: '#4a5568' }}>今日日期</p>
          <p style={{ margin: 0, fontWeight: 'bold' }}>
            {new Date().toLocaleDateString('zh-HK')}
          </p>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3>📅 預約管理</h3>
        {appointments.length === 0 ? (
          <div style={{ 
            background: '#f7fafc', 
            padding: '2rem', 
            borderRadius: '8px',
            textAlign: 'center',
            color: '#718096'
          }}>
            <p>暫無預約</p>
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
                      name: '陳醫生',
                      role: 'therapist',
                      specialization: '物理治療專科'
                    }
                  };
                  setAppointments([newAppointment]);
                }}
              >
                📞 預約諮詢
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
                      <p><strong>病人:</strong> {appointment.patient?.name}</p>
                      <p><strong>治療類型:</strong> {appointment.type === 'initial' ? '初診' : '覆診'}</p>
                      <p><strong>病症:</strong> {appointment.patient?.condition}</p>
                    </div>
                  ) : (
                    <div>
                      <p><strong>治療師:</strong> {appointment.therapist?.name}</p>
                      <p><strong>專科:</strong> {appointment.therapist?.specialization}</p>
                      <p><strong>諮詢類型:</strong> {appointment.type === 'initial' ? '初診' : '覆診'}</p>
                    </div>
                  )}
                </div>

                {appointment.status === 'scheduled' && (
                  <button 
                    className="start-consultation-btn"
                    onClick={() => onStartConsultation(appointment)}
                  >
                    🎥 開始視頻諮詢
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
          <h4>🤖 AI 分析工具</h4>
          <p style={{ color: '#718096', margin: '0.5rem 0' }}>
            在視頻諮詢期間，AI 將自動分析病人的姿勢和動作模式
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: '2rem' }}>🏃‍♂️</div>
              <p style={{ margin: '0.5rem 0', fontWeight: 'bold' }}>姿勢分析</p>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#718096' }}>
                實時檢測關節角度
              </p>
            </div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: '2rem' }}>📊</div>
              <p style={{ margin: '0.5rem 0', fontWeight: 'bold' }}>動作評估</p>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#718096' }}>
                量化活動範圍
              </p>
            </div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: '2rem' }}>⚠️</div>
              <p style={{ margin: '0.5rem 0', fontWeight: 'bold' }}>異常檢測</p>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#718096' }}>
                標記潛在問題
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;