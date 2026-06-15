/**
 * CMSRoutes.jsx
 * Route definitions for CMS Management.
 * Import this inside your SuperAdmin routes and nest it under /superadmin.
 *
 * Usage:
 *   <Routes>
 *     <Route path="/superadmin/*" element={<SuperAdminLayout />}>
 *       {CMSRoutes}
 *     </Route>
 *   </Routes>
 *
 * Or spread inside your existing route config:
 *   import CMSRoutes from "./cms-management/CMSRoutes";
 */

import React from "react";
import { Route, Navigate } from "react-router-dom";
import StudentHubCMS from "./pages/StudentHubCMS";
import TrainerHubCMS from "./pages/TrainerHubCMS";
import AdminHubCMS from "./pages/AdminHubCMS";

/**
 * CMS_ROUTES — array of <Route> elements.
 * Nest these inside your <Routes> or <Route> wrapper.
 *
 * Base path assumed: /superadmin/cms
 */
const CMS_ROUTES = [
  <Route
    key="cms-default"
    path="cms"
    element={<Navigate to="cms/student-hub" replace />}
  />,
  <Route
    key="cms-student-hub"
    path="cms/student-hub"
    element={<StudentHubCMS />}
  />,
  <Route
    key="cms-trainer-hub"
    path="cms/trainer-hub"
    element={<TrainerHubCMS />}
  />,
  <Route
    key="cms-admin-hub"
    path="cms/admin-hub"
    element={<AdminHubCMS />}
  />,
];

export default CMS_ROUTES;

// ─── Alternative: Component-based wrapper ────────────────────────────────────
// If your router uses a nested <Routes> inside SuperAdmin layout:

import { Routes } from "react-router-dom";

/**
 * CMSRoutesWrapper — standalone <Routes> block.
 * Mount this anywhere you want the CMS routes active.
 *
 * Example:
 *   <CMSRoutesWrapper />   (works inside a route with path="/superadmin/cms/*")
 */
export const CMSRoutesWrapper = () => (
  <Routes>
    <Route index element={<Navigate to="student-hub" replace />} />
    <Route path="student-hub" element={<StudentHubCMS />} />
    <Route path="trainer-hub" element={<TrainerHubCMS />} />
    <Route path="admin-hub" element={<AdminHubCMS />} />
  </Routes>
);
