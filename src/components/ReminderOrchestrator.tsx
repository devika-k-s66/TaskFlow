import { useEffect, useCallback } from 'react';
import { useReminders } from '../hooks/useFirestore';
import { isPast } from 'date-fns';

export default function ReminderOrchestrator() {
    const { reminders, updateReminder } = useReminders();

    const triggerNotification = useCallback((title: string, body?: string) => {
        if (!("Notification" in window)) {
            console.log("This browser does not support desktop notification");
            return;
        }

        if (Notification.permission === "granted") {
            new Notification(title, {
                body: body || "Your reminder is due!",
                icon: "/logo192.png" // Fallback to common CRA icon name
            });
        }
    }, []);

    useEffect(() => {
        // Request permission on mount
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }
    }, []);

    useEffect(() => {
        const checkReminders = () => {
            reminders.forEach(reminder => {
                if (reminder.status === 'pending') {
                    const reminderTime = new Date(reminder.time);

                    // Trigger if it's currently due (within 1 minute window) or past due
                    if (isPast(reminderTime)) {
                        console.log(`Triggering reminder: ${reminder.title}`);
                        triggerNotification(reminder.title, reminder.notes);

                        // Mark as sent to prevent duplicate triggers
                        updateReminder(reminder.id, { status: 'sent' });
                    }
                }
            });
        };

        // Check every 30 seconds
        const interval = setInterval(checkReminders, 30000);

        // Also check immediately
        checkReminders();

        return () => clearInterval(interval);
    }, [reminders, triggerNotification, updateReminder]);

    return null; // This component doesn't render anything
}
