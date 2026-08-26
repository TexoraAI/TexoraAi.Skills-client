// Central mock data for the Workspace feature set.
// Swap these arrays for real API calls (see original SuperAdminEvents.jsx
// service pattern: getMyMeetings, getMeetingsCalendar, etc.) whenever the
// backend endpoints for each tab are ready — every page reads from here.

export const currentUser = {
  name: "Student Imam",
  email: "imam@ilmora.ai",
  initials: "TI",
};

export const upcomingEvents = [
  {
    id: 1,
    title: "Learning React - Live Session",
    date: "Aug 23",
    time: "10:00 AM - 11:30 AM",
    mode: "Online",
    registered: "30 / 50",
    countdown: "In 30 mins",
    type: "Meeting",
    status: "upcoming",
  },
  {
    id: 2,
    title: "JavaScript Basics Workshop",
    date: "Aug 23",
    time: "11:00 AM - 12:30 PM",
    mode: "Online",
    registered: "22 / 40",
    countdown: "In 1 hour",
    type: "Presentation",
    status: "upcoming",
  },
  {
    id: 3,
    title: "Database Design & SQL",
    date: "Aug 23",
    time: "12:00 PM - 01:00 PM",
    mode: "Online",
    registered: "18 / 40",
    countdown: "In 2 hours",
    type: "Review",
    status: "upcoming",
  },
  {
    id: 4,
    title: "Advanced Node.js Concepts",
    date: "Aug 23",
    time: "01:00 PM - 02:00 PM",
    mode: "Online",
    registered: "12 / 30",
    countdown: "In 3 hours",
    type: "Meeting",
    status: "upcoming",
  },
  {
    id: 5,
    title: "Data Structures - DSA",
    date: "Aug 23",
    time: "02:00 PM - 03:00 PM",
    mode: "Online",
    registered: "20 / 35",
    countdown: "In 4 hours",
    type: "Demo",
    status: "upcoming",
  },
  {
    id: 6,
    title: "Web Security Fundamentals",
    date: "Aug 24",
    time: "10:00 AM - 11:30 AM",
    mode: "Online",
    registered: "11 / 25",
    countdown: "Tomorrow",
    type: "Planning",
    status: "upcoming",
  },
];

export const eventStatusBuckets = {
  Upcoming: upcomingEvents,
  Ongoing: [],
  Completed: [
    {
      id: 7,
      title: "Intro to Python",
      date: "Aug 19",
      time: "10:00 AM - 11:00 AM",
      mode: "Online",
      registered: "35 / 40",
      countdown: "Ended",
      type: "Meeting",
      status: "completed",
    },
  ],
  Cancelled: [],
};

export const instantMeetings = [
  {
    id: "im1",
    title: "Team Standup",
    meetingId: "482 991 6623",
    when: "Today, 09:30 AM",
    duration: "25 mins",
  },
  {
    id: "im2",
    title: "React Implementation Discussion",
    meetingId: "791 225 8842",
    when: "Today, 11:15 AM",
    duration: "42 mins",
  },
  {
    id: "im3",
    title: "Student Doubt Session",
    meetingId: "128 456 9921",
    when: "Yesterday, 04:30 PM",
    duration: "30 mins",
  },
];

export const todaySchedule = [
  { id: 1, time: "10:00 AM", title: "Learning React - Live Session", status: "In Progress" },
  { id: 2, time: "11:00 AM", title: "JavaScript Basics Workshop", status: "Upcoming" },
  { id: 3, time: "12:00 PM", title: "Database Design & SQL", status: "Upcoming" },
];

export const emails = [
  {
    id: 1,
    from: "John Doe",
    subject: "Question about JavaScript Workshop",
    preview: "Hello Student, I have a question about the upcoming workshop...",
    time: "09:30 AM",
    unread: true,
    folder: "Inbox",
  },
  {
    id: 2,
    from: "Sarah Johnson",
    subject: "React Live Session Materials",
    preview: "Hi Student, Please share the materials for today's session.",
    time: "08:15 AM",
    unread: true,
    folder: "Inbox",
  },
  {
    id: 3,
    from: "Mike Wilson",
    subject: "Project Review Request",
    preview: "Could you please review my project when you have time?",
    time: "Yesterday",
    unread: false,
    folder: "Inbox",
  },
  {
    id: 4,
    from: "ILM ORA Team",
    subject: "System Update Notification",
    preview: "We have updated our system with new features and...",
    time: "Yesterday",
    unread: false,
    folder: "Inbox",
  },
  {
    id: 5,
    from: "Emma Brown",
    subject: "Meeting Follow-up",
    preview: "Thanks for the meeting. Here are the action items...",
    time: "Aug 21",
    unread: false,
    folder: "Inbox",
  },
];

export const emailStats = { unread: 5, sent: 12, drafts: 3, scheduled: 8 };

