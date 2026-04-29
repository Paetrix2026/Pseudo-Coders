/**
 * taskService.ts
 *
 * Abstracts all task localStorage access.
 * Async-ready for Firebase migration.
 *
 * Key: tasks_${userId}
 */

import type { Task } from '../context/TasksContext';

const key = (userId: string) => `tasks_${userId}`;

export async function getTasks(userId: string): Promise<Task[]> {
  const raw = localStorage.getItem(key(userId));
  return raw ? JSON.parse(raw) : [];
}

export async function saveTasks(userId: string, tasks: Task[]): Promise<void> {
  localStorage.setItem(key(userId), JSON.stringify(tasks));
}

export async function addTask(userId: string, task: Task, existing: Task[]): Promise<Task[]> {
  const updated = [task, ...existing];
  await saveTasks(userId, updated);
  return updated;
}
