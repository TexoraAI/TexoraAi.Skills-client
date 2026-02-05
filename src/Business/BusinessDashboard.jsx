
import React, { useState } from "react";
import {
  TrendingUp,
  Users,
  DollarSign,
  BarChart3,
  PieChart,
  Activity,
  FileText,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const BusinessDashboard = () => {
  const [activePanel, setActivePanel] = useState("overview");

  const stats = [
    { label: "Active Leads", value: 0, change: "+12%", trend: "up", color: "from-sky-500 to-sky-600", icon: "👥" },
    { label: "Conversions (This Week)", value: 0, change: "+3%", trend: "up", color: "from-emerald-500 to-emerald-600", icon: "✅" },
    { label: "Revenue (MTD)", value: "₹0", change: "+18%", trend: "up", color: "from-violet-500 to-violet-600", icon: "💰" },
    { label: "Target Progress", value: "0%", change: "On track", trend: "neutral", color: "from-amber-500 to-amber-600", icon: "🎯" },
  ];

  const pipeline = [
    { stage: "New Leads", count: 0, color: "bg-blue-500" },
    { stage: "In Discussion", count: 0, color: "bg-purple-500" },
    { stage: "Closed Won", count: 0, color: "bg-green-500" },
  ];

  const performanceMetrics = [
    { metric: "Conversion Rate", value: "0%", target: "25%", status: "Exceeding" },
    { metric: "Avg. Deal Size", value: "₹0", target: "₹15,000", status: "Above" },
    { metric: "Response Time", value: "0 hrs", target: "4 hrs", status: "Excellent" },
    { metric: "Follow-up Rate", value: "0%", target: "90%", status: "Good" },
  ];

  const keyReports = [
    { title: "Lead Sources", value: "0 Active", color: "from-pink-500 to-rose-500", icon: "📊" },
    { title: "Campaign ROI", value: "0x", color: "from-cyan-500 to-blue-500", icon: "📈" },
    { title: "Customer Satisfaction", value: "0/5", color: "from-green-500 to-emerald-500", icon: "⭐" },
    { title: "Team Performance", value: "0%", color: "from-orange-500 to-amber-500", icon: "🏆" },
  ];

  const recentActivity = [
    { action: "New lead added", detail: "John Doe - Enterprise Plan", time: "2 min ago", icon: "➕" },
    { action: "Deal closed", detail: "ABC Corp - ₹50,000", time: "1 hour ago", icon: "🎉" },
    { action: "Follow-up scheduled", detail: "XYZ Ltd - Tomorrow 10 AM", time: "3 hours ago", icon: "📅" },
    { action: "Proposal sent", detail: "Tech Solutions Inc.", time: "5 hours ago", icon: "📤" },
  ];

  // Pipeline Page Data
  const pipelineStages = [
    {
      stage: "New Leads",
      count: 0,
      value: "₹0",
      color: "from-blue-500 to-cyan-600",
      icon: "📥",
      leads: [
        { name: "John Doe", company: "Tech Corp", value: "₹25,000", date: "2 days ago" },
        { name: "Jane Smith", company: "Innovation Ltd", value: "₹35,000", date: "3 days ago" },
      ],
    },
    {
      stage: "Qualification",
      count: 0,
      value: "₹0",
      color: "from-purple-500 to-pink-600",
      icon: "🔍",
      leads: [
        { name: "Mike Johnson", company: "StartUp Inc", value: "₹45,000", date: "1 week ago" },
      ],
    },
    {
      stage: "Proposal Sent",
      count: 0,
      value: "₹0",
      color: "from-amber-500 to-orange-600",
      icon: "📄",
      leads: [
        { name: "Sarah Williams", company: "Enterprise Co", value: "₹60,000", date: "3 days ago" },
        { name: "David Brown", company: "Solutions LLC", value: "₹40,000", date: "5 days ago" },
      ],
    },
    {
      stage: "Negotiation",
      count: 0,
      value: "₹0",
      color: "from-indigo-500 to-purple-600",
      icon: "💬",
      leads: [
        { name: "Emily Davis", company: "Global Systems", value: "₹75,000", date: "1 day ago" },
      ],
    },
    {
      stage: "Closed Won",
      count: 0,
      value: "₹0",
      color: "from-emerald-500 to-teal-600",
      icon: "✅",
      leads: [
        { name: "Robert Wilson", company: "Tech Giants", value: "₹90,000", date: "Today" },
      ],
    },
  ];

  // Reports Page Data
  const monthlyRevenue = [
    { month: "Jan", revenue: 0 },
    { month: "Feb", revenue: 0 },
    { month: "Mar", revenue: 0 },
    { month: "Apr", revenue: 0 },
    { month: "May", revenue: 0 },
    { month: "Jun", revenue: 0 },
  ];

  const teamPerformance = [
    { name: "Rahul Sharma", deals: 0, revenue: "₹0", conversion: "0%", color: "bg-blue-500" },
    { name: "Priya Patel", deals: 0, revenue: "₹0", conversion: "0%", color: "bg-purple-500" },
    { name: "Amit Kumar", deals: 0, revenue: "₹0", conversion: "0%", color: "bg-green-500" },
    { name: "Neha Singh", deals: 0, revenue: "₹0", conversion: "0%", color: "bg-orange-500" },
  ];

  const leadSources = [
    { source: "Website", leads: 0, percentage: 0, color: "bg-indigo-500" },
    { source: "Referrals", leads: 0, percentage: 0, color: "bg-emerald-500" },
    { source: "Social Media", leads: 0, percentage: 0, color: "bg-purple-500" },
    { source: "Cold Calling", leads: 0, percentage: 0, color: "bg-amber-500" },
    { source: "Events", leads: 0, percentage: 0, color: "bg-pink-500" },
  ];

  // OVERVIEW PAGE
  const OverviewPage = () => (
    <div className="space-y-6">
      {/* Stats Cards with Trend Indicators */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br p-[1px] hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            style={{ backgroundImage: `linear-gradient(135deg, ${item.color})` }}
          >
            <div className="h-full rounded-2xl bg-white dark:bg-slate-900 p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                  {item.label}
                </p>
                <span className={`text-2xl w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                  {item.icon}
                </span>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                {item.value}
              </p>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold ${
                  item.trend === "up" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-600 dark:text-slate-400"
                }`}>
                  {item.trend === "up" ? "↗" : "→"} {item.change}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-500">vs last period</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Metrics Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-4 flex items-center gap-2">
          📊 Performance Metrics
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {performanceMetrics.map((item) => (
            <div
              key={item.metric}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all"
            >
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">{item.metric}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-1">{item.value}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-500">Target: {item.target}</span>
                <span className="px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pipeline Section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-4 flex items-center gap-2">
            🔄 Sales Pipeline
          </h2>
          <div className="space-y-4">
            {pipeline.map((p) => (
              <div
                key={p.stage}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{p.stage}</p>
                  <span className={`w-3 h-3 rounded-full ${p.color} group-hover:scale-125 transition-transform`}></span>
                </div>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">{p.count}</p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Active opportunities</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Timeline */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-4 flex items-center gap-2">
            ⚡ Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{activity.action}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 truncate">{activity.detail}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Reports Section with Colorful Cards */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-4 flex items-center gap-2">
          📈 Key Reports
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {keyReports.map((report) => (
            <div
              key={report.title}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br p-[1px] hover:shadow-xl transition-all duration-300 hover:scale-[1.05] cursor-pointer"
              style={{ backgroundImage: `linear-gradient(135deg, ${report.color})` }}
            >
              <div className="h-full rounded-xl bg-white dark:bg-slate-900 p-5">
                <div className="text-3xl mb-3">{report.icon}</div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {report.title}
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                  {report.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // PIPELINE PAGE
  const PipelinePage = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Sales Pipeline</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Manage your deals across different stages
          </p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all text-sm font-medium">
          + Add Lead
        </button>
      </div>

      {/* Pipeline Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {pipelineStages.map((stage) => (
          <div
            key={stage.stage}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-5 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">{stage.icon}</span>
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stage.color} flex items-center justify-center text-white text-sm font-bold`}>
                {stage.count}
              </div>
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
              {stage.stage}
            </h3>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-50">
              {stage.value}
            </p>
          </div>
        ))}
      </div>

      {/* Detailed Pipeline Stages */}
      <div className="grid gap-6">
        {pipelineStages.map((stage) => (
          <div
            key={stage.stage}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stage.color} flex items-center justify-center text-2xl`}>
                {stage.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {stage.stage}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {stage.count} leads · {stage.value}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {stage.leads.map((lead, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                        {lead.name}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {lead.company}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900 dark:text-slate-50 text-sm">
                        {lead.value}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500">
                        {lead.date}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // REPORTS PAGE
  const ReportsPage = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Sales Reports</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Comprehensive analytics and performance insights
        </p>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Monthly Revenue Trend</h3>
        </div>
        <div className="flex items-end justify-between gap-3 h-64">
          {monthlyRevenue.map((data) => (
            <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-t-lg relative overflow-hidden" style={{ height: '100%' }}>
                <div
                  className="absolute bottom-0 w-full bg-gradient-to-t from-indigo-500 to-purple-500 transition-all duration-500"
                  style={{ height: `${(data.revenue / 150000) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{data.month}</span>
              <span className="text-xs text-slate-500 dark:text-slate-500">₹{data.revenue}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Team Performance */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Team Performance</h3>
        </div>
        <div className="space-y-4">
          {teamPerformance.map((member) => (
            <div
              key={member.name}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${member.color} flex items-center justify-center text-white font-bold text-sm`}>
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                      {member.name}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {member.deals} deals closed
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900 dark:text-slate-50">
                    {member.revenue}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {member.conversion} conversion
                  </p>
                </div>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className={`${member.color} h-2 rounded-full transition-all duration-500`}
                  style={{ width: member.conversion }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lead Sources */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center gap-2 mb-6">
          <PieChart className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Lead Sources</h3>
        </div>
        <div className="space-y-4">
          {leadSources.map((source) => (
            <div key={source.source}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {source.source}
                </span>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {source.leads} leads ({source.percentage}%)
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                <div
                  className={`${source.color} h-3 rounded-full transition-all duration-500`}
                  style={{ width: `${source.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white">
          <p className="text-sm opacity-90 mb-2">Total Revenue (YTD)</p>
          <p className="text-4xl font-bold">₹0</p>
          <p className="text-xs opacity-75 mt-2">+0% vs last year</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
          <p className="text-sm opacity-90 mb-2">Deals Closed (MTD)</p>
          <p className="text-4xl font-bold">0</p>
          <p className="text-xs opacity-75 mt-2">+0% vs last month</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white">
          <p className="text-sm opacity-90 mb-2">Win Rate</p>
          <p className="text-4xl font-bold">0%</p>
          <p className="text-xs opacity-75 mt-2">Industry avg: 27%</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Panel Switcher */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mt-1">
              Business Team
            </h1>
          </div>
          
          {/* Panel Switcher */}
          <div className="flex gap-2 bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActivePanel("overview")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activePanel === "overview"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActivePanel("pipeline")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activePanel === "pipeline"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              Pipeline
            </button>
            <button
              onClick={() => setActivePanel("reports")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activePanel === "reports"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              Reports
            </button>
          </div>
        </div>

        {/* Render Active Page */}
        {activePanel === "overview" && <OverviewPage />}
        {activePanel === "pipeline" && <PipelinePage />}
        {activePanel === "reports" && <ReportsPage />}
      </div>
    </div>
  );
};

export default BusinessDashboard;