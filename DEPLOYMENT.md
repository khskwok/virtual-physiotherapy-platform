# 🚀 Deployment Guide

This guide covers deploying the Virtual Physiotherapy Platform to various environments, from local development to production AWS infrastructure.

## 📋 Prerequisites

### Development Environment
- Node.js (v16 or higher)
- npm or yarn
- Git

### Production Environment
- AWS Account with appropriate permissions
- Docker (for containerization)
- AWS CLI configured
- AWS CDK installed

## 🏠 Local Development

### Quick Start
```bash
# Clone the repository
git clone https://github.com/your-username/virtual-physiotherapy-platform.git
cd virtual-physiotherapy-platform

# Install all dependencies
npm run install:all

# Start development servers
npm run dev
```

### Environment Variables
Create a `.env` file in the root directory:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-jwt-secret-key
DB_CONNECTION_STRING=postgresql://localhost:5432/physiotherapy_db
```

### Accessing the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Demo Users**: 
  - Therapist: 陳醫生 (Dr. Chen)
  - Patient: 李先生 (Mr. Lee)

## 🧪 Testing Environment

### Running Tests
```bash
# All tests
npm test

# Client tests only
cd client && npm test

# Server tests only
npm run test:server

# Coverage report
npm run test:coverage
```

### Test Data
The prototype includes mock data for:
- User profiles (therapist and patient)
- Appointment scheduling
- AI analysis results
- Video consultation sessions

## 🌐 Staging Deployment

### Docker Containerization

1. **Build Docker Images**:
```bash
# Build client
docker build -t physio-client ./client

# Build server
docker build -t physio-server ./server
```

2. **Docker Compose**:
```yaml
version: '3.8'
services:
  client:
    build: ./client
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:5000
  
  server:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=staging
      - PORT=5000
    depends_on:
      - postgres
      - redis
  
  postgres:
    image: postgres:13
    environment:
      - POSTGRES_DB=physiotherapy_db
      - POSTGRES_USER=physio_user
      - POSTGRES_PASSWORD=secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

3. **Start Staging Environment**:
```bash
docker-compose up -d
```

## ☁️ AWS Production Deployment

### Infrastructure as Code (AWS CDK)

1. **Install AWS CDK**:
```bash
npm install -g aws-cdk
```

2. **CDK Stack Configuration**:
```typescript
// infrastructure/lib/physio-stack.ts
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as elasticache from 'aws-cdk-lib/aws-elasticache';

export class PhysioStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC
    const vpc = new ec2.Vpc(this, 'PhysioVPC', {
      maxAzs: 2,
      natGateways: 1
    });

    // ECS Cluster
    const cluster = new ecs.Cluster(this, 'PhysioCluster', {
      vpc: vpc,
      containerInsights: true
    });

    // RDS PostgreSQL
    const database = new rds.DatabaseInstance(this, 'PhysioDatabase', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_13_7
      }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      vpc: vpc,
      multiAz: true,
      deletionProtection: true
    });

    // ElastiCache Redis
    const redis = new elasticache.CfnCacheCluster(this, 'PhysioRedis', {
      cacheNodeType: 'cache.t3.micro',
      engine: 'redis',
      numCacheNodes: 1
    });
  }
}
```

3. **Deploy Infrastructure**:
```bash
cd infrastructure
cdk bootstrap
cdk deploy
```

### Application Deployment

1. **Build and Push Docker Images**:
```bash
# Build for production
npm run build

# Tag and push to ECR
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-southeast-1.amazonaws.com

docker tag physio-client:latest <account-id>.dkr.ecr.ap-southeast-1.amazonaws.com/physio-client:latest
docker tag physio-server:latest <account-id>.dkr.ecr.ap-southeast-1.amazonaws.com/physio-server:latest

docker push <account-id>.dkr.ecr.ap-southeast-1.amazonaws.com/physio-client:latest
docker push <account-id>.dkr.ecr.ap-southeast-1.amazonaws.com/physio-server:latest
```

