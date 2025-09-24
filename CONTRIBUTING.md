# Contributing to Virtual Physiotherapy Platform

Thank you for your interest in contributing to the Virtual Physiotherapy Platform! This project aims to make physiotherapy accessible through AI-powered video consultations with full Cantonese language support for Hong Kong users.

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/virtual-physiotherapy-platform.git
   cd virtual-physiotherapy-platform
   ```

2. **Install dependencies**:
   ```bash
   npm run install:all
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   - Open http://localhost:3000
   - Choose between Therapist (陳醫生) or Patient (李先生)

## 📋 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow React best practices and hooks patterns
- Maintain Cantonese language support throughout
- Write comprehensive tests for new features

### Commit Messages
- Use conventional commit format: `type(scope): description`
- Examples:
  - `feat(ai): add posture analysis scoring`
  - `fix(video): resolve WebRTC connection issues`
  - `docs(readme): update installation instructions`

### Branch Naming
- Feature branches: `feature/description`
- Bug fixes: `fix/description`
- Documentation: `docs/description`

## 🏗️ Project Structure

```
├── .kiro/specs/                 # Project specifications
│   └── virtual-physiotherapy-platform/
│       ├── requirements.md      # Detailed requirements
│       ├── design.md           # Technical design
│       └── tasks.md            # Implementation tasks
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── App.tsx            # Main application
│   │   └── App.css            # Styling
├── server/                     # Node.js backend
│   └── index.js               # Express server
├── package.json               # Root dependencies
└── README.md                  # Project documentation
```

## 🎯 Areas for Contribution

### High Priority
- **WebRTC Integration**: Implement real video streaming
- **AI Model Integration**: Connect actual posture analysis models
- **Database Implementation**: Add PostgreSQL persistence
- **Authentication System**: Implement secure user authentication
- **Mobile App Development**: React Native applications

### Medium Priority
- **Testing**: Unit and integration tests
- **Performance Optimization**: Video streaming optimization
- **Accessibility**: Screen reader compatibility
- **Internationalization**: Additional language support

### Documentation
- API documentation
- User guides in Cantonese
- Developer setup guides
- Architecture documentation

## 🧪 Testing

### Running Tests
```bash
npm test                    # Run all tests
npm run test:client        # Client-side tests only
npm run test:server        # Server-side tests only
```

### Test Requirements
- Maintain 90% code coverage
- Test Cantonese localization
- Include integration tests for AI features
- Test WebRTC functionality across browsers

## 🌐 Localization

### Cantonese Language Support
- All UI text must have Traditional Chinese translations
- Use proper Hong Kong terminology for medical terms
- Test with screen readers for accessibility
- Maintain cultural appropriateness

### Adding New Text
1. Add English text with translation key
2. Add Traditional Chinese translation
3. Test with both language settings
4. Verify cultural appropriateness

## 🔒 Security Guidelines

### Healthcare Compliance
- Follow HIPAA guidelines for patient data
- Implement end-to-end encryption for video calls
- Secure storage of medical information
- Audit logging for all user actions

### Code Security
- No hardcoded secrets or API keys
- Use environment variables for configuration
- Validate all user inputs
- Implement proper authentication and authorization

## 📝 Pull Request Process

1. **Create Feature Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**:
   - Follow coding standards
   - Add tests for new functionality
   - Update documentation as needed

3. **Test Thoroughly**:
   - Run all tests locally
   - Test in both English and Cantonese
   - Verify mobile responsiveness

4. **Submit Pull Request**:
   - Use descriptive title and description
   - Reference related issues
   - Include screenshots for UI changes
   - Request review from maintainers

5. **Address Feedback**:
   - Respond to review comments
   - Make requested changes
   - Update tests if needed

## 🐛 Bug Reports

### Before Reporting
- Check existing issues
- Test in multiple browsers
- Try both language settings
- Gather system information

### Bug Report Template
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 91]
- Language: [English/Cantonese]
```

## 💡 Feature Requests

### Feature Request Template
```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Alternative solutions or features you've considered.

**Additional context**
Any other context or screenshots about the feature request.
```

## 📞 Getting Help

- **Documentation**: Check the README and specs folder
- **Issues**: Search existing GitHub issues
- **Discussions**: Use GitHub Discussions for questions
- **Code Review**: Request review from maintainers

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- Project documentation

Thank you for contributing to making physiotherapy more accessible through technology! 🏥💻