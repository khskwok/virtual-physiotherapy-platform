import React, { useState, useEffect, useRef } from 'react';
import { User, Appointment } from '../App';
import { useLanguage } from '../contexts/LanguageContext';

interface VideoConsultationProps {
  user: User;
  appointment: Appointment;
  onEndConsultation: () => void;
}

interface ConnectionStatus {
  status: 'connecting' | 'connected' | 'reconnecting' | 'disconnected';
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  packetLoss: number;
  bitrate: number;
}

interface VideoQuality {
  resolution: '1080p' | '720p' | '480p' | '360p';
  frameRate: number;
  adaptiveBitrate: boolean;
}

interface PostureAnalysis {
  timestamp: string;
  shoulderAlignment: number;
  spineAngle: number;
  hipPosition: number;
  overallScore: number;
  recommendations: string[];
  musculoskeletalAssessment: {
    forwardHeadPosture: number;
    roundedShoulders: number;
    anteriorPelvicTilt: number;
    spinalCurvature: string;
    asymmetries: string[];
    riskFactors: string[];
  };
  jointAngles: {
    leftShoulder: number;
    rightShoulder: number;
    leftHip: number;
    rightHip: number;
    cervicalSpine: number;
  };
  progressTracking: {
    improvementScore: number;
    comparedToPrevious: string;
    trendsIdentified: string[];
  };
}

