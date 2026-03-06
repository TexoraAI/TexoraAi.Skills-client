import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowRight, Award, BookOpen,
  ChevronDown, Clock,
  GraduationCap, LogOut, Menu, Moon, Sparkles, Star, Sun,
  Target, TrendingUp, Trophy, User, Users, Zap
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import heroStudent from "../../assets/hero-student.png";
// import logo from "../../assets/logo.png";

export default function LMSHomepage({ theme, toggleTheme }) {
  const [activeTab, setActiveTab] = useState("product");
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
      try { setUser(JSON.parse(userData)); }
      catch { sessionStorage.removeItem("user"); }
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const scrollToSection = (sectionId, tabName = null) => {
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        if (tabName) setActiveTab(tabName);
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } else {
      if (tabName) setActiveTab(tabName);
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const companies = [
    { name: "Capgemini" }, { name: "Microsoft" }, { name: "Google" }, { name: "Texora" },
    { name: "Amazon" }, { name: "UFS" }, { name: "Apple" }, { name: "Cognizant" },
  ];

  const logoImages = {
    Capgemini: "/cap.jpg", Microsoft: "/Micrososft.jpg", Google: "/Google.jpg",
    Texora: "/Picture1.jpg", Amazon: "/Amazone.jpg", UFS: "/UFS-Logo.jpg",
    Apple: "/Apple.jpg", Cognizant: "/cognizant.jpg",
  };

  const CompanyLogo = ({ company }) =>
    logoImages[company.name] ? <img src={logoImages[company.name]} alt={company.name} className="w-full h-full object-contain" /> : null;

  const courses = {
    product: [
      { id: 1, title: "Product Management Mastery", instructor: "Ex-Google PM", duration: "8 weeks", students: "2,500+", rating: 4.9, level: "Intermediate", description: "Master product lifecycle from ideation to launch. Learn roadmapping, prioritization, stakeholder management & metrics that matter.", modules: ["Discovery & Research", "Roadmapping", "Prioritization Frameworks", "Launch Strategy", "Metrics & Analytics"], price: "₹49,000", highlights: ["Live sessions with Google PMs", "Real case studies", "1:1 mentorship", "Job referral support"], liveSessions: 5, totalLessons: 81, projects: 3 },
      { id: 2, title: "Product Analytics", instructor: "Ex-Amazon", duration: "6 weeks", students: "1,800+", rating: 4.8, level: "Advanced", description: "Data-driven product decisions. Master A/B testing, cohort analysis, funnel optimization & retention strategies.", modules: ["SQL for Product Managers", "Experimentation", "Funnel Analysis", "Retention Metrics", "Customer Segmentation"], price: "₹39,000", highlights: ["Amazon case studies", "Live SQL projects", "Advanced Mixpanel", "Retention frameworks"], liveSessions: 4, totalLessons: 60, projects: 2 },
      { id: 3, title: "Product Strategy", instructor: "Ex-Meta", duration: "10 weeks", students: "2,100+", rating: 4.9, level: "Advanced", description: "Strategic frameworks for product success. Positioning, competitive analysis, growth strategies & portfolio management.", modules: ["Market Analysis", "Competitive Strategy", "Growth Playbooks", "Portfolio Management", "Pricing Strategy"], price: "₹59,000", highlights: ["Meta growth case studies", "Strategy templates", "Live workshops", "Executive simulations"], liveSessions: 6, totalLessons: 90, projects: 4 },
    ],
    design: [
      { id: 4, title: "UI/UX Design Bootcamp", instructor: "Ex-Airbnb Designer", duration: "12 weeks", students: "3,200+", rating: 5.0, level: "Beginner", description: "Complete UI/UX journey from research to prototype. Figma mastery, design systems & portfolio projects.", modules: ["User Research", "Wireframing", "Prototyping", "Design Systems", "Portfolio Building"], price: "₹69,000", highlights: ["Airbnb case studies", "Figma certification", "Live design reviews", "Job ready portfolio"], liveSessions: 8, totalLessons: 110, projects: 5 },
      { id: 5, title: "Design Systems", instructor: "Ex-Netflix", duration: "8 weeks", students: "1,500+", rating: 4.8, level: "Advanced", description: "Build scalable design systems like Netflix. Components, tokens, documentation & developer handoff.", modules: ["Component Libraries", "Design Tokens", "Documentation", "Dev Handoff", "Scale Patterns"], price: "₹45,000", highlights: ["Netflix system breakdown", "Figma + Storybook", "Live system audits", "Enterprise patterns"], liveSessions: 4, totalLessons: 70, projects: 3 },
      { id: 6, title: "User Research Pro", instructor: "Ex-Microsoft", duration: "6 weeks", students: "1,900+", rating: 4.7, level: "Intermediate", description: "Research methods that drive product decisions. Interviews, surveys, usability testing & synthesis.", modules: ["Interview Techniques", "Survey Design", "Usability Testing", "Synthesis Methods", "Stakeholder Reports"], price: "₹35,000", highlights: ["Microsoft research frameworks", "Live user testing", "Report templates", "Stakeholder presentations"], liveSessions: 3, totalLessons: 55, projects: 2 },
    ],
    growth: [
      { id: 7, title: "Growth Marketing", instructor: "Ex-Uber Growth", duration: "8 weeks", students: "2,800+", rating: 4.9, level: "Intermediate", description: "Growth loops, viral mechanics & acquisition strategies that scale businesses.", modules: ["Growth Frameworks", "Viral Loops", "Acquisition Channels", "Experimentation", "Scaling"], price: "₹49,000", highlights: ["Uber growth case studies", "Live experiments", "Channel deep dives", "Scaling frameworks"], liveSessions: 5, totalLessons: 75, projects: 3 },
      { id: 8, title: "SEO & Content Strategy", instructor: "Ex-Spotify", duration: "10 weeks", students: "2,300+", rating: 4.8, level: "Intermediate", description: "Organic growth mastery. Technical SEO, content systems & link building at scale.", modules: ["Technical SEO", "Content Systems", "Link Building", "Analytics", "Scaling Organic"], price: "₹55,000", highlights: ["Spotify SEO case studies", "Live audits", "Content calendars", "Enterprise SEO"], liveSessions: 5, totalLessons: 85, projects: 3 },
      { id: 9, title: "Performance Marketing", instructor: "Ex-Swiggy", duration: "8 weeks", students: "2,600+", rating: 4.9, level: "Advanced", description: "Paid acquisition at scale. Facebook, Google, creative testing & LTV optimization.", modules: ["Facebook Ads", "Google Ads", "Creative Strategy", "LTV Optimization", "Scaling"], price: "₹47,000", highlights: ["Swiggy ad case studies", "Live campaign builds", "Creative testing", "ROAS frameworks"], liveSessions: 5, totalLessons: 72, projects: 4 },
    ],
  };

  const testimonials = [
    { name: "Priya Sharma", role: "Product Manager @ Flipkart", text: "LMS helped me transition from engineering to PM. The mentorship was invaluable!" },
    { name: "Rahul Verma", role: "UX Designer @ Zomato", text: "Best investment in my career. Landed my dream job within 3 months of completing the course." },
    { name: "Ananya Singh", role: "Growth Lead @ CRED", text: "The practical insights and real-world case studies made all the difference." },
  ];

  const features = [
    { icon: Target, title: "Project-Based Learning", description: "Build real-world projects that showcase your skills" },
    { icon: Users, title: "Expert Mentorship", description: "Learn from professionals at top tech companies" },
    { icon: Trophy, title: "Career Support", description: "Get help with resumes, interviews & job referrals" },
    { icon: Zap, title: "Live Sessions", description: "Interactive workshops with industry experts" },
  ];

  const stats = [
    { value: "50K+", label: "Active Learners" },
    { value: "95%", label: "Success Rate" },
    { value: "100+", label: "Expert Mentors" },
    { value: "4.9★", label: "Average Rating" },
  ];

  const mentorBenefits = [
    { icon: Award, text: "1:1 mentorship and small cohort learning" },
    { icon: TrendingUp, text: "Project reviews with detailed feedback" },
    { icon: Users, text: "Peer community for accountability and networking" },
  ];

  const careerSupport = [
    { icon: Target, title: "Portfolio Support", description: "Turn your projects into case studies hiring managers love" },
    { icon: Award, title: "Interview Prep", description: "Mock interviews, feedback and guidance on role expectations" },
    { icon: Users, title: "Referrals & Network", description: "Warm intros to hiring teams and community-led referrals" },
  ];

  const getLevelColor = (level) => ({
    Beginner: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    Intermediate: "bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20",
    Advanced: "bg-[#1E293B]/10 text-[#1E293B] dark:bg-white/10 dark:text-white border border-[#1E293B]/20 dark:border-white/20",
  }[level] || "bg-gray-100 text-gray-700");

  const navLinks = [
    { text: "Courses", href: "#courses" },
    { text: "Mentors", href: "#mentors" },
    { text: "Success Stories", href: "#successstories" },
  ];

  return (
    <div className="min-h-screen bg-[#F6EDE6] dark:bg-black text-[#1E293B] dark:text-white">

      {/* ── Nav ── */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/95 dark:bg-black/95 backdrop-blur-xl shadow-md" : "bg-white/80 dark:bg-black/80 backdrop-blur-md"} border-b border-[#F97316]/20 dark:border-gray-800`}>
      <div className="max-w-7xl mx-auto px-0">
          <div className="flex items-center justify-between h-20">
           <div
  className="flex items-center justify-start cursor-pointer hover:scale-105 transition-transform"
  onClick={() => navigate("/")}
>
  <span className="text-4xl font-extrabold tracking-wider font-serif">
    <span className="text-green-600">ILM</span>
    <span className="text-[#F97316] ml-2">ORA</span>
  </span>
</div>

            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map(link => (
                <a key={link.text} href={link.href} className="text-[#1E293B] dark:text-gray-300 hover:text-[#F97316] font-medium transition-colors">{link.text}</a>
              ))}
              <Button variant="ghost" onClick={() => navigate("/explore-programs")} className="font-medium text-[#1E293B] dark:text-gray-300 hover:text-[#F97316]">
                Free Services
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-[#F6EDE6] dark:hover:bg-gray-900 transition shadow-sm bg-white dark:bg-black"
              >
                {theme === "dark" ? <Sun className="w-5 h-5 text-[#F97316]" /> : <Moon className="w-5 h-5 text-[#1E293B]" />}
              </button>

              {user ? (
                <div className="hidden lg:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-3 rounded-xl border-gray-200 dark:border-gray-700">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={user.picture} alt={user.name} />
                          <AvatarFallback className="bg-[#1E293B] text-white">{user.name?.charAt(0) || <User className="w-4 h-4" />}</AvatarFallback>
                        </Avatar>
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-72 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                      <div className="px-3 py-3 bg-[#F6EDE6] dark:bg-gray-800 rounded-t-md">
                        <p className="font-semibold text-sm text-[#1E293B] dark:text-white truncate">{user.name || "User"}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                      {[
                        { icon: GraduationCap, label: "My Learning", desc: "View your courses", path: "/my-learning" },
                        { icon: User, label: "Edit Profile", desc: "Update your info", path: "/edit-profile" },
                      ].map(item => (
                        <DropdownMenuItem key={item.label} onClick={() => navigate(item.path)} className="gap-3 cursor-pointer">
                          <div className="w-8 h-8 rounded-lg bg-[#F97316]/10 flex items-center justify-center">
                            <item.icon className="w-4 h-4 text-[#F97316]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{item.label}</p>
                            <p className="text-xs text-gray-500">{item.desc}</p>
                          </div>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="gap-3 text-red-600 cursor-pointer">
                        <LogOut className="w-4 h-4" /><span className="text-sm font-medium">Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <Button onClick={() => navigate("/login")} className="hidden lg:flex items-center gap-2 px-6 h-11 rounded-xl font-semibold bg-[#1E293B] hover:bg-[#334155] text-white shadow-md transition-all hover:scale-105 hover:shadow-lg">
                  <Sparkles className="w-4 h-4" /> Get Started
                </Button>
              )}

              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon" className="rounded-xl"><Menu className="w-6 h-6" /></Button>
                </SheetTrigger>
                <SheetContent className="bg-white dark:bg-gray-900">
                  <div className="flex flex-col gap-4 mt-8">
                    {navLinks.map(link => (
                      <a key={link.text} href={link.href} className="text-lg font-medium hover:text-[#F97316] transition-colors" onClick={() => setMobileMenuOpen(false)}>{link.text}</a>
                    ))}
                    <Button variant="ghost" onClick={() => { navigate("/explore-programs"); setMobileMenuOpen(false); }} className="justify-start text-lg font-medium">Free Services</Button>
                    <Separator className="my-4" />
                    {user ? (
                      <>
                        <Button onClick={() => { navigate("/my-learning"); setMobileMenuOpen(false); }} className="w-full bg-[#1E293B] hover:bg-[#334155]">My Learning</Button>
                        <Button variant="destructive" onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full">Logout</Button>
                      </>
                    ) : (
                      <Button onClick={() => { navigate("/login"); setMobileMenuOpen(false); }} className="w-full bg-[#1E293B] hover:bg-[#334155] text-white">Get Started</Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

     {/* ── Hero NEW ── */}
<section className="pt-32 pb-24 px-6 bg-[#F6EDE6] dark:bg-black relative overflow-hidden">
  <div className="absolute -top-32 left-[10%] w-[600px] h-[600px] bg-[#F97316]/8 dark:bg-[#F97316]/5 rounded-full blur-[120px] pointer-events-none" />
  <div className="absolute -bottom-20 right-[5%] w-[500px] h-[500px] bg-[#1E293B]/5 rounded-full blur-[120px] pointer-events-none" />

  <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-16 items-center">

    {/* LEFT */}
    <div className="text-center lg:text-left">
      <div className="mb-8 inline-flex">
        <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-900 border border-[#F97316]/30 text-[#F97316] px-5 py-2.5 rounded-full text-sm font-semibold shadow-md">
          <Sparkles className="w-4 h-4" />
          Advanced Learning Platform for Modern Professionals
        </div>
      </div>

      <h1 className="text-4xl md:text-4xl lg:text-6xl font-bold mb-6 leading-tight text-[#1E293B] dark:text-white">
        Become the <span className="text-[#F97316]">Top 1%</span>
      </h1>

      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-xl leading-relaxed">
        Learn Product, Design, Growth & Marketing from industry experts.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center lg:items-start">
        <button
          onClick={() => navigate("/explore-programs")}
          className="flex items-center gap-2 bg-[#1E293B] hover:bg-[#334155] text-white font-bold px-8 py-4 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          Start Learning <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>

    {/* RIGHT IMAGE */}
    <div className="flex justify-center">
      <img
        src={heroStudent}
        alt="Hero Student"
        className="w-full max-w-lg object-contain drop-shadow-2xl hover:scale-105 transition duration-500"
      />
    </div>

  </div>
</section>
      {/* ── Stats ── */}
      <section className="py-16 px-6 bg-white dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-[#F6EDE6] dark:bg-gray-900 rounded-2xl p-8 text-center border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="text-4xl md:text-5xl font-bold text-[#F97316] mb-2">{stat.value}</div>
              <p className="text-gray-600 dark:text-gray-300 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-6 bg-[#F6EDE6] dark:bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#1E293B] dark:text-white">
  Why Choose 
  <span className="ml-2">
    <span className="text-green-600">ILM</span>{" "}
    <span className="text-[#F97316]">ORA</span>
  </span>
</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Everything you need to accelerate your career growth</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all group">
                <div className="w-14 h-14 bg-[#1E293B] dark:bg-[#F97316] rounded-2xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-sm">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#1E293B] dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Companies ── */}
      <section className="py-20 px-6 bg-white dark:bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-4 font-bold">Trusted By Professionals At</p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1E293B] dark:text-white">Top Global <span className="text-[#F97316]">Companies</span></h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {companies.map((company) => (
              <div key={company.name} className="group bg-[#F6EDE6] dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 flex items-center justify-center shadow-sm hover:shadow-md hover:-translate-y-2 hover:border-[#F97316]/30 transition-all">
                <div className="w-16 h-16 flex items-center justify-center opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all">
                  <CompanyLogo company={company} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Courses ── */}
      <section id="courses" className="py-24 px-6 scroll-mt-20 bg-[#F6EDE6] dark:bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#1E293B] dark:text-white">Featured <span className="text-[#F97316]">Programs</span></h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Choose your path and start building skills that matter</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-12 p-1.5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              {["product", "design", "growth"].map(tab => (
                <TabsTrigger key={tab} value={tab} className="rounded-xl capitalize font-semibold data-[state=active]:bg-[#1E293B] data-[state=active]:text-white dark:data-[state=active]:bg-[#F97316] transition-all">
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(courses).map(([category, categoryCourses]) => (
              <TabsContent key={category} value={category}>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {categoryCourses.map(course => (
                    <div
                      key={course.id}
                      onClick={() => navigate("/course-details", { state: { course } })}
                      className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden cursor-pointer"
                    >
                      <div className="h-1 bg-[#F97316]" />
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getLevelColor(course.level)}`}>{course.level}</span>
                          <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />{course.rating}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-[#1E293B] dark:text-white mb-1 group-hover:text-[#F97316] transition-colors">{course.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{course.instructor}</p>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-2 leading-relaxed text-sm">{course.description}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
                          <div className="flex items-center gap-1"><Clock className="w-4 h-4 text-[#F97316]" />{course.duration}</div>
                          <div className="flex items-center gap-1"><Users className="w-4 h-4 text-[#F97316]" />{course.students}</div>
                          <div className="flex items-center gap-1"><BookOpen className="w-4 h-4 text-[#F97316]" />{course.modules.length}</div>
                        </div>
                        <button className="w-full bg-[#1E293B] hover:bg-[#334155] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all group-hover:scale-[1.02] shadow-sm">
                          View Details <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* ── Mentors ── */}
      <section id="mentors" className="py-24 px-6 scroll-mt-20 bg-white dark:bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#1E293B] dark:text-white">Learn from <span className="text-[#F97316]">Industry Experts</span></h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-xl">Sessions led by operators from top product companies so you understand how work happens in the real world.</p>
              <div className="space-y-4">
                {mentorBenefits.map((item, i) => (
                  <div key={i} className="bg-[#F6EDE6] dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#1E293B] dark:bg-[#F97316] rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium pt-1">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {testimonials.map((t, i) => (
                <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-5 italic leading-relaxed text-sm">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1E293B] dark:bg-[#F97316] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">{t.name.charAt(0)}</div>
                    <div>
                      <p className="font-semibold text-[#1E293B] dark:text-white text-sm">{t.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Career Support ── */}
      <section id="successstories" className="py-24 px-6 scroll-mt-20 bg-[#F6EDE6] dark:bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#1E293B] dark:text-white">Career Support That <span className="text-[#F97316]">Delivers Results</span></h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">Get help with interview prep, portfolios, referrals and role mapping</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {careerSupport.map((item, i) => (
              <div key={i} className="group bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all">
                <div className="w-16 h-16 bg-[#1E293B] dark:bg-[#F97316] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform shadow-sm">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#1E293B] dark:text-white mb-3">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="bg-[#1E293B] dark:bg-gray-900 rounded-3xl p-14 text-center relative overflow-hidden border border-[#F97316]/20 shadow-xl">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#F97316]" />
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative max-w-3xl mx-auto">
              <h3 className="text-3xl md:text-5xl font-bold mb-6 text-white">Ready to Transform Your Career?</h3>
              <p className="text-lg text-gray-300 mb-10">Join 50,000+ professionals who've already taken the leap</p>
              <button onClick={() => navigate("/explore-programs")} className="group inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#ea6c0a] text-white px-10 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
                Explore Free Services <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-white text-[#1E293B]">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2 space-y-5">
            <h3 className="text-3xl font-extrabold">
  <span className="text-green-600">ILM</span>{" "}
  <span className="text-[#F97316]">ORA</span>
</h3>
              <p className="text-sm text-gray-600 max-w-sm leading-relaxed">Modern learning platform for ambitious professionals who want to break into product, design and growth roles.</p>
              <div className="flex gap-3 pt-2">
                <a href="https://www.youtube.com/@Texoraai" target="_blank" rel="noreferrer" className="h-8 w-8 rounded-full flex items-center justify-center text-white bg-red-600 hover:scale-110 transition-all shadow-md">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
                <a href="https://www.linkedin.com/company/105596104" target="_blank" rel="noreferrer" className="h-8 w-8 rounded-full flex items-center justify-center text-white bg-blue-700 hover:scale-110 transition-all shadow-md">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href="https://api.whatsapp.com/send?phone=919210970334" target="_blank" rel="noreferrer" className="h-8 w-8 rounded-full flex items-center justify-center text-white bg-green-500 hover:scale-110 transition-all shadow-md">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                </a>
                <a 
                href="https://www.instagram.com/texora_ai" 
                target="_blank" 
                rel="noreferrer" 
                className="h-8 w-8 rounded-full flex items-center justify-center text-white bg-pink-600 hover:scale-110 transition-all shadow-md"
                >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.75 2C4.574 2 2 4.574 2 7.75v8.5C2 19.426 4.574 22 7.75 22h8.5C19.426 22 22 19.426 22 16.25v-8.5C22 4.574 19.426 2 16.25 2h-8.5zm0 2h8.5C18.216 4 20 5.784 20 7.75v8.5C20 18.216 18.216 20 16.25 20h-8.5C5.784 20 4 18.216 4 16.25v-8.5C4 5.784 5.784 4 7.75 4zm4.25 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.5-.75a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z"/>
                </svg>
                </a>
                <a 
              href="https://x.com/texoraai" 
              target="_blank" 
              rel="noreferrer" 
              className="h-8 w-8 rounded-full flex items-center justify-center text-white bg-black hover:scale-110 transition-all shadow-md"
              >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2H21l-6.54 7.482L22 22h-6.828l-5.34-6.977L3.64 22H1l7.042-8.053L2 2h6.828l4.86 6.35L18.244 2zm-2.396 18h1.89L8.224 4H6.176l9.672 16z"/>
              </svg>
              </a>
              </div>
            </div>

            {[
              { title: "Programs", items: [
                { label: "Product Management", action: () => scrollToSection("courses", "product") },
                { label: "Growth Marketing", action: () => scrollToSection("courses", "growth") },
                { label: "UI / UX Design", action: () => scrollToSection("courses", "design") },
              ]},
              { title: "Resources", items: [
                { label: "Success Stories", action: () => scrollToSection("successstories") },
                { label: "Free Services", action: () => { navigate("/explore-programs"); setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 250); } },
              ]},
              { title: "Company", items: [
                { label: "About Us", action: () => navigate("/about") },
                { label: "Careers", action: () => navigate("/careers") },
                { label: "Privacy Policy", action: () => navigate("/privacy-policy") },
                { label: "Terms of Service", action: () => navigate("/terms-of-service") },
              ]},
            ].map((section, i) => (
              <div key={i} className="space-y-4">
                <h4 className="text-sm font-semibold tracking-wide">{section.title}</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  {section.items.map(item => (
                    <li key={item.label} onClick={item.action} className="hover:text-[#F97316] cursor-pointer transition-colors">{item.label}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <span>© {new Date().getFullYear()} ILM ORA All rights reserved.</span>
            <span>Built with passion for modern learners 🚀</span>
          </div>
        </div>
      </footer>

    </div>
  );
}













