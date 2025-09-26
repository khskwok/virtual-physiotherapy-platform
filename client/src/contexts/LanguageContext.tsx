import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'zh-HK' | 'en-US';

// Define translation keys type
type TranslationKey = keyof typeof translations['zh-HK'];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionaries
const translations = {
  'zh-HK': {
    // Header
    'header.title': '🏥 虛擬物理治療平台',
    'header.welcome': '歡迎',
    'header.logout': '登出',

    // Login Page
    'login.title': '登入系統',
    'login.selectUser': '選擇用戶類型',
    'login.therapist': '物理治療師',
    'login.patient': '病人',
    'login.therapistDesc': '專業物理治療師',
    'login.patientDesc': '需要治療的病人',

    // Dashboard
    'dashboard.title': '控制台',
    'dashboard.appointments': '預約',
    'dashboard.noAppointments': '暫無預約',
    'dashboard.startConsultation': '開始諮詢',
    'dashboard.scheduled': '已預約',
    'dashboard.inProgress': '進行中',
    'dashboard.completed': '已完成',

    // Video Consultation
    'video.title': '視頻諮詢進行中',
    'video.consultation': '諮詢',
    'video.aiAnalysis': 'AI 姿勢分析',
    'video.consultationInfo': '諮詢資訊',
    'video.therapist': '治療師',
    'video.connectionStatus': '連接狀態',
    'video.notes': '注意事項',
    'video.mute': '靜音',
    'video.unmute': '取消靜音',
    'video.camera': '攝像頭',
    'video.cameraOff': '關閉攝像頭',
    'video.cameraOn': '開啟攝像頭',
    'video.switchCamera': '切換鏡頭',
    'video.screenShare': '螢幕分享',
    'video.stopShare': '停止分享',
    'video.record': '開始錄製',
    'video.recording': '錄製中',
    'video.emergency': '緊急聯絡',
    'video.endCall': '結束通話',
    'video.recommendations': '治療建議',
    'video.jointAngles': '關節角度',
    'video.lastUpdate': '最後更新',
    'video.connecting': '連接中...',
    'video.connected': '已連接',
    'video.reconnecting': '重新連接中...',
    'video.disconnected': '已斷線',
    'video.excellent': '優秀',
    'video.good': '良好',
    'video.fair': '一般',
    'video.poor': '較差',

    // Build Info
    'build.info': '版本資訊',
    'build.number': '版本號',
    'build.date': '建置日期',
    'build.commit': '提交版本',
    'build.branch': '分支',
    'build.type': '建置類型',
    'build.development': '開發版',
    'build.production': '正式版',
    'build.clickForDetails': '點擊查看詳細資訊',

    // Language Toggle
    'language.switch': '切換語言',
    'language.switchTo': '切換至',
    'language.chinese': '繁體中文',
    'language.english': 'English',

    // Login Page Extended
    'login.demoNotice': '這是一個演示原型，請選擇您的身份來體驗平台功能',
    'login.featuresInclude': '功能包括:',
    'login.feature.appointments': '預約管理',
    'login.feature.videoConsult': '視頻諮詢',
    'login.feature.aiAnalysis': 'AI 姿勢分析',
    'login.feature.bilingual': '雙語界面支援',

    // Dashboard Extended
    'dashboard.therapistDashboard': '🩺 治療師控制台',
    'dashboard.patientDashboard': '👤 病人控制台',
    'dashboard.specialization': '專科',
    'dashboard.treatment': '治療項目',
    'dashboard.todayDate': '今日日期',
    'dashboard.bookConsultation': '📞 預約諮詢',
    'dashboard.patient': '病人',
    'dashboard.treatmentType': '治療類型',
    'dashboard.condition': '病症',
    'dashboard.therapist': '治療師',
    'dashboard.consultationType': '諮詢類型',
    'dashboard.initial': '初診',
    'dashboard.followUp': '覆診',
    'dashboard.startVideoConsult': '🎥 開始視頻諮詢',
    'dashboard.aiTools': '🤖 AI 分析工具',
    'dashboard.aiDescription': '在視頻諮詢期間，AI 將自動分析病人的姿勢和動作模式',
    'dashboard.postureAnalysis': '姿勢分析',
    'dashboard.postureDescription': '實時檢測關節角度',
    'dashboard.movementAssessment': '動作評估',
    'dashboard.movementDescription': '量化活動範圍',
    'dashboard.anomalyDetection': '異常檢測',
    'dashboard.anomalyDescription': '標記潛在問題',

    // Video Consultation Extended
    'video.consultationWith': '與 {name} 的諮詢',
    'video.quality': '品質',
    'video.packetLoss': '封包遺失',
    'video.frontCamera': '前鏡頭',
    'video.rearCamera': '後鏡頭',
    'video.you': '您',
    'video.analyzing': '🤖 AI 分析中...',
    'video.overallScore': '整體評分',
    'video.musculoskeletalAssessment': '🔍 肌肉骨骼評估',
    'video.forwardHeadPosture': '前頭姿勢',
    'video.roundedShoulders': '圓肩程度',
    'video.spinalCurvature': '脊椎曲度',
    'video.leftShoulder': '左肩',
    'video.rightShoulder': '右肩',
    'video.leftHip': '左髖',
    'video.rightHip': '右髖',
    'video.waitingConnection': '等待視頻連接建立...',
    'video.initializingAI': '正在初始化 AI 姿勢分析...',
    'video.connectionQuality': '連接品質',
    'video.instructions': '注意事項',
    'video.instruction1': '請在光線充足的環境進行',
    'video.instruction2': '確保攝像頭能清楚看到全身',
    'video.instruction3': '按治療師指示進行動作',
    'video.recordingConsent': '是否同意錄製本次諮詢以供後續分析？錄製內容將嚴格保密。',
    'video.emergencyActivated': '緊急聯絡功能已啟動',
    'video.emergencyServices': '香港緊急服務: 999',
    'video.medicalHotline': '醫療緊急熱線: 2300 6555',
    'video.timeWarning5min': '5分鐘後將自動結束諮詢',
    'video.timeWarning2min': '2分鐘後將自動結束諮詢',
    'video.timeWarning1min': '1分鐘後將自動結束諮詢',
    'video.timeUp': '諮詢時間已到，正在結束會話...',
    
    // AI Analysis Extended
    'video.recommendation1': '建議調整坐姿，保持脊椎挺直',
    'video.recommendation2': '肩膀稍微向後拉，避免前傾',
    'video.recommendation3': '定期進行頸部伸展運動',
    'video.recommendation4': '加強核心肌群訓練以改善姿勢穩定性',
    'video.spinalCurvatureNormal': '正常範圍',
    'video.spinalCurvatureMild': '輕度前凸增加',
    'video.asymmetryGood': '姿勢對稱性良好',
    'video.asymmetryPoor1': '左右肩膀高度不對稱',
    'video.asymmetryPoor2': '可能存在肌肉代償模式',
    'video.riskLow': '姿勢風險較低',
    'video.riskHigh1': '長期不良姿勢風險',
    'video.riskHigh2': '肌肉骨骼疼痛風險增加',
    'video.improvementGood': '較上次評估有顯著改善',
    'video.improvementSimilar': '與上次評估相似，需持續關注',
    'video.trend1': '肩膀對齊度逐漸改善',
    'video.trend2': '核心穩定性需要加強',
    'video.trend3': '整體姿勢意識提升',
    'video.forwardPosture': '前傾',
    'video.degrees': '°',
    'video.millimeters': 'mm',

    // User Names
    'user.drChen': '陳醫生',
    'user.mrLee': '李先生',
    'user.physiotherapySpecialist': '物理治療專科',
    'user.lowerBackPainTreatment': '腰痛治療',

    // Common
    'common.loading': '載入中...',
    'common.error': '錯誤',
    'common.success': '成功',
    'common.cancel': '取消',
    'common.confirm': '確認',
    'common.save': '儲存',
    'common.delete': '刪除',
    'common.edit': '編輯',
    'common.view': '查看',
    'common.back': '返回',
    'common.next': '下一步',
    'common.previous': '上一步',
    'common.close': '關閉'
  },

  'en-US': {
    // Header
    'header.title': '🏥 Virtual Physiotherapy Platform',
    'header.welcome': 'Welcome',
    'header.logout': 'Logout',

    // Login Page
    'login.title': 'Login System',
    'login.selectUser': 'Select User Type',
    'login.therapist': 'Physiotherapist',
    'login.patient': 'Patient',
    'login.therapistDesc': 'Professional Physiotherapist',
    'login.patientDesc': 'Patient Seeking Treatment',

    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.appointments': 'Appointments',
    'dashboard.noAppointments': 'No Appointments',
    'dashboard.startConsultation': 'Start Consultation',
    'dashboard.scheduled': 'Scheduled',
    'dashboard.inProgress': 'In Progress',
    'dashboard.completed': 'Completed',

    // Video Consultation
    'video.title': 'Video Consultation in Progress',
    'video.consultation': 'Consultation',
    'video.aiAnalysis': 'AI Posture Analysis',
    'video.consultationInfo': 'Consultation Information',
    'video.therapist': 'Therapist',
    'video.connectionStatus': 'Connection Status',
    'video.notes': 'Notes',
    'video.mute': 'Mute',
    'video.unmute': 'Unmute',
    'video.camera': 'Camera',
    'video.cameraOff': 'Turn Off Camera',
    'video.cameraOn': 'Turn On Camera',
    'video.switchCamera': 'Switch Camera',
    'video.screenShare': 'Screen Share',
    'video.stopShare': 'Stop Sharing',
    'video.record': 'Start Recording',
    'video.recording': 'Recording',
    'video.emergency': 'Emergency Contact',
    'video.endCall': 'End Call',
    'video.recommendations': 'Recommendations',
    'video.jointAngles': 'Joint Angles',
    'video.lastUpdate': 'Last Update',
    'video.connecting': 'Connecting...',
    'video.connected': 'Connected',
    'video.reconnecting': 'Reconnecting...',
    'video.disconnected': 'Disconnected',
    'video.excellent': 'Excellent',
    'video.good': 'Good',
    'video.fair': 'Fair',
    'video.poor': 'Poor',

    // Build Info
    'build.info': 'Build Info',
    'build.number': 'Build Number',
    'build.date': 'Build Date',
    'build.commit': 'Commit',
    'build.branch': 'Branch',
    'build.type': 'Build Type',
    'build.development': 'Development',
    'build.production': 'Production',
    'build.clickForDetails': 'Click for details',

    // Language Toggle
    'language.switch': 'Switch Language',
    'language.switchTo': 'Switch to',
    'language.chinese': '繁體中文',
    'language.english': 'English',

    // Login Page Extended
    'login.demoNotice': 'This is a demo prototype. Please select your role to experience the platform features',
    'login.featuresInclude': 'Features include:',
    'login.feature.appointments': 'Appointment Management',
    'login.feature.videoConsult': 'Video Consultation',
    'login.feature.aiAnalysis': 'AI Posture Analysis',
    'login.feature.bilingual': 'Bilingual Interface Support',

    // Dashboard Extended
    'dashboard.therapistDashboard': '🩺 Therapist Dashboard',
    'dashboard.patientDashboard': '👤 Patient Dashboard',
    'dashboard.specialization': 'Specialization',
    'dashboard.treatment': 'Treatment',
    'dashboard.todayDate': 'Today\'s Date',
    'dashboard.bookConsultation': '📞 Book Consultation',
    'dashboard.patient': 'Patient',
    'dashboard.treatmentType': 'Treatment Type',
    'dashboard.condition': 'Condition',
    'dashboard.therapist': 'Therapist',
    'dashboard.consultationType': 'Consultation Type',
    'dashboard.initial': 'Initial',
    'dashboard.followUp': 'Follow-up',
    'dashboard.startVideoConsult': '🎥 Start Video Consultation',
    'dashboard.aiTools': '🤖 AI Analysis Tools',
    'dashboard.aiDescription': 'During video consultation, AI will automatically analyze patient posture and movement patterns',
    'dashboard.postureAnalysis': 'Posture Analysis',
    'dashboard.postureDescription': 'Real-time joint angle detection',
    'dashboard.movementAssessment': 'Movement Assessment',
    'dashboard.movementDescription': 'Quantify range of motion',
    'dashboard.anomalyDetection': 'Anomaly Detection',
    'dashboard.anomalyDescription': 'Flag potential issues',

    // Video Consultation Extended
    'video.consultationWith': 'Consultation with {name}',
    'video.quality': 'Quality',
    'video.packetLoss': 'Packet Loss',
    'video.frontCamera': 'Front Camera',
    'video.rearCamera': 'Rear Camera',
    'video.you': 'You',
    'video.analyzing': '🤖 AI Analyzing...',
    'video.overallScore': 'Overall Score',
    'video.musculoskeletalAssessment': '🔍 Musculoskeletal Assessment',
    'video.forwardHeadPosture': 'Forward Head Posture',
    'video.roundedShoulders': 'Rounded Shoulders',
    'video.spinalCurvature': 'Spinal Curvature',
    'video.leftShoulder': 'Left Shoulder',
    'video.rightShoulder': 'Right Shoulder',
    'video.leftHip': 'Left Hip',
    'video.rightHip': 'Right Hip',
    'video.waitingConnection': 'Waiting for video connection...',
    'video.initializingAI': 'Initializing AI posture analysis...',
    'video.connectionQuality': 'Connection Quality',
    'video.instructions': 'Instructions',
    'video.instruction1': 'Please ensure good lighting conditions',
    'video.instruction2': 'Make sure camera can see your full body clearly',
    'video.instruction3': 'Follow therapist instructions for movements',
    'video.recordingConsent': 'Do you consent to recording this consultation for analysis? Recording will be kept confidential.',
    'video.emergencyActivated': 'Emergency contact activated',
    'video.emergencyServices': 'Hong Kong Emergency Services: 999',
    'video.medicalHotline': 'Medical Emergency Hotline: 2300 6555',
    'video.timeWarning5min': 'Consultation will end automatically in 5 minutes',
    'video.timeWarning2min': 'Consultation will end automatically in 2 minutes',
    'video.timeWarning1min': 'Consultation will end automatically in 1 minute',
    'video.timeUp': 'Consultation time is up, ending session...',
    
    // AI Analysis Extended
    'video.recommendation1': 'Adjust sitting posture, keep spine straight',
    'video.recommendation2': 'Pull shoulders slightly back, avoid forward lean',
    'video.recommendation3': 'Regular neck stretching exercises',
    'video.recommendation4': 'Strengthen core muscles to improve postural stability',
    'video.spinalCurvatureNormal': 'Normal range',
    'video.spinalCurvatureMild': 'Mild increased lordosis',
    'video.asymmetryGood': 'Good postural symmetry',
    'video.asymmetryPoor1': 'Left-right shoulder height asymmetry',
    'video.asymmetryPoor2': 'Possible muscle compensation patterns',
    'video.riskLow': 'Low postural risk',
    'video.riskHigh1': 'Long-term poor posture risk',
    'video.riskHigh2': 'Increased musculoskeletal pain risk',
    'video.improvementGood': 'Significant improvement from previous assessment',
    'video.improvementSimilar': 'Similar to previous assessment, continued attention needed',
    'video.trend1': 'Shoulder alignment gradually improving',
    'video.trend2': 'Core stability needs strengthening',
    'video.trend3': 'Overall postural awareness improving',
    'video.forwardPosture': 'forward',
    'video.degrees': '°',
    'video.millimeters': 'mm',

    // User Names
    'user.drChen': 'Dr. Chen',
    'user.mrLee': 'Mr. Lee',
    'user.physiotherapySpecialist': 'Physiotherapy Specialist',
    'user.lowerBackPainTreatment': 'Lower Back Pain Treatment',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.close': 'Close'
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Get saved language from localStorage or default to Traditional Chinese
    const saved = localStorage.getItem('language') as Language;
    return saved || 'zh-HK';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  useEffect(() => {
    // Update document language attribute
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};