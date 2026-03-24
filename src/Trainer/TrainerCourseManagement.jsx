// import axios from "axios";
// import {
//   BookOpen,
//   CheckCircle,
//   Clock,
//   Copy,
//   Download,
//   Edit2,
//   Eye,
//   GraduationCap,
//   Plus,
//   Search,
//   Star,
//   Trash2,
//   TrendingUp,
//   Users,
//   X
// } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { getTrainerBatches } from "@/services/batchService";

// const API = import.meta.env.VITE_API_BASE_URL ||"http://localhost:9000/api";

// const TrainerCourseManagement = () => {
//   const navigate = useNavigate();

//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [batches, setBatches] = useState([]); // ✅ NEW
//   const [editingCourse, setEditingCourse] = useState(null);
//   const [editForm, setEditForm] = useState({
//     title: "",
//     category: "",
//     description: "",
//   });

//   const [showCreateModal, setShowCreateModal] = useState(false);
//   // const [createForm, setCreateForm] = useState({
//   //   title: "",
//   //   category: "",
//   //   description: "",
//   // });
//   const [createForm, setCreateForm] = useState({
//     title: "",
//     category: "",
//     description: "",
//     batchId: "", // ✅ NEW
//   });
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");

//   const authHeader = () => ({
//     Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
//   });

//   // useEffect(() => {
//   //   fetchCourses();
//   // }, []);
//   useEffect(() => {
//     fetchCourses();

//     const loadBatches = async () => {
//       try {
//         const res = await getTrainerBatches();
//         setBatches(res || []);
//       } catch (err) {
//         console.error("Failed to load trainer batches", err);
//       }
//     };

//     loadBatches();
//   }, []);

//   const fetchCourses = async () => {
//     try {
//       const res = await axios.get(`${API}/courses/my`, {
//         headers: authHeader(),
//       });
//       setCourses(res.data);
//     } catch (err) {
//       console.error("Failed to load courses", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const showSuccessNotification = (message) => {
//     setSuccessMessage(message);
//     setShowSuccess(true);
//     setTimeout(() => setShowSuccess(false), 3000);
//   };

//   const createCourse = async (e) => {
//     e.preventDefault();

//     if (!createForm.title || !createForm.category || !createForm.batchId) {
//       alert("Please fill in all required fields");
//       return;
//     }

//     try {
//       await axios.post(`${API}/courses`, createForm, {
//         headers: authHeader(),
//       });
//       setShowCreateModal(false);
//       setCreateForm({
//         title: "",
//         category: "",
//         description: "",
//         batchId: "",
//       });
//       fetchCourses();
//       showSuccessNotification("Course created successfully!");
//     } catch {
//       alert("Failed to create course");
//     }
//   };

//   const handleDelete = async (id) => {
//     if (
//       !window.confirm(
//         "Are you sure you want to delete this course? This action cannot be undone.",
//       )
//     )
//       return;

//     try {
//       await axios.delete(`${API}/courses/${id}`, {
//         headers: authHeader(),
//       });
//       setCourses((prev) => prev.filter((c) => c.id !== id));
//       showSuccessNotification("Course deleted successfully");
//     } catch {
//       alert("Delete failed");
//     }
//   };

//   const openEdit = (course) => {
//     setEditingCourse(course);
//     setEditForm({
//       title: course.title,
//       category: course.category,
//       description: course.description || "",
//     });
//   };

//   const saveEdit = async () => {
//     try {
//       await axios.put(`${API}/courses/${editingCourse.id}`, editForm, {
//         headers: authHeader(),
//       });
//       setEditingCourse(null);
//       fetchCourses();
//       showSuccessNotification("Course updated successfully!");
//     } catch {
//       alert("Update failed");
//     }
//   };

//   const duplicateCourse = async (course) => {
//     try {
//       await axios.post(
//         `${API}/api/courses`,
//         {
//           title: `${course.title} (Copy)`,
//           category: course.category,
//           description: course.description,
//           batchId: Number(createForm.batchId),
//         },
//         { headers: authHeader() },
//       );
//       fetchCourses();
//       showSuccessNotification("Course duplicated successfully!");
//     } catch {
//       alert("Failed to duplicate course");
//     }
//   };

//   const previewCourse = (id) => {
//     window.open(`/course/${id}`, "_blank");
//   };

//   const categories = [
//     "All",
//     "Product",
//     "Design",
//     "Growth & Marketing",
//     "Development",
//     "Business",
//   ];

//   const filteredCourses = courses.filter((course) => {
//     const matchesSearch =
//       course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       course.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase());

//     const matchesCategory =
//       selectedCategory === "All" || course.category === selectedCategory;

//     return matchesSearch && matchesCategory;
//   });

//   // Calculate stats
//   const totalCourses = courses.length;
//   const totalStudents = courses.reduce(
//     (acc, course) => acc + (course.enrolledCount || 0),
//     0,
//   );
//   const avgRating =
//     courses.length > 0
//       ? (
//           courses.reduce((acc, course) => acc + (course.rating || 4.8), 0) /
//           courses.length
//         ).toFixed(1)
//       : 0;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
//       {/* Premium Hero Header */}
//       <div
//         className="
//   bg-gradient-to-r 
//   from-sky-500 via-blue-600 to-indigo-600
//   dark:from-sky-700 dark:via-blue-800 dark:to-indigo-900
// "
//       >
//         <div className="max-w-7xl mx-auto px-6 py-8">
//           <div className="flex items-center gap-3 mb-2">
//             <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
//               <GraduationCap className="w-6 h-6 text-white" />
//             </div>
//             <p className="text-xs font-semibold tracking-wide text-emerald-100 uppercase">
//               Learning Management
//             </p>
//           </div>
//           <h1 className="text-3xl font-bold text-white mb-2">
//             Course Management
//           </h1>
//           <p className="text-emerald-100">
//             Create, manage, and track your courses and learning modules
//           </p>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-6 py-8">
//         {/* Success Notification */}
//         {showSuccess && (
//           <div className="mb-6 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg flex items-center gap-3 animate-in slide-in-from-top">
//             <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
//             <p className="font-semibold text-green-900 dark:text-green-100">
//               {successMessage}
//             </p>
//           </div>
//         )}

//         {/* Stats Dashboard */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <Card className="p-6 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-slate-900">
//             <div className="flex items-center justify-between mb-2">
//               <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
//                 <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
//               </div>
//               <TrendingUp className="w-4 h-4 text-emerald-600" />
//             </div>
//             <p className="text-2xl font-bold text-foreground">{totalCourses}</p>
//             <p className="text-sm text-muted-foreground">Total Courses</p>
//           </Card>

//           <Card className="p-6 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-slate-900">
//             <div className="flex items-center justify-between mb-2">
//               <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
//                 <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
//               </div>
//               <TrendingUp className="w-4 h-4 text-blue-600" />
//             </div>
//             <p className="text-2xl font-bold text-foreground">
//               {totalStudents}
//             </p>
//             <p className="text-sm text-muted-foreground">Total Enrollments</p>
//           </Card>

//           <Card className="p-6 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-slate-900">
//             <div className="flex items-center justify-between mb-2">
//               <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
//                 <Star className="w-5 h-5 text-amber-600 dark:text-amber-400" />
//               </div>
//               <TrendingUp className="w-4 h-4 text-amber-600" />
//             </div>
//             <p className="text-2xl font-bold text-foreground">{avgRating}</p>
//             <p className="text-sm text-muted-foreground">Average Rating</p>
//           </Card>
//         </div>

//         {/* Search & Filter Bar */}
//         <Card className="p-4 mb-6 border-slate-200 dark:border-slate-800 shadow-sm">
//           <div className="flex flex-col md:flex-row gap-4">
//             {/* Search */}
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search courses by title or instructor..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10 border-slate-300 dark:border-slate-700"
//               />
//             </div>

//             {/* Actions */}
//             <div className="flex gap-2">
//               <Button variant="outline" size="sm" className="gap-2">
//                 <Download className="w-4 h-4" />
//                 Export
//               </Button>
//               <Button
//                 onClick={() => setShowCreateModal(true)}
//                 className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
//               >
//                 <Plus className="w-4 h-4" />
//                 New Course
//               </Button>
//             </div>
//           </div>

