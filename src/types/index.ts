// Type Definitions for Workload Automator

// Priority and Status Types
export type Priority = 'Low' | 'Medium' | 'High';
export type RepeatFrequency = 'None' | 'Daily' | 'Weekly' | 'Monthly' | 'Custom';
export type TaskStatus = 'pending' | 'completed' | 'overdue';

// Task Interface
export interface Task {
  id: string;
  title: string;
  description?: string;
  deadline: Date;
  endTime?: Date;
  priority: Priority;
  repeat: RepeatFrequency;
  tags: string[];
  completed: boolean;
  reminderMinutes?: number;
  createdAt: Date;
}

// Reminder Interface
export interface Reminder {
  id: string;
  title: string;
  time: Date;
  repeat: RepeatFrequency;
  notificationType: ('Web' | 'Email' | 'Telegram')[];
  notes?: string;
  status: 'pending' | 'snoozed' | 'sent';
  createdAt: Date;
}

// Automation Types
export type TriggerType = 'Time' | 'TaskBased' | 'Activity' | 'System' | 'Calendar';
export type ConditionType = 'TaskCount' | 'Weekend' | 'Overdue' | 'NoTasks' | 'TimeBetween' | 'HasMeetings';
export type ActionType = 'CreateTask' | 'SendNotification' | 'SendReminder' | 'CompleteTask' | 'GenerateChecklist' | 'MoveTask' | 'SendEmail' | 'SyncCalendar';

export interface AutomationTrigger {
  type: TriggerType;
  value?: string | number;
  time?: string;
}

export interface AutomationCondition {
  type: ConditionType;
  operator?: 'greater' | 'less' | 'equals';
  value?: string | number;
}

export interface AutomationAction {
  type: ActionType;
  params?: Record<string, any>;
}

// Main Automation Interface
export interface Automation {
  id: string;
  name: string;
  enabled: boolean;
  trigger: AutomationTrigger;
  conditions?: AutomationCondition[];
  actions: AutomationAction[];
  lastRun?: Date;
  createdAt: Date;
}

// Routine Interface
export interface Routine {
  id: string;
  name: string;
  tasks: Task[];
  repeat: RepeatFrequency;
  enabled: boolean;
  reminderEnabled: boolean;
  createdAt: Date;
}

// Calendar Event Interface
export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'task' | 'reminder' | 'automation' | 'routine';
  data: Task | Reminder | Automation | Routine;
}

// Dashboard Stats Interface
export interface DashboardStats {
  tasksToday: number;
  automationsRunning: number;
  upcomingReminders: number;
  overdueItems: number;
}

// Template Interface
export interface TimeSlot {
  id: string;
  title: string;
  startTime: string; // "HH:mm"
  duration: number; // minutes
  priority: Priority;
}

export interface TimeTemplate {
  id: string;
  name: string;
  slots: TimeSlot[];
  createdAt: Date;
}

// Analytics Interface
export interface Analytics {
  completionRate: number[];
  activeHours: number[][];
  automationImpact: {
    tasksGenerated: number;
    timeSaved: number;
  };
  habitStreak: number;
}
