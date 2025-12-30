import {
    collection,
    doc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    Timestamp,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Task, Automation, Routine, Reminder } from '../types';

// Helper to convert Firestore timestamps to Date objects
const convertTimestamps = (data: any) => {
    const converted = { ...data };
    Object.keys(converted).forEach(key => {
        if (converted[key] instanceof Timestamp) {
            converted[key] = converted[key].toDate();
        }
    });
    return converted;
};

// ==================== TASKS ====================

export const getTasks = async (userId: string): Promise<Task[]> => {
    try {
        const tasksRef = collection(db, `users/${userId}/tasks`);
        const q = query(tasksRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...convertTimestamps(doc.data()),
        } as Task));
    } catch (error) {
        console.error('Error getting tasks:', error);
        return [];
    }
};

export const addTask = async (userId: string, task: Omit<Task, 'id' | 'createdAt'>) => {
    try {
        const tasksRef = collection(db, `users/${userId}/tasks`);
        const docRef = await addDoc(tasksRef, {
            ...task,
            createdAt: serverTimestamp(),
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding task:', error);
        throw error;
    }
};

export const updateTask = async (userId: string, taskId: string, updates: Partial<Task>) => {
    try {
        const taskRef = doc(db, `users/${userId}/tasks/${taskId}`);
        await updateDoc(taskRef, updates);
    } catch (error) {
        console.error('Error updating task:', error);
        throw error;
    }
};

export const deleteTask = async (userId: string, taskId: string) => {
    try {
        const taskRef = doc(db, `users/${userId}/tasks/${taskId}`);
        await deleteDoc(taskRef);
    } catch (error) {
        console.error('Error deleting task:', error);
        throw error;
    }
};

// ==================== AUTOMATIONS ====================

export const getAutomations = async (userId: string): Promise<Automation[]> => {
    try {
        const automationsRef = collection(db, `users/${userId}/automations`);
        const querySnapshot = await getDocs(automationsRef);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...convertTimestamps(doc.data()),
        } as Automation));
    } catch (error) {
        console.error('Error getting automations:', error);
        return [];
    }
};

export const addAutomation = async (userId: string, automation: Omit<Automation, 'id' | 'createdAt'>) => {
    try {
        const automationsRef = collection(db, `users/${userId}/automations`);
        const docRef = await addDoc(automationsRef, {
            ...automation,
            createdAt: serverTimestamp(),
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding automation:', error);
        throw error;
    }
};

export const updateAutomation = async (userId: string, automationId: string, updates: Partial<Automation>) => {
    try {
        const automationRef = doc(db, `users/${userId}/automations/${automationId}`);
        await updateDoc(automationRef, updates);
    } catch (error) {
        console.error('Error updating automation:', error);
        throw error;
    }
};

export const deleteAutomation = async (userId: string, automationId: string) => {
    try {
        const automationRef = doc(db, `users/${userId}/automations/${automationId}`);
        await deleteDoc(automationRef);
    } catch (error) {
        console.error('Error deleting automation:', error);
        throw error;
    }
};

// ==================== ROUTINES ====================

export const getRoutines = async (userId: string): Promise<Routine[]> => {
    try {
        const routinesRef = collection(db, `users/${userId}/routines`);
        const querySnapshot = await getDocs(routinesRef);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...convertTimestamps(doc.data()),
        } as Routine));
    } catch (error) {
        console.error('Error getting routines:', error);
        return [];
    }
};

export const addRoutine = async (userId: string, routine: Omit<Routine, 'id' | 'createdAt'>) => {
    try {
        const routinesRef = collection(db, `users/${userId}/routines`);
        const docRef = await addDoc(routinesRef, {
            ...routine,
            createdAt: serverTimestamp(),
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding routine:', error);
        throw error;
    }
};

export const updateRoutine = async (userId: string, routineId: string, updates: Partial<Routine>) => {
    try {
        const routineRef = doc(db, `users/${userId}/routines/${routineId}`);
        await updateDoc(routineRef, updates);
    } catch (error) {
        console.error('Error updating routine:', error);
        throw error;
    }
};

export const deleteRoutine = async (userId: string, routineId: string) => {
    try {
        const routineRef = doc(db, `users/${userId}/routines/${routineId}`);
        await deleteDoc(routineRef);
    } catch (error) {
        console.error('Error deleting routine:', error);
        throw error;
    }
};

// ==================== REMINDERS ====================

export const getReminders = async (userId: string): Promise<Reminder[]> => {
    try {
        const remindersRef = collection(db, `users/${userId}/reminders`);
        const querySnapshot = await getDocs(remindersRef);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...convertTimestamps(doc.data()),
        } as Reminder));
    } catch (error) {
        console.error('Error getting reminders:', error);
        return [];
    }
};

export const addReminder = async (userId: string, reminder: Omit<Reminder, 'id' | 'createdAt'>) => {
    try {
        const remindersRef = collection(db, `users/${userId}/reminders`);
        const docRef = await addDoc(remindersRef, {
            ...reminder,
            createdAt: serverTimestamp(),
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding reminder:', error);
        throw error;
    }
};

export const updateReminder = async (userId: string, reminderId: string, updates: Partial<Reminder>) => {
    try {
        const reminderRef = doc(db, `users/${userId}/reminders/${reminderId}`);
        await updateDoc(reminderRef, updates);
    } catch (error) {
        console.error('Error updating reminder:', error);
        throw error;
    }
};

export const deleteReminder = async (userId: string, reminderId: string) => {
    try {
        const reminderRef = doc(db, `users/${userId}/reminders/${reminderId}`);
        await deleteDoc(reminderRef);
    } catch (error) {
        console.error('Error deleting reminder:', error);
        throw error;
    }
};