//           {/* Category Filters */}
//           <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
//             {categories.map((category) => (
//               <Button
//                 key={category}
//                 size="sm"
//                 variant={selectedCategory === category ? "default" : "outline"}
//                 onClick={() => setSelectedCategory(category)}
//                 className={
//                   selectedCategory === category
//                     ? "bg-emerald-600 hover:bg-emerald-700 text-white"
//                     : ""
//                 }
//               >
//                 {category}
//               </Button>
//             ))}
//           </div>
//         </Card>

//         {/* Courses Grid */}
//         {loading ? (
//           <div className="flex items-center justify-center py-12">
//             <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
//           </div>
//         ) : filteredCourses.length === 0 ? (
//           <Card className="p-12 text-center border-slate-200 dark:border-slate-800">
//             <BookOpen className="w-12 h-12 mx-auto mb-4 text-slate-400" />
//             <h3 className="text-lg font-semibold text-foreground mb-2">
//               No courses found
//             </h3>
//             <p className="text-sm text-muted-foreground mb-4">
//               {searchQuery || selectedCategory !== "All"
//                 ? "Try adjusting your filters"
//                 : "Get started by creating your first course"}
//             </p>
//             {!searchQuery && selectedCategory === "All" && (
//               <Button
//                 onClick={() => setShowCreateModal(true)}
//                 className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
//               >
//                 <Plus className="w-4 h-4" />
//                 Create Course
//               </Button>
//             )}
//           </Card>
//         ) : (
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredCourses.map((course) => (
//               <Card
//                 key={course.id}
//                 className="group p-6 space-y-4 border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all duration-300 hover:border-emerald-300 dark:hover:border-emerald-700"
//               >
//                 {/* Status & Category */}
//                 <div className="flex items-center justify-between">
//                   <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full">
//                     <CheckCircle className="w-3 h-3" />
//                     Published
//                   </span>
//                   <span className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
//                     {course.category}
//                   </span>
//                 </div>

//                 {/* Course Info */}
//                 <div>
//                   <h3 className="text-lg font-semibold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 min-h-[3.5rem]">
//                     {course.title}
//                   </h3>
//                   <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
//                     <GraduationCap className="w-3.5 h-3.5" />
//                     {course.ownerEmail}
//                   </p>
//                 </div>

//                 {/* Metadata */}
//                 <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t border-slate-200 dark:border-slate-800">
//                   <span className="flex items-center gap-1.5">
//                     <Clock className="w-4 h-4" />8 weeks
//                   </span>
//                   <span className="flex items-center gap-1.5">
//                     <Users className="w-4 h-4" />
//                     {course.enrolledCount || 0}
//                   </span>
//                   <span className="flex items-center gap-1.5">
//                     <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
//                     {course.rating || 4.8}
//                   </span>
//                 </div>

//                 {/* Description Preview */}
//                 {course.description && (
//                   <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
//                     {course.description}
//                   </p>
//                 )}

//                 {/* Action Buttons */}
//                 <div className="grid grid-cols-2 gap-2 pt-3">
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     onClick={() => openEdit(course)}
//                     className="gap-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-300 dark:hover:border-emerald-700"
//                   >
//                     <Edit2 className="w-3.5 h-3.5" />
//                     Edit
//                   </Button>

//                   <Button
//                     size="sm"
//                     variant="outline"
//                     onClick={() =>
//                       navigate(`/trainer/course/${course.id}/modules`)
//                     }
//                     className="gap-2 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700"
//                   >
//                     <BookOpen className="w-3.5 h-3.5" />
//                     Modules
//                   </Button>

//                   <Button
//                     size="sm"
//                     variant="outline"
//                     onClick={() => previewCourse(course.id)}
//                     className="gap-2 hover:bg-purple-50 dark:hover:bg-purple-950/30 hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-300 dark:hover:border-purple-700"
//                   >
//                     <Eye className="w-3.5 h-3.5" />
//                     Preview
//                   </Button>

//                   <Button
//                     size="sm"
//                     variant="outline"
//                     onClick={() => duplicateCourse(course)}
//                     className="gap-2 hover:bg-amber-50 dark:hover:bg-amber-950/30 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-300 dark:hover:border-amber-700"
//                   >
//                     <Copy className="w-3.5 h-3.5" />
//                     Duplicate
//                   </Button>

//                   <Button
//                     size="sm"
//                     variant="outline"
//                     onClick={() => handleDelete(course.id)}
//                     className="col-span-2 gap-2 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-700"
//                   >
//                     <Trash2 className="w-3.5 h-3.5" />
//                     Delete Course
//                   </Button>
//                 </div>
//               </Card>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Create Course Modal */}
//       {showCreateModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <Card className="w-full max-w-2xl p-6 space-y-5 border-slate-200 dark:border-slate-800 shadow-xl max-h-[90vh] overflow-y-auto">
//             <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
//               <div className="flex items-center gap-2">
//                 <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
//                   <Plus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
//                 </div>
//                 <h2 className="text-xl font-semibold text-foreground">
//                   Create New Course
//                 </h2>
//               </div>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={() => setShowCreateModal(false)}
//               >
//                 <X className="w-5 h-5" />
//               </Button>
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-medium flex items-center gap-2">
//                 Select Batch
//                 <span className="text-red-500">*</span>
//               </label>

//               <select
//                 value={createForm.batchId}
//                 onChange={(e) =>
//                   setCreateForm({ ...createForm, batchId: e.target.value })
//                 }
//                 className="w-full border rounded-md p-2"
//                 required
//               >
//                 <option value="">Select Batch</option>
//                 {batches.map((b) => (
//                   <option key={b.id} value={b.id}>
//                     Batch {b.id}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <form onSubmit={createCourse} className="space-y-5">
//               <div className="space-y-2">
//                 <label
//                   htmlFor="create-title"
//                   className="text-sm font-medium flex items-center gap-2"
//                 >
//                   Course Title
//                   <span className="text-red-500">*</span>
//                 </label>
//                 <Input
//                   id="create-title"
//                   placeholder="e.g., Advanced React Development"
//                   value={createForm.title}
//                   onChange={(e) =>
//                     setCreateForm({ ...createForm, title: e.target.value })
//                   }
//                   required
//                   className="border-slate-300 dark:border-slate-700"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label
//                   htmlFor="create-category"
//                   className="text-sm font-medium flex items-center gap-2"
//                 >
//                   Category
//                   <span className="text-red-500">*</span>
//                 </label>
//                 <Input
//                   id="create-category"
//                   placeholder="e.g., Development"
//                   value={createForm.category}
//                   onChange={(e) =>
//                     setCreateForm({ ...createForm, category: e.target.value })
//                   }
//                   required
//                   className="border-slate-300 dark:border-slate-700"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label
//                   htmlFor="create-description"
//                   className="text-sm font-medium"
//                 >
//                   Description (Optional)
//                 </label>
//                 <Textarea
//                   id="create-description"
//                   rows={4}
//                   placeholder="Describe what students will learn in this course..."
//                   value={createForm.description}
//                   onChange={(e) =>
//                     setCreateForm({
//                       ...createForm,
//                       description: e.target.value,
//                     })
//                   }
//                   className="border-slate-300 dark:border-slate-700 resize-none"
//                 />
//               </div>

//               <div className="flex gap-3 pt-4">
//                 <Button
//                   type="submit"
//                   className="flex-1 gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
//                 >
//                   <CheckCircle className="w-4 h-4" />
//                   Create Course
//                 </Button>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => setShowCreateModal(false)}
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </form>
//           </Card>
//         </div>
//       )}

//       {/* Edit Course Modal */}
//       {editingCourse && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <Card className="w-full max-w-2xl p-6 space-y-5 border-slate-200 dark:border-slate-800 shadow-xl max-h-[90vh] overflow-y-auto">
//             <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
//               <div className="flex items-center gap-2">
//                 <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
//                   <Edit2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
//                 </div>
//                 <h2 className="text-xl font-semibold text-foreground">
//                   Edit Course
//                 </h2>
//               </div>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={() => setEditingCourse(null)}
//               >
//                 <X className="w-5 h-5" />
//               </Button>
//             </div>

//             <div className="space-y-5">
//               <div className="space-y-2">
//                 <label htmlFor="edit-title" className="text-sm font-medium">
//                   Course Title
//                 </label>
//                 <Input
//                   id="edit-title"
//                   placeholder="Course title"
//                   value={editForm.title}
//                   onChange={(e) =>
//                     setEditForm({ ...editForm, title: e.target.value })
//                   }
//                   className="border-slate-300 dark:border-slate-700"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label htmlFor="edit-category" className="text-sm font-medium">
//                   Category
//                 </label>
//                 <Input
//                   id="edit-category"
//                   placeholder="Category"
//                   value={editForm.category}
//                   onChange={(e) =>
//                     setEditForm({ ...editForm, category: e.target.value })
//                   }
//                   className="border-slate-300 dark:border-slate-700"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label
//                   htmlFor="edit-description"
//                   className="text-sm font-medium"
//                 >
//                   Description
//                 </label>
//                 <Textarea
//                   id="edit-description"
//                   rows={4}
//                   placeholder="Course description"
//                   value={editForm.description}
//                   onChange={(e) =>
//                     setEditForm({ ...editForm, description: e.target.value })
//                   }
//                   className="border-slate-300 dark:border-slate-700 resize-none"
//                 />
//               </div>

//               <div className="flex gap-3 pt-4">
//                 <Button
//                   onClick={saveEdit}
//                   className="flex-1 gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
//                 >
//                   <CheckCircle className="w-4 h-4" />
//                   Save Changes
//                 </Button>
//                 <Button
//                   variant="outline"
//                   onClick={() => setEditingCourse(null)}
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </div>
//           </Card>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TrainerCourseManagement;old 1










import axios from "axios";
import {
  BookOpen, CheckCircle, Clock, Download,
  Edit2, Eye, GraduationCap, Plus, Search, Star,
  Trash2, TrendingUp, Users, X, ChevronLeft, ChevronRight,
  Layers, Sparkles, BarChart3, ArrowLeft,
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { getTrainerBatches } from "@/services/batchService";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

/* ─── tiny helpers ─────────────────────────────────────────────────────────── */
const grad = {
  green:  "linear-gradient(135deg,#064e3b,#059669)",
  blue:   "linear-gradient(135deg,#1e3a8a,#2563eb)",
  amber:  "linear-gradient(135deg,#78350f,#d97706)",
  indigo: "linear-gradient(135deg,#312e81,#6366f1)",
  red:    "linear-gradient(135deg,#7f1d1d,#dc2626)",
};

const Field = ({ label, required, children }) => (
  <div className="space-y-1.5">
    <label className="block text-[10px] font-black uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
      {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const inputCls = `w-full rounded-xl px-3 py-2.5 text-sm
  bg-white dark:bg-white/[0.04]
  border border-slate-200 dark:border-white/[0.08]
  text-slate-800 dark:text-slate-100
  placeholder-slate-300 dark:placeholder-slate-600
  focus:outline-none focus:ring-2 focus:ring-blue-500/25
  focus:border-blue-400/60 dark:focus:border-blue-500/50
  transition duration-150`;

/* ─── DragHandle ──────────────────────────────────────────────────────────── */
const DragHandle = ({ onMouseDown, direction = "both", onClick, hint }) => (
  <div
    onMouseDown={onMouseDown}
    onClick={onClick}
    title={hint}
    className={`relative flex-shrink-0 w-[10px] flex items-center justify-center
      ${onMouseDown ? "cursor-col-resize" : "cursor-pointer"}
      group z-10 select-none
      bg-slate-50 dark:bg-white/[0.025]
      hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-150`}
  >
    {/* thin rail */}
    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px
      bg-slate-200 dark:bg-white/[0.07]
      group-hover:bg-blue-300 dark:group-hover:bg-blue-700/60 transition-colors" />

    {/* pill */}
    <div className="absolute top-1/2 -translate-y-1/2
      flex flex-col items-center gap-0.5
      px-[5px] py-2 rounded-lg
      bg-white dark:bg-[#1e3a5f]
      border border-slate-200 dark:border-white/[0.14]
      shadow-sm
      group-hover:border-blue-400/70 dark:group-hover:border-blue-500/60
      group-hover:shadow-blue-500/10 group-hover:shadow-md
      transition-all duration-150">
      {direction === "right" ? (
        <ChevronLeft className="w-2.5 h-2.5 text-slate-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
      ) : (
        <>
          <svg width="4" height="9" viewBox="0 0 4 9" fill="none">
            <path d="M1 0.5L0 4.5L1 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"
              className="text-slate-400 group-hover:text-blue-500 transition-colors" />
          </svg>
          <div className="w-px h-2 bg-slate-300 dark:bg-slate-600 group-hover:bg-blue-400 transition-colors rounded-full" />
          <svg width="4" height="9" viewBox="0 0 4 9" fill="none">
            <path d="M3 0.5L4 4.5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"
              className="text-slate-400 group-hover:text-blue-500 transition-colors" />
          </svg>
        </>
      )}
    </div>
  </div>
);

/* ─── StatCard ────────────────────────────────────────────────────────────── */
const StatCard = ({ icon, value, label, gradient, accent }) => (
  <div className="relative overflow-hidden rounded-2xl p-5 text-white shadow-lg"
    style={{ background: gradient }}>
    <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-10"
      style={{ background: "white" }} />
    <div className="absolute -right-1 -bottom-3 w-12 h-12 rounded-full opacity-10"
      style={{ background: "white" }} />
    <div className="relative flex flex-col gap-2">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center"
        style={{ background: "rgba(255,255,255,0.18)" }}>
        {icon}
      </div>
      <p className="text-3xl font-black tracking-tight">{value}</p>
      <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-white/60">{label}</p>
    </div>
  </div>
);

/* ─── CategoryBadge ───────────────────────────────────────────────────────── */
const categoryColor = {
  Product:           { bg: "bg-violet-100 dark:bg-violet-900/30", text: "text-violet-700 dark:text-violet-300" },
  Design:            { bg: "bg-pink-100 dark:bg-pink-900/30",     text: "text-pink-700 dark:text-pink-300" },
  "Growth & Marketing": { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-300" },
  Development:       { bg: "bg-blue-100 dark:bg-blue-900/30",     text: "text-blue-700 dark:text-blue-300" },
  Business:          { bg: "bg-teal-100 dark:bg-teal-900/30",     text: "text-teal-700 dark:text-teal-300" },
  _default:          { bg: "bg-slate-100 dark:bg-white/8",        text: "text-slate-600 dark:text-slate-400" },
};
const CatBadge = ({ cat }) => {
  const c = categoryColor[cat] || categoryColor._default;
  return (
    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${c.bg} ${c.text}`}>
      {cat}
    </span>
  );
};

/* ══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════════════ */
const TrainerCourseManagement = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery]       = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [courses, setCourses]               = useState([]);
  const [loading, setLoading]               = useState(true);
  const [batches, setBatches]               = useState([]);
  const [editingCourse, setEditingCourse]   = useState(null);
  const [editForm, setEditForm]             = useState({ title: "", category: "", description: "" });

  const [createForm, setCreateForm]         = useState({ title: "", category: "", description: "", batchId: "" });
  const [showSuccess, setShowSuccess]       = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  /* preview state */
  const [previewCourseId, setPreviewCourseId] = useState(null);

  /* panel state */
  const [leftCollapsed, setLeftCollapsed]   = useState(false);
  const [rightOpen, setRightOpen]           = useState(false);
  const [rightMode, setRightMode]           = useState("create");

  const [rightWidth, setRightWidth]         = useState(340);
  const isDragging  = useRef(false);
  const containerRef = useRef(null);

  /* drag ------------------------------------------------------------------ */
  const onMouseDown = useCallback(() => {
    isDragging.current = true;
    document.body.style.cursor     = "col-resize";
    document.body.style.userSelect = "none";
  }, []);
  const onMouseMove = useCallback((e) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const fromRight = rect.right - e.clientX;
    if (fromRight > 260 && fromRight < 580) setRightWidth(fromRight);
  }, []);
  const onMouseUp = useCallback(() => {
    isDragging.current = false;
    document.body.style.cursor     = "";
    document.body.style.userSelect = "";
  }, []);
  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup",   onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup",   onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  /* auth ------------------------------------------------------------------ */
  const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("lms_token")}` });

  /* fetch ----------------------------------------------------------------- */
  useEffect(() => {
    fetchCourses();
    (async () => {
      try { const res = await getTrainerBatches(); setBatches(res || []); }
      catch (err) { console.error("Failed to load batches", err); }
    })();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API}/courses/my`, { headers: authHeader() });
      setCourses(res.data);
    } catch (err) { console.error("Failed to load courses", err); }
    finally { setLoading(false); }
  };

  const showSuccessNotification = (msg) => {
    setSuccessMessage(msg);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  /* CRUD ------------------------------------------------------------------ */
  const createCourse = async (e) => {
    e.preventDefault();
    if (!createForm.title || !createForm.category || !createForm.batchId) {
      alert("Please fill in all required fields"); return;
    }
    try {
      await axios.post(`${API}/courses`, createForm, { headers: authHeader() });
      setCreateForm({ title: "", category: "", description: "", batchId: "" });
      setRightOpen(false);
      fetchCourses();
      showSuccessNotification("Course created successfully!");
    } catch { alert("Failed to create course"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course? This cannot be undone.")) return;
    try {
      await axios.delete(`${API}/courses/${id}`, { headers: authHeader() });
      setCourses((prev) => prev.filter((c) => c.id !== id));
      if (editingCourse?.id === id) { setEditingCourse(null); setRightOpen(false); }
      if (previewCourseId === id) setPreviewCourseId(null);
      showSuccessNotification("Course deleted.");
    } catch { alert("Delete failed"); }
  };

  const openEdit = (course) => {
    setEditingCourse(course);
    setEditForm({ title: course.title, category: course.category, description: course.description || "" });
    setRightMode("edit");
    setRightOpen(true);
    setPreviewCourseId(null);
  };

  const saveEdit = async () => {
    try {
      await axios.put(`${API}/courses/${editingCourse.id}`, editForm, { headers: authHeader() });
      setEditingCourse(null);
      setRightOpen(false);
      fetchCourses();
      showSuccessNotification("Course updated!");
    } catch { alert("Update failed"); }
  };

  /* filter ---------------------------------------------------------------- */
  const categories = ["All", "Product", "Design", "Growth & Marketing", "Development", "Business"];
  const filteredCourses = courses.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        c.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat    = selectedCategory === "All" || c.category === selectedCategory;
    return matchSearch && matchCat;
  });

  /* stats ----------------------------------------------------------------- */
  const totalCourses  = courses.length;
  const totalStudents = courses.reduce((a, c) => a + (c.enrolledCount || 0), 0);
  const avgRating     = courses.length
    ? (courses.reduce((a, c) => a + (c.rating || 4.8), 0) / courses.length).toFixed(1)
    : "—";

  /* ══════════════════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#f0f4f9] dark:bg-[#0b1428] flex flex-col font-sans">

      {/* ── TOP BAR ─────────────────────────────────────────────────────── */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-start justify-between">
          {/* left */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/20"
              style={{ background: grad.blue }}>
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500 mb-0.5">
                Learning Management
              </p>
              <h1 className="text-xl font-black text-slate-800 dark:text-white leading-tight">
                Course Management
              </h1>
            </div>
          </div>

          {/* right */}
          <div className="flex items-center gap-2 pt-1">
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold
              bg-white dark:bg-white/[0.06]
              border border-slate-200 dark:border-white/[0.08]
              text-slate-600 dark:text-slate-300
              hover:bg-slate-50 dark:hover:bg-white/10 transition shadow-sm">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
            <button
              onClick={() => { setRightMode("create"); setRightOpen(true); setEditingCourse(null); setPreviewCourseId(null); }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black text-white shadow-md
                hover:opacity-90 active:scale-[0.98] transition"
              style={{ background: grad.green }}>
              <Plus className="w-3.5 h-3.5" /> New Course
            </button>
          </div>
        </div>

        {/* success toast */}
        {showSuccess && (
          <div className="mt-3 px-4 py-2.5 rounded-xl
            bg-emerald-50 dark:bg-emerald-900/25
            border border-emerald-200 dark:border-emerald-700/40
            flex items-center gap-2 shadow-sm animate-pulse-once">
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">{successMessage}</p>
          </div>
        )}
      </div>

      {/* ── STAT CARDS ──────────────────────────────────────────────────── */}
      <div className="px-6 pb-4 grid grid-cols-3 gap-4">
        <StatCard icon={<BookOpen className="w-4 h-4" />}  value={totalCourses}  label="Total Courses"     gradient={grad.green} />
        <StatCard icon={<Users    className="w-4 h-4" />}  value={totalStudents} label="Total Enrollments" gradient={grad.blue}  />
        <StatCard icon={<Star     className="w-4 h-4" />}  value={avgRating}     label="Average Rating"    gradient={grad.amber} />
      </div>

      {/* ── 3-PANEL BODY ────────────────────────────────────────────────── */}
      <div
        ref={containerRef}
        className="flex flex-1 mx-6 mb-6 overflow-hidden rounded-2xl
          border border-slate-200/80 dark:border-white/[0.07]
          bg-white dark:bg-[#111d35]
          shadow-xl shadow-slate-200/60 dark:shadow-black/30"
        style={{ height: "calc(100vh - 296px)", minHeight: "400px" }}
      >

        {/* ── PANEL 1 : Filters ─────────────────────────────────────────── */}
        <div
          className="flex-shrink-0 flex flex-col overflow-hidden transition-all duration-300
            border-r border-slate-100 dark:border-white/[0.06]"
          style={{ width: leftCollapsed ? 0 : 210 }}
        >
          {/* header */}
          <div className="flex items-center gap-2 px-4 py-3
            border-b border-slate-100 dark:border-white/[0.06]
            bg-slate-50/50 dark:bg-white/[0.02]">
            <Layers className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 whitespace-nowrap">
              Categories
            </span>
          </div>

          <div className="flex-1 overflow-y-auto py-3 px-2.5 space-y-0.5">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left text-xs px-3 py-2.5 rounded-xl transition font-bold flex items-center justify-between
                    ${active
                      ? "text-white shadow-md"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.04]"}`}
                  style={active ? { background: grad.blue } : {}}
                >
                  <span className="truncate">{cat}</span>
                  {active && (
                    <span className="ml-1 w-1.5 h-1.5 rounded-full bg-white/70 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* left collapse handle */}
        <DragHandle
          onClick={() => setLeftCollapsed(!leftCollapsed)}
          direction={leftCollapsed ? "right" : "both"}
          hint={leftCollapsed ? "Expand filters" : "Collapse filters"}
        />

        {/* ── PANEL 2 : Course List ──────────────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">

          {/* search */}
          <div className="flex items-center gap-3 px-5 py-3
            border-b border-slate-100 dark:border-white/[0.06]
            bg-slate-50/30 dark:bg-white/[0.01]">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
              <input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${inputCls} pl-9`}
              />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest
              text-slate-400 dark:text-slate-600 whitespace-nowrap">
              {filteredCourses.length} found
            </span>
          </div>

          {/* grid */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-[3px] border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center
                  bg-slate-100 dark:bg-white/[0.04]">
                  <BookOpen className="w-7 h-7 text-slate-300 dark:text-slate-600" />
                </div>
                <p className="text-sm font-semibold text-slate-400 dark:text-slate-500 text-center max-w-xs">
                  {searchQuery || selectedCategory !== "All"
                    ? "No courses match your filters"
                    : "No courses yet — create your first!"}
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
                {filteredCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onEdit={() => openEdit(course)}
                    onModules={() => navigate(`/trainer/course/${course.id}/modules`)}
                    onPreview={() => { setPreviewCourseId(course.id); setRightMode("preview"); setRightOpen(true); setEditingCourse(null); }}
                    onDelete={() => handleDelete(course.id)}
                    isActive={editingCourse?.id === course.id || previewCourseId === course.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── DRAG HANDLE between panel 2 & 3 ───────────────────────────── */}
        {rightOpen ? (
          <DragHandle onMouseDown={onMouseDown} direction="both" hint="Resize panel" />
        ) : (
          <DragHandle
            onClick={() => { setRightMode("create"); setRightOpen(true); setEditingCourse(null); setPreviewCourseId(null); }}
            direction="right"
            hint="Open create panel"
          />
        )}

        {/* ── PANEL 3 : Create / Edit / Preview ─────────────────────────── */}
        {rightOpen && (
          <div
            className="flex-shrink-0 flex flex-col overflow-hidden
              border-l border-slate-100 dark:border-white/[0.06]
              bg-slate-50/30 dark:bg-white/[0.01]"
            style={{ width: rightWidth }}
          >
            {/* panel header */}
            <div className="flex items-center justify-between px-5 py-3
              border-b border-slate-100 dark:border-white/[0.06]
              bg-white/60 dark:bg-white/[0.03]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center shadow-sm"
                  style={{ background: rightMode === "create" ? grad.green : rightMode === "edit" ? grad.blue : grad.indigo }}>
                  {rightMode === "create" && <Plus    className="w-3.5 h-3.5 text-white" />}
                  {rightMode === "edit"   && <Edit2   className="w-3.5 h-3.5 text-white" />}
                  {rightMode === "preview"&& <Eye     className="w-3.5 h-3.5 text-white" />}
                </div>
                <span className="text-sm font-black text-slate-700 dark:text-white">
                  {rightMode === "create" ? "New Course" : rightMode === "edit" ? "Edit Course" : "Course Preview"}
                </span>
              </div>
              <button
                onClick={() => { setRightOpen(false); setEditingCourse(null); setPreviewCourseId(null); }}
                className="w-7 h-7 rounded-xl flex items-center justify-center
                  hover:bg-slate-100 dark:hover:bg-white/10
                  text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* panel body */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">

              {/* ── PREVIEW MODE ─── */}
              {rightMode === "preview" && previewCourseId && (() => {
                const c = courses.find(x => x.id === previewCourseId);
                if (!c) return null;
                return (
                  <div className="space-y-5">
                    {/* hero */}
                    <div className="rounded-2xl p-5 text-white space-y-2 shadow-lg"
                      style={{ background: grad.indigo }}>
                      <CatBadge cat={c.category} />
                      <h2 className="text-lg font-black leading-snug mt-2">{c.title}</h2>
                      <p className="text-white/60 text-xs flex items-center gap-1">
                        <GraduationCap className="w-3 h-3" /> {c.ownerEmail}
                      </p>
                    </div>

                    {/* meta row */}
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { icon: <Clock className="w-3.5 h-3.5" />,  val: "8 weeks",             label: "Duration" },
                        { icon: <Users className="w-3.5 h-3.5" />,  val: c.enrolledCount || 0,   label: "Enrolled" },
                        { icon: <Star  className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />, val: c.rating || 4.8, label: "Rating" },
                      ].map((m, i) => (
                        <div key={i} className="rounded-xl p-3 text-center
                          bg-white dark:bg-white/[0.04]
                          border border-slate-100 dark:border-white/[0.06] shadow-sm">
                          <div className="flex justify-center mb-1 text-slate-400">{m.icon}</div>
                          <p className="text-sm font-black text-slate-800 dark:text-white">{m.val}</p>
                          <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">{m.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* description */}
                    {c.description && (
                      <div className="rounded-xl p-4
                        bg-white dark:bg-white/[0.04]
                        border border-slate-100 dark:border-white/[0.06]">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">About</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{c.description}</p>
                      </div>
                    )}

                    {/* quick actions */}
                    <div className="space-y-2 pt-1">
                      <button onClick={() => openEdit(c)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition hover:opacity-90"
                        style={{ background: grad.blue }}>
                        <Edit2 className="w-4 h-4" /> Edit This Course
                      </button>
                      <button onClick={() => navigate(`/trainer/course/${c.id}/modules`)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition hover:opacity-90"
                        style={{ background: grad.indigo }}>
                        <BookOpen className="w-4 h-4" /> Manage Modules
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* ── CREATE / EDIT FORM ─── */}
              {(rightMode === "create" || rightMode === "edit") && (
                <>
                  {rightMode === "create" && (
                    <Field label="Batch" required>
                      <select
                        value={createForm.batchId}
                        onChange={(e) => setCreateForm({ ...createForm, batchId: e.target.value })}
                        className={inputCls}
                        required
                      >
                        <option value="">Select Batch…</option>
                        {batches.map((b) => (
                          <option key={b.id} value={b.id}>Batch {b.id}</option>
                        ))}
                      </select>
                    </Field>
                  )}

                  <Field label="Course Title" required>
                    <input
                      placeholder="e.g., Advanced React Development"
                      value={rightMode === "create" ? createForm.title : editForm.title}
                      onChange={(e) => rightMode === "create"
                        ? setCreateForm({ ...createForm, title: e.target.value })
                        : setEditForm({ ...editForm, title: e.target.value })}
                      className={inputCls}
                    />
                  </Field>

                  <Field label="Category" required>
                    <input
                      placeholder="e.g., Development"
                      value={rightMode === "create" ? createForm.category : editForm.category}
                      onChange={(e) => rightMode === "create"
                        ? setCreateForm({ ...createForm, category: e.target.value })
                        : setEditForm({ ...editForm, category: e.target.value })}
                      className={inputCls}
                    />
                  </Field>

                  <Field label="Description">
                    <textarea
                      rows={5}
                      placeholder="Describe what students will learn…"
                      value={rightMode === "create" ? createForm.description : editForm.description}
                      onChange={(e) => rightMode === "create"
                        ? setCreateForm({ ...createForm, description: e.target.value })
                        : setEditForm({ ...editForm, description: e.target.value })}
                      className={`${inputCls} resize-none`}
                    />
                  </Field>

                  {/* submit row */}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={rightMode === "create" ? createCourse : saveEdit}
                      className="flex-1 flex items-center justify-center gap-2
                        py-2.5 rounded-xl text-sm font-black text-white shadow-md
                        hover:opacity-90 active:scale-[0.98] transition"
                      style={{ background: rightMode === "create" ? grad.green : grad.blue }}
                    >
                      <CheckCircle className="w-4 h-4" />
                      {rightMode === "create" ? "Create Course" : "Save Changes"}
                    </button>
                    <button
                      onClick={() => { setRightOpen(false); setEditingCourse(null); }}
                      className="px-4 py-2.5 rounded-xl text-sm font-bold
                        bg-slate-100 dark:bg-white/[0.06]
                        border border-slate-200 dark:border-white/[0.08]
                        text-slate-600 dark:text-slate-300
                        hover:bg-slate-200 dark:hover:bg-white/10 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════════
   COURSE CARD (extracted for clarity)
══════════════════════════════════════════════════════════════════════════ */
const CourseCard = ({ course, onEdit, onModules, onPreview, onDelete, isActive }) => (
  <div
    className={`rounded-2xl border transition-all duration-200 p-4 space-y-3 group flex flex-col
      ${isActive
        ? "border-blue-400/60 dark:border-blue-500/50 shadow-lg shadow-blue-500/10 bg-blue-50/40 dark:bg-blue-900/10"
        : "border-slate-100 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] hover:border-blue-200 dark:hover:border-blue-700/40 hover:shadow-md"
      }`}
  >
    {/* header */}
    <div className="flex items-center justify-between gap-2">
      <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest
        px-2 py-1 rounded-full
        bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
        <CheckCircle className="w-2.5 h-2.5" /> Published
      </span>
      <CatBadge cat={course.category} />
    </div>

    {/* title */}
    <div className="flex-1">
      <h3 className="text-sm font-black text-slate-800 dark:text-white line-clamp-2
        group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
        {course.title}
      </h3>
      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1 truncate">
        <GraduationCap className="w-3 h-3 flex-shrink-0" /> {course.ownerEmail}
      </p>
    </div>

    {/* meta strip */}
    <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-400 dark:text-slate-500
      pt-2 border-t border-slate-100 dark:border-white/[0.05]">
      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />8w</span>
      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{course.enrolledCount || 0}</span>
      <span className="flex items-center gap-1">
        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />{course.rating || 4.8}
      </span>
    </div>

    {/* description */}
    {course.description && (
      <p className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-2 leading-relaxed">
        {course.description}
      </p>
    )}

    {/* action buttons — 3 in a row + delete full width */}
    <div className="space-y-1.5 pt-1">
      <div className="grid grid-cols-3 gap-1.5">
        {[
          { label: "Edit",    icon: <Edit2    className="w-3 h-3" />, onClick: onEdit,    hover: "hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700" },
          { label: "Modules", icon: <BookOpen className="w-3 h-3" />, onClick: onModules, hover: "hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300" },
          { label: "Preview", icon: <Eye      className="w-3 h-3" />, onClick: onPreview, hover: "hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-300" },
        ].map((btn, i) => (
          <button key={i} onClick={btn.onClick}
            className={`flex items-center justify-center gap-1 px-2 py-1.5 rounded-xl text-[10px] font-black
              border border-slate-200 dark:border-white/[0.08]
              bg-white dark:bg-transparent
              text-slate-500 dark:text-slate-400
              transition ${btn.hover}`}>
            {btn.icon} {btn.label}
          </button>
        ))}
      </div>

      <button onClick={onDelete}
        className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-xl text-[10px] font-black
          border border-slate-200 dark:border-white/[0.08]
          bg-white dark:bg-transparent
          text-slate-500 dark:text-slate-400
          hover:bg-red-50 dark:hover:bg-red-900/20
          hover:text-red-600 dark:hover:text-red-400
          hover:border-red-300 dark:hover:border-red-700/50 transition">
        <Trash2 className="w-3 h-3" /> Delete Course
      </button>
    </div>
  </div>
);

export default TrainerCourseManagement;


































// import axios from "axios";old 2
// import {
//   BookOpen, CheckCircle, Clock, Copy, Download,
//   Edit2, Eye, GraduationCap, Plus, Search, Star,
//   Trash2, TrendingUp, Users, X, ChevronLeft, ChevronRight,
// } from "lucide-react";
// import { useEffect, useRef, useState, useCallback } from "react";
// import { useNavigate } from "react-router-dom";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { getTrainerBatches } from "@/services/batchService";

// const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

// const TrainerCourseManagement = () => {
//   const navigate = useNavigate();

//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [batches, setBatches] = useState([]);
//   const [editingCourse, setEditingCourse] = useState(null);
//   const [editForm, setEditForm] = useState({ title: "", category: "", description: "" });

//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [createForm, setCreateForm] = useState({ title: "", category: "", description: "", batchId: "" });
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");

//   /* ================= PANEL STATE ================= */
//   // Left panel (filters) collapse
//   const [leftCollapsed, setLeftCollapsed] = useState(false);
//   // Right panel (create/edit) open
//   const [rightOpen, setRightOpen] = useState(false);
//   const [rightMode, setRightMode] = useState("create"); // "create" | "edit"

//   // Drag handle between middle and right
//   const [rightWidth, setRightWidth] = useState(320); // px
//   const isDragging = useRef(false);
//   const containerRef = useRef(null);

//   const onMouseDown = useCallback(() => {
//     isDragging.current = true;
//     document.body.style.cursor = "col-resize";
//     document.body.style.userSelect = "none";
//   }, []);
//   const onMouseMove = useCallback((e) => {
//     if (!isDragging.current || !containerRef.current) return;
//     const rect = containerRef.current.getBoundingClientRect();
//     const fromRight = rect.right - e.clientX;
//     if (fromRight > 240 && fromRight < 560) setRightWidth(fromRight);
//   }, []);
//   const onMouseUp = useCallback(() => {
//     isDragging.current = false;
//     document.body.style.cursor = "";
//     document.body.style.userSelect = "";
//   }, []);
//   useEffect(() => {
//     window.addEventListener("mousemove", onMouseMove);
//     window.addEventListener("mouseup", onMouseUp);
//     return () => { window.removeEventListener("mousemove", onMouseMove); window.removeEventListener("mouseup", onMouseUp); };
//   }, [onMouseMove, onMouseUp]);

//   /* ================= AUTH ================= */
//   const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("lms_token")}` });

//   /* ================= FETCH ================= */
//   useEffect(() => {
//     fetchCourses();
//     const loadBatches = async () => {
//       try { const res = await getTrainerBatches(); setBatches(res || []); }
//       catch (err) { console.error("Failed to load trainer batches", err); }
//     };
//     loadBatches();
//   }, []);

//   const fetchCourses = async () => {
//     try {
//       const res = await axios.get(`${API}/courses/my`, { headers: authHeader() });
//       setCourses(res.data);
//     } catch (err) { console.error("Failed to load courses", err); }
//     finally { setLoading(false); }
//   };

//   const showSuccessNotification = (message) => {
//     setSuccessMessage(message);
//     setShowSuccess(true);
//     setTimeout(() => setShowSuccess(false), 3000);
//   };

//   /* ================= CRUD ================= */
//   const createCourse = async (e) => {
//     e.preventDefault();
//     if (!createForm.title || !createForm.category || !createForm.batchId) { alert("Please fill in all required fields"); return; }
//     try {
//       await axios.post(`${API}/courses`, createForm, { headers: authHeader() });
//       setCreateForm({ title: "", category: "", description: "", batchId: "" });
//       setRightOpen(false);
//       fetchCourses();
//       showSuccessNotification("Course created successfully!");
//     } catch { alert("Failed to create course"); }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) return;
//     try {
//       await axios.delete(`${API}/courses/${id}`, { headers: authHeader() });
//       setCourses((prev) => prev.filter((c) => c.id !== id));
//       if (editingCourse?.id === id) { setEditingCourse(null); setRightOpen(false); }
//       showSuccessNotification("Course deleted successfully");
//     } catch { alert("Delete failed"); }
//   };

//   const openEdit = (course) => {
//     setEditingCourse(course);
//     setEditForm({ title: course.title, category: course.category, description: course.description || "" });
//     setRightMode("edit");
//     setRightOpen(true);
//   };

//   const saveEdit = async () => {
//     try {
//       await axios.put(`${API}/courses/${editingCourse.id}`, editForm, { headers: authHeader() });
//       setEditingCourse(null);
//       setRightOpen(false);
//       fetchCourses();
//       showSuccessNotification("Course updated successfully!");
//     } catch { alert("Update failed"); }
//   };

//   const duplicateCourse = async (course) => {
//     try {
//       await axios.post(`${API}/api/courses`,
//         { title: `${course.title} (Copy)`, category: course.category, description: course.description, batchId: Number(createForm.batchId) },
//         { headers: authHeader() }
//       );
//       fetchCourses();
//       showSuccessNotification("Course duplicated successfully!");
//     } catch { alert("Failed to duplicate course"); }
//   };

//   const previewCourse = (id) => window.open(`/course/${id}`, "_blank");

//   /* ================= FILTER ================= */
//   const categories = ["All", "Product", "Design", "Growth & Marketing", "Development", "Business"];
//   const filteredCourses = courses.filter((course) => {
//     const matchesSearch =
//       course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       course.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
//     return matchesSearch && matchesCategory;
//   });

//   /* ================= STATS ================= */
//   const totalCourses  = courses.length;
//   const totalStudents = courses.reduce((acc, c) => acc + (c.enrolledCount || 0), 0);
//   const avgRating     = courses.length > 0
//     ? (courses.reduce((acc, c) => acc + (c.rating || 4.8), 0) / courses.length).toFixed(1)
//     : 0;

//   /* ============================================================
//      RENDER
//   ============================================================ */
//   return (
//     <div className="min-h-screen bg-slate-100 dark:bg-[#0f1b38] flex flex-col">

//       {/* ===== TOP BAR ===== */}
//       <div className="px-6 pt-6 pb-4 max-w-full">
//         <div className="flex items-center justify-between">
//           <div>
//             <div className="flex items-center gap-2 mb-1">
//               <div className="p-2 rounded-lg" style={{ background: "linear-gradient(135deg,#1e3a8a,#1d4ed8)" }}>
//                 <GraduationCap className="h-4 w-4 text-white" />
//               </div>
//               <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
//                 Learning Management
//               </span>
//             </div>
//             <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Course Management</h1>
//             <p className="text-sm text-slate-500 dark:text-slate-400">
//               Create, manage, and track your courses
//             </p>
//           </div>

//           <div className="flex items-center gap-2">
//             <Button variant="outline" size="sm" className="gap-2 border-slate-200 dark:border-white/10 bg-white dark:bg-[#162040] text-slate-700 dark:text-slate-200">
//               <Download className="w-4 h-4" /> Export
//             </Button>
//             <button
//               onClick={() => { setRightMode("create"); setRightOpen(true); setEditingCourse(null); }}
//               className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-md transition hover:opacity-90"
//               style={{ background: "linear-gradient(135deg,#166534,#16a34a)" }}
//             >
//               <Plus className="w-4 h-4" /> New Course
//             </button>
//           </div>
//         </div>

//         {/* Success banner */}
//         {showSuccess && (
//           <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 flex items-center gap-2">
//             <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
//             <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">{successMessage}</p>
//           </div>
//         )}
//       </div>

//       {/* ===== STAT CARDS ===== */}
//       <div className="px-6 pb-4">
//         <div className="grid grid-cols-3 gap-4">
//           {[
//             { icon: <BookOpen size={18} />,  value: totalCourses,  label: "Total Courses",     style: "linear-gradient(135deg,#166534,#16a34a)" },
//             { icon: <Users size={18} />,     value: totalStudents, label: "Total Enrollments", style: "linear-gradient(135deg,#1e3a8a,#2563eb)" },
//             { icon: <Star size={18} />,      value: avgRating,     label: "Average Rating",    style: "linear-gradient(135deg,#92400e,#d97706)" },
//           ].map((s, i) => (
//             <div key={i} className="rounded-xl px-5 py-4 flex flex-col gap-1 text-white shadow-md"
//               style={{ background: s.style }}>
//               <span className="text-white/70">{s.icon}</span>
//               <span className="text-2xl font-extrabold">{s.value}</span>
//               <span className="text-xs text-white/65 uppercase tracking-widest font-semibold">{s.label}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ===== 3-PANEL BODY ===== */}
//       <div
//         ref={containerRef}
//         className="flex flex-1 mx-6 mb-6 overflow-hidden rounded-2xl
//                    border border-slate-200 dark:border-white/10
//                    bg-white dark:bg-[#162040] shadow-sm"
//         style={{ height: "calc(100vh - 290px)", minHeight: "420px" }}
//       >

//         {/* ======== PANEL 1: FILTERS (collapsible) ======== */}
//         <div
//           className="flex-shrink-0 flex flex-col border-r border-slate-100 dark:border-white/10 transition-all duration-300 overflow-hidden"
//           style={{ width: leftCollapsed ? "0px" : "220px" }}
//         >
//           <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 dark:border-white/10">
//             <Search className="w-4 h-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
//             <span className="text-sm font-bold text-slate-700 dark:text-white whitespace-nowrap">Filters</span>
//           </div>

//           <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
//             {categories.map((cat) => (
//               <button
//                 key={cat}
//                 onClick={() => setSelectedCategory(cat)}
//                 className={`w-full text-left text-sm px-3 py-2 rounded-lg transition font-medium
//                   ${selectedCategory === cat
//                     ? "text-white"
//                     : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
//                   }`}
//                 style={selectedCategory === cat ? { background: "linear-gradient(135deg,#1e3a8a,#2563eb)" } : {}}
//               >
//                 {cat}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Left collapse handle */}
//         <div
//           onClick={() => setLeftCollapsed(!leftCollapsed)}
//           className="relative flex-shrink-0 w-3 flex items-center justify-center
//                      cursor-pointer group z-10
//                      bg-slate-100 dark:bg-white/5
//                      border-r border-slate-200 dark:border-white/10
//                      hover:bg-blue-100 dark:hover:bg-blue-900/30 transition"
//         >
//           <div className="absolute flex items-center gap-0.5 px-1.5 py-2 rounded-lg
//                           bg-white dark:bg-[#1e3a5f]
//                           border border-slate-300 dark:border-white/20
//                           shadow group-hover:border-blue-400 dark:group-hover:border-blue-600
//                           transition select-none">
//             {leftCollapsed
//               ? <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-300 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
//               : <>
//                   <svg width="5" height="10" viewBox="0 0 6 12" fill="none" className="text-slate-400 group-hover:text-blue-500">
//                     <path d="M1 1L0 6L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
//                   </svg>
//                   <div className="w-px h-3 bg-slate-300 dark:bg-slate-500 group-hover:bg-blue-400 transition mx-0.5" />
//                   <svg width="5" height="10" viewBox="0 0 6 12" fill="none" className="text-slate-400 group-hover:text-blue-500">
//                     <path d="M5 1L6 6L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
//                   </svg>
//                 </>
//             }
//           </div>
//         </div>

//         {/* ======== PANEL 2: COURSE LIST (main) ======== */}
//         <div className="flex-1 flex flex-col overflow-hidden min-w-0">

//           {/* Search bar */}
//           <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-100 dark:border-white/10">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//               <input
//                 placeholder="Search courses..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-9 pr-4 py-2 text-sm rounded-xl
//                            bg-slate-50 dark:bg-white/5
//                            border border-slate-200 dark:border-white/10
//                            text-slate-800 dark:text-slate-100
//                            placeholder-slate-400 dark:placeholder-slate-500
//                            focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition"
//               />
//             </div>
//             <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
//               {filteredCourses.length} course{filteredCourses.length !== 1 ? "s" : ""}
//             </span>
//           </div>

//           {/* Course grid */}
//           <div className="flex-1 overflow-y-auto p-4">
//             {loading ? (
//               <div className="flex items-center justify-center py-16">
//                 <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
//               </div>
//             ) : filteredCourses.length === 0 ? (
//               <div className="flex flex-col items-center justify-center py-16 gap-3">
//                 <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600" />
//                 <p className="text-sm text-slate-500 dark:text-slate-400">
//                   {searchQuery || selectedCategory !== "All" ? "No courses match your filters" : "No courses yet — create your first!"}
//                 </p>
//               </div>
//             ) : (
//               <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
//                 {filteredCourses.map((course) => (
//                   <div
//                     key={course.id}
//                     className="rounded-2xl border border-slate-100 dark:border-white/8
//                                bg-slate-50 dark:bg-white/3
//                                hover:border-blue-300 dark:hover:border-blue-700/50
//                                hover:shadow-md transition p-4 space-y-3 group"
//                   >
//                     {/* Header */}
//                     <div className="flex items-center justify-between">
//                       <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider
//                                        px-2 py-1 rounded-full
//                                        bg-emerald-100 dark:bg-emerald-900/30
//                                        text-emerald-700 dark:text-emerald-300">
//                         <CheckCircle className="w-3 h-3" /> Published
//                       </span>
//                       <span className="text-[10px] font-semibold px-2 py-1 rounded-full
//                                        bg-slate-100 dark:bg-white/8 text-slate-500 dark:text-slate-400">
//                         {course.category}
//                       </span>
//                     </div>

//                     {/* Title */}
//                     <div>
//                       <h3 className="text-sm font-bold text-slate-800 dark:text-white line-clamp-2 min-h-[2.5rem]
//                                      group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
//                         {course.title}
//                       </h3>
//                       <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
//                         <GraduationCap className="w-3 h-3" /> {course.ownerEmail}
//                       </p>
//                     </div>

//                     {/* Meta */}
//                     <div className="flex items-center gap-3 text-xs text-slate-400 pt-2
//                                     border-t border-slate-100 dark:border-white/8">
//                       <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />8w</span>
//                       <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{course.enrolledCount || 0}</span>
//                       <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />{course.rating || 4.8}</span>
//                     </div>

//                     {/* Description */}
//                     {course.description && (
//                       <p className="text-xs text-slate-400 line-clamp-2">{course.description}</p>
//                     )}

//                     {/* Actions */}
//                     <div className="grid grid-cols-2 gap-1.5 pt-1">
//                       {[
//                         { label: "Edit",      icon: <Edit2 className="w-3.5 h-3.5" />,  onClick: () => openEdit(course),                         cls: "hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700" },
//                         { label: "Modules",   icon: <BookOpen className="w-3.5 h-3.5" />, onClick: () => navigate(`/trainer/course/${course.id}/modules`), cls: "hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300" },
//                         { label: "Preview",   icon: <Eye className="w-3.5 h-3.5" />,    onClick: () => previewCourse(course.id),                 cls: "hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-300" },
//                         { label: "Duplicate", icon: <Copy className="w-3.5 h-3.5" />,   onClick: () => duplicateCourse(course),                  cls: "hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-300" },
//                       ].map((btn, i) => (
//                         <button key={i} onClick={btn.onClick}
//                           className={`flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold
//                                       border border-slate-200 dark:border-white/10
//                                       text-slate-600 dark:text-slate-300
//                                       bg-white dark:bg-transparent transition ${btn.cls}`}>
//                           {btn.icon} {btn.label}
//                         </button>
//                       ))}

//                       <button onClick={() => handleDelete(course.id)}
//                         className="col-span-2 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold
//                                    border border-slate-200 dark:border-white/10
//                                    bg-white dark:bg-transparent
//                                    text-slate-600 dark:text-slate-300
//                                    hover:bg-red-50 dark:hover:bg-red-900/20
//                                    hover:text-red-600 dark:hover:text-red-400
//                                    hover:border-red-300 dark:hover:border-red-700 transition">
//                         <Trash2 className="w-3.5 h-3.5" /> Delete Course
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* ======== DRAG HANDLE between panel 2 & 3 (only when panel 3 open) ======== */}
//         {rightOpen && (
//           <div
//             onMouseDown={onMouseDown}
//             className="relative flex-shrink-0 w-3 flex items-center justify-center
//                        cursor-col-resize group z-10
//                        bg-slate-100 dark:bg-white/5
//                        border-x border-slate-200 dark:border-white/10
//                        hover:bg-blue-100 dark:hover:bg-blue-900/30 transition"
//           >
//             <div className="absolute flex items-center gap-0.5 px-1.5 py-2 rounded-lg
//                             bg-white dark:bg-[#1e3a5f]
//                             border border-slate-300 dark:border-white/20
//                             shadow group-hover:border-blue-400 dark:group-hover:border-blue-600
//                             transition select-none">
//               <svg width="5" height="10" viewBox="0 0 6 12" fill="none" className="text-slate-400 group-hover:text-blue-500">
//                 <path d="M1 1L0 6L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
//               </svg>
//               <div className="w-px h-3 bg-slate-300 dark:bg-slate-500 group-hover:bg-blue-400 transition mx-0.5" />
//               <svg width="5" height="10" viewBox="0 0 6 12" fill="none" className="text-slate-400 group-hover:text-blue-500">
//                 <path d="M5 1L6 6L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
//               </svg>
//             </div>
//           </div>
//         )}

//         {/* ======== PANEL 3: CREATE / EDIT (slide-in, no popup) ======== */}
//         {rightOpen && (
//           <div
//             className="flex-shrink-0 flex flex-col border-l border-slate-100 dark:border-white/10 overflow-hidden"
//             style={{ width: `${rightWidth}px` }}
//           >
//             {/* Panel header */}
//             <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 dark:border-white/10">
//               <div className="flex items-center gap-2">
//                 <div className="p-1.5 rounded-lg"
//                   style={{ background: rightMode === "create" ? "linear-gradient(135deg,#166534,#16a34a)" : "linear-gradient(135deg,#1e3a8a,#1d4ed8)" }}>
//                   {rightMode === "create" ? <Plus className="w-3.5 h-3.5 text-white" /> : <Edit2 className="w-3.5 h-3.5 text-white" />}
//                 </div>
//                 <span className="text-sm font-bold text-slate-700 dark:text-white">
//                   {rightMode === "create" ? "New Course" : "Edit Course"}
//                 </span>
//               </div>
//               <button
//                 onClick={() => { setRightOpen(false); setEditingCourse(null); }}
//                 className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
//               >
//                 <X className="w-4 h-4" />
//               </button>
//             </div>

//             {/* Panel body */}
//             <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">

//               {/* Batch select (create only) */}
//               {rightMode === "create" && (
//                 <div className="space-y-1.5">
//                   <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
//                     Batch <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     value={createForm.batchId}
//                     onChange={(e) => setCreateForm({ ...createForm, batchId: e.target.value })}
//                     className="w-full rounded-xl px-3 py-2.5 text-sm
//                                bg-slate-50 dark:bg-white/5
//                                border border-slate-200 dark:border-white/10
//                                text-slate-800 dark:text-slate-100
//                                focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition"
//                     required
//                   >
//                     <option value="">Select Batch</option>
//                     {batches.map((b) => (
//                       <option key={b.id} value={b.id}>Batch {b.id}</option>
//                     ))}
//                   </select>
//                 </div>
//               )}

//               {/* Title */}
//               <div className="space-y-1.5">
//                 <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
//                   Course Title <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   placeholder="e.g., Advanced React Development"
//                   value={rightMode === "create" ? createForm.title : editForm.title}
//                   onChange={(e) => rightMode === "create"
//                     ? setCreateForm({ ...createForm, title: e.target.value })
//                     : setEditForm({ ...editForm, title: e.target.value })}
//                   className="w-full rounded-xl px-3 py-2.5 text-sm
//                              bg-slate-50 dark:bg-white/5
//                              border border-slate-200 dark:border-white/10
//                              text-slate-800 dark:text-slate-100
//                              placeholder-slate-400
//                              focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition"
//                 />
//               </div>

//               {/* Category */}
//               <div className="space-y-1.5">
//                 <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
//                   Category <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   placeholder="e.g., Development"
//                   value={rightMode === "create" ? createForm.category : editForm.category}
//                   onChange={(e) => rightMode === "create"
//                     ? setCreateForm({ ...createForm, category: e.target.value })
//                     : setEditForm({ ...editForm, category: e.target.value })}
//                   className="w-full rounded-xl px-3 py-2.5 text-sm
//                              bg-slate-50 dark:bg-white/5
//                              border border-slate-200 dark:border-white/10
//                              text-slate-800 dark:text-slate-100
//                              placeholder-slate-400
//                              focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition"
//                 />
//               </div>

//               {/* Description */}
//               <div className="space-y-1.5">
//                 <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
//                   Description
//                 </label>
//                 <textarea
//                   rows={5}
//                   placeholder="Describe what students will learn..."
//                   value={rightMode === "create" ? createForm.description : editForm.description}
//                   onChange={(e) => rightMode === "create"
//                     ? setCreateForm({ ...createForm, description: e.target.value })
//                     : setEditForm({ ...editForm, description: e.target.value })}
//                   className="w-full resize-none rounded-xl px-3 py-2.5 text-sm
//                              bg-slate-50 dark:bg-white/5
//                              border border-slate-200 dark:border-white/10
//                              text-slate-800 dark:text-slate-100
//                              placeholder-slate-400
//                              focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition"
//                 />
//               </div>

//               {/* Submit */}
//               <div className="flex gap-2 pt-1">
//                 <button
//                   onClick={rightMode === "create" ? createCourse : saveEdit}
//                   className="flex-1 flex items-center justify-center gap-2
//                              px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-md transition hover:opacity-90"
//                   style={{ background: rightMode === "create" ? "linear-gradient(135deg,#166534,#16a34a)" : "linear-gradient(135deg,#1e3a8a,#1d4ed8)" }}
//                 >
//                   <CheckCircle className="w-4 h-4" />
//                   {rightMode === "create" ? "Create Course" : "Save Changes"}
//                 </button>
//                 <button
//                   onClick={() => { setRightOpen(false); setEditingCourse(null); }}
//                   className="px-4 py-2.5 rounded-xl text-sm font-semibold
//                              bg-slate-100 dark:bg-white/8
//                              border border-slate-200 dark:border-white/10
//                              text-slate-600 dark:text-slate-300
//                              hover:bg-slate-200 dark:hover:bg-white/14 transition"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Toggle panel 3 button (when closed) */}
//         {!rightOpen && (
//           <div
//             onClick={() => { setRightMode("create"); setRightOpen(true); setEditingCourse(null); }}
//             className="relative flex-shrink-0 w-3 flex items-center justify-center
//                        cursor-pointer group z-10
//                        bg-slate-100 dark:bg-white/5
//                        border-l border-slate-200 dark:border-white/10
//                        hover:bg-emerald-100 dark:hover:bg-emerald-900/20 transition"
//           >
//             <div className="absolute flex items-center px-1.5 py-2 rounded-lg
//                             bg-white dark:bg-[#1e3a5f]
//                             border border-slate-300 dark:border-white/20
//                             shadow group-hover:border-emerald-400 dark:group-hover:border-emerald-600
//                             transition select-none">
//               <ChevronLeft className="w-3 h-3 text-slate-400 group-hover:text-emerald-500 dark:group-hover:text-emerald-400" />
//             </div>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// };

// export default TrainerCourseManagement;



