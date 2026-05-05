import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  GraduationCap,
  Moon,
  Sun,
  Search,
  BookOpen,
  CreditCard,
  Users,
  Settings,
  Award,
  MessageCircle,
  Mail,
} from "lucide-react";

/* ══════════════════════════════════════════════
   ILM ORA  ·  FAQ PAGE
   Design: Matches existing ILM ORA pages
   bg: #F6EDE6 | Orange: #F97316 | Navy: #1E293B
══════════════════════════════════════════════ */

const FAQ_DATA = [
  {
    category: "Courses & Programs",
    icon: BookOpen,
    color: "#F97316",
    faqs: [
      {
        q: "What types of courses does ILM ORA offer?",
        a: "ILM ORA offers industry-focused programs in Product Management, UI/UX Design, Growth Marketing, and Technology. All courses are designed by experts from top companies like Google, Amazon, and Meta.",
      },
      {
        q: "Are the courses self-paced or live?",
        a: "We offer both formats. Most courses are self-paced so you can learn on your own schedule. We also offer live cohort-based programs with mentor sessions for deeper engagement.",
      },
      {
        q: "How long does it take to complete a course?",
        a: "Course duration varies by program. Short skill-building courses can be completed in 2–4 weeks, while comprehensive bootcamp-style programs may take 8–12 weeks.",
      },
      {
        q: "Do I get a certificate after completing a course?",
        a: "Yes! Upon successful completion of all modules and assessments, you receive a verified digital certificate that you can share on LinkedIn or add to your resume.",
      },
      {
        q: "Can I access course content after completion?",
        a: "Absolutely. Once enrolled, you get lifetime access to all course materials, including future updates to the curriculum.",
      },
    ],
  },
  {
    category: "Pricing & Payments",
    icon: CreditCard,
    color: "#16a34a",
    faqs: [
      {
        q: "Are the free services really free?",
        a: "Yes! Our Free Services section offers select courses and resources at no cost. You can explore them without entering any payment details.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit/debit cards, UPI, net banking, and popular wallets. International payments via Stripe are also supported.",
      },
      {
        q: "Is there a refund policy?",
        a: "We offer a full refund within 7 days of purchase if you are not satisfied — no questions asked. After 7 days, refunds are evaluated on a case-by-case basis.",
      },
      {
        q: "Do you offer EMI or installment options?",
        a: "Yes, select programs support no-cost EMI options through partner banks and payment providers. You'll see the EMI option at checkout if it's available for your chosen program.",
      },
    ],
  },
  {
    category: "Account & Access",
    icon: Settings,
    color: "#0d9488",
    faqs: [
      {
        q: "How do I create an account?",
        a: "Click 'Get Started' on the homepage and sign up with your email or Google account. Account creation is free and takes less than a minute.",
      },
      {
        q: "I forgot my password. How do I reset it?",
        a: "Click 'Forgot Password' on the login page, enter your registered email, and we'll send you a secure reset link immediately.",
      },
      {
        q: "Can I access ILM ORA on mobile?",
        a: "Yes! ILM ORA is fully responsive and works seamlessly on all devices — mobile, tablet, and desktop. A dedicated mobile app is coming soon.",
      },
      {
        q: "Can I change my registered email address?",
        a: "Yes, you can update your email from your Profile Settings. A verification link will be sent to the new email before the change takes effect.",
      },
    ],
  },
  {
    category: "Mentors & Community",
    icon: Users,
    color: "#7c3aed",
    faqs: [
      {
        q: "Who are the mentors at ILM ORA?",
        a: "Our mentors are senior professionals and leaders from top companies like Google, Amazon, Flipkart, and leading startups. Each mentor is vetted for both expertise and teaching ability.",
      },
      {
        q: "Can I get 1-on-1 mentorship sessions?",
        a: "Yes, select programs include dedicated 1-on-1 mentor sessions. You can also book additional mentorship sessions separately from your dashboard.",
      },
      {
        q: "Is there a student community I can join?",
        a: "Absolutely! All enrolled students get access to our private community on WhatsApp and Discord where you can network, share projects, and collaborate with peers.",
      },
    ],
  },
  {
    category: "Certificates & Careers",
    icon: Award,
    color: "#db2777",
    faqs: [
      {
        q: "Are ILM ORA certificates recognized by employers?",
        a: "Our certificates are recognized by a growing network of hiring partners. We also partner with companies to source top learners for open roles.",
      },
      {
        q: "Does ILM ORA help with job placement?",
        a: "Yes! Our Career Support team helps with resume reviews, mock interviews, and connecting you to our hiring partner network. Placement support is available in select premium programs.",
      },
      {
        q: "Can I add my certificate to LinkedIn?",
        a: "Yes. Every certificate comes with a unique verification link that you can directly add to your LinkedIn profile under 'Licenses & Certifications'.",
      },
    ],
  },
];

