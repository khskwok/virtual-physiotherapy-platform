import React from 'react';

interface BuildInfoProps {
  show?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'header';
}

const BuildInfo: React.FC<BuildInfoProps> = ({ 
  show = true, 
  position = 'bottom-right' 
}) => {
  // Get build info from package.json (injected at build time)
  const buildInfo = (window as any).__BUILD_INFO__ || {
    buildNumber: 'unknown',
    buildDate: 'unknown',
    gitCommit: 'unknown',
    gitBranch: 'unknown',
    buildType: 'development'
  };

  if (!show) return null;

  const positionStyles = {
    'top-left': { top: '10px', left: '10px' },
    'top-right': { top: '10px', right: '10px' },
    'bottom-left': { bottom: '10px', left: '10px' },
    'bottom-right': { bottom: '10px', right: '10px' }
  };

  const isDevelopment = buildInfo.buildType === 'development';

  // Header style for integration into app header
  if (position === 'header') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: isDevelopment ? 'rgba(255, 193, 7, 0.15)' : 'rgba(40, 167, 69, 0.15)',
          color: isDevelopment ? '#b8860b' : '#28a745',
          padding: '6px 10px',
          borderRadius: '4px',
          fontSize: '11px',
          fontFamily: 'monospace',
          border: `1px solid ${isDevelopment ? 'rgba(255, 193, 7, 0.3)' : 'rgba(40, 167, 69, 0.3)'}`,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          marginLeft: '12px'
        }}
        title={`Build: ${buildInfo.buildNumber}\nDate: ${new Date(buildInfo.buildDate).toLocaleString()}\nCommit: ${buildInfo.gitCommit}\nBranch: ${buildInfo.gitBranch}\nType: ${buildInfo.buildType}`}
        onClick={() => {
          console.log('🔧 Build Information:', buildInfo);
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = isDevelopment ? 'rgba(255, 193, 7, 0.25)' : 'rgba(40, 167, 69, 0.25)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = isDevelopment ? 'rgba(255, 193, 7, 0.15)' : 'rgba(40, 167, 69, 0.15)';
        }}
      >
        <span style={{ fontSize: '12px' }}>
          {isDevelopment ? '🔧' : '🚀'}
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span style={{ fontWeight: 'bold', lineHeight: '1.2' }}>
            Build #{buildInfo.buildNumber}
          </span>
          <span style={{ fontSize: '9px', opacity: 0.8, lineHeight: '1.1' }}>
            {buildInfo.gitBranch} • {buildInfo.gitCommit}
          </span>
        </div>
      </div>
    );
  }

  // Fixed position styles for corner positioning
  return (
    <div
      style={{
        position: 'fixed',
        ...positionStyles[position],
        backgroundColor: isDevelopment ? 'rgba(255, 193, 7, 0.9)' : 'rgba(40, 167, 69, 0.9)',
        color: isDevelopment ? '#000' : '#fff',
        padding: '8px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 9999,
        border: `1px solid ${isDevelopment ? '#ffc107' : '#28a745'}`,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        transition: 'opacity 0.3s ease'
      }}
      title={`Build: ${buildInfo.buildNumber}\nDate: ${new Date(buildInfo.buildDate).toLocaleString()}\nCommit: ${buildInfo.gitCommit}\nBranch: ${buildInfo.gitBranch}`}
      onClick={() => {
        console.log('Build Information:', buildInfo);
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '14px' }}>
          {isDevelopment ? '🔧' : '🚀'}
        </span>
        <span>
          Build #{buildInfo.buildNumber}
        </span>
      </div>
      <div style={{ fontSize: '10px', opacity: 0.8, marginTop: '2px' }}>
        {buildInfo.gitBranch} • {buildInfo.gitCommit}
      </div>
    </div>
  );
};

export default BuildInfo;