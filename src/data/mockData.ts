import type { Task, Reminder, Automation, Routine, DashboardStats } from '../types';

export const mockTasks: Task[] = [
    {
        id: '1',
        title: 'Review project proposal',
        description: 'Go through the Q4 project proposal and provide feedback',
        deadline: new Date(2025, 11, 7, 15, 30),
        priority: 'High',
        repeat: 'None',
        tags: ['work', 'urgent'],
        completed: false,
        reminderMinutes: 30,
        createdAt: new Date(2025, 11, 5),
    },
    {
        id: '2',
        title: 'Team standup meeting',
        description: 'Daily sync with the team',
        deadline: new Date(2025, 11, 7, 10, 0),
        priority: 'Medium',
        repeat: 'Daily',
        tags: ['meetings'],
        completed: false,
        reminderMinutes: 15,
        createdAt: new Date(2025, 11, 1),
    },
    {
        id: '3',
        title: 'Workout session',
        deadline: new Date(2025, 11, 7, 18, 0),
        priority: 'Medium',
        repeat: 'Daily',
        tags: ['health', 'personal'],
        completed: false,
        reminderMinutes: 10,
        createdAt: new Date(2025, 11, 3),
    },
    {
        id: '4',
        title: 'Write daily journal',
        deadline: new Date(2025, 11, 7, 21, 0),
        priority: 'Low',
        repeat: 'Daily',
        tags: ['personal', 'habit'],
        completed: false,
        reminderMinutes: 10,
        createdAt: new Date(2025, 11, 1),
    },
    {
        id: '5',
        title: 'Grocery shopping',
        deadline: new Date(2025, 11, 8, 11, 0),
        priority: 'Medium',
        repeat: 'Weekly',
        tags: ['personal', 'errands'],
        completed: false,
        createdAt: new Date(2025, 11, 6),
    },
];

export const mockReminders: Reminder[] = [
    {
        id: '1',
        title: 'Drink Water',
        time: new Date(2025, 11, 6, 15, 30),
        repeat: 'Daily',
        notificationType: ['Web'],
        status: 'pending',
        createdAt: new Date(2025, 11, 1),
    },
    {
        id: '2',
        title: 'Meeting prep',
        time: new Date(2025, 11, 6, 18, 0),
        repeat: 'None',
        notificationType: ['Web', 'Email'],
        notes: 'Prepare slides for client presentation',
        status: 'pending',
        createdAt: new Date(2025, 11, 6),
    },
    {
        id: '3',
        title: 'Send daily summary',
        time: new Date(2025, 11, 6, 22, 0),
        repeat: 'Daily',
        notificationType: ['Web'],
        status: 'pending',
        createdAt: new Date(2025, 11, 1),
    },
    {
        id: '4',
        title: 'Take medication',
        time: new Date(2025, 11, 6, 20, 0),
        repeat: 'Daily',
        notificationType: ['Web'],
        status: 'pending',
        createdAt: new Date(2025, 11, 1),
    },
];

export const mockAutomations: Automation[] = [
    {
        id: '1',
        name: 'Daily Journal Creator',
        enabled: true,
        trigger: {
            type: 'Time',
            time: '21:00',
        },
        conditions: [
            {
                type: 'NoTasks',
            },
        ],
        actions: [
            {
                type: 'CreateTask',
                params: {
                    title: 'Write daily journal',
                    priority: 'Low',
                },
            },
        ],
        lastRun: new Date(2025, 11, 5, 21, 0),
        createdAt: new Date(2025, 11, 1),
    },
    {
        id: '2',
        name: 'Weekly Grocery Checklist',
        enabled: true,
        trigger: {
            type: 'Time',
            time: '09:00',
        },
        actions: [
            {
                type: 'GenerateChecklist',
                params: {
                    title: 'Weekly grocery list',
                },
            },
        ],
        lastRun: new Date(2025, 11, 1, 9, 0),
        createdAt: new Date(2025, 10, 25),
    },
    {
        id: '3',
        name: 'Auto-clear Completed Tasks',
        enabled: true,
        trigger: {
            type: 'System',
            value: 'weekly',
        },
        actions: [
            {
                type: 'CompleteTask',
                params: {
                    filter: 'completed',
                },
            },
        ],
        lastRun: new Date(2025, 11, 3),
        createdAt: new Date(2025, 10, 20),
    },
    {
        id: '4',
        name: 'Morning Routine Kickstart',
        enabled: true,
        trigger: {
            type: 'Time',
            time: '07:00',
        },
        conditions: [
            {
                type: 'TaskCount',
                operator: 'equals',
                value: 0,
            },
        ],
        actions: [
            {
                type: 'GenerateChecklist',
                params: {
                    title: 'Start your day',
                },
            },
            {
                type: 'SendNotification',
                params: {
                    message: 'Good morning! Your daily tasks are ready.',
                },
            },
        ],
        lastRun: new Date(2025, 11, 6, 7, 0),
        createdAt: new Date(2025, 10, 15),
    },
];

