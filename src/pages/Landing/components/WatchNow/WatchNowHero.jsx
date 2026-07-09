import {
  Play,
  PlayCircle,
  Users,
  Sparkles,
  TrendingUp,
  Briefcase,
  Award,
} from "lucide-react";
import { watchNowFeatures } from "./data";

const FEATURE_ICONS = {
  live: { Icon: PlayCircle, color: "text-[#F97316]" },
  guidance: { Icon: Users, color: "text-green-600" },
  interview: { Icon: Sparkles, color: "text-[#F97316]" },
  skills: { Icon: TrendingUp, color: "text-green-600" },
  projects: { Icon: Briefcase, color: "text-[#F97316]" },
  resources: { Icon: Award, color: "text-green-600" },
};

export default function WatchNowHero({ onWatchNow, features = watchNowFeatures }) {
  return (
    <div className="flex flex-col justify-center">
      <span className="inline-flex items-center gap-1.5 self-start text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#F97316] bg-[#F97316]/10 border border-[#F97316]/20 px-4 py-1.5 rounded-full mb-4">
        <Play className="w-3 h-3 fill-[#F97316]" />
        Watch Now
      </span>

     <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 tracking-tight text-[#1E293B] dark:text-white leading-tight">
  Learn Through{" "}
  <span className="text-[#F97316]">Expert Sessions</span>
</h2>

      <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-xl leading-relaxed">
  Explore live sessions, career guidance, interview preparation,
  hands-on projects, and expert-led learning designed to help you
  build real-world skills and grow your career.
</p>

      <ul className="flex flex-col gap-3 mb-8">
        {features.map((feature) => {
          const meta = FEATURE_ICONS[feature.key] || FEATURE_ICONS.live;
          const { Icon, color } = meta;
          return (
            <li key={feature.key} className="flex items-center gap-3">
              <span className={`flex items-center justify-center w-6 h-6 shrink-0 ${color}`}>
                <Icon className="w-5 h-5" />
              </span>
              <span className="text-sm sm:text-base font-medium text-[#1E293B] dark:text-gray-200">
                {feature.text}
              </span>
            </li>
          );
        })}
      </ul>

      
    </div>
  );
}
