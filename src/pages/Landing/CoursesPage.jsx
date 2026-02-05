

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Users,
  Star,
  ArrowRight,
  Sun,
  Moon,
  ArrowLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export default function CoursesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("product");
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  const courses = {
    product: [
      {
        id: 1,
        title: "Product Management Mastery",
        instructor: "Ex-Google PM",
        duration: "8 weeks",
        students: "2,500+",
        rating: 4.9,
        description:
          "Master product lifecycle from ideation to launch. Learn roadmapping, prioritization & metrics.",
      },
      {
        id: 2,
        title: "Product Analytics",
        instructor: "Ex-Amazon",
        duration: "6 weeks",
        students: "1,800+",
        rating: 4.8,
        description:
          "Data-driven product decisions with A/B testing, cohorts & funnel analysis.",
      },
      {
        id: 3,
        title: "Product Strategy",
        instructor: "Ex-Meta",
        duration: "10 weeks",
        students: "2,100+",
        rating: 4.9,
        description:
          "Strategic frameworks for positioning, growth & portfolio management.",
      },
    ],
    design: [
      {
        id: 4,
        title: "UI/UX Design Bootcamp",
        instructor: "Ex-Airbnb",
        duration: "12 weeks",
        students: "3,200+",
        rating: 5.0,
        description:
          "Complete UI/UX journey from research to prototype with Figma.",
      },
      {
        id: 5,
        title: "Design Systems",
        instructor: "Ex-Netflix",
        duration: "8 weeks",
        students: "1,500+",
        rating: 4.8,
        description:
          "Build scalable design systems with tokens & documentation.",
      },
      {
        id: 6,
        title: "User Research Pro",
        instructor: "Ex-Microsoft",
        duration: "6 weeks",
        students: "1,900+",
        rating: 4.7,
        description:
          "User interviews, usability testing & research synthesis.",
      },
    ],
    growth: [
      {
        id: 7,
        title: "Growth Marketing",
        instructor: "Ex-Uber",
        duration: "8 weeks",
        students: "2,800+",
        rating: 4.9,
        description:
          "Growth loops, viral mechanics & acquisition strategies.",
      },
      {
        id: 8,
        title: "SEO & Content Strategy",
        instructor: "Ex-Spotify",
        duration: "10 weeks",
        students: "2,300+",
        rating: 4.8,
        description:
          "Technical SEO, content systems & analytics at scale.",
      },
      {
        id: 9,
        title: "Performance Marketing",
        instructor: "Ex-Swiggy",
        duration: "8 weeks",
        students: "2,600+",
        rating: 4.9,
        description:
          "Paid ads, creative testing & LTV optimization.",
      },
    ],
  };

  const handleViewDetails = (course) => {
    navigate("/course-details", { state: { course } });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Header */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-black/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              TexoraAi.skills
            </span>
          </button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              const next = !dark;
              setDark(next);
              localStorage.setItem("theme", next ? "dark" : "light");
            }}
          >
            {dark ? <Sun /> : <Moon />}
          </Button>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Build Your Career with the Right Skills
            </h1>
            <p className="text-lg text-muted-foreground">
              Expert-led programs in Product, Design & Growth
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-10">
            <TabsList className="mx-auto w-fit rounded-full">
              <TabsTrigger value="product">Product</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="growth">Growth & Marketing</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Courses Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {courses[activeTab].map((course) => (
              <Card
                key={course.id}
                className="hover:shadow-xl hover:shadow-blue-500/10 transition-all"
              >
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {course.instructor}
                  </p>
                </CardHeader>

                <CardContent>
                  <div className="flex justify-between text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <BookOpen size={16} /> {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={16} /> {course.students}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {course.rating}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-6 line-clamp-3">
                    {course.description}
                  </p>

                  <Button
                    onClick={() => handleViewDetails(course)}
                    className="w-full bg-gradient-to-r from-blue-600 to-emerald-600"
                  >
                    View details <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
