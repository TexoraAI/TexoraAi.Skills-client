
import React, { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import searchService from "../services/searchService";

const SearchPage = () => {
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const isStudent = pathname.startsWith("/student");
  const isTrainer = pathname.startsWith("/trainer");
  const isAdmin = pathname.startsWith("/admin");
  const isBusiness = pathname.startsWith("/business");

  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const heading = isStudent
    ? "Student search"
    : isTrainer
    ? "Trainer search"
    : isBusiness
    ? "Business search"
    : isAdmin
    ? "Admin search"
    : "Search";

  const description = isStudent
    ? "Apne courses, assignments, documents aur doubts ko yahan se search karo."
    : isTrainer
    ? "Batches, students, uploaded content aur assessments ko yahan se search karo."
    : isBusiness
    ? "Leads, enrollments, invoices aur campaigns ko yahan search kar sakte hain."
    : isAdmin
    ? "Users, roles, payments aur system logs ko yahan se search karo."
    : "Global search across your LMS.";

  // 🔑 CORE SEARCH (BACKEND MATCHED)
  const runSearch = async (searchKey) => {
    if (!searchKey || !searchKey.trim()) return;

    try {
      setLoading(true);
      setError("");

      const res = await searchService.search(searchKey.trim());

      console.log("SEARCH RESPONSE:", res.data);

      if (Array.isArray(res.data)) {
        setResults(res.data);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error("SEARCH ERROR:", err);
      setError("Search failed");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 AUTO SEARCH FROM URL (?q=java)
  useEffect(() => {
    const q = searchParams.get("q");
    if (q && q !== keyword) {
      setKeyword(q);
      runSearch(q);
    }
  }, [searchParams]);

  // 🔥 KEEP URL IN SYNC
  const handleSearchClick = () => {
    if (!keyword.trim()) return;
    setSearchParams({ q: keyword.trim() });
  };

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-100">{heading}</h1>
        <p className="mt-1 text-sm text-slate-400">{description}</p>
      </div>

      {/* UI UNCHANGED */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type to search..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-80 px-3 py-2 rounded bg-slate-800 text-slate-100"
        />
        <button
          onClick={handleSearchClick}
          className="px-4 py-2 bg-blue-600 rounded text-white"
        >
          Search
        </button>
      </div>

      {loading && <p className="text-slate-400">Searching...</p>}
      {error && <p className="text-red-400">{error}</p>}

      <div className="space-y-2">
        {results.map((item, index) => (
          <div
            key={item.id ?? index}
            className="p-3 rounded bg-slate-800 border border-slate-700"
          >
            <h3 className="font-medium text-slate-100">
              {item.courseTitle || "Untitled"}
            </h3>

            <p className="text-sm text-slate-400">
              {item.courseDescription || ""}
            </p>
          </div>
        ))}
      </div>

      {isStudent && (
        <div className="text-xs text-slate-500">
          <p>Examples:</p>
          <ul className="mt-1 list-disc list-inside space-y-1">
            <li>"React Week 3 notes"</li>
            <li>"Assignment 2 deadline"</li>
            <li>"Doubt: Hooks"</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
