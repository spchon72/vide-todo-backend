require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const todosRouter = require('./routes/todos');

const app = express();

// CORS 설정 - 개발 환경용 (여러 출처 허용)
app.use(cors({
	origin: [
		'http://localhost:3000',
		'http://localhost:5000',
		'http://127.0.0.1:5500'
	],
	credentials: true,
	methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/todo';

app.get('/', (_req, res) => {
	res.json({ status: 'ok', message: 'Todo backend is running' });
});

app.use('/todos', todosRouter);

async function start() {
	try {
		await mongoose.connect(mongoUri, {
			serverSelectionTimeoutMS: 5000, // 5초 타임아웃
			socketTimeoutMS: 45000,
		});
		console.log('✅ MongoDB 연결 성공');
		app.listen(port, () => {
			console.log(`🚀 Server listening on http://localhost:${port}`);
		});
	} catch (err) {
		console.error('❌ MongoDB 연결 실패:', err.message);
		console.error('\n💡 해결 방법:');
		console.error('   1. MongoDB 서비스가 실행 중인지 확인하세요.');
		console.error('   2. 또는 MongoDB Atlas를 사용하려면 환경변수 MONGODB_URI를 설정하세요.');
		console.error('   3. 예: $env:MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/todo"');
		console.error('\n   현재 연결 시도 URI:', mongoUri);
		process.exit(1);
	}
}

start();


