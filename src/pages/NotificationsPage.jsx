
import React from "react";
import { useLocation } from "react-router-dom";
import { Bell, CheckCheck } from "lucide-react";

const NotificationsPage = () => {
  const { pathname } = useLocation();
  const isStudent = pathname.startsWith("/student");
  const isTrainer = pathname.startsWith("/trainer");
  const isAdmin = pathname.startsWith("/admin");
  const isBusiness = pathname.startsWith("/business");

  let notifications;

  if (isStudent) {
    notifications = [
      {
        id: 1,
        title: "New assignment published",
        description: "React Basics assignment has been added to your course.",
        time: "5 min ago",
        type: "assignment",
        icon: "📘",
        color: "from-blue-500 to-indigo-500",
      },
      {
        id: 2,
        title: "Quiz scheduled",
        description: "JavaScript quiz scheduled for tomorrow 7 PM.",
        time: "1 hr ago",
        type: "quiz",
        icon: "📝",
        color: "from-purple-500 to-pink-500",
      },
    ];
  } else if (isTrainer) {
    notifications = [
      {
        id: 1,
        title: "New doubt raised",
        description: "1 new doubt in React Hooks topic (Batch A).",
        time: "10 min ago",
        type: "doubt",
        icon: "❓",
        color: "from-orange-500 to-red-500",
      },
      {
        id: 2,
        title: "Attendance pending",
        description: "Today's Batch B attendance not marked yet.",
        time: "2 hr ago",
        type: "attendance",
        icon: "📊",
        color: "from-green-500 to-teal-500",
      },
    ];
  } else if (isAdmin) {
    notifications = [
      {
        id: 1,
        title: "New user registered",
        description: "A new student account awaits approval.",
        time: "15 min ago",
        type: "user",
        icon: "👤",
        color: "from-cyan-500 to-blue-500",
      },
      {
        id: 2,
        title: "Revenue report ready",
        description: "Monthly revenue report for LMS is generated.",
        time: "3 hr ago",
        type: "report",
        icon: "📑",
        color: "from-violet-500 to-purple-500",
      },
    ];
  } else if (isBusiness) {
    notifications = [
      {
        id: 1,
        title: "New lead assigned",
        description: "A new corporate lead has been assigned to you.",
        time: "20 min ago",
        type: "lead",
        icon: "📈",
        color: "from-emerald-500 to-green-500",
      },
      {
        id: 2,
        title: "Invoice payment received",
        description: "Payment received for invoice INV-101.",
        time: "1 hr ago",
        type: "payment",
        icon: "💳",
        color: "from-blue-500 to-cyan-500",
      },
      {
        id: 3,
        title: "Campaign performance updated",
        description: "Winter Offer campaign performance report is ready.",
        time: "3 hr ago",
        type: "campaign",
        icon: "📢",
        color: "from-pink-500 to-rose-500",
      },
    ];
  } else {
    notifications = [];
  }

  const heading = isStudent
    ? "Your notifications"
    : isTrainer
    ? "Trainer notifications"
    : isAdmin
    ? "Admin notifications"
    : isBusiness
    ? "Business notifications"
    : "Notifications";

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
              {heading}
            </h1>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">
            {isStudent &&
              "Assignments, quizzes, course updates aur system alerts yahan dikhte hain."}
            {isTrainer &&
              "Batches, students, doubts aur assessment related alerts yahan dikhte hain."}
            {isAdmin &&
              "User approvals, system status aur revenue related alerts yahan dikhte hain."}
            {isBusiness &&
              "Leads, enrollments, invoices aur campaigns se related alerts yahan dikhte hain."}
            {!isStudent && !isTrainer && !isAdmin && !isBusiness &&
              "Recent alerts from the system."}
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors">
          <CheckCheck className="w-4 h-4" />
          Mark all read
        </button>
      </div>

      {/* NOTIFICATIONS LIST */}
      <div className="space-y-3">
        {notifications.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-800 mb-4">
              <Bell className="w-8 h-8 text-gray-400 dark:text-slate-500" />
            </div>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              Abhi koi notification nahi hai.
            </p>
          </div>
        )}

        {notifications.map((item) => (
          <div
            key={item.id}
            className="group relative flex items-start gap-4 rounded-xl border border-gray-200 dark:border-slate-700/70 bg-white dark:bg-slate-900/70 p-4 shadow-sm hover:shadow-md dark:hover:shadow-lg transition-all duration-200 hover:border-gray-300 dark:hover:border-slate-600"
          >
            {/* ICON */}
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-lg shadow-md flex-shrink-0`}>
              {item.icon}
            </div>

            {/* CONTENT */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                  {item.title}
                </h2>
                <span className="text-xs text-gray-500 dark:text-slate-500 whitespace-nowrap">
                  {item.time}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
                {item.description}
              </p>
            </div>

            {/* UNREAD INDICATOR */}
            <div className="absolute top-4 right-4">
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 dark:bg-indigo-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;