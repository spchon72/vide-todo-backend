const express = require('express');
const Todo = require('../models/Todo');


const router = express.Router();

// CORS 미들웨어 추가 (이 라우터에만 적용)
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // 또는 특정 도메인: 'https://vibe-todo-frontend-eosin.vercel.app'
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  
  // Preflight 요청 처리
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

router.post('/', async (req, res) => {
	try {
		const { title, description, dueDate, tags } = req.body || {};
		if (!title || typeof title !== 'string' || title.trim().length === 0) {
			return res.status(400).json({ message: 'title은 필수입니다.' });
		}

		const todo = await Todo.create({
			title: title.trim(),
			description,
			dueDate,
			tags
		});

		return res.status(201).json(todo);
	} catch (err) {
		return res.status(400).json({ message: '생성 실패', error: err.message });
	}
});

router.get('/', async (_req, res) => {
	try {
		const todos = await Todo.find().sort({ createdAt: -1 });
		return res.json(todos);
	} catch (err) {
		return res.status(500).json({ message: '조회 실패', error: err.message });
	}
});

router.patch('/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const update = {};
		const { title, description, completed, dueDate, tags } = req.body || {};

		if (title !== undefined) {
			if (typeof title !== 'string' || title.trim().length === 0) {
				return res.status(400).json({ message: 'title이 유효하지 않습니다.' });
			}
			update.title = title.trim();
		}
		if (description !== undefined) update.description = description;
		if (completed !== undefined) update.completed = completed;
		if (dueDate !== undefined) update.dueDate = dueDate;
		if (tags !== undefined) update.tags = tags;

		const todo = await Todo.findByIdAndUpdate(id, update, {
			new: true,
			runValidators: true
		});
		if (!todo) {
			return res.status(404).json({ message: '존재하지 않는 할일입니다.' });
		}
		return res.json(todo);
	} catch (err) {
		return res.status(400).json({ message: '수정 실패', error: err.message });
	}
});

router.delete('/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const deleted = await Todo.findByIdAndDelete(id);
		if (!deleted) {
			return res.status(404).json({ message: '존재하지 않는 할일입니다.' });
		}
		return res.status(204).send();
	} catch (err) {
		return res.status(400).json({ message: '삭제 실패', error: err.message });
	}
});

module.exports = router;


