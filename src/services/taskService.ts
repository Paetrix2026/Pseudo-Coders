/**
 * taskService.ts
 *
 * Abstracts all task access.
 * Connected to Firebase Firestore.
 *
 * Collection: tasks
 */

import { collection, doc, getDocs, query, where, writeBatch, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Task } from '../context/TasksContext';

export async function getTasks(userId: string): Promise<Task[]> {
  try {
    const q = query(collection(db, 'tasks'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    const tasks: Task[] = [];
    snapshot.forEach((docSnap) => {
      tasks.push(docSnap.data() as Task);
    });
    // Sort descending by ID so newest tasks appear first
    return tasks.sort((a, b) => Number(b.id) - Number(a.id));
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
}

export async function saveTasks(userId: string, tasks: Task[]): Promise<void> {
  if (!tasks || tasks.length === 0) return;
  
  try {
    const batch = writeBatch(db);
    tasks.forEach((task) => {
      const taskRef = doc(db, 'tasks', task.id);
      batch.set(taskRef, {
        ...task,
        userId
      }, { merge: true });
    });
    await batch.commit();
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
}

export async function addTask(userId: string, task: Task): Promise<void> {
  try {
    const taskRef = doc(db, 'tasks', task.id);
    await setDoc(taskRef, {
      ...task,
      userId,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error adding task:', error);
  }
}
