import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Award,
  BarChart3,
  BookOpen,
  ChevronDown,
  FileText,
  GraduationCap,
  LogOut,
  Menu,
  Moon,
  Sparkles,
  Sun,
  User,
  Users,
} from "lucide-react";
import MobileFullScreenMenu from "./MobileFullScreenMenu";

/* ─────────────────────────────────────────────────────────────────
   NAVBAR — logo, desktop navigation, mega menu, dropdowns, user/login
   state, avatar/profile menu, logout, "Get Started" CTA, mobile menu
   button, theme toggle, scroll effects, sticky behavior.
───────────────────────────────────────────────────────────────── */
export default function Navbar({ theme, toggleTheme, setShowLoginModal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        sessionStorage.removeItem("user");
      }
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const navLinks = [
  {
    text: "Mentors",
    href: "#mentors",
    icon: BookOpen,
    color: "text-orange-500",
    description: "Learn from Industry Experts",
  },
  {
    text: "Success Stories",
    href: "#successstories",
    icon: Award,
    color: "text-green-500",
    description: "Real Success Stories from Learners",
  },
];

  const navButtons = [];

  return (
    <>
      {/* ── Full-Screen Mobile Menu ── */}
      {mobileMenuOpen && (
        <MobileFullScreenMenu
          onClose={() => setMobileMenuOpen(false)}
          navLinks={navLinks}
          navButtons={navButtons}
          user={user}
          navigate={navigate}
          handleLogout={handleLogout}
          setShowLoginModal={setShowLoginModal}
        />
      )}

      {/* ── Nav ── */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 bg-[#1F1D1F]/95 border-b border-[#F97316]/20 ${
          scrolled
            ? "backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.18)]"
            : "backdrop-blur-md"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[68px]">
            {/* Logo */}
            <div
              className="flex items-center cursor-pointer hover:scale-105 transition-transform flex-shrink-0"
              onClick={() => navigate("/")}
            >
              <span className="text-[28px] sm:text-[32px] font-extrabold tracking-wide font-serif leading-none whitespace-nowrap">
                <span className="text-green-600">ILM</span>
                <span className="text-[#F97316] ml-1">ORA</span>
                <span className="inline-flex items-center bg-orange-50 border border-[#F97316] rounded ml-1.5 px-1.5 py-0.5 text-[0.45rem] sm:text-[0.5rem] font-sans font-semibold tracking-widest text-[#F97316] uppercase leading-snug align-middle">
                  Beta
                </span>
              </span>
            </div>

            {/* Desktop Nav — visible from lg (1024px) and above */}
            <div className="hidden lg:flex items-center gap-1 flex-1 justify-center mx-4 xl:mx-6">
              <button
                type="button"
                onClick={() => navigate("/all-courses")}
                className="text-white hover:text-[#F97316] font-medium transition-colors duration-300 px-3 xl:px-4 py-2 rounded-lg hover:bg-[#F97316]/10 text-[13px] xl:text-[15px] whitespace-nowrap bg-transparent border-none cursor-pointer"
              >
                All Courses
              </button>
              {/* ILM ORA Feature Dropdown */}
              <div className="relative group">
                <button className="text-white hover:text-[#F97316] font-medium transition-colors duration-300 px-3 xl:px-4 py-2 rounded-lg hover:bg-[#F97316]/10 text-[13px] xl:text-[15px] whitespace-nowrap bg-transparent border-none cursor-pointer flex items-center gap-1">
                  ILM ORA Feature
                  <ChevronDown className="w-4 h-4" />
                </button>

                <div className="absolute top-full left-0 mt-2 w-80 bg-[#232323] border border-white/[0.08] rounded-xl shadow-xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <button
                    onClick={() => navigate("/student-hub")}
                    className="w-full text-left p-3 rounded-lg hover:bg-[#F97316]/[0.12]"
                  >
                    <div className="flex items-start gap-3">
                      <GraduationCap className="w-5 h-5 text-green-600 mt-1" />
                      <div>
                        <div className="font-semibold text-sm text-white">
                          Student Hub
                        </div>
                        <div className="text-xs text-gray-400">
                          AI-Powered Learning & Career Growth
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => navigate("/trainer-hub")}
                    className="w-full text-left p-3 rounded-lg hover:bg-[#F97316]/[0.12]"
                  >
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-blue-600 mt-1" />
                      <div>
                        <div className="font-semibold text-sm text-white">
                          Trainer Hub
                        </div>
                        <div className="text-xs text-gray-400">
                          Training Management & Mentorship
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => navigate("/manager-hub")}
                    className="w-full text-left p-3 rounded-lg hover:bg-[#F97316]/[0.12]"
                  >
                    <div className="flex items-start gap-3">
                      <BarChart3 className="w-5 h-5 text-purple-600 mt-1" />
                      <div>
                        <div className="font-semibold text-sm text-white">
                          Manager Hub
                        </div>
                        <div className="text-xs text-gray-400">
                          Analytics, Performance & Team Development
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Divider */}
                  <div className="border-t border-white/[0.08] my-2"></div>

                  {/* ILM ORA Meet */}
                  <button
                    onClick={() => navigate("/ilm-ora-meet")}
                    className="w-full text-left p-3 rounded-lg hover:bg-[#F97316]/[0.12]"
                  >
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-orange-500 mt-1" />
                      <div>
                        <div className="font-semibold text-sm text-white">
                          ILM ORA Meet
                        </div>
                        <div className="text-xs text-gray-400">
                          Virtual Meetings & Collaboration
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* AI Resume Builder */}
                  <button
                    onClick={() => navigate("/resume-builder")}
                    className="w-full text-left p-3 rounded-lg hover:bg-[#F97316]/[0.12]"
                  >
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-green-600 mt-1" />
                      <div>
                        <div className="font-semibold text-sm text-white">
                          AI Resume Builder
                        </div>
                        <div className="text-xs text-gray-400">
                          Create ATS-Friendly Professional Resumes
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Direct Nav Links — Mentors, Success Stories */}
              {navLinks.map((link) => (
                <button
                  key={link.text}
                  type="button"
                  onClick={() => {
                    document
                      .querySelector(link.href)
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-white hover:text-[#F97316] font-medium transition-colors duration-300 px-3 xl:px-4 py-2 rounded-lg hover:bg-[#F97316]/10 text-[13px] xl:text-[15px] whitespace-nowrap bg-transparent border-none cursor-pointer"
                >
                  {link.text}
                </button>
              ))}
            </div>
            {/* Right side */}
            <div className="flex items-center gap-2 xl:gap-3 flex-shrink-0">
              <button
                onClick={toggleTheme}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-white/[0.08] hover:border-[#F97316] transition-colors duration-300 shadow-sm bg-[#2A2A2A] flex-shrink-0"
              >
                {theme === "dark" ? (
                  <Sun className="w-[18px] h-[18px] text-[#F97316]" />
                ) : (
                  <Moon className="w-[18px] h-[18px] text-gray-300" />
                )}
              </button>

              {user ? (
                <div className="hidden lg:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="gap-2 rounded-xl border-white/[0.08] bg-[#2A2A2A] hover:border-[#F97316] text-white h-10 px-3"
                      >
                        <Avatar className="w-7 h-7">
                          <AvatarImage src={user.picture} alt={user.name} />
                          <AvatarFallback className="bg-[#1E293B] text-white text-xs">
                            {user.name?.charAt(0) || (
                              <User className="w-3 h-3" />
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-72 bg-[#232323] border-white/[0.08]"
                    >
                      <div className="px-3 py-3 bg-[#2A2A2A] rounded-t-md">
                        <p className="font-semibold text-sm text-white truncate">
                          {user.name || "User"}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                      <DropdownMenuSeparator />
                      {[
                        {
                          icon: GraduationCap,
                          label: "My Learning",
                          desc: "View your courses",
                          path: "/my-learning",
                        },
                        {
                          icon: User,
                          label: "Edit Profile",
                          desc: "Update your info",
                          path: "/edit-profile",
                        },
                      ].map((item) => (
                        <DropdownMenuItem
                          key={item.label}
                          onClick={() => navigate(item.path)}
                          className="gap-3 cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#F97316]/10 flex items-center justify-center">
                            <item.icon className="w-4 h-4 text-[#F97316]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {item.label}
                            </p>
                            <p className="text-xs text-gray-400">{item.desc}</p>
                          </div>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="gap-3 text-red-600 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <Button
                  onClick={() => setShowLoginModal(true)}
                  className="flex bg-gradient-to-br from-[#F97316] to-[#EA580C] hover:from-[#F97316] hover:to-[#EA580C] text-white font-bold px-3 sm:px-4 xl:px-5 py-2.5 rounded-xl items-center gap-1.5 sm:gap-2 shadow-md hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(249,115,22,0.35)] transition-all duration-300 text-[12px] sm:text-[13px] xl:text-[15px] h-10 whitespace-nowrap"
                >
                  <Sparkles className="w-4 h-4" /> Get Started
                </Button>
              )}

              {/* Hamburger — only shown below lg (below 1024px) */}
              <button
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl border border-white/[0.08] hover:border-[#F97316] bg-[#2A2A2A] transition-colors duration-300 shadow-sm"
                aria-label="Open menu"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}