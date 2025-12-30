import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as firestore from '../lib/firestore';
import type { Task, Automation, Reminder, Routine } from '../types';

export function useTasks() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setTasks([]);
            setLoading(false);
            return;
        }

        const fetchTasks = async () => {
            setLoading(true);
            try {
                const data = await firestore.getTasks(user.uid);
                setTasks(data);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [user]);

    const addTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
        if (!user) return;
        try {
            const taskId = await firestore.addTask(user.uid, taskData);
            const newTask: Task = {
                ...taskData,
                id: taskId,
                createdAt: new Date()
            };
            setTasks(prev => [newTask, ...prev]);
        } catch (error) {
            console.error("Error adding task:", error);
            throw error;
        }
    };

    const updateTask = async (id: string, updates: Partial<Task>) => {
        if (!user) return;
        try {
            await firestore.updateTask(user.uid, id, updates);
            setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
        } catch (error) {
            console.error("Error updating task:", error);
            throw error;
        }
    };

    const deleteTask = async (id: string) => {
        if (!user) return;
        try {
            await firestore.deleteTask(user.uid, id);
            setTasks(prev => prev.filter(t => t.id !== id));
        } catch (error) {
            console.error("Error deleting task:", error);
            throw error;
        }
    };

    return { tasks, loading, addTask, updateTask, deleteTask };
}

export function useAutomations() {
    const { user } = useAuth();
    const [automations, setAutomations] = useState<Automation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setAutomations([]);
            setLoading(false);
            return;
        }

        const fetchAutomations = async () => {
            setLoading(true);
            try {
                const data = await firestore.getAutomations(user.uid);
                setAutomations(data);
            } catch (error) {
                console.error("Error fetching automations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAutomations();
    }, [user]);

    const addAutomation = async (automationData: Omit<Automation, 'id' | 'createdAt'>) => {
        if (!user) return;
        try {
            const id = await firestore.addAutomation(user.uid, automationData);
            const newAutomation: Automation = { ...automationData, id, createdAt: new Date() };
            setAutomations(prev => [newAutomation, ...prev]);
        } catch (error) {
            console.error("Error adding automation:", error);
            throw error;
        }
    };

    const toggleAutomation = async (id: string, enabled: boolean) => {
        if (!user) return;
        try {
            await firestore.updateAutomation(user.uid, id, { enabled });
            setAutomations(prev => prev.map(a => a.id === id ? { ...a, enabled } : a));
        } catch (error) {
            console.error("Error toggling automation:", error);
            throw error;
        }
    };

    const updateAutomation = async (id: string, updates: Partial<Automation>) => {
        if (!user) return;
        try {
            await firestore.updateAutomation(user.uid, id, updates);
            setAutomations(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
        } catch (error) {
            console.error("Error updating automation:", error);
            throw error;
        }
    };

    const deleteAutomation = async (id: string) => {
        if (!user) return;
        try {
            await firestore.deleteAutomation(user.uid, id);
            setAutomations(prev => prev.filter(a => a.id !== id));
        } catch (error) {
            console.error("Error deleting automation:", error);
            throw error;
        }
    };

    return { automations, loading, addAutomation, toggleAutomation, updateAutomation, deleteAutomation };
}


export function useReminders() {
    const { user } = useAuth();
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setReminders([]);
            setLoading(false);
            return;
        }

        const fetchReminders = async () => {
            setLoading(true);
            try {
                const data = await firestore.getReminders(user.uid);
                setReminders(data);
            } catch (error) {
                console.error("Error fetching reminders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReminders();
    }, [user]);

    const addReminder = async (reminderData: Omit<Reminder, 'id' | 'createdAt'>) => {
        if (!user) return;
        try {
            const id = await firestore.addReminder(user.uid, reminderData);
            const newReminder: Reminder = { ...reminderData, id, createdAt: new Date() };
            setReminders(prev => [...prev, newReminder]);
        } catch (error) {
            console.error("Error adding reminder:", error);
            throw error;
        }
    };

    const updateReminder = async (id: string, updates: Partial<Reminder>) => {
        if (!user) return;
        try {
            await firestore.updateReminder(user.uid, id, updates);
            setReminders(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
        } catch (error) {
            console.error("Error updating reminder:", error);
            throw error;
        }
    };

    const deleteReminder = async (id: string) => {
        if (!user) return;
        try {
            await firestore.deleteReminder(user.uid, id);
            setReminders(prev => prev.filter(r => r.id !== id));
        } catch (error) {
            console.error("Error deleting reminder:", error);
            throw error;
        }
    };

    return { reminders, loading, addReminder, updateReminder, deleteReminder };
}


export function useRoutines() {
    const { user } = useAuth();
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setRoutines([]);
            setLoading(false);
            return;
        }

        const fetchRoutines = async () => {
            setLoading(true);
            try {
                const data = await firestore.getRoutines(user.uid);
                setRoutines(data);
            } catch (error) {
                console.error("Error fetching routines:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRoutines();
    }, [user]);

    const addRoutine = async (routineData: Omit<Routine, 'id' | 'createdAt'>) => {
        if (!user) return;
        try {
            const id = await firestore.addRoutine(user.uid, routineData);
            const newRoutine: Routine = { ...routineData, id, createdAt: new Date() };
            setRoutines(prev => [newRoutine, ...prev]);
        } catch (error) {
            console.error("Error adding routine:", error);
            throw error;
        }
    };

    const updateRoutine = async (id: string, updates: Partial<Routine>) => {
        if (!user) return;
        try {
            await firestore.updateRoutine(user.uid, id, updates);
            setRoutines(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
        } catch (error) {
            console.error("Error updating routine:", error);
            throw error;
        }
    };

    const deleteRoutine = async (id: string) => {
        if (!user) return;
        try {
            await firestore.deleteRoutine(user.uid, id);
            setRoutines(prev => prev.filter(r => r.id !== id));
        } catch (error) {
            console.error("Error deleting routine:", error);
            throw error;
        }
    };

    return { routines, loading, addRoutine, updateRoutine, deleteRoutine };
}
