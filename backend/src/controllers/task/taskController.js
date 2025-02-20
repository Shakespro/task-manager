import asyncHandler from 'express-async-handler';
import TaskModel from '../../models/tasks/TaskModel.js';

// Create a task
export const createTask = asyncHandler(async (req, res) => {
    const { title, description, dueDate, priority, status } = req.body;

    if (!title || title.trim() === "") {
        return res.status(400).json({ message: 'Title is required!' });
    }
    if (!description || description.trim() === "") {
        return res.status(400).json({ message: 'Description is required' });
    }

    try {
        const task = new TaskModel({
            title,
            description,
            dueDate,
            priority,
            status,
            user: req.user._id,
        });

        await task.save();
        res.status(201).json(task);
    } catch (error) {
        console.error("Error in createTask: ", error.stack);
        res.status(500).json({ message: error.message });
    }
});

// Get all tasks
export const getTasks = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    if (!userId) {
        return res.status(400).json({ message: 'User not found' });
    }

    try {
        const tasks = await TaskModel.find({ user: userId });
        res.status(200).json({ length: tasks.length, tasks });
    } catch (error) {
        console.error("Error in getTasks: ", error.stack);
        res.status(500).json({ message: error.message });
    }
});

// Get a single task by ID
export const getTask = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    if (!id) {
        return res.status(400).json({ message: 'Please provide a task id' });
    }

    try {
        const task = await TaskModel.findById(id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (!task.user.equals(userId)) {
            return res.status(401).json({ message: 'Not authorized to view this task' });
        }

        res.status(200).json(task);
    } catch (error) {
        console.error("Error in getTask: ", error.stack);
        res.status(500).json({ message: error.message });
    }
});

// Update a task
export const updateTask = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description, dueDate, priority, status, completed } = req.body;
    const userId = req.user._id;

    if (!id) {
        return res.status(400).json({ message: 'Please provide a task id' });
    }

    try {
        const task = await TaskModel.findById(id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (!task.user.equals(userId)) {
            return res.status(401).json({ message: 'Not authorized to update this task' });
        }

        task.title = title || task.title;
        task.description = description || task.description;
        task.dueDate = dueDate || task.dueDate;
        task.priority = priority || task.priority;
        task.status = status || task.status;
        task.completed = completed !== undefined ? completed : task.completed; 

        await task.save();
        res.status(200).json(task);
    } catch (error) {
        console.error("Error in updateTask: ", error.stack);
        res.status(500).json({ message: error.message });
    }
});

// Delete a task
export const deleteTask = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    try {
        const task = await TaskModel.findById(id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (!task.user.equals(userId)) {
            return res.status(401).json({ message: 'Not authorized to delete this task' });
        }

        await TaskModel.findByIdAndDelete(id);
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error("Error in deleteTask: ", error.stack);
        res.status(500).json({ message: error.message });
    }
});
