import { Video, Users, Clock, Star } from "lucide-react";
import { watchNowStats } from "./data";

const ICONS = {
  videos: { Icon: Video, bg: "bg-[#FDE9DD]", color: "text-[#F97316]" },
  experts: { Icon: Users, bg: "bg-[#DCFCE7]", color: "text-green-600" },
  hours: { Icon: Clock, bg: "bg-[#FDE9DD]", color: "text-[#F97316]" },
  rating: { Icon: Star, bg: "bg-[#DCFCE7]", color: "text-green-600" },
};

export default function Stats({ stats = watchNowStats }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-10">
      {stats.map((stat) => {
        const iconMeta = ICONS[stat.key] || ICONS.videos;
        const { Icon, bg, color } = iconMeta;
        return (
          <div
            key={stat.key}
            className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl px-4 py-5 flex items-center gap-3 shadow-sm"
          >
            <span className={`flex items-center justify-center w-10 h-10 rounded-full ${bg} shrink-0`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </span>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-extrabold text-[#1E293B] dark:text-white leading-none">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                {stat.label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
