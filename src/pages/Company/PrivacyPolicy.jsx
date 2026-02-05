import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PrivacyPolicy = () => {
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
      <div className="max-w-4xl mx-auto px-4 pt-10 pb-16">
        {/* Badge */}
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/40 text-xs font-medium text-indigo-300 mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 mr-2" />
          Texora.skills · Legal
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
          Privacy <span className="text-indigo-400">Policy</span>
        </h1>

        <p className="text-sm text-slate-400 mb-8">
          Last Updated: February 2, 2026
        </p>

        {/* Intro card */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-7 mb-8 shadow-lg shadow-indigo-500/10">
          <p className="text-slate-300 leading-relaxed">
            Texora.skills ("Texora," "we," "our," and/or "us") values the privacy
            of individuals who use our learning platform. This Privacy Policy
            explains how we collect, use, and protect information from users of
            our Services.
          </p>
        </section>

        {/* Content blocks */}
        <div className="space-y-8">
          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-7">
            <h2 className="text-xl font-semibold mb-3">
              Information We Collect
            </h2>
            <p className="text-slate-300 leading-relaxed">
              We collect information you provide directly when you create an
              account, such as your name, email address, and profile details.
              We also collect learning progress, assessment results, and usage
              analytics.
            </p>
          </section>

          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-7">
            <h2 className="text-xl font-semibold mb-3">
              How We Use Information
            </h2>
            <p className="text-slate-300 leading-relaxed">
              The information we collect is used to operate, maintain, and
              improve Texora.skills, including course delivery, progress
              tracking, certificates, and security.
            </p>
          </section>

          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-7">
            <h2 className="text-xl font-semibold mb-3">Data Security</h2>
            <p className="text-slate-300 leading-relaxed">
              We apply industry-standard security measures to protect your
              data. However, no system can be completely secure.
            </p>
          </section>

          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-7">
            <h2 className="text-xl font-semibold mb-3">Your Rights</h2>
            <p className="text-slate-300 leading-relaxed">
              You may request access, correction, or deletion of your personal
              data at any time through support or profile settings.
            </p>
          </section>

          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-7">
            <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
            <p className="text-slate-300 leading-relaxed">
              Questions? Reach us at{" "}
              <a
                href="mailto:privacy@texora.skills"
                className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
              >
                privacy@texora.skills
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