export const mockRoutines: Routine[] = [
    {
        id: '1',
        name: 'Morning Routine',
        tasks: [
            {
                id: 'mr1',
                title: 'Meditation',
                deadline: new Date(2025, 11, 7, 6, 30),
                priority: 'Medium',
                repeat: 'Daily',
                tags: ['health', 'mindfulness'],
                completed: false,
                createdAt: new Date(2025, 11, 1),
            },
            {
                id: 'mr2',
                title: 'Exercise',
                deadline: new Date(2025, 11, 7, 7, 0),
                priority: 'High',
                repeat: 'Daily',
                tags: ['health'],
                completed: false,
                createdAt: new Date(2025, 11, 1),
            },
            {
                id: 'mr3',
                title: 'Healthy breakfast',
                deadline: new Date(2025, 11, 7, 8, 0),
                priority: 'Medium',
                repeat: 'Daily',
                tags: ['health'],
                completed: false,
                createdAt: new Date(2025, 11, 1),
            },
        ],
        repeat: 'Daily',
        enabled: true,
        reminderEnabled: true,
        createdAt: new Date(2025, 11, 1),
    },
    {
        id: '2',
        name: 'Night Routine',
        tasks: [
            {
                id: 'nr1',
                title: 'Write daily reflection',
                deadline: new Date(2025, 11, 7, 21, 0),
                priority: 'Low',
                repeat: 'Daily',
                tags: ['personal'],
                completed: false,
                createdAt: new Date(2025, 11, 1),
            },
            {
                id: 'nr2',
                title: 'Plan tomorrow',
                deadline: new Date(2025, 11, 7, 21, 30),
                priority: 'Medium',
                repeat: 'Daily',
                tags: ['planning'],
                completed: false,
                createdAt: new Date(2025, 11, 1),
            },
            {
                id: 'nr3',
                title: 'Read 30 minutes',
                deadline: new Date(2025, 11, 7, 22, 0),
                priority: 'Low',
                repeat: 'Daily',
                tags: ['learning'],
                completed: false,
                createdAt: new Date(2025, 11, 1),
            },
        ],
        repeat: 'Daily',
        enabled: true,
        reminderEnabled: true,
        createdAt: new Date(2025, 11, 1),
    },
    {
        id: '3',
        name: 'Sunday Reset',
        tasks: [
            {
                id: 'sr1',
                title: 'Review week',
                deadline: new Date(2025, 11, 8, 10, 0),
                priority: 'High',
                repeat: 'Weekly',
                tags: ['planning', 'review'],
                completed: false,
                createdAt: new Date(2025, 11, 1),
            },
            {
                id: 'sr2',
                title: 'Meal prep',
                deadline: new Date(2025, 11, 8, 14, 0),
                priority: 'Medium',
                repeat: 'Weekly',
                tags: ['health'],
                completed: false,
                createdAt: new Date(2025, 11, 1),
            },
            {
                id: 'sr3',
                title: 'Clean workspace',
                deadline: new Date(2025, 11, 8, 16, 0),
                priority: 'Low',
                repeat: 'Weekly',
                tags: ['organization'],
                completed: false,
                createdAt: new Date(2025, 11, 1),
            },
        ],
        repeat: 'Weekly',
        enabled: true,
        reminderEnabled: false,
        createdAt: new Date(2025, 11, 1),
    },
];

export const mockDashboardStats: DashboardStats = {
    tasksToday: 5,
    automationsRunning: 4,
    upcomingReminders: 3,
    overdueItems: 1,
};
