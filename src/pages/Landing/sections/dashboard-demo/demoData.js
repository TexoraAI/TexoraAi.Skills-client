// Demo-only mock data for the landing-page dashboard preview.
// Adapted from the real Dashboard project's data/mockData.js so the demo
// shows the same kind of content the actual product ships with. Trimmed
// down and duplicated locally (rather than imported cross-project) so this
// section has zero dependency on the Dashboard app's services/ or auth
// modules — everything here is plain, static, frontend-only data.

export const demoUser = {
  name: "Admin Imam",
  email: "imam@ilmora.ai",
  initials: "AI",
};

export const overviewStats = [
  { key: "events", label: "Upcoming Events", value: 12, delta: "↑ 2 this week", tone: "purple" },
  { key: "live", label: "Live Right Now", value: 3, delta: "Across 3 batches", tone: "green" },
  { key: "scheduled", label: "Scheduled Today", value: 17, delta: "Next in 24 min", tone: "amber" },
  { key: "attendance", label: "Attendance Rate", value: "96%", delta: "↑ 4% vs last week", tone: "blue" },
];

export const upcomingEvents = [
  { id: 1, title: "Learning React — Live Session", date: "Aug 23", time: "10:00 AM – 11:30 AM", mode: "Online", registered: "30 / 50", countdown: "In 30 mins", type: "Meeting" },
  { id: 2, title: "JavaScript Basics Workshop", date: "Aug 23", time: "11:00 AM – 12:30 PM", mode: "Online", registered: "22 / 40", countdown: "In 1 hour", type: "Presentation" },
  { id: 3, title: "Database Design & SQL", date: "Aug 23", time: "12:00 PM – 1:00 PM", mode: "Online", registered: "18 / 40", countdown: "In 2 hours", type: "Review" },
  { id: 4, title: "Advanced Node.js Concepts", date: "Aug 23", time: "1:00 PM – 2:00 PM", mode: "Online", registered: "12 / 30", countdown: "In 3 hours", type: "Meeting" },
  { id: 5, title: "Data Structures — DSA", date: "Aug 23", time: "2:00 PM – 3:00 PM", mode: "Online", registered: "20 / 35", countdown: "In 4 hours", type: "Demo" },
  { id: 6, title: "Web Security Fundamentals", date: "Aug 24", time: "10:00 AM – 11:30 AM", mode: "Online", registered: "11 / 25", countdown: "Tomorrow", type: "Planning" },
];

export const eventBuckets = {
  Upcoming: upcomingEvents,
  Ongoing: [
    { id: 20, title: "Weekly Product Sync", date: "Today", time: "Started 18m ago", mode: "Online", registered: "9 / 12", countdown: "Live now", type: "Meeting" },
  ],
  Completed: [
    { id: 7, title: "Intro to Python", date: "Aug 19", time: "10:00 AM – 11:00 AM", mode: "Online", registered: "35 / 40", countdown: "Ended", type: "Meeting" },
    { id: 8, title: "Onboarding Walkthrough", date: "Aug 18", time: "9:00 AM – 10:00 AM", mode: "Online", registered: "40 / 40", countdown: "Ended", type: "Meeting" },
  ],
  Cancelled: [],
};

export const todaySchedule = [
  { id: 1, time: "10:00 AM", title: "Learning React — Live Session", status: "In Progress" },
  { id: 2, time: "11:00 AM", title: "JavaScript Basics Workshop", status: "Upcoming" },
  { id: 3, time: "12:00 PM", title: "Database Design & SQL", status: "Upcoming" },
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
  { day: "Monday", start: "09:00", end: "18:00", enabled: true },
  { day: "Tuesday", start: "09:00", end: "18:00", enabled: true },
  { day: "Wednesday", start: "09:00", end: "18:00", enabled: true },
  { day: "Thursday", start: "08:00", end: "18:00", enabled: true },
  { day: "Friday", start: "09:00", end: "17:00", enabled: true },
  { day: "Saturday", start: "10:00", end: "14:00", enabled: true },
  { day: "Sunday", start: "09:00", end: "18:00", enabled: false },
];

export const integrations = [
  { id: 1, name: "Google Calendar", desc: "Sync events and reminders", connected: true },
  { id: 2, name: "Zoom", desc: "Schedule and join meetings", connected: true },
  { id: 3, name: "Google Meet", desc: "Start meetings directly", connected: false },
  { id: 4, name: "Outlook Calendar", desc: "Sync with Outlook", connected: false },
  { id: 5, name: "Slack", desc: "Get notifications", connected: true },
  { id: 6, name: "Microsoft Teams", desc: "Integrate with Teams", connected: false },
];

// Simple month-calendar seed: day-of-month -> event titles.
export const calendarEvents = {
  9: ["Learning React — Live"],
  10: ["JS Basics Workshop"],
  12: ["Database Design & SQL"],
  20: ["Advanced Node.js"],
  23: ["Learning React — Live", "JS Basics Workshop", "Database Design & SQL"],
  25: ["Web Security Fundamentals"],
};

export const notifications = [
  { id: 1, text: "Sarah Johnson shared React Live Session materials", time: "2 min ago" },
  { id: 2, text: "3 people joined Weekly Product Sync", time: "18 min ago" },
  { id: 3, text: "Reminder: Prepare slides for React session", time: "1 hour ago" },
];

