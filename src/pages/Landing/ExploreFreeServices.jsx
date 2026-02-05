// import {
//   ChevronRight,
//   Clock,
//   Code,
//   GraduationCap,
//   Palette,
//   Play,
//   Rocket,
//   Star,
//   TrendingUp,
//   Users,
//   Moon,
//   Sun,
//   Youtube,
//   Linkedin,
//   MessageCircle,
// } from "lucide-react";
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const ExploreFreeServices = () => {
//   const [activeCategory, setActiveCategory] = useState("all");
//   const [dark, setDark] = useState(
//     () => localStorage.getItem("theme") === "dark",
//   );

//   const navigate = useNavigate();

//   // ✅ Apply dark class to <html> same as LMSHomepage
//   useEffect(() => {
//     if (dark) {
//       document.documentElement.classList.add("dark");
//       localStorage.setItem("theme", "dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//       localStorage.setItem("theme", "light");
//     }
//   }, [dark]);

//   const categories = [
//     { id: "all", name: "All Programs", icon: GraduationCap },
//     { id: "product", name: "Product Management", icon: Rocket },
//     { id: "design", name: "Design", icon: Palette },
//     { id: "growth", name: "Growth & Marketing", icon: TrendingUp },
//     { id: "tech", name: "Technology", icon: Code },
//   ];

//   const services = [
//     {
//       id: 1,
//       category: "product",
//       title: "Build An Agentic AI Product End to End, No Code",
//       instructors: [
//         "Tyler Fisk: Co-Founder AI Build Lab",
//         "Sara Davison: Co-Founder AI Build Lab",
//       ],
//       students: "10,477 students",
//       rating: 4.9,
//       duration: "6 weeks",
//       level: "Beginner",
//       featured: true,
//       status: "ON DEMAND",
//       topics: ["AI Product Development", "No-Code Tools", "Product Strategy"],
//     },
//     {
//       id: 2,
//       category: "product",
//       title: "AI Prototyping for Product Managers in 2025",
//       instructors: ["Colin Matthews: Sold my first SaaS in 2021"],
//       students: "8,456 students",
//       rating: 4.8,
//       duration: "4 weeks",
//       level: "Intermediate",
//       status: "ON DEMAND",
//       topics: ["AI/ML", "Prototyping", "Product Design"],
//     },
//     {
//       id: 3,
//       category: "product",
//       title: "How top companies evaluate PM candidates in 2025",
//       instructors: [
//         "Ben Erez: Former Meta PM",
//         "Nickey Skarstad: Director of Product",
//       ],
//       students: "7,849 students",
//       rating: 4.7,
//       duration: "3 weeks",
//       level: "All Levels",
//       status: "ON DEMAND",
//       topics: ["Interview Prep", "PM Skills", "Career Growth"],
//     },
//     {
//       id: 4,
//       category: "design",
//       title: "Create AI-Powered Prototypes as a Product Designer",
//       instructors: ["Xinran Ma: Founder of Design with AI"],
//       students: "6,809 students",
//       rating: 4.9,
//       duration: "5 weeks",
//       level: "Intermediate",
//       status: "ON DEMAND",
//       topics: ["AI Design Tools", "Figma", "Prototyping"],
//     },
//     {
//       id: 5,
//       category: "tech",
//       title: "Building Agentic AI Applications in 2025",
//       instructors: [
//         "Aishwarya Naresh Reganti: Tech Lead AI",
//         "Sai Kirti Badam: Founding Engineer",
//       ],
//       students: "6,490 students",
//       rating: 4.8,
//       duration: "8 weeks",
//       level: "Advanced",
//       status: "ON DEMAND",
//       topics: ["AI/ML", "Python", "LLMs"],
//     },
//     {
//       id: 6,
//       category: "tech",
//       title: "Build AI product sense: vibe code your personal OS",
//       instructors: [
//         "Aman Khan: AI Product leader at Arize AI",
//         "Tai Raviv: Gen AI PM",
//       ],
//       students: "5,691 students",
//       rating: 4.7,
//       duration: "6 weeks",
//       level: "Intermediate",
//       status: "ON DEMAND",
//       topics: ["AI Development", "Product Thinking", "Coding"],
//     },
//     {
//       id: 7,
//       category: "growth",
//       title: "Growth Marketing Strategies for Startups",
//       instructors: [
//         "Sarah Johnson: Former Growth Lead Meta",
//         "Mike Chen: Ex-Marketing Director Amazon",
//       ],
//       students: "9,234 students",
//       rating: 4.8,
//       duration: "5 weeks",
//       level: "Intermediate",
//       status: "ON DEMAND",
//       topics: ["Growth Hacking", "Analytics", "User Acquisition"],
//     },
//     {
//       id: 8,
//       category: "growth",
//       title: "Data-Driven Marketing in 2025",
//       instructors: ["David Smith: Marketing Analytics Expert Google"],
//       students: "7,123 students",
//       rating: 4.6,
//       duration: "4 weeks",
//       level: "Beginner",
//       status: "ON DEMAND",
//       topics: ["Analytics", "A/B Testing", "Marketing ROI"],
//     },
//   ];

//   const filteredServices =
//     activeCategory === "all"
//       ? services
//       : services.filter((s) => s.category === activeCategory);

//   const stats = [
//     { value: "50K+", label: "Active Learners" },
//     { value: "95%", label: "Success Rate" },
//     { value: "100+", label: "Expert Mentors" },
//     { value: "4.9", label: "Average Rating" },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 dark:from-black dark:via-slate-950 dark:to-slate-900 text-black dark:text-white">
//       {/* Header */}
//       <header className="bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
//         <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <GraduationCap className="w-8 h-8 text-blue-600" />
//             <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
//               TexoraAi.skills
//             </span>
//           </div>
//           <nav className="flex items-center gap-8">
//             {/* Theme toggle */}
//             <button
//               onClick={() => setDark(!dark)}
//               className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 transition"
//               aria-label="Toggle theme"
//             >
//               {dark ? (
//                 <Sun className="w-5 h-5 text-yellow-400" />
//               ) : (
//                 <Moon className="w-5 h-5 text-slate-900" />
//               )}
//             </button>
//           </nav>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <section className="max-w-7xl mx-auto px-6 py-16">
//         <div className="text-center mb-12">
//           <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-4 py-2 rounded-full mb-6 text-sm font-medium">
//             🎓 Advanced TexoraAi.skills for Modern Education
//           </div>
//           <h1 className="text-5xl md:text-7xl font-bold mb-6">
//             Explore Our{" "}
//             <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
//               Free Services
//             </span>
//           </h1>
//           <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
//             Access world-class courses from industry experts at Google, Amazon,
//             Meta & top startups. Start learning today with our comprehensive
//             programs.
//           </p>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
//           {stats.map((stat, idx) => (
//             <div
//               key={idx}
//               className="bg-white/80 dark:bg-black/60 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-shadow"
//             >
//               <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-2">
//                 {stat.value}
//               </div>
//               <div className="text-gray-600 dark:text-gray-300 font-medium">
//                 {stat.label}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Category Filter */}
//         <div className="flex flex-wrap gap-3 justify-center mb-12">
//           {categories.map((cat) => {
//             const Icon = cat.icon;
//             return (
//               <button
//                 key={cat.id}
//                 onClick={() => setActiveCategory(cat.id)}
//                 className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
//                   activeCategory === cat.id
//                     ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg scale-105"
//                     : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-md hover:shadow-lg"
//                 }`}
//               >
//                 <Icon className="w-4 h-4" />
//                 {cat.name}
//               </button>
//             );
//           })}
//         </div>

//         {/* Services Grid */}
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {filteredServices.map((service) => (
//             <div
//               key={service.id}
//               className="bg-white dark:bg-black rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100 dark:border-gray-800 hover:scale-105"
//             >
//               <div className="p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/40 px-3 py-1 rounded-full">
//                     {service.status}
//                   </span>
//                   {service.featured && (
//                     <span className="flex items-center gap-1 text-xs font-bold text-yellow-600">
//                       <Star className="w-3 h-3 fill-current" />
//                       Featured
//                     </span>
//                   )}
//                 </div>

//                 <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-blue-600 transition-colors overflow-hidden max-h-12 line-clamp-2">
//                   {service.title}
//                 </h3>

//                 <div className="flex flex-wrap gap-2 mb-4">
//                   {service.topics.slice(0, 2).map((topic, idx) => (
//                     <span
//                       key={idx}
//                       className="text-xs bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200 px-3 py-1 rounded-full"
//                     >
//                       {topic}
//                     </span>
//                   ))}
//                 </div>

//                 <div className="space-y-3 mb-4">
//                   {service.instructors.map((instructor, idx) => {
//                     const name = instructor.split(":")[0].trim();
//                     const initials = name
//                       .split(" ")
//                       .map((n) => n[0])
//                       .join("")
//                       .toUpperCase()
//                       .slice(0, 2);

//                     return (
//                       <div key={idx} className="flex items-start gap-3">
//                         <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
//                           {initials}
//                         </div>
//                         <span className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed flex-1">
//                           {instructor}
//                         </span>
//                       </div>
//                     );
//                   })}
//                 </div>

//                 <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
//                   <div className="flex items-center gap-1">
//                     <Users className="w-4 h-4" />
//                     {service.students}
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
//                     {service.rating}
//                   </div>
//                 </div>

//                 <div className="flex items-center justify-between text-sm mb-4">
//                   <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
//                     <Clock className="w-4 h-4" />
//                     {service.duration}
//                   </div>
//                   <span className="bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-200 px-3 py-1 rounded-full text-xs font-medium">
//                     {service.level}
//                   </span>
//                 </div>

//                 {/* ✅ ONLY CHANGE HERE */}
//                 <button
//                   onClick={() => navigate(`/watch-demo/${service.id}`)}
//                   className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all group-hover:scale-105"
//                 >
//                   <Play className="w-4 h-4" />
//                   Watch Now
//                   <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* CTA Section */}
//         <div className="mt-20 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 rounded-3xl p-12 text-center text-white shadow-2xl">
//           <h2 className="text-4xl font-bold mb-4">
//             Ready to Become the Top 1%?
//           </h2>
//           <p className="text-xl mb-8 opacity-90">
//             Join thousands of learners who are mastering Product, Design, Growth
//             & Technology
//           </p>
//           <div className="flex gap-4 justify-center flex-wrap">
//             <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all hover:scale-105">
//               Start Learning Free
//             </button>
//             <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all">
//               Talk to an Advisor
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="py-12 px-6 bg-gradient-to-br from-blue-600 via-emerald-600 to-teal-600 dark:from-blue-900 dark:via-emerald-900 dark:to-teal-900 border-t border-blue-500/30 mt-20">
//         <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
//           {/* Brand + description */}
//           <div>
//             <p className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-emerald-100 bg-clip-text text-transparent mb-4">
//               TexoraAi.skills
//             </p>
//             <p className="text-blue-100 dark:text-blue-200 text-sm">
//               Modern learning platform for ambitious professionals who want to
//               break into product, design and growth roles.
//             </p>
//           </div>

//           {/* Contact */}
//           <div className="text-blue-100 dark:text-blue-200 text-sm space-y-3">
//             <p className="font-semibold text-white mb-2">Contact</p>
//             <div className="flex items-center gap-2">
//               <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
//                 <span className="text-xs">✉</span>
//               </div>
//               <a
//                 href="mailto:support@texoraai.skills"
//                 className="hover:text-white transition"
//               >
//                 support@texoraai.skills
//               </a>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
//                 <span className="text-xs">📍</span>
//               </div>
//               <span>Skalholtsgatan 2, Kista, Stockholm, Sweden - 164 40</span>
//             </div>
//           </div>

//           {/* Social + year */}
//           <div className="text-blue-100 dark:text-blue-200">
//             <p className="font-semibold text-white mb-4">Connect</p>
//             <div className="flex gap-3 mb-4">
//               <a
//                 href="https://www.youtube.com/@Texoraai"
//                 target="_blank"
//                 rel="noreferrer"
//                 className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 flex items-center justify-center hover:bg-white/30 hover:scale-105 transition-all shadow-xl hover:shadow-2xl"
//               >
//                 <Youtube size={20} className="text-white" />
//               </a>
//               <a
//                 href="https://www.linkedin.com/company/105596104"
//                 target="_blank"
//                 rel="noreferrer"
//                 className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 flex items-center justify-center hover:bg-white/30 hover:scale-105 transition-all shadow-xl hover:shadow-2xl"
//               >
//                 <Linkedin size={20} className="text-white" />
//               </a>
//               <a
//                 href="https://api.whatsapp.com/send?phone=919210970334"
//                 target="_blank"
//                 rel="noreferrer"
//                 className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 flex items-center justify-center hover:bg-white/30 hover:scale-105 transition-all shadow-xl hover:shadow-2xl"
//               >
//                 <MessageCircle size={20} className="text-white" />
//               </a>
//             </div>
//           </div>
//         </div>

//         <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-white/20 text-center">
//           <p className="text-blue-200 dark:text-blue-300 text-sm">
//             {new Date().getFullYear()} TexoraAi.skills. All rights reserved.
//           </p>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default ExploreFreeServices;

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
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ExploreFreeServices = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark",
  );

  const navigate = useNavigate();

  // ✅ Apply dark class to <html> same as LMSHomepage
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
    { value: "10K+", label: "Active Learners" },
    { value: "95%", label: "Success Rate" },
    { value: "100+", label: "Expert Mentors" },
    { value: "4.9", label: "Average Rating" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 dark:from-black dark:via-slate-950 dark:to-slate-900 text-black dark:text-white">
      {/* Header */}
      <header className="bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              TexoraAi.skills
            </span>
          </div>
          <nav className="flex items-center gap-8">
            {/* Theme toggle */}
            <button
              onClick={() => setDark(!dark)}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 transition"
              aria-label="Toggle theme"
            >
              {dark ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-900" />
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-4 py-2 rounded-full mb-6 text-sm font-medium">
            🎓 Advanced TexoraAi.skills for Modern Education
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Explore Our{" "}
            <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Free Services
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Access world-class courses from industry experts at Google, Amazon,
            Meta & top startups. Start learning today with our comprehensive
            programs.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white/80 dark:bg-black/60 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                  activeCategory === cat.id
                    ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg scale-105"
                    : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-md hover:shadow-lg"
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
              className="bg-white dark:bg-black rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100 dark:border-gray-800 hover:scale-105"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/40 px-3 py-1 rounded-full">
                    {service.status}
                  </span>
                  {service.featured && (
                    <span className="flex items-center gap-1 text-xs font-bold text-yellow-600">
                      <Star className="w-3 h-3 fill-current" />
                      Featured
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-blue-600 transition-colors overflow-hidden max-h-12 line-clamp-2">
                  {service.title}
                </h3>

                <div className="flex flex-wrap gap-2 mb-4">
                  {service.topics.slice(0, 2).map((topic, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200 px-3 py-1 rounded-full"
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
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {initials}
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed flex-1">
                          {instructor}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {service.students}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {service.rating}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm mb-4">
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                    <Clock className="w-4 h-4" />
                    {service.duration}
                  </div>
                  <span className="bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-200 px-3 py-1 rounded-full text-xs font-medium">
                    {service.level}
                  </span>
                </div>

                {/* ✅ ONLY CHANGE HERE */}
                <button
                  onClick={() => navigate(`/watch-demo/${service.id}`)}
                  className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all group-hover:scale-105"
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
        <div className="mt-20 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Become the Top 1%?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of learners who are mastering Product, Design, Growth
            & Technology
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all hover:scale-105">
              Start Learning Free
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all">
              Talk to an Advisor
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gradient-to-br from-blue-600 via-emerald-600 to-teal-600 dark:from-blue-900 dark:via-emerald-900 dark:to-teal-900 border-t border-blue-500/30 mt-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {/* Brand + description */}
          <div>
            <p className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-emerald-100 bg-clip-text text-transparent mb-4">
              TexoraAi.skills
            </p>
            <p className="text-blue-100 dark:text-blue-200 text-sm">
              Modern learning platform for ambitious professionals who want to
              break into product, design and growth roles.
            </p>
          </div>

          {/* Contact */}
          <div className="text-blue-100 dark:text-blue-200 text-sm space-y-3">
            <p className="font-semibold text-white mb-2">Contact</p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="text-xs">✉</span>
              </div>
              <a
                href="mailto:support@texoraai.skills"
                className="hover:text-white transition"
              >
                support@texoraai.skills
              </a>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="text-xs">📍</span>
              </div>
              <span>Skalholtsgatan 2, Kista, Stockholm, Sweden - 164 40</span>
            </div>
          </div>

          {/* Social + year */}
          <div className="text-blue-100 dark:text-blue-200">
            <p className="font-semibold text-white mb-4">Connect</p>
            <div className="flex gap-3 mb-4">
              <a
                href="https://www.youtube.com/@Texoraai"
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 flex items-center justify-center hover:bg-white/30 hover:scale-105 transition-all shadow-xl hover:shadow-2xl"
              >
                <Youtube size={20} className="text-white" />
              </a>
              <a
                href="https://www.linkedin.com/company/105596104"
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 flex items-center justify-center hover:bg-white/30 hover:scale-105 transition-all shadow-xl hover:shadow-2xl"
              >
                <Linkedin size={20} className="text-white" />
              </a>
              <a
                href="https://api.whatsapp.com/send?phone=919210970334"
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 flex items-center justify-center hover:bg-white/30 hover:scale-105 transition-all shadow-xl hover:shadow-2xl"
              >
                <MessageCircle size={20} className="text-white" />
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-white/20 text-center">
          <p className="text-blue-200 dark:text-blue-300 text-sm">
            {new Date().getFullYear()} TexoraAi.skills. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ExploreFreeServices;
