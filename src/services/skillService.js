// src/services/skillService.js

import { SAMPLE_SKILLS } from "../data/skillDummyData";

// ── Score calculator: quiz 40% + assignment 40% + video 20% ──
export const calculateSkillScore = (quizScore, assignmentScore, videoProgress) => {
  return Math.round(quizScore * 0.4 + assignmentScore * 0.4 + videoProgress * 0.2);
};

// ── Level assignment ──────────────────────────────────────────
export const getSkillLevel = (score) => {
  if (score >= 70) return { label: "Advanced",     color: "#34d399", bg: "rgba(52,211,153,0.12)"  };
  if (score >= 40) return { label: "Intermediate", color: "#fb923c", bg: "rgba(251,146,60,0.12)"  };
  return              { label: "Beginner",      color: "#f87171", bg: "rgba(248,113,113,0.12)" };
};

// ── Progress bar color ────────────────────────────────────────
export const getProgressColor = (score) => {
  if (score >= 70) return "#34d399";
  if (score >= 50) return "#fb923c";
  return "#f87171";
};

// ── Compute all student skills with derived fields ────────────
export const computeStudentSkills = (rawSkills = SAMPLE_SKILLS) => {
  return rawSkills.map((s) => {
    const score = calculateSkillScore(s.quizScore, s.assignmentScore, s.videoProgress);
    const level = getSkillLevel(score);
    return {
      ...s,
      score,
      level:        level.label,
      levelColor:   level.color,
      levelBg:      level.bg,
      progressColor: getProgressColor(score),
      isWeak:       score < 50,
      isStrong:     score >= 70,
      canAddResume: score >= 70,
    };
  });
};

// ── Mock API calls (replace with real axios calls) ────────────
export const skillService = {
  getStudentSkills: async () => {
    await new Promise((r) => setTimeout(r, 600)); // simulate network
    return computeStudentSkills();
  },

  updateSkillScore: async (skillId, { quizScore, assignmentScore, videoProgress }) => {
    const score = calculateSkillScore(quizScore, assignmentScore, videoProgress);
    return { skillId, score, level: getSkillLevel(score).label };
  },

  addToResume: async (skillId, skillName) => {
    console.log(`Adding ${skillName} to resume...`);
    return { success: true, message: `${skillName} added to resume!` };
  },
};