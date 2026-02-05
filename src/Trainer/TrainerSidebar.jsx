import React from "react";
import { NavLink } from "react-router-dom";

const baseLink =
  "flex items-center px-4 py-2 text-sm rounded-md mb-1 transition-colors";

const inactive = "text-muted-foreground hover:text-foreground hover:bg-accent";

const active =
  "bg-accent text-foreground font-medium border-l-4 border-primary";

const SectionLabel = ({ children }) => (
  <div className="px-4 mt-4 mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
    {children}
  </div>
);

const TrainerSidebar = () => {
  return (
    <nav className="flex-1 py-4 text-sm">
      <SectionLabel>Trainer</SectionLabel>

      <NavLink
        to="/trainer"
        end
        className={({ isActive }) =>
          `${baseLink} ${isActive ? active : inactive}`
        }
      >
        Dashboard
      </NavLink>

      <SectionLabel>Batch Management</SectionLabel>

      <NavLink
        to="/trainer/batches"
        className={({ isActive }) =>
          `${baseLink} ${isActive ? active : inactive}`
        }
      >
        Batches
      </NavLink>

      <SectionLabel>Content Management</SectionLabel>

      <NavLink
        to="/trainer/upload-videos"
        className={({ isActive }) =>
          `${baseLink} ${isActive ? active : inactive}`
        }
      >
        Upload Videos
      </NavLink>

      <NavLink
        to="/trainer/upload-documents"
        className={({ isActive }) =>
          `${baseLink} ${isActive ? active : inactive}`
        }
      >
        Upload Documents
      </NavLink>

      <NavLink
        to="/trainer/create-quiz"
        className={({ isActive }) =>
          `${baseLink} ${isActive ? active : inactive}`
        }
      >
        Create Quiz
      </NavLink>

      <NavLink
        to="/trainer/create-assignments"
        className={({ isActive }) =>
          `${baseLink} ${isActive ? active : inactive}`
        }
      >
        Create Assignments
      </NavLink>

      <SectionLabel>Reports & Analytics</SectionLabel>

      <NavLink
        to="/trainer/student-reports"
        className={({ isActive }) =>
          `${baseLink} ${isActive ? active : inactive}`
        }
      >
        <NavLink
          to="/trainer/course-management"
          className={({ isActive }) =>
            `${baseLink} ${isActive ? active : inactive}`
          }
        >
          Course Management
        </NavLink>
        Student Reports
      </NavLink>

      <NavLink
        to="/trainer/batch-reports"
        className={({ isActive }) =>
          `${baseLink} ${isActive ? active : inactive}`
        }
      >
        Batch Reports
      </NavLink>

      <NavLink
        to="/trainer/performance"
        className={({ isActive }) =>
          `${baseLink} ${isActive ? active : inactive}`
        }
      >
        Performance Analysis
      </NavLink>

      <SectionLabel>AI & Settings</SectionLabel>

      <NavLink
        to="/trainer/ai-usage"
        className={({ isActive }) =>
          `${baseLink} ${isActive ? active : inactive}`
        }
      >
        My AI Usage
      </NavLink>

      <NavLink
        to="/trainer/settings"
        className={({ isActive }) =>
          `${baseLink} ${isActive ? active : inactive}`
        }
      >
        Settings
      </NavLink>
    </nav>
  );
};

export default TrainerSidebar;
