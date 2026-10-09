import React from 'react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { TasksProvider, useTasks } from '../context/taskContext';
import Modal from '../app/Components/Modal/Modal';

vi.mock('axios', () => ({ default: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() } }));
vi.mock('../context/userContext', () => ({ useUserContext: () => ({ user: { _id: 'test-user' } }) }));
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }));

function TaskScreen() {
  const { openModalForAdd, isEditing, tasks } = useTasks();
  return <>
    <button onClick={openModalForAdd}>New task</button>
    <output>{tasks.length} tasks</output>
    {isEditing && <Modal />}
  </>;
}

beforeEach(() => {
  vi.resetAllMocks();
  axios.get.mockResolvedValue({ data: { tasks: [] } });
});
afterEach(cleanup);

async function openForm() {
  render(<TasksProvider><TaskScreen /></TasksProvider>);
  await waitFor(() => expect(axios.get).toHaveBeenCalled());
  fireEvent.click(screen.getByText('New task'));
  fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Regression task' } });
  fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Temporary test' } });
}

test('failed saving preserves the form and allows a successful retry', async () => {
  axios.post.mockRejectedValueOnce(new Error('Unavailable'));
  axios.post.mockResolvedValueOnce({ data: { _id: 'saved', title: 'Regression task' } });
  await openForm();
  fireEvent.click(screen.getByText('Create Task'));
  await waitFor(() => expect(screen.getByText('Create Task').disabled).toBe(false));
  expect(screen.getByLabelText('Title').value).toBe('Regression task');
  fireEvent.click(screen.getByText('Create Task'));
  await waitFor(() => expect(screen.queryByLabelText('Title')).toBeNull());
  expect(screen.getByText('1 tasks')).toBeTruthy();
});

test('switching completion from Yes to No submits boolean false', async () => {
  axios.post.mockResolvedValue({ data: { _id: 'saved' } });
  await openForm();
  const completion = screen.getByRole('combobox', { name: /Completed/ });
  fireEvent.change(completion, { target: { value: 'true' } });
  fireEvent.change(completion, { target: { value: 'false' } });
  expect(completion.value).toBe('false');
  fireEvent.click(screen.getByText('Create Task'));
  await waitFor(() => expect(axios.post).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ completed: false })));
});

test('pending saves disable resubmission', async () => {
  axios.post.mockReturnValue(new Promise(() => {}));
  await openForm();
  fireEvent.click(screen.getByText('Create Task'));
  expect(screen.getByText('Saving…').disabled).toBe(true);
  expect(screen.getByLabelText('Title').disabled).toBe(true);
  expect(axios.post).toHaveBeenCalledTimes(1);
});
