// src/pages/Landing/components/texoraData.js

import {
  Search,
  FileText,
  FileCheck2,
  Link2,
  Users,
  BarChart3,
  Server,
} from "lucide-react";

export const TEXORA_HEADER = {
  title: "TEXORA.AI",
  subtitle: "AI-Powered Solutions for Careers, Businesses & Growth",
};

// Compact list mega-menu — Candidate Tools / Enterprise Tools
// Each item with a `url` opens directly on texora.ai in a new tab.
// Items with only a `route` navigate inside the current app.
export const TEXORA_TOOL_GROUPS = [
  {
    id: "candidate-tools",
    label: "CANDIDATE TOOLS",
    items: [
      {
        id: "jobsync",
        title: "JobSync",
        description: "Multi-platform job search",
        url: "https://texora.ai/job-sync",
        icon: Search,
      },
      {
        id: "resume-builder",
        title: "Resume Builder",
        description: "Create ATS-friendly resumes",
        url: "https://texora.ai/resume-builder-info",
        icon: FileText,
      },
      {
        id: "ats-checker",
        title: "ATS Checker",
        description: "Check ATS compatibility",
        url: "https://texora.ai/check-ats-score",
        icon: FileCheck2,
      },
      {
        id: "tex-interview",
        title: "Tex Interview",
        description: "Automated skill assessment",
        url: "https://texora.ai/tex-interview",
        icon: Link2,
      },
    ],
  },
  {
    id: "enterprise-tools",
    label: "ENTERPRISE TOOLS",
    items: [
      {
        id: "talentcraft",
        title: "TalentCraft",
        description: "AI-powered resume screener",
        url: "https://texora.ai/talent-craft",
        icon: Users,
      },
      {
        id: "insight-review",
        title: "Insight Review",
        description: "Interview clip analytics",
        url: "https://texora.ai/insight-review",
        icon: BarChart3,
      },
    ],
  },
];

// Extra row below the two sections (no external URL yet -> internal route)
export const TEXORA_BENCH_RESOURCE = {
  id: "bench-resource",
  title: "Bench Resource",
  description: "Manage bench talent pipeline",
  route: "/bench-resource",
  icon: Server,
};

export const TEXORA_CTA = {
  text: "Explore Texora AI",
  url: "https://texora.ai/",
};