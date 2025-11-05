const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema(
	{
		title: { type: String, required: true, trim: true, minlength: 1, maxlength: 200 },
		description: { type: String, trim: true, maxlength: 2000 },
		completed: { type: Boolean, default: false },
		dueDate: { type: Date },
		tags: { type: [String], default: [] },
		createdAt: { type: Date, default: Date.now }
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Todo', TodoSchema);


