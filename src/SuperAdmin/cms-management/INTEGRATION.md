# CMS Management — Integration Guide

Complete CMS system for Student Hub, Trainer Hub, and Admin Hub.

---

## 📁 File Structure

```
cms-management/
├── components/
│   ├── CMSHeader.jsx          ✅ (existing)
│   ├── CMSSidebar.jsx         ✅ (existing)
│   ├── ComponentEditor.jsx    ✅ (existing)
│   ├── PageEditor.jsx         ✅ (existing)
│   ├── SectionEditor.jsx      ✅ (existing)
│   ├── MediaManager.jsx       🆕 NEW
│   └── NavigationManager.jsx  🆕 NEW
├── hooks/
│   └── useCMS.js              ✅ (existing)
├── pages/
│   ├── StudentHubCMS.jsx      🆕 NEW
│   ├── TrainerHubCMS.jsx      🆕 NEW
│   └── AdminHubCMS.jsx        🆕 NEW
├── renderer/
│   ├── CMSRenderer.jsx        🆕 NEW
│   ├── HubShell.jsx           🆕 NEW
│   ├── componentRegistry.js   ✅ (existing)
│   ├── iconRegistry.js        ✅ (existing)
│   └── theme.js               ✅ (existing)
├── services/
│   ├── cmsApi.js              ✅ (existing)
│   └── cmsSeed.js             🆕 UPDATED (full seed for all 3 hubs)
├── styles/
│   └── cms.css                ✅ (existing)
├── CMSRoutes.jsx              🆕 NEW
└── superAdminSidebarCMSMenu.js 🆕 NEW
```

---

## 🚀 Step 1 — Seed on App Boot

In your `App.jsx` or `index.jsx`:

```jsx
import { seedCMSData } from "./cms-management/services/cmsSeed";

// Inside App component or before ReactDOM.render:
useEffect(() => {
  seedCMSData(); // runs once, skips if data already exists
}, []);
```

---

## 🛣️ Step 2 — Add Routes

### Option A — Inline Route Array

```jsx
// In your SuperAdmin router file:
import CMS_ROUTES from "./cms-management/CMSRoutes";

<Routes>
  <Route path="/superadmin" element={<SuperAdminLayout />}>
    <Route index element={<Dashboard />} />
    {/* ... your existing routes ... */}
    {CMS_ROUTES}   {/* ← paste here */}
  </Route>
</Routes>
```

### Option B — Nested Routes Component

```jsx
import { CMSRoutesWrapper } from "./cms-management/CMSRoutes";

// In your SuperAdmin layout or router:
<Route path="/superadmin/cms/*" element={<CMSRoutesWrapper />} />
```

---

## 🗂️ Step 3 — Add Sidebar Menu

Open your SuperAdmin sidebar file and add:

```jsx
import { Layers, GraduationCap, UserCheck, ShieldCheck } from "lucide-react";
import { NavLink } from "react-router-dom";

// Inside sidebar JSX — add this block where appropriate:
<div className="sidebar-group">
  <div className="sidebar-group-label">
    <Layers size={14} />
    CMS Management
  </div>

  <NavLink
    to="/superadmin/cms/student-hub"
    className={({ isActive }) => `sidebar-item ${isActive ? "sidebar-item--active" : ""}`}
  >
    <GraduationCap size={16} />
    Student Hub
  </NavLink>

  <NavLink
    to="/superadmin/cms/trainer-hub"
    className={({ isActive }) => `sidebar-item ${isActive ? "sidebar-item--active" : ""}`}
  >
    <UserCheck size={16} />
    Trainer Hub
  </NavLink>

  <NavLink
    to="/superadmin/cms/admin-hub"
    className={({ isActive }) => `sidebar-item ${isActive ? "sidebar-item--active" : ""}`}
  >
    <ShieldCheck size={16} />
    Admin Hub
  </NavLink>
</div>
```

---

## ✅ Features Implemented

| Feature | Status |
|---|---|
| Student Hub CMS page | ✅ |
| Trainer Hub CMS page | ✅ |
| Admin Hub CMS page | ✅ |
| CMSRenderer (dynamic preview) | ✅ |
| HubShell (reusable wrapper) | ✅ |
| MediaManager (upload/browse/delete) | ✅ |
| NavigationManager (per-hub menus) | ✅ |
| Add/Edit/Delete sections | ✅ |
| Add/Edit/Delete components | ✅ |
| Show/Hide section | ✅ |
| Publish/Unpublish section | ✅ |
| Reorder sections (▲▼) | ✅ |
| Show/Hide component | ✅ |
| Page Settings (title, description, publish) | ✅ |
| Live Preview toggle | ✅ |
| Stats bar (section/component counts) | ✅ |
| localStorage persistence | ✅ |
| Seed data for all 3 hubs | ✅ |
| Route integration | ✅ |
| Sidebar menu snippet | ✅ |

---

## 🔧 Dependencies Required

These should already be installed in your project:

```
react-router-dom   (for NavLink, Route, Navigate)
lucide-react       (icons)
```

No additional npm packages needed.

---

## 💡 localStorage Keys Used

| Key | Contents |
|---|---|
| `cms_pages` | Page records |
| `cms_sections` | Section records |
| `cms_components` | Component records |
| `cms_media_library` | Uploaded media (base64) |
| `cms_navigation` | Navigation menus |

To reset everything: `localStorage.clear()` then reload.
