"use client";

import { createTheme } from "@mui/material/styles";

// Brand Color Palette: Cobalt Blue (#405FE2)
// Primary Main:   #405FE2
// Primary Light:  #708bf5
// Primary Dark:   #2843be
// Background:     #f4f7fe (Clean subtle canvas)
// Surface:        #ffffff (Crisp white paper)
// Text Primary:   #0f172a (Deep slate)

export const appTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#405FE2",
      light: "#708bf5",
      dark: "#2843be",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#003c5e",
      light: "#017aa9",
      dark: "#002338",
      contrastText: "#ffffff",
    },
    success: {
      main: "#15803d",
      light: "#22c55e",
      dark: "#166534",
    },
    warning: {
      main: "#d97706",
      light: "#f59e0b",
      dark: "#b45309",
    },
    error: {
      main: "#dc2626",
      light: "#ef4444",
      dark: "#b91c1c",
    },
    background: {
      default: "#f4f7fe",
      paper: "#ffffff",
    },
    text: {
      primary: "#0f172a",
      secondary: "#475569",
    },
    divider: "rgba(64, 95, 226, 0.12)",
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h1: {
      fontWeight: 800,
      letterSpacing: "-0.025em",
      color: "#0f172a",
    },
    h2: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
      color: "#0f172a",
    },
    h3: {
      fontWeight: 700,
      letterSpacing: "-0.015em",
      color: "#0f172a",
    },
    h4: {
      fontWeight: 600,
      color: "#0f172a",
    },
    h5: {
      fontWeight: 600,
      color: "#0f172a",
    },
    h6: {
      fontWeight: 600,
      color: "#0f172a",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "8px 22px",
          boxShadow: "none",
          fontWeight: 600,
          "&:hover": {
            boxShadow: "0 4px 14px rgba(64, 95, 226, 0.28)",
          },
        },
        contained: {
          backgroundColor: "#405FE2",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#2843be",
          },
        },
        outlined: {
          borderColor: "#405FE2",
          color: "#405FE2",
          "&:hover": {
            borderColor: "#2843be",
            backgroundColor: "rgba(64, 95, 226, 0.06)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          border: "1px solid rgba(64, 95, 226, 0.16)",
          borderRadius: 12,
          boxShadow: "0 2px 10px rgba(64, 95, 226, 0.05)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "#ffffff",
          border: "1px solid rgba(64, 95, 226, 0.18)",
          borderRadius: 16,
          boxShadow: "0 20px 40px rgba(15, 23, 42, 0.12)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(244, 247, 254, 0.94)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(64, 95, 226, 0.12)",
          boxShadow: "0 2px 8px rgba(64, 95, 226, 0.04)",
          color: "#0f172a",
        },
      },
    },
  },
});

export const purple90sTheme = appTheme;
