import express from 'express';
import { createTask, getTasks, getTask, updateTask, deleteTask } from '../controllers/task/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/task/create', protect, createTask);
router.get('/tasks', protect, getTasks);
// protect is a middleware that checks if the user is logged in
router.get('/task/:id', protect, getTask);
router.patch('/task/:id', protect, updateTask);
router.delete('/task/:id', protect, deleteTask);

export default router; 