// ── Added for the 8 previously-missing sidebar sections ──

export const instantMeetingRecents = [
  { id: 1, title: "Quick sync with Sarah", when: "Today, 9:12 AM", duration: "18 min", participants: 2 },
  { id: 2, title: "Ad-hoc design review", when: "Yesterday, 4:40 PM", duration: "34 min", participants: 5 },
  { id: 3, title: "Client callback", when: "Aug 25, 11:00 AM", duration: "12 min", participants: 3 },
];

export const taskOrbitRooms = [
  { id: 1, task: "Fix onboarding checkout bug", parentMeeting: "Weekly Product Sync", members: 3, status: "Active" },
  { id: 2, task: "Draft Q3 slide deck", parentMeeting: "Learning React — Live Session", members: 2, status: "Active" },
  { id: 3, task: "Review DB schema changes", parentMeeting: "Database Design & SQL", members: 4, status: "Scheduled" },
  { id: 4, task: "Postmortem: outage on Aug 18", parentMeeting: "Onboarding Walkthrough", members: 5, status: "Archived" },
];

export const summaries = [
  { id: 1, title: "Learning React — Live Session", type: "Meetings", date: "Aug 23", actionItems: 4, length: "12 min read" },
  { id: 2, title: "JavaScript Basics Workshop", type: "Meetings", date: "Aug 23", actionItems: 2, length: "8 min read" },
  { id: 3, title: "Web Security Fundamentals", type: "Events", date: "Aug 24", actionItems: 6, length: "15 min read" },
  { id: 4, title: "Weekly Product Sync", type: "Meetings", date: "Today", actionItems: 3, length: "6 min read" },
];

export const calendarSyncAccounts = [
  { id: 1, name: "Google Calendar", email: "imam@ilmora.ai", synced: true },
  { id: 2, name: "Outlook Calendar", email: "imam@outlook.com", synced: false },
];

export const calendarSyncHistory = [
  { event: "Synced 12 events from Google Calendar", time: "2 min ago" },
  { event: "Resolved 1 double-booking conflict", time: "1 hour ago" },
  { event: "Synced 8 events from Google Calendar", time: "Yesterday" },
];

export const emailStats = [
  { label: "Unread", value: 4 },
  { label: "This week", value: 27 },
  { label: "Starred", value: 3 },
];

export const emailMessages = {
  Inbox: [
    { id: 1, subject: "Your Learning React session recording is ready", from: "ILM ORA", preview: "The recording and summary are now available…", time: "10:42 AM", unread: true, starred: false, hasAttachment: false },
    { id: 2, subject: "Sarah shared workshop materials with you", from: "Sarah Johnson", preview: "Here are the slides from today's session…", time: "9:15 AM", unread: true, starred: true, hasAttachment: true },
    { id: 3, subject: "Reminder: Database Design & SQL starts in 1 hour", from: "ILM ORA", preview: "Your session is coming up…", time: "Yesterday", unread: false, starred: false, hasAttachment: false },
  ],
  Sent: [
    { id: 4, subject: "Re: Onboarding checkout bug", from: "Mike Wilson", preview: "Sounds good, I'll take a look this afternoon…", time: "Aug 25", unread: false, starred: false, hasAttachment: false },
  ],
  Drafts: [
    { id: 5, subject: "Q3 workspace roadmap (draft)", from: "Admin Imam", preview: "Draft not sent yet…", time: "Aug 22", unread: false, starred: false, hasAttachment: false },
  ],
};

export const mySchedules = [
  { id: 1, name: "30-Minute Mentorship Call", duration: "30 min", bookings: 14, slug: "ilmora.ai/imam/30min", active: true },
  { id: 2, name: "Office Hours", duration: "60 min", bookings: 6, slug: "ilmora.ai/imam/office-hours", active: true },
  { id: 3, name: "Quick Question (15 min)", duration: "15 min", bookings: 21, slug: "ilmora.ai/imam/quick", active: false },
];

export const sharedWithMe = [
  { id: 1, title: "Onboarding Walkthrough — recording", type: "Recording", sharedBy: "Sarah Johnson", sharedByInitials: "SJ", color: "#0d9488", time: "2 days ago" },
  { id: 2, title: "Team Availability Calendar", type: "Calendar", sharedBy: "Mike Wilson", sharedByInitials: "MW", color: "#0ea5e9", time: "5 days ago" },
  { id: 3, title: "Client Onboarding Schedule", type: "Schedule", sharedBy: "ILM ORA Team", sharedByInitials: "IT", color: "#b45309", time: "1 week ago" },
];

export const reminders = [
  { id: 1, title: "Prepare slides for React session", due: "Today, 9:30 AM", priority: "High", done: false },
  { id: 2, title: "Send follow-up to workshop attendees", due: "Today, 5:00 PM", priority: "Medium", done: false },
  { id: 3, title: "Renew Zoom subscription", due: "Aug 30", priority: "Low", done: false },
  { id: 4, title: "Review onboarding feedback form", due: "Aug 22", priority: "Medium", done: true },
];
