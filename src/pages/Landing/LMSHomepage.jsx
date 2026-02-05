
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowRight, Award,
  BarChart3,
  BookOpen,
  CheckCircle,
  ChevronDown,
  Clock,
  GraduationCap,
  LogOut,
  Menu,
  Moon,
  Sparkles,
  Star, Sun,
  Target,
  TrendingUp,
  Trophy,
  User,
  Users,
  Zap
} from "lucide-react";
import { useEffect, useState } from "react";
import { FaLinkedinIn, FaWhatsapp, FaYoutube } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function LMSHomepage({ theme, toggleTheme }) {
  const [activeTab, setActiveTab] = useState("product");
  const [selectedCourse, setSelectedCourse] = useState(null);
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
      } catch (error) {
        console.error("Error parsing user data:", error);
        sessionStorage.removeItem("user");
      }
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const scrollToSection = (sectionId, tabName = null) => {
    // Check if we're on the explore-programs page
    if (window.location.pathname === '/explore-programs') {
      // Navigate to home first, then scroll
      navigate('/');
      setTimeout(() => {
        if (tabName) {
          setActiveTab(tabName);
        }
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
      return;
    }

    // First navigate to home if not already there
    if (window.location.pathname !== '/') {
      navigate('/');
      // Wait for navigation then scroll
      setTimeout(() => {
        if (tabName) {
          setActiveTab(tabName);
        }
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    } else {
      // Already on home page, just scroll
      if (tabName) {
        setActiveTab(tabName);
      }
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const companies = [
    { name: "Capgemini", colors: "from-blue-600 to-cyan-400", bgGradient: "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30" },
    { name: "Microsoft", colors: "from-blue-600 to-blue-400", bgGradient: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30" },
    { name: "Google", colors: "from-blue-500 to-green-400", bgGradient: "bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/30 dark:to-green-950/30" },
    { name: "Texora", colors: "from-orange-500 to-amber-500", bgGradient: "bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30" },
    { name: "Amazon", colors: "from-orange-400 to-yellow-400", bgGradient: "bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950/30 dark:to-yellow-950/30" },
    { name: "UFS", colors: "from-blue-700 to-indigo-500", bgGradient: "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30" },
    { name: "Apple", colors: "from-gray-400 to-gray-200", bgGradient: "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/30 dark:to-gray-800/30" },
    { name: "Cognizant", colors: "from-blue-600 to-indigo-500", bgGradient: "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30" },
  ];

  const courses = {
    product: [
      { id: 1, title: "Product Management Mastery", instructor: "Ex-Google PM", duration: "8 weeks", students: "2,500+", rating: 4.9, level: "Intermediate", description: "Master product lifecycle from ideation to launch. Learn roadmapping, prioritization, stakeholder management & metrics that matter.", modules: ["Discovery & Research", "Roadmapping", "Prioritization Frameworks", "Launch Strategy", "Metrics & Analytics"], price: "₹49,000", highlights: ["Live sessions with Google PMs", "Real case studies", "1:1 mentorship", "Job referral support"] },
      { id: 2, title: "Product Analytics", instructor: "Ex-Amazon", duration: "6 weeks", students: "1,800+", rating: 4.8, level: "Advanced", description: "Data-driven product decisions. Master A/B testing, cohort analysis, funnel optimization & retention strategies.", modules: ["SQL for Product Managers", "Experimentation", "Funnel Analysis", "Retention Metrics", "Customer Segmentation"], price: "₹39,000", highlights: ["Amazon case studies", "Live SQL projects", "Advanced Mixpanel", "Retention frameworks"] },
      { id: 3, title: "Product Strategy", instructor: "Ex-Meta", duration: "10 weeks", students: "2,100+", rating: 4.9, level: "Advanced", description: "Strategic frameworks for product success. Positioning, competitive analysis, growth strategies & portfolio management.", modules: ["Market Analysis", "Competitive Strategy", "Growth Playbooks", "Portfolio Management", "Pricing Strategy"], price: "₹59,000", highlights: ["Meta growth case studies", "Strategy templates", "Live workshops", "Executive simulations"] },
    ],
    design: [
      { id: 4, title: "UI/UX Design Bootcamp", instructor: "Ex-Airbnb Designer", duration: "12 weeks", students: "3,200+", rating: 5.0, level: "Beginner", description: "Complete UI/UX journey from research to prototype. Figma mastery, design systems & portfolio projects.", modules: ["User Research", "Wireframing", "Prototyping", "Design Systems", "Portfolio Building"], price: "₹69,000", highlights: ["Airbnb case studies", "Figma certification", "Live design reviews", "Job ready portfolio"] },
      { id: 5, title: "Design Systems", instructor: "Ex-Netflix", duration: "8 weeks", students: "1,500+", rating: 4.8, level: "Advanced", description: "Build scalable design systems like Netflix. Components, tokens, documentation & developer handoff.", modules: ["Component Libraries", "Design Tokens", "Documentation", "Dev Handoff", "Scale Patterns"], price: "₹45,000", highlights: ["Netflix system breakdown", "Figma + Storybook", "Live system audits", "Enterprise patterns"] },
      { id: 6, title: "User Research Pro", instructor: "Ex-Microsoft", duration: "6 weeks", students: "1,900+", rating: 4.7, level: "Intermediate", description: "Research methods that drive product decisions. Interviews, surveys, usability testing & synthesis.", modules: ["Interview Techniques", "Survey Design", "Usability Testing", "Synthesis Methods", "Stakeholder Reports"], price: "₹35,000", highlights: ["Microsoft research frameworks", "Live user testing", "Report templates", "Stakeholder presentations"] },
    ],
    growth: [
      { id: 7, title: "Growth Marketing", instructor: "Ex-Uber Growth", duration: "8 weeks", students: "2,800+", rating: 4.9, level: "Intermediate", description: "Growth loops, viral mechanics & acquisition strategies that scale businesses.", modules: ["Growth Frameworks", "Viral Loops", "Acquisition Channels", "Experimentation", "Scaling"], price: "₹49,000", highlights: ["Uber growth case studies", "Live experiments", "Channel deep dives", "Scaling frameworks"] },
      { id: 8, title: "SEO & Content Strategy", instructor: "Ex-Spotify", duration: "10 weeks", students: "2,300+", rating: 4.8, level: "Intermediate", description: "Organic growth mastery. Technical SEO, content systems & link building at scale.", modules: ["Technical SEO", "Content Systems", "Link Building", "Analytics", "Scaling Organic"], price: "₹55,000", highlights: ["Spotify SEO case studies", "Live audits", "Content calendars", "Enterprise SEO"] },
      { id: 9, title: "Performance Marketing", instructor: "Ex-Swiggy", duration: "8 weeks", students: "2,600+", rating: 4.9, level: "Advanced", description: "Paid acquisition at scale. Facebook, Google, creative testing & LTV optimization.", modules: ["Facebook Ads", "Google Ads", "Creative Strategy", "LTV Optimization", "Scaling"], price: "₹47,000", highlights: ["Swiggy ad case studies", "Live campaign builds", "Creative testing", "ROAS frameworks"] },
    ],
  };

  const testimonials = [
    { name: "Priya Sharma", role: "Product Manager @ Flipkart", text: "LMS helped me transition from engineering to PM. The mentorship was invaluable!", rating: 5, image: null },
    { name: "Rahul Verma", role: "UX Designer @ Zomato", text: "Best investment in my career. Landed my dream job within 3 months of completing the course.", rating: 5, image: null },
    { name: "Ananya Singh", role: "Growth Lead @ CRED", text: "The practical insights and real-world case studies made all the difference.", rating: 5, image: null },
  ];

  const socialLinks = [
    { name: "YouTube", icon: FaYoutube, href: "https://www.youtube.com/@Texoraai", hover: "hover:bg-red-600" },
    { name: "LinkedIn", icon: FaLinkedinIn, href: "https://www.linkedin.com/company/105596104", hover: "hover:bg-blue-600" },
    { name: "WhatsApp", icon: FaWhatsapp, href: "https://api.whatsapp.com/send?phone=919210970334", hover: "hover:bg-green-600" },
  ];

  const features = [
    { icon: Target, title: "Project-Based Learning", description: "Build real-world projects that showcase your skills", gradient: "from-blue-500 to-cyan-500" },
    { icon: Users, title: "Expert Mentorship", description: "Learn from professionals at top tech companies", gradient: "from-emerald-500 to-teal-500" },
    { icon: Trophy, title: "Career Support", description: "Get help with resumes, interviews & job referrals", gradient: "from-purple-500 to-pink-500" },
    { icon: Zap, title: "Live Sessions", description: "Interactive workshops with industry experts", gradient: "from-orange-500 to-red-500" },
  ];

  const stats = [
    { value: "50K+", label: "Active Learners", gradient: "from-blue-600 to-cyan-500" },
    { value: "95%", label: "Success Rate", gradient: "from-emerald-600 to-teal-500" },
    { value: "100+", label: "Expert Mentors", gradient: "from-purple-600 to-pink-500" },
    { value: "4.9★", label: "Average Rating", gradient: "from-orange-500 to-red-500" },
  ];

  const mentorBenefits = [
    { icon: Award, text: "1:1 mentorship and small cohort learning", gradient: "from-yellow-500 to-orange-500" },
    { icon: TrendingUp, text: "Project reviews with detailed feedback", gradient: "from-emerald-500 to-teal-500" },
    { icon: Users, text: "Peer community for accountability and networking", gradient: "from-blue-500 to-cyan-500" },
  ];

  const careerSupport = [
    { icon: Target, title: "Portfolio Support", description: "Turn your projects into case studies hiring managers love", gradient: "from-blue-600 to-cyan-500" },
    { icon: Award, title: "Interview Prep", description: "Mock interviews, feedback and guidance on role expectations", gradient: "from-emerald-600 to-teal-500" },
    { icon: Users, title: "Referrals & Network", description: "Warm intros to hiring teams and community-led referrals", gradient: "from-purple-600 to-pink-500" },
  ];

  const logoImages = { Capgemini: "/cap.jpg", Microsoft: "/Micrososft.jpg", Google: "/Google.jpg", Texora: "/Picture1.jpg", Amazon: "/Amazone.jpg", UFS: "/UFS-Logo.jpg", Apple: "/Apple.jpg", Cognizant: "/cognizant.jpg" };
  
  const CompanyLogo = ({ company }) => logoImages[company.name] ? <img src={logoImages[company.name]} alt={company.name} className="w-full h-full object-contain" /> : null;

  const getLevelColor = (level) => ({ Beginner: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", Intermediate: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", Advanced: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" }[level] || "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400");

  const navLinks = [
    { text: "Courses", href: "#courses" },
    { text: "Mentors", href: "#mentors" },
    { text: "Success Stories", href: "#successstories" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50/30 dark:from-gray-950 dark:via-black dark:to-blue-950/20 text-gray-900 dark:text-white">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50" : "bg-white/80 dark:bg-gray-950/80 backdrop-blur-md"} border-b border-gray-200 dark:border-gray-800`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate("/")}>
              <img src={logo} alt="TexoraAi.skills Logo" className="h-10 w-auto object-contain" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-600 bg-clip-text text-transparent">TexoraAi.skills</span>
            </div>

            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map(link => <a key={link.text} href={link.href} className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">{link.text}</a>)}
              <Button variant="ghost" onClick={() => navigate("/explore-programs")} className="font-medium">Free Services</Button>
            </div>

            <div className="flex items-center gap-4">
              <Button onClick={toggleTheme} size="icon" className="relative overflow-hidden rounded-full w-10 h-10 bg-white/70 dark:bg-black/40 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-110 active:scale-95">
                <span className={`absolute transition-all duration-500 ${theme === "dark" ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"}`}><Sun className="w-5 h-5 text-yellow-500" /></span>
                <span className={`absolute transition-all duration-500 ${theme === "dark" ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`}><Moon className="w-5 h-5 text-gray-800 dark:text-gray-200" /></span>
              </Button>

              {user ? (
                <div className="hidden lg:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-3 rounded-xl">
                        <Avatar className="w-8 h-8"><AvatarImage src={user.picture} alt={user.name} /><AvatarFallback className="bg-gradient-to-br from-blue-500 to-emerald-500 text-white">{user.name?.charAt(0) || <User className="w-4 h-4" />}</AvatarFallback></Avatar>
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-72">
                      <div className="px-2 py-3 bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-blue-950/30 dark:to-emerald-950/30">
                        <p className="font-semibold text-sm truncate">{user.name || "User"}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                      {[{ icon: GraduationCap, label: "My Learning", desc: "View your courses", color: "blue", path: "/my-learning" }, { icon: User, label: "Edit Profile", desc: "Update your info", color: "emerald", path: "/edit-profile" }].map(item => (
                        <DropdownMenuItem key={item.label} onClick={() => navigate(item.path)} className="gap-3 cursor-pointer">
                          <div className={`w-8 h-8 rounded-lg bg-${item.color}-100 dark:bg-${item.color}-900/30 flex items-center justify-center`}><item.icon className={`w-4 h-4 text-${item.color}-600 dark:text-${item.color}-400`} /></div>
                          <div><p className="text-sm font-medium">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="gap-3 text-red-600 dark:text-red-400 cursor-pointer"><LogOut className="w-4 h-4" /><span className="text-sm font-medium">Logout</span></DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <Button onClick={() => navigate("/login")} className="hidden lg:flex items-center gap-2 px-6 h-11 rounded-full font-semibold text-white bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-600 shadow-md shadow-blue-500/20 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40 active:scale-95 relative overflow-hidden">
                  <span className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full" />
                  <Sparkles className="w-4 h-4 relative z-10" /><span className="relative z-10">Get Started</span>
                </Button>
              )}

              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="lg:hidden"><Button variant="ghost" size="icon" className="rounded-xl"><Menu className="w-6 h-6" /></Button></SheetTrigger>
                <SheetContent>
                  <div className="flex flex-col gap-4 mt-8">
                    {navLinks.map(link => <a key={link.text} href={link.href} className="text-lg font-medium hover:text-blue-600 transition-colors" onClick={() => setMobileMenuOpen(false)}>{link.text}</a>)}
                    <Button variant="ghost" onClick={() => { navigate("/explore-programs"); setMobileMenuOpen(false); }} className="justify-start text-lg font-medium">Free Services</Button>
                    <Separator className="my-4" />
                    {user ? (<><Button onClick={() => { navigate("/my-learning"); setMobileMenuOpen(false); }} className="w-full">My Learning</Button><Button variant="destructive" onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full">Logout</Button></>) : (<Button onClick={() => { navigate("/login"); setMobileMenuOpen(false); }} className="w-full bg-gradient-to-r from-blue-600 to-emerald-600">Get Started</Button>)}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <Badge variant="outline" className="mb-8 px-5 py-2.5 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-emerald-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400">
            <Sparkles className="w-4 h-4 mr-2" />Advanced Learning Platform for Modern Professionals
          </Badge>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">Become the <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-600 bg-clip-text text-transparent">Top 1%</span></h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed">Learn Product, Design, Growth & Marketing from industry experts at Google, Amazon, Meta & top startups.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" onClick={() => navigate("/explore-programs")} className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:shadow-2xl hover:shadow-blue-500/40 text-lg rounded-xl group">
              Start Learning<ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
            {["50,000+ Learners", "95% Success Rate", "4.9★ Average Rating"].map(text => <div key={text} className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /><span>{text}</span></div>)}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-white dark:bg-gray-900/50 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => <div key={i} className="text-center group hover:scale-105 transition-transform"><div className={`text-5xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}>{stat.value}</div><p className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</p></div>)}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">TexoraAi.skills</span></h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">Everything you need to accelerate your career growth</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <Card key={i} className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all hover:-translate-y-2 border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}><feature.icon className="w-7 h-7 text-white" /></div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent><p className="text-gray-600 dark:text-gray-400">{feature.description}</p></CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-50 via-blue-50 to-emerald-50 dark:from-gray-950 dark:via-blue-950/20 dark:to-emerald-950/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 font-semibold">Trusted By Professionals At</p>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">Top Global Companies</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {companies.map(company => (
              <div key={company.name} className={`${company.bgGradient} rounded-2xl p-6 flex flex-col items-center justify-center gap-4 border border-gray-200/50 dark:border-gray-700/50 hover:scale-110 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 group cursor-pointer`}>
                <div className="w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform bg-white/90 dark:bg-black/90 rounded-xl p-2 shadow-lg"><CompanyLogo company={company} /></div>
                <span className={`text-xs font-bold bg-gradient-to-r ${company.colors} bg-clip-text text-transparent`}>{company.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-20 px-6 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">Programs</span></h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">Choose your path and start building skills that matter</p>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-12 h-auto p-1.5">
              {["product", "design", "growth"].map(tab => <TabsTrigger key={tab} value={tab} className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white capitalize">{tab}</TabsTrigger>)}
            </TabsList>
            {Object.entries(courses).map(([category, categoryCourses]) => (
              <TabsContent key={category} value={category}>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {categoryCourses.map(course => (
                    <Card key={course.id} className="group hover:shadow-2xl hover:shadow-blue-500/20 transition-all hover:-translate-y-2 cursor-pointer overflow-hidden" onClick={() => setSelectedCourse(course)}>
                      <CardHeader className="bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-blue-950/30 dark:to-emerald-950/30">
                        <div className="flex items-start justify-between mb-4">
                          <Badge className={getLevelColor(course.level)}>{course.level}</Badge>
                          <Badge variant="outline" className="bg-white dark:bg-gray-900"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />{course.rating}</Badge>
                        </div>
                        <CardTitle className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{course.title}</CardTitle>
                        <CardDescription>{course.instructor}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-2">{course.description}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-6">
                          {[{ icon: Clock, text: course.duration }, { icon: Users, text: course.students }, { icon: BookOpen, text: course.modules.length }].map((item, i) => <div key={i} className="flex items-center gap-2"><item.icon className="w-4 h-4" /><span>{item.text}</span></div>)}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:shadow-lg hover:shadow-blue-500/30 rounded-xl group/btn">View Details<ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" /></Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Course Details Modal */}
      <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 border border-gray-200 dark:border-gray-800">
          {selectedCourse && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Badge className={getLevelColor(selectedCourse.level)}>{selectedCourse.level}</Badge>
                  <Badge variant="outline"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />{selectedCourse.rating}</Badge>
                </div>
                <DialogTitle className="text-3xl bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">{selectedCourse.title}</DialogTitle>
                <DialogDescription>{selectedCourse.instructor}</DialogDescription>
              </DialogHeader>
              <div className="space-y-8 py-4">
                <div>
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-blue-600" />About This Program</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{selectedCourse.description}</p>
                </div>
                <div className="grid grid-cols-3 gap-4 p-6 bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-blue-950/30 dark:to-emerald-950/30 rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
                  {[{ icon: Clock, value: selectedCourse.duration, label: "Duration", color: "blue" }, { icon: Users, value: selectedCourse.students, label: "Students", color: "emerald" }, { icon: Star, value: selectedCourse.rating, label: "Rating", color: "yellow", fill: true }].map((stat, i) => (
                    <div key={i} className="text-center">
                      <stat.icon className={`w-6 h-6 text-${stat.color}-${stat.color === "yellow" ? "500" : "600"} dark:text-${stat.color}-400 mx-auto mb-2 ${stat.fill ? "fill-yellow-500" : ""}`} />
                      <p className={`text-2xl font-bold text-${stat.color}-${stat.color === "yellow" ? "600" : "600"} dark:text-${stat.color}-400`}>{stat.value}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <Card className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white border-0">
                  <CardContent className="p-6 text-center">
                    <p className="text-sm font-medium mb-2 text-blue-100">Investment</p>
                    <p className="text-4xl font-bold mb-1">{selectedCourse.price}</p>
                    <p className="text-sm text-blue-100">Limited time offer • Full access included</p>
                  </CardContent>
                </Card>
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-blue-600" />What You'll Learn</h3>
                  <div className="space-y-3">
                    {selectedCourse.modules.map((module, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0"><span className="text-white font-bold text-sm">{i + 1}</span></div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{module}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Trophy className="w-5 h-5 text-blue-600" />Program Highlights</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {selectedCourse.highlights.map((highlight, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-950/30 dark:to-emerald-950/30 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
                        <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button onClick={() => navigate("/explore-programs")} className="flex-1 bg-gradient-to-r from-blue-600 to-emerald-600 hover:shadow-2xl hover:shadow-blue-500/40 rounded-2xl h-12">Enroll Now<ArrowRight className="w-5 h-5 ml-2" /></Button>
                  <Button variant="outline" onClick={() => setSelectedCourse(null)} className="flex-1 rounded-2xl h-12">Close</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Mentors Section */}
      <section id="mentors" className="py-20 px-6 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-950 dark:to-blue-950/20 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Learn from <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">Industry Experts</span></h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">Sessions led by operators from top product companies so you understand how work happens in the real world.</p>
              <div className="space-y-4">
                {mentorBenefits.map((item, i) => (
                  <Card key={i} className="hover:shadow-lg transition-shadow">
                    <CardContent className="flex items-start gap-4 p-4">
                      <div className={`w-10 h-10 bg-gradient-to-br ${item.gradient} rounded-lg flex items-center justify-center flex-shrink-0`}><item.icon className="w-5 h-5 text-white" /></div>
                      <p className="text-gray-700 dark:text-gray-300 font-medium pt-1.5">{item.text}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {testimonials.map((testimonial, i) => (
                <Card key={i} className="hover:shadow-xl hover:shadow-blue-500/10 transition-all hover:-translate-y-1">
                  <CardHeader><div className="flex items-center gap-1 mb-2">{[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}</div></CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 italic">"{testimonial.text}"</p>
                    <div className="flex items-center gap-3">
                      <Avatar><AvatarFallback className="bg-gradient-to-br from-blue-500 to-emerald-500 text-white font-bold">{testimonial.name.charAt(0)}</AvatarFallback></Avatar>
                      <div><p className="font-semibold">{testimonial.name}</p><p className="text-sm text-muted-foreground">{testimonial.role}</p></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section id="successstories" className="py-20 px-6 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Career Support That <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">Delivers Results</span></h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">Get help with interview prep, portfolios, referrals and role mapping</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {careerSupport.map((item, i) => (
              <Card key={i} className="group hover:shadow-2xl hover:shadow-blue-500/20 transition-all hover:-translate-y-2">
                <CardHeader>
                  <div className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}><item.icon className="w-8 h-8 text-white" /></div>
                  <CardTitle className="text-2xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent><p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.description}</p></CardContent>
              </Card>
            ))}
          </div>
          <Card className="mt-12 bg-gradient-to-br from-blue-600 to-emerald-600 text-white border-0">
            <CardContent className="p-8">
              <div className="max-w-3xl mx-auto text-center">
                <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Career?</h3>
                <p className="text-xl text-blue-100 mb-8">Join 50,000+ professionals who've already taken the leap</p>
                <Button size="lg" onClick={() => navigate("/explore-programs")} className="bg-white text-blue-600 hover:bg-white/90 hover:shadow-2xl rounded-xl">Explore Free Services<ArrowRight className="w-5 h-5 ml-2" /></Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative overflow-hidden bg-gradient-to-br from-[#0B0F1A] via-[#0F172A] to-black text-gray-300">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-0 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-emerald-600/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">TexoraAi.skills</h3>
              <p className="text-sm text-gray-400 leading-relaxed max-w-sm">Modern learning platform for ambitious professionals who want to break into product, design and growth roles.</p>
              <div className="flex gap-3 pt-2">
                {socialLinks.map(link => {
                  const Icon = link.icon;
                  return <a key={link.name} href={link.href} target="_blank" rel="noreferrer" aria-label={link.name} className={`h-9 w-9 rounded-full flex items-center justify-center bg-white/10 transition-all duration-300 hover:scale-110 ${link.hover}`}><Icon className="h-4.5 w-4.5" /></a>;
                })}
              </div>
            </div>
            {[
              { 
                title: "Programs", 
                items: [
                  { label: "Product Management", action: () => scrollToSection('courses', 'product') },
                  { label: "Growth Marketing", action: () => scrollToSection('courses', 'growth') },
                  { label: "UI / UX Design", action: () => scrollToSection('courses', 'design') }
                ]
              },
              { 
                title: "Resources", 
                items: [
                  { label: "Success Stories", action: () => scrollToSection('successstories') },
                  { 
                    label: "Free Services", 
                    action: () => {
                      navigate("/explore-programs");
                      setTimeout(() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }, 100);
                    }
                  }
                ]
              },
              { 
                title: "Company", 
                items: [
                  { label: "About Us", action: () => navigate("/about") },
                  { label: "Careers", action: () => navigate("/careers") },
                  { label: "Privacy Policy", action: () => navigate("/privacy-policy") },
                  { label: "Terms of Service", action: () => navigate("/terms-of-service") }
                ]
              }
              
            ].map((section, i) => (
              <div key={i} className="space-y-4">
                <h4 className="text-sm font-semibold text-white">{section.title}</h4>
                <ul className="space-y-2 text-sm">
                  {section.items.map(item => (
                    <li 
                      key={item.label} 
                      onClick={item.action}
                      className="hover:text-white cursor-pointer transition-colors"
                    >
                      {item.label}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <Separator className="my-14 bg-white/10" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <span>© {new Date().getFullYear()} TexoraAi.skills. All rights reserved.</span>
            <span className="text-xs text-gray-500">Built with passion for modern learners 🚀</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
