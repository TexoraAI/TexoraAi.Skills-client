



import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Search,
  BookOpen,
  Users,
  Star,
  Filter,
  Download,
  TrendingUp,
  Clock,
  GraduationCap,
  BarChart3,
  X,
  CheckCircle,
  AlertCircle,
  Copy,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const API = "http://localhost:9000";

const TrainerCourseManagement = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingCourse, setEditingCourse] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    category: "",
    description: "",
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: "",
    category: "",
    description: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API}/api/courses/my`, {
        headers: authHeader(),
      });
      setCourses(res.data);
    } catch (err) {
      console.error("Failed to load courses", err);
    } finally {
      setLoading(false);
    }
  };

  const showSuccessNotification = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const createCourse = async (e) => {
    e.preventDefault();

    if (!createForm.title || !createForm.category) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      await axios.post(
        `${API}/api/courses`,
        createForm,
        { headers: authHeader() }
      );
      setShowCreateModal(false);
      setCreateForm({ title: "", category: "", description: "" });
      fetchCourses();
      showSuccessNotification("Course created successfully!");
    } catch {
      alert("Failed to create course");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) return;

    try {
      await axios.delete(`${API}/api/courses/${id}`, {
        headers: authHeader(),
      });
      setCourses((prev) => prev.filter((c) => c.id !== id));
      showSuccessNotification("Course deleted successfully");
    } catch {
      alert("Delete failed");
    }
  };

  const openEdit = (course) => {
    setEditingCourse(course);
    setEditForm({
      title: course.title,
      category: course.category,
      description: course.description || "",
    });
  };

  const saveEdit = async () => {
    try {
      await axios.put(
        `${API}/api/courses/${editingCourse.id}`,
        editForm,
        { headers: authHeader() }
      );
      setEditingCourse(null);
      fetchCourses();
      showSuccessNotification("Course updated successfully!");
    } catch {
      alert("Update failed");
    }
  };

  const duplicateCourse = async (course) => {
    try {
      await axios.post(
        `${API}/api/courses`,
        {
          title: `${course.title} (Copy)`,
          category: course.category,
          description: course.description,
        },
        { headers: authHeader() }
      );
      fetchCourses();
      showSuccessNotification("Course duplicated successfully!");
    } catch {
      alert("Failed to duplicate course");
    }
  };

  const previewCourse = (id) => {
    window.open(`/course/${id}`, "_blank");
  };

  const categories = ["All", "Product", "Design", "Growth & Marketing", "Development", "Business"];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || course.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Calculate stats
  const totalCourses = courses.length;
  const totalStudents = courses.reduce((acc, course) => acc + (course.enrolledCount || 0), 0);
  const avgRating = courses.length > 0 
    ? (courses.reduce((acc, course) => acc + (course.rating || 4.8), 0) / courses.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Premium Hero Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-900 dark:via-teal-900 dark:to-cyan-900">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs font-semibold tracking-wide text-emerald-100 uppercase">
              Learning Management
            </p>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Course Management
          </h1>
          <p className="text-emerald-100">
            Create, manage, and track your courses and learning modules
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Success Notification */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg flex items-center gap-3 animate-in slide-in-from-top">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <p className="font-semibold text-green-900 dark:text-green-100">
              {successMessage}
            </p>
          </div>
        )}

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-slate-900">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-foreground">{totalCourses}</p>
            <p className="text-sm text-muted-foreground">Total Courses</p>
          </Card>

          <Card className="p-6 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-slate-900">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-foreground">{totalStudents}</p>
            <p className="text-sm text-muted-foreground">Total Enrollments</p>
          </Card>

          <Card className="p-6 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-slate-900">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <Star className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <TrendingUp className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-foreground">{avgRating}</p>
            <p className="text-sm text-muted-foreground">Average Rating</p>
          </Card>
        </div>

        {/* Search & Filter Bar */}
        <Card className="p-4 mb-6 border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search courses by title or instructor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-slate-300 dark:border-slate-700"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
              >
                <Plus className="w-4 h-4" />
                New Course
              </Button>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                size="sm"
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : ""
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </Card>

        {/* Courses Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredCourses.length === 0 ? (
          <Card className="p-12 text-center border-slate-200 dark:border-slate-800">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-slate-400" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No courses found
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery || selectedCategory !== "All"
                ? "Try adjusting your filters"
                : "Get started by creating your first course"}
            </p>
            {!searchQuery && selectedCategory === "All" && (
              <Button
                onClick={() => setShowCreateModal(true)}
                className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
              >
                <Plus className="w-4 h-4" />
                Create Course
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card
                key={course.id}
                className="group p-6 space-y-4 border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all duration-300 hover:border-emerald-300 dark:hover:border-emerald-700"
              >
                {/* Status & Category */}
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full">
                    <CheckCircle className="w-3 h-3" />
                    Published
                  </span>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                    {course.category}
                  </span>
                </div>

                {/* Course Info */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 min-h-[3.5rem]">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5" />
                    {course.ownerEmail}
                  </p>
                </div>

                {/* Metadata */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    8 weeks
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    {course.enrolledCount || 0}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    {course.rating || 4.8}
                  </span>
                </div>

                {/* Description Preview */}
                {course.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                    {course.description}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEdit(course)}
                    className="gap-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-300 dark:hover:border-emerald-700"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/trainer/course/${course.id}/modules`)}
                    className="gap-2 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Modules
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => previewCourse(course.id)}
                    className="gap-2 hover:bg-purple-50 dark:hover:bg-purple-950/30 hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-300 dark:hover:border-purple-700"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Preview
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => duplicateCourse(course)}
                    className="gap-2 hover:bg-amber-50 dark:hover:bg-amber-950/30 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-300 dark:hover:border-amber-700"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Duplicate
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(course.id)}
                    className="col-span-2 gap-2 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Course
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Course Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl p-6 space-y-5 border-slate-200 dark:border-slate-800 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <Plus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                  Create New Course
                </h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCreateModal(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <form onSubmit={createCourse} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="create-title" className="text-sm font-medium flex items-center gap-2">
                  Course Title
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  id="create-title"
                  placeholder="e.g., Advanced React Development"
                  value={createForm.title}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, title: e.target.value })
                  }
                  required
                  className="border-slate-300 dark:border-slate-700"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="create-category" className="text-sm font-medium flex items-center gap-2">
                  Category
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  id="create-category"
                  placeholder="e.g., Development"
                  value={createForm.category}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, category: e.target.value })
                  }
                  required
                  className="border-slate-300 dark:border-slate-700"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="create-description" className="text-sm font-medium">
                  Description (Optional)
                </label>
                <Textarea
                  id="create-description"
                  rows={4}
                  placeholder="Describe what students will learn in this course..."
                  value={createForm.description}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, description: e.target.value })
                  }
                  className="border-slate-300 dark:border-slate-700 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                >
                  <CheckCircle className="w-4 h-4" />
                  Create Course
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Edit Course Modal */}
      {editingCourse && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl p-6 space-y-5 border-slate-200 dark:border-slate-800 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Edit2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                  Edit Course
                </h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditingCourse(null)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="edit-title" className="text-sm font-medium">
                  Course Title
                </label>
                <Input
                  id="edit-title"
                  placeholder="Course title"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  className="border-slate-300 dark:border-slate-700"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="edit-category" className="text-sm font-medium">
                  Category
                </label>
                <Input
                  id="edit-category"
                  placeholder="Category"
                  value={editForm.category}
                  onChange={(e) =>
                    setEditForm({ ...editForm, category: e.target.value })
                  }
                  className="border-slate-300 dark:border-slate-700"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="edit-description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="edit-description"
                  rows={4}
                  placeholder="Course description"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="border-slate-300 dark:border-slate-700 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={saveEdit}
                  className="flex-1 gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  <CheckCircle className="w-4 h-4" />
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingCourse(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TrainerCourseManagement;