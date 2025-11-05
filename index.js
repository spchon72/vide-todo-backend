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
// CORS 설정 - express.json() 전에 배치
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'http://localhost:5173',
  'http://127.0.0.1:5500',
  'https://vibe-todo-frontend-git-main-sungpum-chons-projects.vercel.app',
  // Vercel 패턴 매칭
  /^https:\/\/.*\.vercel\.app$/,
  /^https:\/\/vibe-todo-frontend.*\.vercel\.app$/,
];

app.use(cors({
  origin: function (origin, callback) {
    // origin이 없으면 (같은 출처 요청 등) 허용
    if (!origin) return callback(null, true);
    
    // 허용된 origin 목록 확인
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return origin === allowed;
      } else if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('⚠️ CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(express.json());

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
