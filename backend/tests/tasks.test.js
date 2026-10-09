import test from 'node:test';
import assert from 'node:assert/strict';
import TaskModel from '../src/models/tasks/TaskModel.js';
import { createTask } from '../src/controllers/task/taskController.js';

test('new tasks preserve the selected completion status', async (t) => {
  t.mock.method(TaskModel.prototype, 'save', async function () { return this; });
  for (const completed of [true, false]) {
    await new Promise((resolve, reject) => {
      const request = {
        user: { _id: '507f1f77bcf86cd799439011' },
        body: { title: 'Temporary test', description: 'No database writes', completed },
      };
      const response = {
        status(code) { assert.equal(code, 201); return this; },
        json(task) { assert.equal(task.completed, completed); resolve(); },
      };
      createTask(request, response, reject);
    });
  }
});
