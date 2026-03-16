
import {
  ChevronRight,
  Clock,
  Code,
  GraduationCap,
  Palette,
  Play,
  Rocket,
  Star,
  TrendingUp,
  Users,
  Moon,
  Sun,
  Youtube,
  Linkedin,
  MessageCircle,
  BookOpen,
  Award,
  Zap,
  Globe,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ExploreFreeServices = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark",
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  const categories = [
    { id: "all", name: "All Programs", icon: GraduationCap },
    { id: "product", name: "Product Management", icon: Rocket },
    { id: "design", name: "Design", icon: Palette },
    { id: "growth", name: "Growth & Marketing", icon: TrendingUp },
    { id: "tech", name: "Technology", icon: Code },
  ];

  const services = [
    {
      id: 1,
      category: "product",
      title: "Build An Agentic AI Product End to End, No Code",
      instructors: [
        "Tyler Fisk: Co-Founder AI Build Lab",
        "Sara Davison: Co-Founder AI Build Lab",
      ],
      students: "10,477 students",
      rating: 4.9,
      duration: "6 weeks",
      level: "Beginner",
      featured: true,
      status: "ON DEMAND",
      topics: ["AI Product Development", "No-Code Tools", "Product Strategy"],
    },
  ];

  const filteredServices =
    activeCategory === "all"
      ? services
      : services.filter((s) => s.category === activeCategory);

  const stats = [
    { value: "10K+", label: "Active Learners", icon: Users },
    { value: "95%", label: "Success Rate", icon: Award },
    { value: "100+", label: "Expert Mentors", icon: Globe },
    { value: "4.9", label: "Average Rating", icon: Star },
  ];

  return (
    <div className="min-h-screen bg-[#F6EDE6] dark:bg-black text-[#1E293B] dark:text-white">
      {/* Header */}
      <header className="bg-white/90 dark:bg-black/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-[#F97316]/20 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F97316] rounded-xl flex items-center justify-center shadow-md">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">
  <span className="text-green-600 dark:text-green-400">ILM </span>
  <span className="text-[#F97316]">ORA</span>
</span>
          </div>
          <nav className="flex items-center gap-8">
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
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#F97316]/10 dark:bg-[#F97316]/20 text-[#F97316] border border-[#F97316]/30 px-4 py-2 rounded-full mb-6 text-sm font-semibold">
            <Zap className="w-4 h-4" />
            Advanced ILM ORA for Modern Education
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#1E293B] dark:text-white leading-tight">
            Explore Our{" "}
            <span className="text-[#F97316]">
              Free Services
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Access world-class courses from industry experts at Google, Amazon,
            Meta & top startups. Start learning today with our comprehensive
            programs.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-gray-900 rounded-2xl p-6 text-center shadow-md border border-gray-200 dark:border-gray-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-10 h-10 bg-[#F97316]/10 dark:bg-[#F97316]/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-[#F97316]" />
                </div>
                <div className="text-4xl font-bold text-[#F97316] mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium text-sm">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm ${
                  activeCategory === cat.id
                    ? "bg-[#1E293B] dark:bg-[#F97316] text-white shadow-md scale-105"
                    : "bg-white dark:bg-gray-900 text-[#1E293B] dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-[#F97316]/10 hover:border-[#F97316]/40 hover:text-[#F97316] dark:hover:bg-gray-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-200 dark:border-gray-800 hover:-translate-y-1 w-full"
            >
              {/* Card top accent bar */}
              <div className="h-1.5 bg-[#F97316]" />

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-[#F97316] bg-[#F97316]/10 dark:bg-[#F97316]/20 border border-[#F97316]/30 px-3 py-1 rounded-full">
                    {service.status}
                  </span>
                  {service.featured && (
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded-full">
                      <Star className="w-3 h-3 fill-current" />
                      Featured
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-[#1E293B] dark:text-gray-100 mb-3 group-hover:text-[#F97316] transition-colors overflow-hidden max-h-14 line-clamp-2 leading-snug">
                  {service.title}
                </h3>

                <div className="flex flex-wrap gap-2 mb-4">
                  {service.topics.slice(0, 2).map((topic, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-[#F6EDE6] dark:bg-gray-800 text-[#1E293B] dark:text-gray-300 border border-[#F97316]/20 px-3 py-1 rounded-full font-medium"
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                <div className="space-y-3 mb-4">
                  {service.instructors.map((instructor, idx) => {
                    const name = instructor.split(":")[0].trim();
                    const initials = name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2);

                    return (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-[#1E293B] dark:bg-[#F97316] rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
                          {initials}
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed flex-1 pt-1">
                          {instructor}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#F97316]" />
                    {service.students}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{service.rating}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm mb-4">
                  <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                    <Clock className="w-4 h-4 text-[#F97316]" />
                    {service.duration}
                  </div>
                  <span className="bg-[#1E293B]/10 dark:bg-white/10 text-[#1E293B] dark:text-white px-3 py-1 rounded-full text-xs font-semibold border border-[#1E293B]/20 dark:border-white/20">
                    {service.level}
                  </span>
                </div>

                <button
                  onClick={() => navigate(`/watch-demo/${service.id}`)}
                  className="w-full bg-[#1E293B] dark:bg-[#F97316] hover:bg-[#334155] dark:hover:bg-[#ea6c0a] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md group-hover:scale-[1.02]"
                >
                  <Play className="w-4 h-4" />
                  Watch Now
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-[#1E293B] dark:bg-gray-900 rounded-3xl p-12 text-center text-white shadow-2xl border border-[#F97316]/20 relative overflow-hidden">
          {/* Decorative orange accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#F97316]" />
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-[#F97316]/20 text-[#F97316] border border-[#F97316]/40 px-4 py-2 rounded-full mb-6 text-sm font-semibold">
              <BookOpen className="w-4 h-4" />
              Start Your Journey Today
            </div>
            <h2 className="text-4xl font-bold mb-4 text-white">
              Ready to Become the{" "}
              <span className="text-[#F97316]">Top 1%?</span>
            </h2>
            <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
              Join thousands of learners who are mastering Product, Design, Growth
              & Technology
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
             
              
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-[#1E293B] mt-20">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-5">
            <h3 className="text-2xl font-bold">
  <span className="text-green-600">ILM </span>
  <span className="text-[#F97316]">ORA</span>
</h3>
              <p className="text-sm text-gray-600 max-w-sm">
                Modern learning platform for ambitious professionals who want to break into product, design and growth roles.
              </p>
              <div className="flex gap-4 pt-4">
                {/* YouTube */}
                <a href="https://www.youtube.com/@Texoraai" target="_blank" rel="noreferrer" aria-label="YouTube"
                  className="h-8 w-8 rounded-full flex items-center justify-center text-white shadow-md transition-all duration-300 hover:scale-110 bg-red-600">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                {/* LinkedIn */}
                <a href="https://www.linkedin.com/company/105596104" target="_blank" rel="noreferrer" aria-label="LinkedIn"
                  className="h-8 w-8 rounded-full flex items-center justify-center text-white shadow-md transition-all duration-300 hover:scale-110 bg-blue-700">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                {/* WhatsApp */}
                <a href="https://api.whatsapp.com/send?phone=919210970334" target="_blank" rel="noreferrer" aria-label="WhatsApp"
                  className="h-8 w-8 rounded-full flex items-center justify-center text-white shadow-md transition-all duration-300 hover:scale-110 bg-green-500">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                  </svg>
                </a>
                {/* Instagram */}
              <a
              href="https://www.instagram.com/texora_ai"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="h-8 w-8 rounded-full flex items-center justify-center text-white shadow-md transition-all duration-300 hover:scale-110 bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500"
              >
              <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="currentColor"
              >
              <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm4.25 5.5a4.75 4.75 0 1 0 0 9.5 4.75 4.75 0 0 0 0-9.5zm0 7.75a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm4.75-8.88a1.13 1.13 0 1 1-2.25 0 1.13 1.13 0 0 1 2.25 0z"/>
             </svg>
              </a>
             {/* X (Twitter) */}
            <a
            href="https://x.com/texoraai"
            target="_blank"
            rel="noreferrer"
            aria-label="X"
            className="h-8 w-8 rounded-full flex items-center justify-center text-white shadow-md transition-all duration-300 hover:scale-110 bg-black"
          >
          <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="currentColor"
          >
          <path d="M18.244 2H21l-6.543 7.482L22 22h-6.828l-5.34-7.038L3.828 22H1.07l7.002-8.003L2 2h6.828l4.838 6.372L18.244 2z"/>
          </svg>
          </a>
              </div>
            </div>
            {/* Links Sections */}
            {[
              {
                title: "Resources",
                items: [
                  { label: "Success Stories", action: () => {} },
                  { label: "Free Services", action: () => navigate("/explore-programs") }
                ]
              },
              {
                title: "Company",
                items: [
                  { label: "About Us", action: () => navigate("/about") },
                  { label: "Careers", action: () => navigate("/careers") },
                  { label: "Privacy Policy", action: () => navigate("/privacy-policy") },
                  { label: "Terms of Service", action: () => navigate("/terms-of-service") },
                ]
              }
            ].map((section, i) => (
              <div key={i} className="space-y-4">
                <h4 className="text-sm font-semibold text-[#1E293B] tracking-wide">
                  {section.title}
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  {section.items.map(item => (
                    <li
                      key={item.label}
                      onClick={item.action}
                      className="hover:text-[#F97316] cursor-pointer transition"
                    >
                      {item.label}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-300 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <span>© {new Date().getFullYear()} ILM ORA. All rights reserved.</span>
            <span>Built for modern learners</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ExploreFreeServices;











