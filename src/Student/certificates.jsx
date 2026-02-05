
// import React from "react";

// const Certificates = () => {
//   const templates = [
//     {
//       id: 1,
//       name: "Completion Certificate",
//       level: "Course Completion",
//       description:
//         "Awarded when a student successfully completes all modules of a course.",
//       accent: "from-indigo-500 to-sky-500",
//     },
//     {
//       id: 2,
//       name: "Excellence Certificate",
//       level: "Top Performer",
//       description:
//         "Given to students scoring above 90% and maintaining excellent attendance.",
//       accent: "from-emerald-500 to-teal-500",
//     },
//     {
//       id: 3,
//       name: "Internship Certificate",
//       level: "Industry Internship",
//       description:
//         "Issued after successful completion of internship and project submission.",
//       accent: "from-fuchsia-500 to-purple-500",
//     },
//   ];

//   return (
//     <div className="p-6 space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-2xl font-bold text-foreground">
//           Certificates
//         </h1>
//         <p className="mt-1 text-sm text-muted-foreground">
//           View your certificate templates. Download or request generation from
//           your admin.
//         </p>
//       </div>

//       {/* Templates */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {templates.map((tpl) => (
//           <div
//             key={tpl.id}
//             className="
//               rounded-2xl border bg-card text-card-foreground
//               shadow-sm hover:shadow-lg transition-shadow
//               flex flex-col overflow-hidden
//             "
//           >
//             {/* Accent band */}
//             <div className={`h-2 bg-gradient-to-r ${tpl.accent}`} />

//             <div className="p-5 flex flex-col flex-1">
//               <h2 className="text-lg font-semibold">
//                 {tpl.name}
//               </h2>

//               <span className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
//                 {tpl.level}
//               </span>

//               <p className="mt-3 text-sm text-muted-foreground flex-1">
//                 {tpl.description}
//               </p>

//               {/* Actions */}
//               <div className="mt-4 flex items-center justify-between gap-2">
//                 <button
//                   className="
//                     px-3 py-1.5 text-xs font-semibold rounded-lg
//                     bg-primary text-primary-foreground
//                   "
//                 >
//                   Preview
//                 </button>

//                 <button
//                   className="
//                     px-3 py-1.5 text-xs font-semibold rounded-lg
//                     border border-border
//                     text-foreground hover:bg-muted
//                   "
//                 >
//                   Download sample
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Certificates;



import React, { useState } from "react";
import { Award, Download, Eye, CheckCircle, Star, Calendar } from "lucide-react";

const Certificates = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const templates = [
    {
      id: 1,
      name: "Completion Certificate",
      level: "Course Completion",
      description:
        "Awarded when a student successfully completes all modules of a course.",
      accent: "from-indigo-500 to-sky-500",
      icon: CheckCircle,
      earned: 3,
      total: 5,
      criteria: ["Complete all modules", "Pass final assessment", "Minimum 75% attendance"],
    },
    {
      id: 2,
      name: "Excellence Certificate",
      level: "Top Performer",
      description:
        "Given to students scoring above 90% and maintaining excellent attendance.",
      accent: "from-emerald-500 to-teal-500",
      icon: Star,
      earned: 1,
      total: 2,
      criteria: ["Score above 90%", "95%+ attendance", "Complete bonus assignments"],
    },
    {
      id: 3,
      name: "Internship Certificate",
      level: "Industry Internship",
      description:
        "Issued after successful completion of internship and project submission.",
      accent: "from-fuchsia-500 to-purple-500",
      icon: Calendar,
      earned: 0,
      total: 1,
      criteria: ["Complete 3-month internship", "Submit final project", "Receive supervisor approval"],
    },
  ];

  const stats = [
    { label: "Total Earned", value: "4", icon: Award, color: "text-indigo-600" },
    { label: "In Progress", value: "2", icon: CheckCircle, color: "text-amber-600" },
    { label: "Available", value: "8", icon: Star, color: "text-emerald-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-500 via-fuchsia-500 to-indigo-600 p-8 md:p-12 shadow-2xl">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Your Certificates
              </h1>
            </div>
            <p className="text-lg text-white/90 max-w-2xl">
              Track your achievements and download professional certificates for completed courses and milestones.
            </p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-4 rounded-2xl bg-slate-100 dark:bg-slate-700/50 ${stat.color}`}>
                  <stat.icon className="w-7 h-7" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Certificate Templates */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Certificate Templates
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {templates.map((tpl) => {
              const Icon = tpl.icon;
              const progress = (tpl.earned / tpl.total) * 100;
              
              return (
                <div
                  key={tpl.id}
                  className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-700"
                >
                  {/* Gradient accent */}
                  <div className={`h-2 bg-gradient-to-r ${tpl.accent}`} />

                  <div className="p-6 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${tpl.accent} shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                          {tpl.earned}/{tpl.total}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Earned
                        </p>
                      </div>
                    </div>

                    {/* Title & Level */}
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {tpl.name}
                      </h3>
                      <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold uppercase tracking-wide rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {tpl.level}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {tpl.description}
                    </p>

                    {/* Progress bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
                        <span>Progress</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${tpl.accent} transition-all duration-500`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Criteria */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                        Requirements
                      </p>
                      <ul className="space-y-1.5">
                        {tpl.criteria.map((criterion, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span>{criterion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <button
                        onClick={() => setSelectedTemplate(tpl.id)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 bg-gradient-to-r ${tpl.accent} text-white hover:shadow-lg hover:scale-105`}
                      >
                        <Eye className="w-4 h-4" />
                        Preview
                      </button>
                      <button
                        disabled={tpl.earned === 0}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                          tpl.earned > 0
                            ? "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                        }`}
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>

                  {/* Hover overlay effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-900/5 dark:to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-800">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
              <Award className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2">
                How to Earn Certificates
              </h3>
              <p className="text-sm text-indigo-700 dark:text-indigo-300 leading-relaxed">
                Complete all course requirements and meet the criteria listed for each certificate type. 
                Once earned, certificates can be downloaded as PDF files with official verification codes. 
                Contact your administrator if you believe you've met the requirements but haven't received a certificate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificates;