import React from 'react';
import { User } from '../App';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const mockUsers: User[] = [
    {
      id: '1',
      email: 'therapist@clinic.hk',
      name: '陳醫生',
      role: 'therapist',
      specialization: '物理治療專科'
    },
    {
      id: '2',
      email: 'patient@email.hk', 
      name: '李先生',
      role: 'patient',
      condition: '腰痛治療'
    }
  ];

  return (
    <div className="login-container">
      <h2>選擇用戶身份</h2>
      <p style={{ color: '#718096', marginBottom: '2rem' }}>
        這是一個演示原型，請選擇您的身份來體驗平台功能
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
              {user.role === 'therapist' ? '🩺 物理治療師' : '👤 病人'}
            </p>
            <p>
              {user.specialization || user.condition}
            </p>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#718096' }}>
        <p>💡 功能包括:</p>
        <ul style={{ textAlign: 'left', paddingLeft: '1.5rem' }}>
          <li>預約管理</li>
          <li>視頻諮詢</li>
          <li>AI 姿勢分析</li>
          <li>粵語界面支援</li>
        </ul>
      </div>
    </div>
  );
};

export default LoginPage;