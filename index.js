require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const todosRouter = require('./routes/todos');

const app = express();

/* ===== 1) ENV ===== */
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI가 설정되지 않았습니다.');
  process.exit(1);
}
console.log('🔐 MONGODB_URI 감지:', MONGODB_URI.slice(0, 25) + '...');

/* ===== 2) MIDDLEWARE ===== */
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5000',
    'http://localhost:5173',
    'http://127.0.0.1:5500',
    // 배포된 프런트 주소가 있으면 여기에 추가 (예: 'https://<project>.cloudtype.app')
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

/* ===== 3) ROUTES ===== */
app.get('/', (_req, res) => {
  res.json({ status: 'ok', message: 'Todo backend is running' });
});
app.use('/todos', todosRouter);

/* ===== 4) BOOTSTRAP ===== */
(async function bootstrap() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // 10초 내 연결 실패 시 에러
      // 필요하면 dbName: 'todo'
    });
    console.log('✅ MongoDB connected');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ MongoDB connect error:', err.message);
    process.exit(1);
  }
})();
