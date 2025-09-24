import React, { useState, useEffect, useRef } from 'react';
import { User, Appointment } from '../App';

interface VideoConsultationProps {
  user: User;
  appointment: Appointment;
  onEndConsultation: () => void;
}

interface PostureAnalysis {
  timestamp: string;
  shoulderAlignment: number;
  spineAngle: number;
  hipPosition: number;
  overallScore: number;
  recommendations: string[];
}

const VideoConsultation: React.FC<VideoConsultationProps> = ({ 
  user, 
  appointment, 
  onEndConsultation 
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [postureData, setPostureData] = useState<PostureAnalysis | null>(null);
  const [consultationTime, setConsultationTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Start consultation timer
    intervalRef.current = setInterval(() => {
      setConsultationTime(prev => prev + 1);
    }, 1000);

    // Simulate AI analysis for therapist view
    if (user.role === 'therapist') {
      startAIAnalysis();
    }

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [user.role]);

  const startAIAnalysis = () => {
    setIsAnalyzing(true);
    
    // Simulate periodic AI analysis updates
    const analysisInterval = setInterval(() => {
      const mockAnalysis: PostureAnalysis = {
        timestamp: new Date().toLocaleTimeString('zh-HK'),
        shoulderAlignment: Math.floor(Math.random() * 20) + 80, // 80-100%
        spineAngle: Math.floor(Math.random() * 10) + 5, // 5-15 degrees
        hipPosition: Math.floor(Math.random() * 15) + 85, // 85-100%
        overallScore: Math.floor(Math.random() * 20) + 75, // 75-95%
        recommendations: [
          '建議調整坐姿，保持脊椎挺直',
          '肩膀稍微向後拉，避免前傾',
          '定期進行頸部伸展運動'
        ]
      };
      setPostureData(mockAnalysis);
    }, 3000);

    // Cleanup analysis when component unmounts
    return () => clearInterval(analysisInterval);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#48bb78'; // Green
    if (score >= 75) return '#ed8936'; // Orange
    return '#e53e3e'; // Red
  };

  const handleEndCall = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    onEndConsultation();
  };

  return (
    <div className="video-consultation">
      <div className="consultation-header">
        <div>
          <h3>🎥 視頻諮詢進行中</h3>
          <p style={{ margin: 0, color: '#718096' }}>
            {user.role === 'therapist' 
              ? `與 ${appointment.patient?.name} 的諮詢` 
              : `與 ${appointment.therapist?.name} 的諮詢`
            }
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#4a5568' }}>
            ⏱️ {formatTime(consultationTime)}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#718096' }}>
            {new Date().toLocaleTimeString('zh-HK')}
          </div>
        </div>
      </div>

      <div className="video-container">
        <div className="main-video">
          <div className="video-placeholder">
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
              {user.role === 'therapist' ? '👩‍⚕️' : '👤'}
            </div>
            <h3>
              {user.role === 'therapist' 
                ? `${appointment.patient?.name} 的視頻` 
                : `${appointment.therapist?.name} 的視頻`
              }
            </h3>
            <p style={{ color: '#a0aec0' }}>
              視頻串流模擬 - 實際應用中將顯示真實視頻
            </p>
            {user.role === 'therapist' && isAnalyzing && (
              <div style={{ 
                position: 'absolute', 
                top: '1rem', 
                right: '1rem',
                background: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontSize: '0.9rem'
              }}>
                🤖 AI 分析中...
              </div>
            )}
          </div>
        </div>

        <div className="ai-analysis-panel">
          <h4 style={{ margin: '0 0 1rem 0' }}>
            {user.role === 'therapist' ? '🤖 AI 姿勢分析' : '📋 諮詢資訊'}
          </h4>
          
          {user.role === 'therapist' ? (
            <div className="posture-analysis">
              {postureData ? (
                <>
                  <div className="analysis-item">
                    <h5 style={{ margin: '0 0 0.5rem 0' }}>整體評分</h5>
                    <div 
                      className="analysis-score"
                      style={{ color: getScoreColor(postureData.overallScore) }}
                    >
                      {postureData.overallScore}%
                    </div>
                  </div>

                  <div className="analysis-item">
                    <h5 style={{ margin: '0 0 0.5rem 0' }}>肩膀對齊</h5>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span>{postureData.shoulderAlignment}%</span>
                      <div style={{ 
                        width: '60px', 
                        height: '8px', 
                        background: '#e2e8f0',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${postureData.shoulderAlignment}%`,
                          height: '100%',
                          background: getScoreColor(postureData.shoulderAlignment)
                        }} />
                      </div>
                    </div>
                  </div>

                  <div className="analysis-item">
                    <h5 style={{ margin: '0 0 0.5rem 0' }}>脊椎角度</h5>
                    <div>{postureData.spineAngle}°</div>
                  </div>

                  <div className="analysis-item">
                    <h5 style={{ margin: '0 0 0.5rem 0' }}>建議</h5>
                    <ul style={{ 
                      margin: 0, 
                      paddingLeft: '1rem',
                      fontSize: '0.9rem',
                      color: '#4a5568'
                    }}>
                      {postureData.recommendations.map((rec, index) => (
                        <li key={index} style={{ marginBottom: '0.25rem' }}>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ 
                    fontSize: '0.8rem', 
                    color: '#718096',
                    textAlign: 'center',
                    marginTop: '1rem'
                  }}>
                    最後更新: {postureData.timestamp}
                  </div>
                </>
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  color: '#718096',
                  padding: '2rem 0'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔄</div>
                  <p>正在初始化 AI 分析...</p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="analysis-item">
                <h5 style={{ margin: '0 0 0.5rem 0' }}>治療師</h5>
                <p style={{ margin: 0 }}>{appointment.therapist?.name}</p>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#718096' }}>
                  {appointment.therapist?.specialization}
                </p>
              </div>

              <div className="analysis-item">
                <h5 style={{ margin: '0 0 0.5rem 0' }}>諮詢類型</h5>
                <p style={{ margin: 0 }}>
                  {appointment.type === 'initial' ? '初診評估' : '覆診跟進'}
                </p>
              </div>

              <div className="analysis-item">
                <h5 style={{ margin: '0 0 0.5rem 0' }}>治療重點</h5>
                <p style={{ margin: 0 }}>{user.condition}</p>
              </div>

              <div className="analysis-item">
                <h5 style={{ margin: '0 0 0.5rem 0' }}>注意事項</h5>
                <ul style={{ 
                  margin: 0, 
                  paddingLeft: '1rem',
                  fontSize: '0.9rem',
                  color: '#4a5568'
                }}>
                  <li>請在光線充足的環境進行</li>
                  <li>確保攝像頭能清楚看到全身</li>
                  <li>按治療師指示進行動作</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="controls">
        <button 
          className="control-btn mute-btn"
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? '🔇 取消靜音' : '🔊 靜音'}
        </button>
        
        <button 
          className="control-btn camera-btn"
          onClick={() => setIsCameraOn(!isCameraOn)}
        >
          {isCameraOn ? '📹 關閉攝像頭' : '📷 開啟攝像頭'}
        </button>
        
        <button 
          className="control-btn end-call-btn"
          onClick={handleEndCall}
        >
          📞 結束通話
        </button>
      </div>
    </div>
  );
};

export default VideoConsultation;