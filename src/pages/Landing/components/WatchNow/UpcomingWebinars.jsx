import { CalendarDays, Bell } from "lucide-react";
import { upcomingWebinars } from "./data";

export default function UpcomingWebinars({
  webinars = upcomingWebinars,
  title = "Upcoming Webinars",
  onSetReminder,
}) {
  if (!webinars?.length) return null;

  return (
    <div className="mt-6 sm:mt-8">
      <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">
        {title}
      </h3>
      <div className="grid sm:grid-cols-2 gap-4">
        {webinars.map((webinar) => (
          <div
            key={webinar.id}
            className="flex items-center justify-between gap-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#F97316]/10 text-[#F97316] shrink-0">
                <CalendarDays className="w-5 h-5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#1E293B] dark:text-white truncate">
                  {webinar.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {webinar.date} &middot; {webinar.mentor}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onSetReminder?.(webinar)}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#1E293B] dark:text-white border border-gray-200 dark:border-gray-700 rounded-full px-3 py-1.5 hover:border-[#F97316] hover:text-[#F97316] transition-colors shrink-0"
            >
              <Bell className="w-3.5 h-3.5" />
              Remind me
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
