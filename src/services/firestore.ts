import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    onSnapshot,
    Timestamp,
    orderBy,
    getDocs,
    QueryConstraint
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Task, Automation, Reminder, Routine } from '../types';

// Helper to convert Firestore dates to JS Dates
const convertDates = (data: any) => {
    const result = { ...data };
    for (const key in result) {
        if (result[key] instanceof Timestamp) {
            result[key] = result[key].toDate();
        } else if (typeof result[key] === 'object' && result[key] !== null) {
            result[key] = convertDates(result[key]);
        }
    }
    return result;
};

// Generic subscribe function
function subscribeToCollection<T>(
    userId: string,
    collectionName: string,
    callback: (data: T[]) => void,
    constraints: QueryConstraint[] = []
) {
    if (!userId) {
        callback([]);
        return () => { };
    }

    const q = query(
        collection(db, 'users', userId, collectionName),
        ...constraints
    );

    return onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...convertDates(doc.data())
        })) as T[];
        callback(items);
    }, (error) => {
        console.error(`Error fetching ${collectionName}:`, error);
        callback([]);
    });
}

// TASKS
export const taskService = {
    subscribe: (userId: string, callback: (tasks: Task[]) => void) => {
        return subscribeToCollection<Task>(userId, 'tasks', callback, [orderBy('createdAt', 'desc')]);
    },
    add: async (userId: string, task: Omit<Task, 'id' | 'createdAt'>) => {
        return addDoc(collection(db, 'users', userId, 'tasks'), {
            ...task,
            createdAt: Timestamp.now(),
            deadline: Timestamp.fromDate(task.deadline),
        });
    },
    update: async (userId: string, taskId: string, updates: Partial<Task>) => {
        const processedUpdates = { ...updates };
        if (processedUpdates.deadline) {
            // @ts-ignore
            processedUpdates.deadline = Timestamp.fromDate(processedUpdates.deadline);
        }
        return updateDoc(doc(db, 'users', userId, 'tasks', taskId), processedUpdates);
    },
    delete: async (userId: string, taskId: string) => {
        return deleteDoc(doc(db, 'users', userId, 'tasks', taskId));
    }
};

// AUTOMATIONS
export const automationService = {
    subscribe: (userId: string, callback: (automations: Automation[]) => void) => {
        return subscribeToCollection<Automation>(userId, 'automations', callback, [orderBy('createdAt', 'desc')]);
    },
    add: async (userId: string, automation: Omit<Automation, 'id' | 'createdAt'>) => {
        return addDoc(collection(db, 'users', userId, 'automations'), {
            ...automation,
            createdAt: Timestamp.now(),
            lastRun: automation.lastRun ? Timestamp.fromDate(automation.lastRun) : null
        });
    },
    toggle: async (userId: string, id: string, enabled: boolean) => {
        return updateDoc(doc(db, 'users', userId, 'automations', id), { enabled });
    },
    update: async (userId: string, id: string, updates: Partial<Automation>) => {
        // Handle nested date conversions if necessary
        return updateDoc(doc(db, 'users', userId, 'automations', id), updates);
    },
    delete: async (userId: string, id: string) => {
        return deleteDoc(doc(db, 'users', userId, 'automations', id));
    }
};

// REMINDERS
export const reminderService = {
    subscribe: (userId: string, callback: (reminders: Reminder[]) => void) => {
        return subscribeToCollection<Reminder>(userId, 'reminders', callback, [orderBy('time', 'asc')]);
    },
    add: async (userId: string, reminder: Omit<Reminder, 'id' | 'createdAt'>) => {
        return addDoc(collection(db, 'users', userId, 'reminders'), {
            ...reminder,
            createdAt: Timestamp.now(),
            time: Timestamp.fromDate(reminder.time)
        });
    },
    update: async (userId: string, id: string, updates: Partial<Reminder>) => {
        const processedUpdates = { ...updates };
        if (processedUpdates.time) {
            // @ts-ignore
            processedUpdates.time = Timestamp.fromDate(processedUpdates.time);
        }
        return updateDoc(doc(db, 'users', userId, 'reminders', id), processedUpdates);
    },
    delete: async (userId: string, id: string) => {
        return deleteDoc(doc(db, 'users', userId, 'reminders', id));
    }
};

// ROUTINES
export const routineService = {
    subscribe: (userId: string, callback: (routines: Routine[]) => void) => {
        return subscribeToCollection<Routine>(userId, 'routines', callback, [orderBy('createdAt', 'desc')]);
    },
    add: async (userId: string, routine: Omit<Routine, 'id' | 'createdAt'>) => {
        return addDoc(collection(db, 'users', userId, 'routines'), {
            ...routine,
            createdAt: Timestamp.now(),
            // Ensure nested tasks dates are converted if necessary
            tasks: routine.tasks.map(t => ({
                ...t,
                deadline: Timestamp.fromDate(t.deadline),
                createdAt: Timestamp.now()
            }))
        });
    },
    update: async (userId: string, id: string, updates: Partial<Routine>) => {
        return updateDoc(doc(db, 'users', userId, 'routines', id), updates);
    },
    delete: async (userId: string, id: string) => {
        return deleteDoc(doc(db, 'users', userId, 'routines', id));
    }
};
