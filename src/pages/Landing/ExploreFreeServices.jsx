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
  BookOpen,
  Award,
  Zap,
  Globe,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { courseService } from "../../services/courseService";

const ExploreFreeServices = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark",
  );
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // ── Navigate to home + scroll to top ──
  const goHome = () => {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await courseService.getAllFeaturedCourses();
        const data = res.data?.data || res.data || [];

        const safeArray = (val) => {
          if (Array.isArray(val)) return val;
          if (typeof val === "string")
            return val
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean);
          return [];
        };

        const normalized = data.map((course) => ({
          id: course._id || course.id,
          category: (course.category || "product").toLowerCase(),
          title: course.title || "Untitled Course",
          instructors: safeArray(
            Array.isArray(course.instructors)
              ? course.instructors
              : course.instructor
                ? [course.instructor]
                : ["Instructor"],
          ),
          students: course.studentsCount
            ? `${Number(course.studentsCount).toLocaleString()} students`
            : "0 students",
          rating: course.rating || 4.9,
          duration: course.duration || "Self-paced",
          level: course.level || "Beginner",
          featured: course.featured ?? true,
          status: course.status || "ON DEMAND",
          topics: safeArray(course.topics).length
            ? safeArray(course.topics)
            : safeArray(course.tags),
          thumbnail: course.thumbnail || course.image || null,
        }));

        setServices(normalized);
      } catch (err) {
        console.error("Failed to fetch featured courses:", err);
        setError("Failed to load courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCourses();
  }, []);

  const categories = [
    { id: "all", name: "All Programs", icon: GraduationCap },
    { id: "product", name: "Product Management", icon: Rocket },
    { id: "design", name: "Design", icon: Palette },
    { id: "growth", name: "Growth & Marketing", icon: TrendingUp },
    { id: "tech", name: "Technology", icon: Code },
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
          {/* ── ILM ORA logo — home par jata hai ── */}
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
            Explore Our <span className="text-[#F97316]">Free Services</span>
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
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-800 w-full animate-pulse"
              >
                <div className="h-1.5 bg-gray-200 dark:bg-gray-700" />
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-24" />
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20" />
                  </div>
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl flex-shrink-0" />
                    <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="text-red-500 text-lg font-semibold mb-2">
              {error}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-[#F97316] text-white rounded-xl font-semibold hover:bg-[#ea6c0a] transition"
            >
              Retry
            </button>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium">
              No courses found in this category.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-200 dark:border-gray-800 hover:-translate-y-1 w-full"
              >
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
                      const name =
                        typeof instructor === "string"
                          ? instructor.split(":")[0].trim()
                          : instructor?.name || "Instructor";
                      const initials = name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2);
                      const label =
                        typeof instructor === "string"
                          ? instructor
                          : instructor?.name || "Instructor";

                      return (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-[#1E293B] dark:bg-[#F97316] rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
                            {initials}
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed flex-1 pt-1">
                            {label}
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
        )}

        {/* CTA Section */}
        <div className="mt-20 bg-[#1E293B] dark:bg-gray-900 rounded-3xl p-12 text-center text-white shadow-2xl border border-[#F97316]/20 relative overflow-hidden">
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
              Join thousands of learners who are mastering Product, Design,
              Growth & Technology
            </p>
          </div>
        </div>
      </section>

     {/* ── Footer ── */}
     <footer className="bg-white text-[#1E293B]">
        <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid gap-14 grid-cols-1 md:grid-cols-2 lg:grid-cols-5 items-start">

            {/* ── Col 1: Logo + Desc + Social ── */}
            <div className="flex flex-col gap-2.5 self-start text-left">
              <h3 className="text-3xl font-extrabold leading-none">
                <span className="text-green-600">ILM</span>{" "}
                <span className="text-[#F97316]">ORA</span>
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Modern learning platform for ambitious professionals who want to break into product, design and growth roles.
              </p>
              <p className="text-sm text-gray-500">
                📧{" "}
                <a href="mailto:support@ilmora.com" className="hover:text-[#F97316] transition-colors">
                  support@ilmora.com
                </a>
              </p>
              <p className="text-sm text-gray-500">📍 New Delhi, India</p>

              {/* Social Icons */}
              <div className="flex items-center gap-3 pt-1">
                {/* YouTube */}
                <a href="https://www.youtube.com/@Texoraai" target="_blank" rel="noreferrer"
                  className="h-9 w-9 rounded-full flex items-center justify-center text-white bg-[#FF0000] hover:scale-110 hover:shadow-md transition-all">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                {/* LinkedIn */}
                <a href="https://www.linkedin.com/company/105596104" target="_blank" rel="noreferrer"
                  className="h-9 w-9 rounded-full flex items-center justify-center text-white bg-[#0A66C2] hover:scale-110 hover:shadow-md transition-all">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                {/* WhatsApp */}
                <a href="https://api.whatsapp.com/send?phone=919210970334" target="_blank" rel="noreferrer"
                  className="h-9 w-9 rounded-full flex items-center justify-center text-white bg-[#25D366] hover:scale-110 hover:shadow-md transition-all">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                  </svg>
                </a>
                {/* Instagram */}
                <a href="https://www.instagram.com/texora_ai" target="_blank" rel="noreferrer"
                  className="h-9 w-9 rounded-full flex items-center justify-center text-white hover:scale-110 hover:shadow-md transition-all"
                  style={{ background: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)" }}>
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                  </svg>
                </a>
                {/* X (Twitter) */}
                <a href="https://x.com/texoraai" target="_blank" rel="noreferrer"
                  className="h-9 w-9 rounded-full flex items-center justify-center text-white bg-black hover:scale-110 hover:shadow-md transition-all">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L2.062 2.25H8.28l4.259 5.63 5.704-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* ── Col 2: Programs ── */}
            <div className="flex flex-col gap-4 items-center text-center">
              <h4 className="text-sm font-bold tracking-widest text-[#1E293B] uppercase">Programs</h4>
              <ul className="flex flex-col gap-2.5 text-sm text-gray-600">
                {[
                  { label: "Product Management", action: () => scrollToSection("courses", "product") },
                  { label: "Growth Marketing",   action: () => scrollToSection("courses", "growth") },
                  { label: "UI / UX Design",     action: () => scrollToSection("courses", "design") },
                ].map(item => (
                  <li key={item.label} onClick={item.action}
                    className="hover:text-[#F97316] cursor-pointer transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-[#F97316] opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Col 3: Resources ── */}
            <div className="flex flex-col gap-4 items-center text-center">
              <h4 className="text-sm font-bold tracking-widest text-[#1E293B] uppercase">Resources</h4>
              <ul className="flex flex-col gap-2.5 text-sm text-gray-600">
                <li onClick={() => scrollToSection("successstories")}
                  className="hover:text-[#F97316] cursor-pointer transition-colors flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-[#F97316] opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                  Success Stories
                </li>
                <li onClick={() => { navigate("/explore-programs"); setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 250); }}
                  className="hover:text-[#F97316] cursor-pointer transition-colors flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-[#F97316] opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                  Free Services
                </li>
                <li onClick={() => window.open("https://texora.ai/blogs", "_blank")}
                  className="hover:text-[#F97316] cursor-pointer transition-colors flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-[#F97316] opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                  Blogs
                </li>
                <li
      onClick={() => window.open("https://texora.ai/use-cases", "_blank")}
      className="hover:text-[#F97316] cursor-pointer transition-colors flex items-center gap-1.5 group"
    >
      <span className="w-1 h-1 rounded-full bg-[#F97316] opacity-0 group-hover:opacity-100 transition-all shrink-0" />
      Use Cases
    </li>

    <li
      onClick={() => window.open("https://texora.ai/product-updates", "_blank")}
      className="hover:text-[#F97316] cursor-pointer transition-colors flex items-center gap-1.5 group"
    >
      <span className="w-1 h-1 rounded-full bg-[#F97316] opacity-0 group-hover:opacity-100 transition-all shrink-0" />
      Product Updates
    </li>

    <li
      onClick={() => window.open("https://texora.ai/company-news", "_blank")}
      className="hover:text-[#F97316] cursor-pointer transition-colors flex items-center gap-1.5 group"
    >
      <span className="w-1 h-1 rounded-full bg-[#F97316] opacity-0 group-hover:opacity-100 transition-all shrink-0" />
      Company News
    </li>

              </ul>
            </div>

            {/* ── Col 4: Company ── */}
            <div className="flex flex-col gap-4 self-start">
              <h4 className="text-sm font-bold tracking-widest text-[#1E293B] uppercase">Company</h4>
              <ul className="flex flex-col gap-2.5 text-sm text-gray-600">
                {[
                  { label: "About Us",         action: () => navigate("/about") },
                  { label: "Careers",          action: () => navigate("/careers") },
                  { label: "Pricing",          action: () => navigate("/pricing") },
                  { label: "Privacy Policy",   action: () => navigate("/privacy-policy") },
                  { label: "Terms of Service", action: () => navigate("/terms-of-service") },
                  
                ].map(item => (
                  <li key={item.label} onClick={item.action}
                    className="hover:text-[#F97316] cursor-pointer transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-[#F97316] opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Col 5: Support ── */}
            <div className="flex flex-col gap-4 self-start">
              <h4 className="text-sm font-bold tracking-widest text-[#1E293B] uppercase">Support</h4>
              <ul className="flex flex-col gap-2.5 text-sm text-gray-600">
                {[
                  { label: "Help Center", action: () => navigate("/help-center") },
                  { label: "Contact",     action: () => navigate("/contact") },
                  { label: "FAQ",         action: () => navigate("/faq") },
                ].map(item => (
                  <li key={item.label} onClick={item.action}
                    className="hover:text-[#F97316] cursor-pointer transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-[#F97316] opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                    {item.label}
                  </li>
                ))}
              </ul>
              {/* Live status badge */}
              <div className="pt-1">
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Status: Live
                </span>
              </div>
            </div>

          </div>

          {/* ── Bottom bar ── */}
          <div className="border-t border-gray-200 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
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
};

export default ExploreFreeServices;