export const mySchedules = [
  { id: 1, title: "Learning React - Live Session", date: "Aug 23", time: "10:00 AM - 11:30 AM", mode: "Online", countdown: "In 30 mins", type: "Meeting" },
  { id: 2, title: "JavaScript Basics Workshop", date: "Aug 23", time: "11:00 AM - 12:30 PM", mode: "Online", countdown: "In 1 hour", type: "Presentation" },
  { id: 3, title: "Database Design & SQL", date: "Aug 23", time: "12:00 PM - 01:00 PM", mode: "Online", countdown: "In 2 hours", type: "Review" },
  { id: 4, title: "Advanced Node.js Concepts", date: "Aug 23", time: "01:00 PM - 02:00 PM", mode: "Online", countdown: "In 3 hours", type: "Meeting" },
  { id: 5, title: "Data Structures - DSA", date: "Aug 23", time: "02:00 PM - 03:00 PM", mode: "Online", countdown: "In 4 hours", type: "Demo" },
];

export const sharedWithMe = [
  { id: 1, title: "UI/UX Design Workshop", sharedBy: "John Doe", when: "Sat, Aug 23, 2026 · 10:00 AM", kind: "Events" },
  { id: 2, title: "Project Review Meeting", sharedBy: "Sarah Johnson", when: "Sun, Aug 24, 2026 · 11:00 AM", kind: "Events" },
  { id: 3, title: "Team Planning Session", sharedBy: "Rajesh Team", when: "Mon, Aug 25, 2026 · 11:00 AM", kind: "Schedules" },
  { id: 4, title: "Doubt Clearing Session", sharedBy: "Mike Wilson", when: "Mon, Aug 25, 2026 · 04:00 PM", kind: "Schedules" },
  { id: 5, title: "Cursor Guidance Webinar", sharedBy: "Emma Brown", when: "Tue, Aug 26, 2026 · 09:00 AM", kind: "Events" },
];

export const reminders = [
  { id: 1, title: "Prepare slides for React session", due: "Sat, Aug 23, 2026 · 09:00 AM", done: false, urgency: "In 10 mins" },
  { id: 2, title: "Review JavaScript workshop materials", due: "Sat, Aug 23, 2026 · 10:00 AM", done: false, urgency: "In 1 hour" },
  { id: 3, title: "Send assignment to students", due: "Sat, Aug 23, 2026 · 01:30 PM", done: false, urgency: "In 4 hours" },
  { id: 4, title: "Follow up with John on progress", due: "Sun, Aug 24, 2026 · 11:00 AM", done: false, urgency: "Tomorrow" },
  { id: 5, title: "Weekly report submission", due: "Mon, Aug 25, 2026 · 06:00 PM", done: false, urgency: "In 2 days" },
  { id: 6, title: "Mentor meeting preparation", due: "Tue, Aug 26, 2026 · 09:00 AM", done: false, urgency: "In 3 days" },
];

export const contacts = [
  { id: 1, name: "John Doe", role: "Mentor", email: "john.doe@ilmora.ai", color: "#7c3aed" },
  { id: 2, name: "Sarah Johnson", role: "Mentor", email: "sarah.j@ilmora.ai", color: "#0d9488" },
  { id: 3, name: "Mike Wilson", role: "Student", email: "mike.w@ilmora.ai", color: "#0ea5e9" },
  { id: 4, name: "Emma Brown", role: "Student", email: "emma.b@ilmora.ai", color: "#db2777" },
  { id: 5, name: "ILM ORA Team", role: "Team", email: "team@ilmora.ai", color: "#b45309" },
  { id: 6, name: "David Lee", role: "Mentor", email: "david.lee@ilmora.ai", color: "#7c3aed" },
];

export const weeklyAvailability = [
  { day: "Monday", start: "09:00", end: "06:00", enabled: true },
  { day: "Tuesday", start: "09:00", end: "06:00", enabled: true },
  { day: "Wednesday", start: "09:00", end: "06:00", enabled: true },
  { day: "Thursday", start: "08:00", end: "06:00", enabled: true },
  { day: "Friday", start: "09:00", end: "05:00", enabled: true },
  { day: "Saturday", start: "10:00", end: "02:00", enabled: true },
  { day: "Sunday", start: "09:00", end: "06:00", enabled: false },
];

export const integrations = [
  { id: 1, name: "Google Calendar", desc: "Sync events and reminders", connected: true },
  { id: 2, name: "Zoom", desc: "Schedule and join meetings", connected: true },
  { id: 3, name: "Google Meet", desc: "Start meetings directly", connected: false },
  { id: 4, name: "Outlook Calendar", desc: "Sync with Outlook", connected: false },
  { id: 5, name: "Slack", desc: "Get notifications", connected: true },
  { id: 6, name: "Microsoft Teams", desc: "Integrate with Teams", connected: false },
];

export const syncHistory = [
  { id: 1, label: "Events synced successfully", time: "Just now" },
  { id: 2, label: "Meetings synced successfully", time: "2 mins ago" },
  { id: 3, label: "Calendar connected", time: "10 mins ago" },
];

// Simple month calendar seed: day-of-month -> event titles, for Aug 2026.
export const calendarEvents = {
  9: ["Learning React - Live"],
  10: ["JS Basics Workshop"],
  12: ["Database Design & SQL"],
  16: [],
  20: ["Advanced Node.js"],
  23: ["Learning React - Live", "JS Basics Workshop", "Database Design & SQL"],
  24: [],
  25: ["Web Security Fundamentals"],
};
