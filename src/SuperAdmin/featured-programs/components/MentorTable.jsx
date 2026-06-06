import React from "react";
import {
  Eye,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Star,
} from "lucide-react";

const MentorTable = ({ mentors, onView, onEdit, onDelete, onToggleStatus }) => {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={13}
        className={
          i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }
      />
    ));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (!mentors || mentors.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
        <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star size={28} className="text-purple-400" />
        </div>
        <p className="text-gray-500 font-medium">No mentor feedbacks found</p>
        <p className="text-gray-400 text-sm mt-1">
          Add a new feedback to get started
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-5 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                Profile
              </th>
              <th className="text-left px-5 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                Name
              </th>
              <th className="text-left px-5 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                Designation
              </th>
              <th className="text-left px-5 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                Company
              </th>
              <th className="text-left px-5 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                Rating
              </th>
              <th className="text-left px-5 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wider max-w-xs">
                Feedback
              </th>
              <th className="text-left px-5 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-5 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                Created
              </th>
              <th className="text-left px-5 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mentors.map((mentor) => (
              <tr
                key={mentor.id}
                className="hover:bg-gray-50/60 transition-colors duration-150"
              >
                {/* Profile Image */}
                <td className="px-5 py-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center flex-shrink-0">
                    {mentor.profileImage ? (
                      <img
                        src={mentor.profileImage}
                        alt={mentor.candidateName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-semibold text-sm">
                        {mentor.candidateName?.charAt(0)?.toUpperCase() || "M"}
                      </span>
                    )}
                  </div>
                </td>

                {/* Name */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800 whitespace-nowrap">
                      {mentor.candidateName}
                    </span>
                    {mentor.isFeatured && (
                      <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-semibold rounded-full uppercase tracking-wide">
                        Featured
                      </span>
                    )}
                  </div>
                </td>

                {/* Designation */}
                <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                  {mentor.designation}
                </td>

                {/* Company */}
                <td className="px-5 py-4">
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium whitespace-nowrap">
                    {mentor.company}
                  </span>
                </td>

                {/* Rating */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1">
                    {renderStars(mentor.rating)}
                    <span className="ml-1 text-xs text-gray-500 font-medium">
                      {mentor.rating}/5
                    </span>
                  </div>
                </td>

                {/* Feedback */}
                <td className="px-5 py-4 max-w-xs">
                  <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed">
                    {mentor.feedbackMessage}
                  </p>
                </td>

                {/* Status */}
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      mentor.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        mentor.status === "active"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    />
                    {mentor.status === "active" ? "Active" : "Inactive"}
                  </span>
                </td>

                {/* Created Date */}
                <td className="px-5 py-4 text-gray-500 text-xs whitespace-nowrap">
                  {formatDate(mentor.createdAt)}
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onView(mentor)}
                      title="View"
                      className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-150"
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      onClick={() => onEdit(mentor)}
                      title="Edit"
                      className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-150"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => onToggleStatus(mentor)}
                      title={
                        mentor.status === "active"
                          ? "Deactivate"
                          : "Activate"
                      }
                      className={`p-1.5 rounded-lg transition-all duration-150 ${
                        mentor.status === "active"
                          ? "text-green-600 hover:text-orange-500 hover:bg-orange-50"
                          : "text-gray-400 hover:text-green-600 hover:bg-green-50"
                      }`}
                    >
                      {mentor.status === "active" ? (
                        <ToggleRight size={15} />
                      ) : (
                        <ToggleLeft size={15} />
                      )}
                    </button>
                    <button
                      onClick={() => onDelete(mentor)}
                      title="Delete"
                      className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-150"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MentorTable;