const ALL_FAQS = FAQ_DATA.flatMap((cat) =>
  cat.faqs.map((faq) => ({ ...faq, category: cat.category }))
);

export default function FAQ() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  const goHome = () => {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const categories = ["All", ...FAQ_DATA.map((c) => c.category)];

  const filtered = ALL_FAQS.filter((faq) => {
    const matchCat =
      activeCategory === "All" || faq.category === activeCategory;
    const matchSearch =
      search.trim() === "" ||
      faq.q.toLowerCase().includes(search.toLowerCase()) ||
      faq.a.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="min-h-screen bg-[#F6EDE6] dark:bg-black text-[#1E293B] dark:text-white">

      {/* ══ NAVBAR ══ */}
      <header className="bg-white/90 dark:bg-black/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-[#F97316]/20 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={goHome}
            className="flex items-center gap-3 bg-transparent border-none cursor-pointer p-0"
          >
            <div className="w-10 h-10 bg-[#F97316] rounded-xl flex items-center justify-center shadow-md">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">
              <span className="text-green-600 dark:text-green-400">ILM </span>
              <span className="text-[#F97316]">ORA</span>
            </span>
          </button>
          <button
            onClick={() => setDark(!dark)}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-[#F6EDE6] dark:hover:bg-gray-900 transition shadow-sm"
            aria-label="Toggle theme"
          >
            {dark ? (
              <Sun className="w-5 h-5 text-[#F97316]" />
            ) : (
              <Moon className="w-5 h-5 text-[#1E293B]" />
            )}
          </button>
        </div>
      </header>

      {/* ══ HERO ══ */}
      <section className="bg-[#1E293B] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 70% 0%, rgba(249,115,22,0.15) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 10% 80%, rgba(22,163,74,0.10) 0%, transparent 55%)",
          }}
        />
        <div className="max-w-7xl mx-auto px-6 py-14 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#F97316]/15 text-[#F97316] border border-[#F97316]/30 px-4 py-2 rounded-full mb-6 text-xs font-bold tracking-widest uppercase">
            <MessageCircle className="w-4 h-4" />
            Help Center
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4 tracking-tight">
            Frequently Asked{" "}
            <span className="text-[#F97316]">Questions</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            Everything you need to know about ILM ORA — courses, payments, accounts, and more.
          </p>

          {/* Search bar */}
          <div className="max-w-lg mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setOpenIndex(null); }}
              placeholder="Search questions..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#F97316]/60 focus:bg-white/15 transition text-sm"
            />
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 mt-10 flex-wrap">
            {[
              { val: `${ALL_FAQS.length}+`, lbl: "Questions Answered" },
              { val: "5", lbl: "Categories" },
              { val: "24h", lbl: "Support Response" },
            ].map((s) => (
              <div key={s.lbl} className="text-center">
                <div className="text-2xl font-black text-white leading-none">{s.val}</div>
                <div className="text-xs text-gray-500 mt-1 font-medium">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ MAIN CONTENT ══ */}
      <section className="max-w-7xl mx-auto px-6 py-14">

        {/* Category pills */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {categories.map((cat) => {
            const catData = FAQ_DATA.find((c) => c.category === cat);
            const Icon = catData?.icon;
            return (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setOpenIndex(null); }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm ${
                  activeCategory === cat
                    ? "bg-[#1E293B] dark:bg-[#F97316] text-white shadow-md scale-105"
                    : "bg-white dark:bg-gray-900 text-[#1E293B] dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-[#F97316]/10 hover:border-[#F97316]/40 hover:text-[#F97316] dark:hover:bg-gray-800"
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {cat}
              </button>
            );
          })}
        </div>

        {/* Results count */}
        {search.trim() !== "" && (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""} for{" "}
            <span className="text-[#F97316] font-semibold">"{search}"</span>
          </p>
        )}

        {/* FAQ list */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400 dark:text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No results found.</p>
            <p className="text-sm mt-2">Try a different keyword or category.</p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto flex flex-col gap-3">
            {filtered.map((faq, i) => {
              const catData = FAQ_DATA.find((c) => c.category === faq.category);
              const isOpen = openIndex === i;
              return (
                <div
                  key={i}
                  className={`bg-white dark:bg-gray-900 rounded-2xl border overflow-hidden transition-all duration-200 ${
                    isOpen
                      ? "border-[#F97316]/40 shadow-md"
                      : "border-gray-200 dark:border-gray-800 hover:border-[#F97316]/30"
                  }`}
                >
                  <button
                    onClick={() => toggle(i)}
                    className="w-full flex items-start justify-between gap-4 px-6 py-5 text-left"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      {/* Category color dot */}
                      <span
                        className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                        style={{ background: catData?.color || "#F97316" }}
                      />
                      <div>
                        {/* Show category label when "All" is selected */}
                        {activeCategory === "All" && (
                          <span
                            className="text-xs font-bold uppercase tracking-widest mb-1 block"
                            style={{ color: catData?.color || "#F97316" }}
                          >
                            {faq.category}
                          </span>
                        )}
                        <span className="font-semibold text-[#1E293B] dark:text-gray-100 text-base leading-snug">
                          {faq.q}
                        </span>
                      </div>
                    </div>
                    <ChevronDown
                      className="w-5 h-5 text-[#F97316] flex-shrink-0 mt-1 transition-transform duration-200"
                      style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-0">
                      <div className="ml-5 pl-3 border-l-2 border-[#F97316]/30">
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ══ STILL HAVE QUESTIONS CTA ══ */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="max-w-3xl mx-auto bg-[#1E293B] dark:bg-gray-900 rounded-3xl p-10 text-center relative overflow-hidden border border-[#F97316]/20">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#F97316]" />
          <div
            className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none"
            style={{ background: "rgba(249,115,22,0.08)" }}
          />
          <div className="relative z-10">
            <div className="w-14 h-14 bg-[#F97316]/15 border border-[#F97316]/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-7 h-7 text-[#F97316]" />
            </div>
            <h2 className="text-2xl font-extrabold text-white mb-3">
              Still have questions?
            </h2>
            <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto leading-relaxed">
              Can't find what you're looking for? Our support team is happy to help you within 24 hours.
            </p>
            <a
              href="mailto:support@ilmora.com"
              className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#ea6c0a] text-white font-bold px-7 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm"
            >
              <Mail className="w-4 h-4" />
              Contact Support
            </a>
            <p className="text-gray-500 text-xs mt-4">
              support@ilmora.com · Mon–Fri, 9am–6pm IST
            </p>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="bg-white dark:bg-gray-950 text-[#1E293B] dark:text-gray-200 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] items-start">

            {/* Col 1 */}
            <div className="flex flex-col gap-4 self-start">
              <button onClick={goHome} className="bg-transparent border-none cursor-pointer p-0 text-left w-fit">
                <h3 className="text-3xl font-extrabold leading-none">
                  <span className="text-green-600">ILM</span>{" "}
                  <span className="text-[#F97316]">ORA</span>
                </h3>
              </button>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Modern learning platform for ambitious professionals who want to break into product, design and growth roles.
              </p>
              <p className="text-sm text-gray-500">
                📧{" "}
                <a href="mailto:support@ilmora.com" className="hover:text-[#F97316] transition-colors">
                  support@ilmora.com
                </a>
              </p>
              <p className="text-sm text-gray-500">📍 New Delhi, India</p>
              <div className="flex items-center gap-3 pt-1">
                <a href="https://www.youtube.com/@Texoraai" target="_blank" rel="noreferrer"
                  className="h-9 w-9 rounded-full flex items-center justify-center text-white bg-[#FF0000] hover:scale-110 hover:shadow-md transition-all">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
                <a href="https://www.linkedin.com/company/105596104" target="_blank" rel="noreferrer"
                  className="h-9 w-9 rounded-full flex items-center justify-center text-white bg-[#0A66C2] hover:scale-110 hover:shadow-md transition-all">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href="https://api.whatsapp.com/send?phone=919210970334" target="_blank" rel="noreferrer"
                  className="h-9 w-9 rounded-full flex items-center justify-center text-white bg-[#25D366] hover:scale-110 hover:shadow-md transition-all">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                </a>
                <a href="https://www.instagram.com/texora_ai" target="_blank" rel="noreferrer"
                  className="h-9 w-9 rounded-full flex items-center justify-center text-white hover:scale-110 hover:shadow-md transition-all"
                  style={{ background: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)" }}>
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                </a>
                <a href="https://x.com/texoraai" target="_blank" rel="noreferrer"
                  className="h-9 w-9 rounded-full flex items-center justify-center text-white bg-black hover:scale-110 hover:shadow-md transition-all">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L2.062 2.25H8.28l4.259 5.63 5.704-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              </div>
            </div>

            {/* Col 2: Programs */}
            <div className="flex flex-col gap-4 self-start">
              <h4 className="text-sm font-bold tracking-widest text-[#1E293B] dark:text-gray-200 uppercase">Programs</h4>
              <ul className="flex flex-col gap-2.5 text-sm text-gray-600 dark:text-gray-400">
                {["Product Management", "Growth Marketing", "UI / UX Design"].map((label) => (
                  <li key={label} className="hover:text-[#F97316] cursor-pointer transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-[#F97316] opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                    {label}
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Resources */}
            <div className="flex flex-col gap-4 self-start">
              <h4 className="text-sm font-bold tracking-widest text-[#1E293B] dark:text-gray-200 uppercase">Resources</h4>
              <ul className="flex flex-col gap-2.5 text-sm text-gray-600 dark:text-gray-400">
                {[
                  { label: "Success Stories", action: () => navigate("/") },
                  { label: "Free Services", action: () => { navigate("/explore-programs"); window.scrollTo({ top: 0, behavior: "instant" }); } },
                  { label: "Blogs", action: () => window.open("https://texora.ai/blogs", "_blank") },
                ].map((item) => (
                  <li key={item.label} onClick={item.action} className="hover:text-[#F97316] cursor-pointer transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-[#F97316] opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4: Company */}
            <div className="flex flex-col gap-4 self-start">
              <h4 className="text-sm font-bold tracking-widest text-[#1E293B] dark:text-gray-200 uppercase">Company</h4>
              <ul className="flex flex-col gap-2.5 text-sm text-gray-600 dark:text-gray-400">
                {[
                  { label: "About Us", path: "/about" },
                  { label: "Careers", path: "/careers" },
                  { label: "Pricing", path: "/pricing" },
                  { label: "Privacy Policy", path: "/privacy-policy" },
                  { label: "Terms of Service", path: "/terms-of-service" },
                  { label: "Contact Us", path: "/contact" },
                ].map((item) => (
                  <li key={item.label} onClick={() => { navigate(item.path); window.scrollTo({ top: 0, behavior: "instant" }); }}
                    className="hover:text-[#F97316] cursor-pointer transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-[#F97316] opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 5: Support */}
            <div className="flex flex-col gap-4 self-start">
              <h4 className="text-sm font-bold tracking-widest text-[#1E293B] dark:text-gray-200 uppercase">Support</h4>
              <ul className="flex flex-col gap-2.5 text-sm text-gray-600 dark:text-gray-400">
                {[
                  { label: "Help Center", path: "/help-center" },
                  { label: "Contact", path: "/contact" },
                  { label: "FAQ", path: "/faq" },
                ].map((item) => (
                  <li key={item.label} onClick={() => { navigate(item.path); window.scrollTo({ top: 0, behavior: "instant" }); }}
                    className="hover:text-[#F97316] cursor-pointer transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-[#F97316] opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                    {item.label}
                  </li>
                ))}
              </ul>
              <div className="pt-1">
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Status: Live
                </span>
              </div>
            </div>

          </div>

          {/* Bottom bar */}
          <div className="border-t border-gray-200 dark:border-gray-800 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <span>© {new Date().getFullYear()} ILM ORA All rights reserved.</span>
            <div className="flex items-center gap-2">
              <span>Built with</span>
              <span className="text-red-500 text-base">❤️</span>
              <span>passion for modern learners</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}