const VideoConsultation: React.FC<VideoConsultationProps> = ({ 
  user, 
  appointment, 
  onEndConsultation 
}) => {
  const { t, language } = useLanguage();
  // Video session states
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    status: 'connecting',
    quality: 'good',
    packetLoss: 0,
    bitrate: 1000
  });
  const [videoQuality, setVideoQuality] = useState<VideoQuality>({
    resolution: '720p',
    frameRate: 30,
    adaptiveBitrate: true
  });
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingConsent, setRecordingConsent] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [cameraMode, setCameraMode] = useState<'front' | 'rear'>('front');
  
  // Audio/Video controls
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [audioQuality, setAudioQuality] = useState<'excellent' | 'good' | 'fair' | 'poor'>('good');
  
  // AI Analysis states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [postureData, setPostureData] = useState<PostureAnalysis | null>(null);
  
  // Session management
  const [consultationTime, setConsultationTime] = useState(0);
  const [timeWarning, setTimeWarning] = useState<string | null>(null);
  const [emergencyMode, setEmergencyMode] = useState(false);
  
  // Refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const connectionCheckRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initialize video session
    initializeVideoSession();
    
    // Start consultation timer
    intervalRef.current = setInterval(() => {
      setConsultationTime(prev => {
        const newTime = prev + 1;
        // Check for time warnings (Requirement 1.11)
        checkTimeWarnings(newTime);
        return newTime;
      });
    }, 1000);

    // Monitor connection quality
    connectionCheckRef.current = setInterval(() => {
      simulateConnectionMonitoring();
    }, 5000);

    // Cleanup
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (connectionCheckRef.current) clearInterval(connectionCheckRef.current);
      endVideoSession();
    };
  }, []);

  const initializeVideoSession = async () => {
    try {
      // Simulate establishing video connection (Requirement 1.1)
      setConnectionStatus(prev => ({ ...prev, status: 'connecting' }));
      
      // Simulate 10-second connection establishment
      setTimeout(() => {
        setConnectionStatus(prev => ({ ...prev, status: 'connected' }));
        setIsSessionActive(true);
        
        // Start AI analysis for therapist (Requirement 2)
        if (user.role === 'therapist') {
          setTimeout(() => {
            setIsAnalyzing(true);
            startAIAnalysis();
          }, 2000);
        }
      }, 3000); // Simulated connection time
      
    } catch (error) {
      console.error('Failed to initialize video session:', error);
      setConnectionStatus(prev => ({ ...prev, status: 'disconnected' }));
    }
  };

  const simulateConnectionMonitoring = () => {
    // Simulate network monitoring (Requirement 1.2, 1.4)
    const packetLoss = Math.random() * 3; // 0-3% packet loss
    const bitrate = Math.floor(Math.random() * 500) + 800; // 800-1300 kbps
    
    let quality: 'excellent' | 'good' | 'fair' | 'poor' = 'excellent';
    if (packetLoss > 2) quality = 'poor';
    else if (packetLoss > 1) quality = 'fair';
    else if (packetLoss > 0.5) quality = 'good';
    
    setConnectionStatus(prev => ({
      ...prev,
      packetLoss,
      bitrate,
      quality
    }));

    // Adaptive bitrate adjustment (Requirement 1.6)
    if (quality === 'poor' && videoQuality.resolution !== '360p') {
      setVideoQuality(prev => ({
        ...prev,
        resolution: '360p',
        frameRate: 15
      }));
    } else if (quality === 'excellent' && videoQuality.resolution !== '720p') {
      setVideoQuality(prev => ({
        ...prev,
        resolution: '720p',
        frameRate: 30
      }));
    }
  };

  const checkTimeWarnings = (time: number) => {
    // Time limit warnings (Requirement 1.11)
    const minutes = Math.floor(time / 60);
    if (minutes === 25) setTimeWarning(t('video.timeWarning5min'));
    else if (minutes === 28) setTimeWarning(t('video.timeWarning2min'));
    else if (minutes === 29) setTimeWarning(t('video.timeWarning1min'));
    else if (minutes >= 30) {
      setTimeWarning(t('video.timeUp'));
      setTimeout(() => handleEndCall(), 5000);
    }
  };

  const startAIAnalysis = () => {
    // Enhanced AI analysis with comprehensive assessment
    const analysisInterval = setInterval(() => {
      const shoulderAlign = Math.floor(Math.random() * 20) + 80;
      const spineAngle = Math.floor(Math.random() * 10) + 5;
      const hipPos = Math.floor(Math.random() * 15) + 85;
      const overallScore = Math.floor((shoulderAlign + hipPos + (100 - spineAngle)) / 3);
      
      const mockAnalysis: PostureAnalysis = {
        timestamp: new Date().toLocaleTimeString(language === 'zh-HK' ? 'zh-HK' : 'en-US'),
        shoulderAlignment: shoulderAlign,
        spineAngle: spineAngle,
        hipPosition: hipPos,
        overallScore: overallScore,
        recommendations: [
          t('video.recommendation1'),
          t('video.recommendation2'),
          t('video.recommendation3'),
          t('video.recommendation4')
        ],
        musculoskeletalAssessment: {
          forwardHeadPosture: Math.floor(Math.random() * 30) + 10,
          roundedShoulders: Math.floor(Math.random() * 15) + 5,
          anteriorPelvicTilt: Math.floor(Math.random() * 10) + 5,
          spinalCurvature: spineAngle > 10 ? t('video.spinalCurvatureMild') : t('video.spinalCurvatureNormal'),
          asymmetries: shoulderAlign < 85 ? [t('video.asymmetryPoor1'), t('video.asymmetryPoor2')] : [t('video.asymmetryGood')],
          riskFactors: overallScore < 80 ? [t('video.riskHigh1'), t('video.riskHigh2')] : [t('video.riskLow')]
        },
        jointAngles: {
          leftShoulder: Math.floor(Math.random() * 20) + 170,
          rightShoulder: Math.floor(Math.random() * 20) + 170,
          leftHip: Math.floor(Math.random() * 15) + 175,
          rightHip: Math.floor(Math.random() * 15) + 175,
          cervicalSpine: Math.floor(Math.random() * 10) + 45
        },
        progressTracking: {
          improvementScore: Math.floor(Math.random() * 20) + 5,
          comparedToPrevious: overallScore > 85 ? t('video.improvementGood') : t('video.improvementSimilar'),
          trendsIdentified: [t('video.trend1'), t('video.trend2'), t('video.trend3')]
        }
      };
      setPostureData(mockAnalysis);
    }, 4000);

    return () => clearInterval(analysisInterval);
  };

  const handleStartRecording = () => {
    if (!recordingConsent) {
      const consent = window.confirm(t('video.recordingConsent'));
      if (!consent) return;
      setRecordingConsent(true);
    }
    setIsRecording(true);
  };

  const handleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
  };

  const handleCameraSwitch = () => {
    setCameraMode(prev => prev === 'front' ? 'rear' : 'front');
  };

  const handleEmergency = () => {
    setEmergencyMode(true);
    // In real implementation, this would contact emergency services
    alert(`${t('video.emergencyActivated')}\n\n${t('video.emergencyServices')}\n${t('video.medicalHotline')}`);
  };

  const endVideoSession = () => {
    setIsSessionActive(false);
    setIsRecording(false);
    setIsAnalyzing(false);
  };

  const handleEndCall = () => {
    endVideoSession();
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (connectionCheckRef.current) clearInterval(connectionCheckRef.current);
    onEndConsultation();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#48bb78';
    if (score >= 75) return '#ed8936';
    return '#e53e3e';
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus.status) {
      case 'connected': return '#48bb78';
      case 'connecting': case 'reconnecting': return '#ed8936';
      case 'disconnected': return '#e53e3e';
      default: return '#718096';
    }
  };

  return (
    <div className="video-consultation">
      {/* Header with session info */}
      <div className="consultation-header">
        <div>
          <h3>🎥 {t('video.title')}</h3>
          <p style={{ margin: 0, color: '#718096' }}>
            {user.role === 'therapist' 
              ? t('video.consultationWith').replace('{name}', appointment.patient?.name || '')
              : t('video.consultationWith').replace('{name}', appointment.therapist?.name || '')
            }
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.9rem' }}>
            <span style={{ color: getConnectionStatusColor() }}>
              ● {connectionStatus.status === 'connected' ? t('video.connected') : 
                  connectionStatus.status === 'connecting' ? t('video.connecting') :
                  connectionStatus.status === 'reconnecting' ? t('video.reconnecting') : t('video.disconnected')}
            </span>
            <span>{t('video.quality')}: {videoQuality.resolution} @ {videoQuality.frameRate}fps</span>
            <span>{t('video.packetLoss')}: {connectionStatus.packetLoss.toFixed(1)}%</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#4a5568' }}>
            ⏱️ {formatTime(consultationTime)}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#718096' }}>
            {new Date().toLocaleTimeString(language === 'zh-HK' ? 'zh-HK' : 'en-US')}
          </div>
          {timeWarning && (
            <div style={{ 
              fontSize: '0.8rem', 
              color: '#e53e3e', 
              fontWeight: 'bold',
              marginTop: '0.5rem'
            }}>
              ⚠️ {timeWarning}
            </div>
          )}
        </div>
      </div>

      {/* Main video area */}
      <div className="video-container">
        <div className="main-video">
          <div className="video-grid">
            {/* Remote participant video */}
            <div className="remote-video">
              <video
                ref={remoteVideoRef}
                autoPlay
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
              >
                <source src="/kling_20250925_Image_to_Video_Follow_the_3399_0.mp4" type="video/mp4" />
              </video>
              <div className="video-overlay">
                <span style={{ 
                  position: 'absolute', 
                  bottom: '10px', 
                  left: '10px',
                  background: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.8rem'
                }}>
                  {user.role === 'therapist' ? appointment.patient?.name : appointment.therapist?.name}
                </span>
                {isRecording && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: '#e53e3e',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.8rem'
                  }}>
                    🔴 {t('video.recording')}
                  </div>
                )}
                {user.role === 'therapist' && isAnalyzing && (
                  <div style={{ 
                    position: 'absolute', 
                    top: '10px', 
                    left: '10px',
                    background: 'rgba(0,0,0,0.8)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.8rem'
                  }}>
                    {t('video.analyzing')}
                  </div>
                )}
              </div>
            </div>

            {/* Local participant video (picture-in-picture) */}
            <div className="local-video">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  transform: cameraMode === 'front' ? 'scaleX(-1)' : 'none'
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: '5px',
                left: '5px',
                background: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '0.7rem'
              }}>
                {t('video.you')} ({cameraMode === 'front' ? t('video.frontCamera') : t('video.rearCamera')})
              </div>
            </div>
          </div>
        </div>

        {/* AI Analysis Panel */}
        <div className="ai-analysis-panel">
          <h4 style={{ margin: '0 0 1rem 0' }}>
            {user.role === 'therapist' ? t('video.aiAnalysis') : t('video.consultationInfo')}
          </h4>
          
          {user.role === 'therapist' ? (
            <div className="posture-analysis">
              {postureData && isAnalyzing ? (
                <>
                  <div className="analysis-item">
                    <h5 style={{ margin: '0 0 0.5rem 0' }}>{t('video.overallScore')}</h5>
                    <div 
                      className="analysis-score"
                      style={{ color: getScoreColor(postureData.overallScore) }}
                    >
                      {postureData.overallScore}%
                    </div>
                  </div>

                  <div className="analysis-item">
                    <h5 style={{ margin: '0 0 0.5rem 0' }}>{t('video.musculoskeletalAssessment')}</h5>
                    <div style={{ fontSize: '0.85rem', color: '#4a5568' }}>
                      <div style={{ marginBottom: '0.5rem' }}>
                        <strong>{t('video.forwardHeadPosture')}:</strong> {postureData.musculoskeletalAssessment.forwardHeadPosture}{t('video.millimeters')} {t('video.forwardPosture')}
                      </div>
                      <div style={{ marginBottom: '0.5rem' }}>
                        <strong>{t('video.roundedShoulders')}:</strong> {postureData.musculoskeletalAssessment.roundedShoulders}{t('video.degrees')}
                      </div>
                      <div style={{ marginBottom: '0.5rem' }}>
                        <strong>{t('video.spinalCurvature')}:</strong> {postureData.musculoskeletalAssessment.spinalCurvature}
                      </div>
                    </div>
                  </div>

                  <div className="analysis-item">
                    <h5 style={{ margin: '0 0 0.5rem 0' }}>📊 {t('video.jointAngles')}</h5>
                    <div style={{ fontSize: '0.8rem', color: '#4a5568' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem' }}>
                        <div>{t('video.leftShoulder')}: {postureData.jointAngles.leftShoulder}{t('video.degrees')}</div>
                        <div>{t('video.rightShoulder')}: {postureData.jointAngles.rightShoulder}{t('video.degrees')}</div>
                        <div>{t('video.leftHip')}: {postureData.jointAngles.leftHip}{t('video.degrees')}</div>
                        <div>{t('video.rightHip')}: {postureData.jointAngles.rightHip}{t('video.degrees')}</div>
                      </div>
                    </div>
                  </div>

                  <div className="analysis-item">
                    <h5 style={{ margin: '0 0 0.5rem 0' }}>💡 {t('video.recommendations')}</h5>
                    <ul style={{
                      margin: 0,
                      paddingLeft: '1rem',
                      fontSize: '0.85rem',
                      color: '#4a5568'
                    }}>
                      {postureData.recommendations.slice(0, 3).map((rec, index) => (
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
                    {t('video.lastUpdate')}: {postureData.timestamp}
                  </div>
                </>
              ) : (
                <div style={{
                  textAlign: 'center',
                  color: '#718096',
                  padding: '2rem 0'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                    {!isSessionActive ? '⏳' : '🔄'}
                  </div>
                  <p>
                    {!isSessionActive 
                      ? t('video.waitingConnection')
                      : t('video.initializingAI')
                    }
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="analysis-item">
                <h5 style={{ margin: '0 0 0.5rem 0' }}>{t('video.therapist')}</h5>
                <p style={{ margin: 0 }}>{appointment.therapist?.name}</p>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#718096' }}>
                  {appointment.therapist?.specialization}
                </p>
              </div>

              <div className="analysis-item">
                <h5 style={{ margin: '0 0 0.5rem 0' }}>{t('video.connectionQuality')}</h5>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  color: getConnectionStatusColor()
                }}>
                  <span>●</span>
                  <span>{connectionStatus.quality === 'excellent' ? t('video.excellent') : 
                         connectionStatus.quality === 'good' ? t('video.good') :
                         connectionStatus.quality === 'fair' ? t('video.fair') : t('video.poor')}</span>
                </div>
              </div>

              <div className="analysis-item">
                <h5 style={{ margin: '0 0 0.5rem 0' }}>{t('video.instructions')}</h5>
                <ul style={{ 
                  margin: 0, 
                  paddingLeft: '1rem',
                  fontSize: '0.9rem',
                  color: '#4a5568'
                }}>
                  <li>{t('video.instruction1')}</li>
                  <li>{t('video.instruction2')}</li>
                  <li>{t('video.instruction3')}</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Control buttons */}
      <div className="controls">
        <button 
          className="control-btn mute-btn"
          onClick={() => setIsMuted(!isMuted)}
          style={{ backgroundColor: isMuted ? '#e53e3e' : '#4a5568' }}
        >
          {isMuted ? `🔇 ${t('video.unmute')}` : `🔊 ${t('video.mute')}`}
        </button>
        
        <button 
          className="control-btn camera-btn"
          onClick={() => setIsCameraOn(!isCameraOn)}
          style={{ backgroundColor: !isCameraOn ? '#e53e3e' : '#667eea' }}
        >
          {isCameraOn ? `📹 ${t('video.cameraOff')}` : `📷 ${t('video.cameraOn')}`}
        </button>

        <button 
          className="control-btn"
          onClick={handleCameraSwitch}
          style={{ backgroundColor: '#38a169' }}
        >
          🔄 {t('video.switchCamera')}
        </button>

        <button 
          className="control-btn"
          onClick={handleScreenShare}
          style={{ backgroundColor: isScreenSharing ? '#e53e3e' : '#805ad5' }}
        >
          {isScreenSharing ? `🚫 ${t('video.stopShare')}` : `📺 ${t('video.screenShare')}`}
        </button>

        <button 
          className="control-btn"
          onClick={handleStartRecording}
          style={{ backgroundColor: isRecording ? '#e53e3e' : '#38a169' }}
          disabled={isRecording}
        >
          {isRecording ? `🔴 ${t('video.recording')}` : `⏺️ ${t('video.record')}`}
        </button>

        <button 
          className="control-btn emergency-btn"
          onClick={handleEmergency}
          style={{ backgroundColor: '#e53e3e' }}
        >
          🚨 {t('video.emergency')}
        </button>
        
        <button 
          className="control-btn end-call-btn"
          onClick={handleEndCall}
        >
          📞 {t('video.endCall')}
        </button>
      </div>
    </div>
  );
};

export default VideoConsultation;