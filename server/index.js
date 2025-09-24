const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// Mock data for prototype
const users = [
  {
    id: '1',
    email: 'therapist@clinic.hk',
    name: '陳醫生',
    role: 'therapist',
    specialization: '物理治療'
  },
  {
    id: '2', 
    email: 'patient@email.hk',
    name: '李先生',
    role: 'patient',
    condition: '腰痛'
  }
];

const appointments = [
  {
    id: '1',
    patientId: '2',
    therapistId: '1',
    date: '2024-01-15',
    time: '14:00',
    status: 'scheduled',
    type: 'initial'
  }
];

// API Routes
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.get('/api/appointments', (req, res) => {
  const { userId, role } = req.query;
  let userAppointments = appointments;
  
  if (role === 'patient') {
    userAppointments = appointments.filter(apt => apt.patientId === userId);
  } else if (role === 'therapist') {
    userAppointments = appointments.filter(apt => apt.therapistId === userId);
  }
  
  // Add user details to appointments
  const enrichedAppointments = userAppointments.map(apt => ({
    ...apt,
    patient: users.find(u => u.id === apt.patientId),
    therapist: users.find(u => u.id === apt.therapistId)
  }));
  
  res.json(enrichedAppointments);
});

app.post('/api/appointments', (req, res) => {
  const newAppointment = {
    id: String(appointments.length + 1),
    ...req.body,
    status: 'scheduled'
  };
  appointments.push(newAppointment);
  res.json(newAppointment);
});

// WebRTC Signaling
io.on('connection', (socket) => {
  console.log('用戶已連接:', socket.id);

  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);
    console.log(`用戶 ${userId} 加入房間 ${roomId}`);
  });

  socket.on('offer', (roomId, offer) => {
    socket.to(roomId).emit('offer', offer);
  });

  socket.on('answer', (roomId, answer) => {
    socket.to(roomId).emit('answer', answer);
  });

  socket.on('ice-candidate', (roomId, candidate) => {
    socket.to(roomId).emit('ice-candidate', candidate);
  });

  socket.on('disconnect', () => {
    console.log('用戶已斷線:', socket.id);
  });
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`伺服器運行於端口 ${PORT}`);
});