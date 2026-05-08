// src/pages/public/PublicSessionComplete.jsx

import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, Clock, Mail } from "lucide-react";

const PublicSessionComplete = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { duration, bookingId } = location.state || {};

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f1f5f9",
        padding: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ maxWidth: "500px", textAlign: "center" }}>
        {/* ✅ Success Icon */}
        <div style={{ marginBottom: "24px" }}>
          <CheckCircle2 size={80} className="text-green-600 mx-auto" />
        </div>

        {/* ✅ Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Session Complete!
        </h1>
        <p className="text-gray-600 mb-8">
          Thank you for attending the live session.
        </p>

        {/* ✅ Duration Card */}
        {duration !== null && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Clock size={24} className="text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">
                {duration} minutes
              </span>
            </div>
            <p className="text-gray-600">Time attended</p>
          </div>
        )}

        {/* ✅ Certificate Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <Mail size={32} className="text-blue-600 mx-auto mb-2" />
          <p className="text-sm text-gray-700">
            A confirmation email has been sent to your registered email address
            with your attendance certificate.
          </p>
        </div>

        {/* ✅ Actions */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
          >
            Go Home
          </button>
          <button
            onClick={() => window.close()}
            className="px-6 py-3 bg-gray-200 text-gray-900 font-bold rounded-lg hover:bg-gray-300"
          >
            Close
          </button>
        </div>

        {/* ✅ Footer */}
        <p className="text-xs text-gray-500 mt-8">
          Booking ID: {bookingId || "N/A"}
        </p>
      </div>
    </div>
  );
};

export default PublicSessionComplete;
