import express from 'express';
import { createTask, getTasks, getTask } from '../controllers/task/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/task/create', protect, createTask);
router.get('/tasks', protect, getTasks);
// protect is a middleware that checks if the user is logged in
router.get('/task/:id', protect, getTask);

export default router; 