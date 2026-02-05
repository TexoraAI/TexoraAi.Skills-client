import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Careers = () => {
  const { pathname } = useLocation();

  // 🔥 Scroll to top on route change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  const roles = [
    {
      title: "Frontend Engineer",
      location: "Remote (India)",
    },
    {
      title: "Backend Engineer",
      location: "Remote (India)",
    },
    {
      title: "EdTech Intern",
      location: "Remote (India)",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-56px)] overflow-y-auto scroll-smooth bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      {/* Container */}
      <div className="max-w-5xl mx-auto px-4 pt-12 pb-20">
        {/* Badge */}
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/40 text-xs font-medium text-indigo-300 mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 mr-2" />
          Texora.skills · Careers
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
          Careers at <span className="text-indigo-400">Texora.skills</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-3xl leading-relaxed">
          Texora.skills is building the learning platform of tomorrow. We’re
          empowering students, trainers, and institutions with modern,
          cohort-based learning experiences.
        </p>

        {/* Roles */}
        <div className="space-y-4">
          {roles.map((role, i) => (
            <a
              key={i}
              href="#"
              className="group block bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/10 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-50 mb-1 group-hover:text-indigo-400 transition-colors">
                    {role.title}
                  </h3>
                  <p className="text-sm text-slate-400">{role.location}</p>
                </div>

                <span className="flex items-center justify-center h-9 w-9 rounded-full bg-slate-800 text-slate-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-all">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-14 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center">
          <p className="text-slate-300">
            Don’t see a role that fits?
            <span className="block mt-1">
              Reach out to us at{" "}
              <a
                href="mailto:careers@texora.skills"
                className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
              >
                careers@texora.skills
              </a>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Careers;
