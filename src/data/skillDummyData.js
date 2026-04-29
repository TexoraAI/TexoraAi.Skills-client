// src/data/skillDummyData.js

export const CAREER_ROADMAPS = {
    "Full Stack Developer": [
      { id: 1, name: "HTML", skill: "HTML", required: 70 },
      { id: 2, name: "CSS", skill: "CSS", required: 70 },
      { id: 3, name: "JavaScript", skill: "JavaScript", required: 75 },
      { id: 4, name: "React", skill: "React", required: 75 },
      { id: 5, name: "Node.js", skill: "Node.js", required: 70 },
      { id: 6, name: "SQL", skill: "SQL", required: 65 },
      { id: 7, name: "System Design", skill: "System Design", required: 60 },
    ],
    "Data Scientist": [
      { id: 1, name: "Python", skill: "Python", required: 80 },
      { id: 2, name: "Statistics", skill: "Statistics", required: 75 },
      { id: 3, name: "SQL", skill: "SQL", required: 70 },
      { id: 4, name: "Machine Learning", skill: "Machine Learning", required: 75 },
      { id: 5, name: "Deep Learning", skill: "Deep Learning", required: 65 },
      { id: 6, name: "Data Visualization", skill: "Data Visualization", required: 60 },
    ],
    "DevOps Engineer": [
      { id: 1, name: "Linux", skill: "Linux", required: 75 },
      { id: 2, name: "Docker", skill: "Docker", required: 70 },
      { id: 3, name: "Kubernetes", skill: "Kubernetes", required: 65 },
      { id: 4, name: "CI/CD", skill: "CI/CD", required: 70 },
      { id: 5, name: "AWS", skill: "AWS", required: 65 },
      { id: 6, name: "Monitoring", skill: "Monitoring", required: 60 },
    ],
  };
  
  export const SKILL_RECOMMENDATIONS = {
    JavaScript: [
      { type: "course", title: "JavaScript Mastery", duration: "8 hrs" },
      { type: "video", title: "JS Async/Await Deep Dive", duration: "45 min" },
      { type: "practice", title: "50 JS Coding Challenges", duration: "Self-paced" },
    ],
    React: [
      { type: "course", title: "React 18 Complete Guide", duration: "12 hrs" },
      { type: "video", title: "React Hooks Explained", duration: "1 hr" },
      { type: "practice", title: "Build 5 React Projects", duration: "Self-paced" },
    ],
    SQL: [
      { type: "course", title: "SQL for Beginners", duration: "6 hrs" },
      { type: "video", title: "Advanced SQL Queries", duration: "55 min" },
      { type: "practice", title: "SQL Practice Set", duration: "Self-paced" },
    ],
    Python: [
      { type: "course", title: "Python Bootcamp", duration: "10 hrs" },
      { type: "video", title: "Python OOP Concepts", duration: "1.5 hrs" },
      { type: "practice", title: "Python Coding Drills", duration: "Self-paced" },
    ],
    DEFAULT: [
      { type: "course", title: "Foundation Course", duration: "5 hrs" },
      { type: "video", title: "Core Concepts Video", duration: "40 min" },
      { type: "practice", title: "Practice Exercises", duration: "Self-paced" },
    ],
  };
  
  export const SAMPLE_SKILLS = [
    { id: 1, name: "JavaScript", quizScore: 72, assignmentScore: 68, videoProgress: 85, color: "#F7DF1E", icon: "JS" },
    { id: 2, name: "React",      quizScore: 65, assignmentScore: 70, videoProgress: 78, color: "#61DAFB", icon: "Re" },
    { id: 3, name: "SQL",        quizScore: 38, assignmentScore: 42, videoProgress: 55, color: "#336791", icon: "SQ" },
    { id: 4, name: "Python",     quizScore: 30, assignmentScore: 28, videoProgress: 40, color: "#3776AB", icon: "Py" },
    { id: 5, name: "Node.js",    quizScore: 55, assignmentScore: 60, videoProgress: 65, color: "#339933", icon: "No" },
    { id: 6, name: "CSS",        quizScore: 80, assignmentScore: 85, videoProgress: 90, color: "#264DE4", icon: "CS" },
    { id: 7, name: "HTML",       quizScore: 88, assignmentScore: 90, videoProgress: 95, color: "#E34F26", icon: "HT" },
    { id: 8, name: "Git",        quizScore: 45, assignmentScore: 50, videoProgress: 60, color: "#F05032", icon: "Gi" },
  ];