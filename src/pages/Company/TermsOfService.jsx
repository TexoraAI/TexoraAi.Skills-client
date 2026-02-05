import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const TermsOfService = () => {
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
      {/* Container */}
      <div className="max-w-4xl mx-auto px-4 pt-10 pb-16">
        {/* Badge */}
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/40 text-xs font-medium text-indigo-300 mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 mr-2" />
          Texora.skills · Legal
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
          Terms of <span className="text-indigo-400">Service</span>
        </h1>

        <p className="text-sm text-slate-400 mb-8">
          Last Updated: February 2, 2026
        </p>

        {/* Intro */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-7 mb-8 shadow-lg shadow-indigo-500/10">
          <p className="text-slate-300 leading-relaxed mb-4">
            Welcome to Texora.skills. These Terms of Service form a legally
            binding agreement between you and Texora.skills governing your use
            of our learning platform.
          </p>
          <p className="text-slate-200 font-semibold leading-relaxed">
            By accessing or using Texora.skills, you agree to comply with these
            terms. If you do not agree, please discontinue use of the Service.
          </p>
        </section>

        {/* Sections */}
        <div className="space-y-8">
          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-7">
            <h2 className="text-xl font-semibold mb-3">
              Platform Usage
            </h2>
            <p className="text-slate-300 leading-relaxed">
              You must use Texora.skills responsibly and solely for lawful
              educational and training purposes. Sharing credentials or
              unauthorized access is prohibited.
            </p>
          </section>

          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-7">
            <h2 className="text-xl font-semibold mb-3">
              Your Account
            </h2>
            <p className="text-slate-300 leading-relaxed">
              You are responsible for safeguarding your account credentials and
              all activities under your account.
            </p>
          </section>

          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-7">
            <h2 className="text-xl font-semibold mb-3">
              Content Ownership
            </h2>
            <p className="text-slate-300 leading-relaxed">
              All platform content is protected by intellectual property laws.
              Unauthorized distribution may result in termination.
            </p>
          </section>

          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-7">
            <h2 className="text-xl font-semibold mb-3">
              Changes &amp; Termination
            </h2>
            <p className="text-slate-300 leading-relaxed">
              We may update these Terms or suspend access if violations occur.
              Continued use indicates acceptance.
            </p>
          </section>

          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-7">
            <h2 className="text-xl font-semibold mb-3">
              Disclaimers
            </h2>
            <p className="text-slate-300 leading-relaxed">
              The Service is provided "as is" without warranties. Use at your
              own risk.
            </p>
          </section>

          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-7">
            <h2 className="text-xl font-semibold mb-3">
              Contact Us
            </h2>
            <p className="text-slate-300 leading-relaxed">
              Questions? Contact us at{" "}
              <a
                href="mailto:legal@texora.skills"
                className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
              >
                legal@texora.skills
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