2. **ECS Service Configuration**:
```json
{
  "family": "physio-server",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::<account-id>:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "physio-server",
      "image": "<account-id>.dkr.ecr.ap-southeast-1.amazonaws.com/physio-server:latest",
      "portMappings": [
        {
          "containerPort": 5000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "PORT",
          "value": "5000"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/physio-server",
          "awslogs-region": "ap-southeast-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

## 🔧 Configuration Management

### Environment Variables

#### Development
```env
NODE_ENV=development
PORT=5000
JWT_SECRET=dev-secret-key
DB_CONNECTION_STRING=postgresql://localhost:5432/physiotherapy_db
REDIS_URL=redis://localhost:6379
```

#### Production
```env
NODE_ENV=production
PORT=5000
JWT_SECRET=${JWT_SECRET_FROM_SECRETS_MANAGER}
DB_CONNECTION_STRING=${RDS_CONNECTION_STRING}
REDIS_URL=${ELASTICACHE_REDIS_URL}
AWS_REGION=ap-southeast-1
S3_BUCKET_NAME=physio-platform-storage
CLOUDFRONT_DOMAIN=cdn.physiotherapy-platform.com
```

### MCP Server Configuration

```json
{
  "mcpServers": {
    "aws-healthcare": {
      "command": "uvx",
      "args": ["aws-healthcare-mcp@latest"],
      "env": {
        "AWS_REGION": "ap-southeast-1",
        "HEALTHCARE_COMPLIANCE": "true"
      }
    },
    "cantonese-nlp": {
      "command": "uvx",
      "args": ["cantonese-nlp-mcp@latest"],
      "env": {
        "LANGUAGE": "zh-HK",
        "MODEL_VERSION": "v2.1"
      }
    },
    "posture-analysis": {
      "command": "uvx",
      "args": ["posture-analysis-mcp@latest"],
      "env": {
        "MODEL_ENDPOINT": "https://api.posture-ai.com",
        "CONFIDENCE_THRESHOLD": "0.85"
      }
    }
  }
}
```

## 📊 Monitoring and Logging

### CloudWatch Configuration
```yaml
# cloudwatch-config.yml
logs:
  logs_collected:
    files:
      collect_list:
        - file_path: /var/log/physio-server/*.log
          log_group_name: /aws/ec2/physio-server
          log_stream_name: '{instance_id}'
          timezone: 'UTC'

metrics:
  namespace: PhysiotherapyPlatform
  metrics_collected:
    cpu:
      measurement: [cpu_usage_idle, cpu_usage_iowait]
      metrics_collection_interval: 60
    disk:
      measurement: [used_percent]
      metrics_collection_interval: 60
      resources: ['*']
    mem:
      measurement: [mem_used_percent]
      metrics_collection_interval: 60
```

### Health Checks
```javascript
// server/health.js
app.get('/health', (req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    services: {
      database: 'connected',
      redis: 'connected',
      ai_service: 'available'
    }
  };
  
  res.status(200).json(healthCheck);
});
```

## 🔒 Security Configuration

### SSL/TLS Certificate
```bash
# Using AWS Certificate Manager
aws acm request-certificate \
  --domain-name physiotherapy-platform.com \
  --subject-alternative-names *.physiotherapy-platform.com \
  --validation-method DNS
```

### Security Headers
```javascript
// server/security.js
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});
```

## 🚨 Troubleshooting

### Common Issues

1. **Port Already in Use**:
```bash
# Kill processes on port 5000
lsof -ti:5000 | xargs kill -9
```

2. **Database Connection Issues**:
```bash
# Check PostgreSQL status
pg_isready -h localhost -p 5432
```

3. **Memory Issues**:
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
```

### Log Analysis
```bash
# View application logs
docker logs physio-server

# Follow logs in real-time
docker logs -f physio-server

# AWS CloudWatch logs
aws logs tail /aws/ecs/physio-server --follow
```

## 📈 Performance Optimization

### Frontend Optimization
- Enable gzip compression
- Implement code splitting
- Optimize images and assets
- Use CDN for static content

### Backend Optimization
- Implement connection pooling
- Use Redis for caching
- Optimize database queries
- Enable compression middleware

### Video Streaming Optimization
- Adaptive bitrate streaming
- WebRTC optimization
- TURN/STUN server configuration
- Network quality monitoring

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm ci
      - run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-southeast-1
      
      - name: Deploy to ECS
        run: |
          aws ecs update-service --cluster physio-cluster --service physio-server --force-new-deployment
```

This deployment guide provides comprehensive instructions for deploying the Virtual Physiotherapy Platform across different environments, from local development to production AWS infrastructure with proper monitoring, security, and optimization configurations.