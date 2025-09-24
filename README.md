# 🏥 Virtual Physiotherapy Platform - Prototype

A simplified prototype demonstrating the consultancy journey between physiotherapists and patients with AI-powered posture analysis and full Cantonese language support.

## 🚀 Features Demonstrated

### For Patients (病人)
- **Dashboard**: View appointments and treatment information
- **Video Consultation**: Join video calls with physiotherapists
- **Cantonese Interface**: Full Traditional Chinese UI support
- **Mobile-Friendly**: Responsive design for all devices

### For Therapists (治療師)
- **Patient Management**: View patient appointments and history
- **AI Analysis**: Real-time posture analysis during consultations
- **Professional Dashboard**: Comprehensive treatment overview
- **Clinical Tools**: Integrated assessment and recommendation tools

### Core Technologies
- **Frontend**: React.js with TypeScript and Cantonese localization
- **Backend**: Node.js with Express and Socket.io for real-time communication
- **AI Simulation**: Mock posture analysis with realistic data
- **WebRTC Ready**: Infrastructure for real video communication

## 🛠️ Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm run install:all
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Access the application**:
   - Open http://localhost:3000 in your browser
   - Choose between Therapist (陳醫生) or Patient (李先生) to explore different user journeys

## 🎯 User Journey Demo

### Patient Journey (病人體驗)
1. **Login** as 李先生 (Patient)
2. **Dashboard** shows treatment information and appointments
3. **Book Consultation** if no appointments exist
4. **Start Video Call** to begin consultation
5. **Receive Care** with real-time guidance from therapist

### Therapist Journey (治療師體驗)
1. **Login** as 陳醫生 (Therapist)
2. **Dashboard** displays patient appointments and AI tools overview
3. **Start Consultation** with scheduled patients
4. **AI Analysis** provides real-time posture assessment
5. **Clinical Insights** help make informed treatment decisions

## 🤖 AI Features Simulated

- **Real-time Posture Analysis**: Shoulder alignment, spine angle assessment
- **Movement Scoring**: Overall posture score with color-coded feedback
- **Clinical Recommendations**: Automated suggestions based on analysis
- **Progress Tracking**: Historical data visualization (planned)

## 🌐 Cantonese Language Support

- **Traditional Chinese UI**: All interface elements in 繁體中文
- **Cultural Adaptation**: Hong Kong-specific date formats and terminology
- **Accessibility**: Screen reader compatible Chinese text
- **Professional Medical Terms**: Accurate physiotherapy terminology

## 📱 Technical Architecture

```
Frontend (React + TypeScript)
├── LoginPage - User authentication simulation
├── Dashboard - Role-based control panels
├── VideoConsultation - WebRTC-ready video interface
└── AI Analysis Panel - Real-time posture feedback

Backend (Node.js + Express)
├── REST API - User and appointment management
├── Socket.io - Real-time communication
├── Mock Data - Realistic user and appointment data
└── WebRTC Signaling - Video call infrastructure
```

## 🔧 Development Notes

This prototype demonstrates:
- **Spec-driven development** approach with comprehensive requirements
- **Microservices-ready** architecture for AWS deployment
- **Healthcare compliance** considerations in design
- **Scalable infrastructure** patterns for production deployment

## 📋 Next Steps for Production

1. **Implement WebRTC** for real video streaming
2. **Integrate actual AI models** for posture analysis
3. **Add database persistence** with PostgreSQL
4. **Deploy to AWS** using the designed infrastructure
5. **Add security features** including encryption and authentication
6. **Implement MCP servers** for extensible AI capabilities

## 🏗️ Full Implementation Plan

The complete implementation plan with 39 detailed tasks is available in `.kiro/specs/virtual-physiotherapy-platform/tasks.md`. Each task includes:
- Specific coding requirements
- Testing specifications
- Requirements traceability
- Progressive complexity building

## 📞 Support

This prototype illustrates the complete consultancy journey from initial login through video consultation with AI-enhanced assessment capabilities, all delivered in a culturally-appropriate Cantonese interface for Hong Kong users.