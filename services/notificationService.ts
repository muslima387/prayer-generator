
const NOTIFICATION_KEY = 'dailyPrayerReminder';

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!('Notification' in window)) {
    alert('This browser does not support desktop notification');
    return 'denied';
  }
  return await Notification.requestPermission();
};

export const setDailyReminder = (name: string) => {
  localStorage.setItem(NOTIFICATION_KEY, JSON.stringify({ name, enabled: true }));
  
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 9, 0, 0); // 9 AM tomorrow
  const timeToNotification = tomorrow.getTime() - now.getTime();

  setTimeout(() => {
    const reminderData = localStorage.getItem(NOTIFICATION_KEY);
    if (reminderData) {
      const { name: savedName, enabled } = JSON.parse(reminderData);
      if (enabled) {
        new Notification('تذكير بالدعاء ✨', {
          body: `لا تنسَ الدعاء لـ ${savedName} اليوم.`,
          icon: '/favicon.ico', // You might want to replace this with a proper icon
        });
        // Reschedule for the next day
        setDailyReminder(savedName);
      }
    }
  }, timeToNotification);

  alert(`تم ضبط تذكير يومي للدعاء لـ ${name} في الساعة 9 صباحًا.`);
};

export const cancelDailyReminder = () => {
  const reminderData = localStorage.getItem(NOTIFICATION_KEY);
  if (reminderData) {
    const { name } = JSON.parse(reminderData);
    localStorage.setItem(NOTIFICATION_KEY, JSON.stringify({ name, enabled: false }));
    alert(`تم إلغاء التذكير اليومي للدعاء لـ ${name}.`);
  }
};

export const getReminderStatus = (): { name: string, enabled: boolean } | null => {
  const data = localStorage.getItem(NOTIFICATION_KEY);
  return data ? JSON.parse(data) : null;
}
