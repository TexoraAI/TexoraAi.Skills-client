/**
 * theme.js — CMS UI theme tokens.
 * Used within CMS Management pages only.
 * Does NOT affect Student/Trainer/Admin Hubs.
 */

export const theme = {
  colors: {
    primary: "var(--cms-primary)",
    primaryHover: "var(--cms-primary-hover)",

    success: "var(--cms-success)",
    warning: "var(--cms-warning)",
    danger: "var(--cms-danger)",

    surface: "var(--cms-surface)",
    surfaceLight: "var(--cms-surface-2)",

    border: "var(--cms-border)",

    textPrimary: "var(--cms-text)",
    textSecondary: "var(--cms-text-muted)",

    badge: {
      published: {
        bg: "var(--cms-success-soft)",
        text: "var(--cms-success)",
      },

      unpublished: {
        bg: "var(--cms-danger-soft)",
        text: "var(--cms-danger)",
      },

      hidden: {
        bg: "var(--cms-primary-soft)",
        text: "var(--cms-primary)",
      },
    },
  },

  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },

  radius: {
    sm: "6px",
    md: "10px",
    lg: "16px",
  },

  font: {
    size: {
      xs: "11px",
      sm: "13px",
      md: "14px",
      lg: "16px",
      xl: "20px",
      xxl: "24px",
    },
  },
};

export default theme;