import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const AboutTexoraSkills = () => {
  const { pathname } = useLocation();

  // 🔥 Scroll to top on route change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return (
    <div className="min-h-[calc(100vh-56px)] overflow-y-auto scroll-smooth bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      {/* Top container */}
      <div className="max-w-6xl mx-auto px-4 pt-10 pb-16">
        {/* Badge */}
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/40 text-xs font-medium text-indigo-300 mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 mr-2" />
          Texora.skills · Future-ready LMS
        </div>

        {/* Heading + intro */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
          About <span className="text-indigo-400">Texora.skills</span>
        </h1>
        <p className="text-lg text-slate-300 max-w-3xl">
          Texora.skills is built to centralize courses, assessments, and
          performance tracking into one intuitive platform.
        </p>

        {/* 2-column layout */}
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.4fr),minmax(0,1fr)] items-start">
          {/* LEFT */}
          <div className="space-y-8">
            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-lg shadow-indigo-500/10">
              <h2 className="text-xl font-semibold mb-3">
                Built for every learning role
              </h2>
              <p className="text-slate-300">
                Role-based dashboards for Students, Trainers, Admins, and
                Business Teams.
              </p>
            </section>

            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-3">Our Mission</h2>
              <p className="text-slate-300">
                Empower learners with job-ready skills and measurable outcomes.
              </p>
            </section>

            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-3">Our Vision</h2>
              <p className="text-slate-300">
                Become the trusted learning backbone for future-ready education.
              </p>
            </section>
          </div>

          {/* RIGHT */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 relative">
            <h3 className="text-lg font-semibold mb-4">
              One platform. Four roles.
            </h3>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex justify-between bg-slate-800 rounded-xl px-3 py-2">
                <span>Student</span>
                <span className="text-emerald-300">Progress</span>
              </div>
              <div className="flex justify-between bg-slate-800 rounded-xl px-3 py-2">
                <span>Trainer</span>
                <span className="text-indigo-300">Analytics</span>
              </div>
              <div className="flex justify-between bg-slate-800 rounded-xl px-3 py-2">
                <span>Admin</span>
                <span className="text-amber-300">Control</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What we offer */}
      <section className="border-t border-slate-800 bg-slate-950/80">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-semibold mb-6">What we offer</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-slate-900 rounded-2xl p-5">
              <p className="text-sky-300 font-semibold">For Students</p>
            </div>
            <div className="bg-slate-900 rounded-2xl p-5">
              <p className="text-violet-300 font-semibold">For Trainers</p>
            </div>
            <div className="bg-slate-900 rounded-2xl p-5">
              <p className="text-emerald-300 font-semibold">For Business</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutTexoraSkills;
