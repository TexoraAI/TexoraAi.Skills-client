
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  FileText,
  Target,
  Sun,
  Moon,
  Calendar,
  Clock,
} from "lucide-react";

export default function SyllabusPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const courseData = location.state?.course;

  const [expandedWeek, setExpandedWeek] = useState(null);
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem("theme");
    return stored === "dark";
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  useEffect(() => {
    if (!courseData) {
      navigate("/courses");
    }
  }, [courseData, navigate]);

  if (!courseData) return null;

  const syllabus = [
    {
      week: "Week 1",
      dates: "Jan 6 — Jan 11",
      title: "Product Foundations & Capstone Kickoff",
      items: 15,
      sessions: [
        {
          type: "live",
          title: "[Capstone] Project Walkthrough and Kick-off",
          date: "FRI 1/9",
          time: "11:30 PM—12:30 AM (GMT+5:30)",
        },
        {
          type: "live",
          title: "Orientation Session [optional]",
          date: "FRI 1/9",
          time: "11:00 PM—11:30 PM (GMT+5:30)",
        },
      ],
      phase: {
        title: "Phase 1: Building Products 101",
        items: 15,
        description:
          "Master the fundamentals of product development and management",
      },
    },
    {
      week: "Week 2",
      dates: "Jan 12 — Jan 18",
      title: "Deep Dive into Product Development",
      items: 13,
      phase: {
        title: "Phase 1: Technical Deep Dive",
        items: 13,
        description:
          "Technical knowledge required for effective product management. Learn algorithms, best practices, and frameworks.",
      },
      sessions: [
        {
          type: "lesson",
          title: "Understanding Core Product Concepts",
          duration: "45 min",
        },
        {
          type: "lesson",
          title: "User-Centric Product Thinking",
          duration: "60 min",
        },
        {
          type: "live",
          title: "Guest Session: Industry Expert",
          date: "WED 1/14",
          time: "10:00 PM—11:30 PM (GMT+5:30)",
        },
      ],
    },
    {
      week: "Week 3",
      dates: "Jan 19 — Jan 25",
      title: "Strategy & XFN Collaboration",
      items: 12,
      phase: {
        title: "Phase 2: Strategic Product Management",
        items: 12,
        description:
          "Learn how to develop product strategy, work with cross-functional teams, and drive alignment.",
      },
      sessions: [
        {
          type: "lesson",
          title: "Product Strategy Frameworks",
          duration: "50 min",
        },
        {
          type: "lesson",
          title: "Working with Engineering Teams",
          duration: "40 min",
        },
        {
          type: "live",
          title: "XFN Collaboration Workshop",
          date: "THU 1/22",
          time: "9:00 PM—10:30 PM (GMT+5:30)",
        },
      ],
    },
    {
      week: "Week 4",
      dates: "Jan 26 — Feb 1",
      title: "PRDs, User Stories & Planning",
      items: 14,
      phase: {
        title: "Phase 2: Execution Excellence",
        items: 14,
        description:
          "Master the art of product documentation, user story writing, and sprint planning.",
      },
      sessions: [
        {
          type: "lesson",
          title: "Writing Effective PRDs",
          duration: "55 min",
        },
        {
          type: "lesson",
          title: "User Story Mapping",
          duration: "45 min",
        },
        {
          type: "project",
          title: "PRD Assignment",
          deadline: "SUN 2/1",
        },
      ],
    },
    {
      week: "Week 5",
      dates: "Feb 2 — Feb 8",
      title: "Data & Metrics",
      items: 16,
      phase: {
        title: "Phase 3: Data-Driven Decisions",
        items: 16,
        description:
          "Learn to define metrics, analyze data, and make data-informed decisions.",
      },
      sessions: [
        {
          type: "lesson",
          title: "Defining Success Metrics",
          duration: "50 min",
        },
        {
          type: "lesson",
          title: "A/B Testing & Experimentation",
          duration: "60 min",
        },
        {
          type: "live",
          title: "Analytics Deep Dive",
          date: "TUE 2/4",
          time: "10:00 PM—11:30 PM (GMT+5:30)",
        },
      ],
    },
    {
      week: "Week 6",
      dates: "Feb 9 — Feb 15",
      title: "Go-to-Market & Launch",
      items: 11,
      phase: {
        title: "Phase 3: Product Launch",
        items: 11,
        description:
          "Master go-to-market strategy, launch planning, and post-launch optimization.",
      },
      sessions: [
        {
          type: "lesson",
          title: "GTM Strategy Development",
          duration: "45 min",
        },
        {
          type: "lesson",
          title: "Launch Planning & Execution",
          duration: "50 min",
        },
        {
          type: "project",
          title: "Launch Plan Presentation",
          deadline: "SAT 2/14",
        },
      ],
    },
    {
      week: "Week 7-8",
      dates: "Feb 16 — Feb 22",
      title: "Capstone & Final Projects",
      items: 5,
      sessions: [
        {
          type: "live",
          title: "Final Capstone Presentations",
          date: "WED 2/18",
          time: "9:00 PM—11:00 PM (GMT+5:30)",
        },
        {
          type: "live",
          title: "Graduation & Networking",
          date: "THU 2/19",
          time: "10:00 PM—11:00 PM (GMT+5:30)",
        },
      ],
    },
  ];

  const toggleWeek = (index) => {
    setExpandedWeek(expandedWeek === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>

            <button
              onClick={() => {
                const next = !dark;
                setDark(next);
                localStorage.setItem("theme", next ? "dark" : "light");
              }}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 transition"
            >
              {dark ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {courseData.title} - Course Syllabus
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>{courseData.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>
                  {courseData.liveSessions} live sessions •{" "}
                  {courseData.totalLessons} lessons
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Syllabus Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            This comprehensive syllabus covers all aspects of{" "}
            {courseData.title.toLowerCase()}. Each week includes live sessions,
            self-paced lessons, and hands-on projects to ensure you master the
            material.
          </p>
        </div>

        <div className="space-y-3">
          {syllabus.map((week, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900"
            >
              <button
                onClick={() => toggleWeek(index)}
                className="w-full px-6 py-5 flex items-center justify-between bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {index + 1}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-lg text-gray-900 dark:text-white">
                      {week.week}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {week.dates}
                    </p>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">
                      {week.title}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                    {week.items} items
                  </span>
                  {expandedWeek === index ? (
                    <ChevronUp className="text-gray-400" size={24} />
                  ) : (
                    <ChevronDown className="text-gray-400" size={24} />
                  )}
                </div>
              </button>

              {expandedWeek === index && (
                <div className="p-6 space-y-4 bg-white dark:bg-zinc-900">
                  {week.phase && (
                    <div className="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-950/30 dark:to-emerald-950/30 rounded-xl p-4 border border-blue-200/50 dark:border-blue-800/50">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                            {week.phase.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {week.phase.description}
                          </p>
                        </div>
                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full whitespace-nowrap">
                          {week.phase.items} items
                        </span>
                      </div>
                    </div>
                  )}

                  {week.sessions &&
                    week.sessions.map((session, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-zinc-800 rounded-xl hover:shadow-md transition"
                      >
                        {session.type === "live" ? (
                          <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                            <PlayCircle size={20} className="text-white" />
                          </div>
                        ) : session.type === "project" ? (
                          <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                            <Target size={20} className="text-white" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                            <FileText size={20} className="text-white" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-white mb-1">
                            {session.title}
                          </p>
                          {session.date && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {session.date} • {session.time}
                            </p>
                          )}
                          {session.duration && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Duration: {session.duration}
                            </p>
                          )}
                          {session.deadline && (
                            <p className="text-sm text-red-600 dark:text-red-400 font-medium mt-1">
                              Due: {session.deadline}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-950/30 dark:to-emerald-950/30 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-800/50">
          <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">
            Ready to Start Learning?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Join {courseData.students} students who are already mastering{" "}
            {courseData.title.toLowerCase()}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl hover:shadow-blue-500/50 transition"
          >
            Enroll Now • {courseData.price}
          </button>
        </div>
      </div>
    </div>
  );
}
