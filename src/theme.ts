import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#800000",
      light: "#a53a3a",
      dark: "#4b0000",
    },
    secondary: {
      main: "#d4a017",
      light: "#f2ce4f",
      dark: "#a6760d",
    },
    background: {
      default: "#120505",
      paper: "rgba(30, 6, 7, 0.88)",
    },
    text: {
      primary: "#fff5ea",
      secondary: "rgba(255, 245, 234, 0.75)",
    },
  },
  shape: {
    borderRadius: 18,
  },
  typography: {
    fontFamily: "'Plus Jakarta Sans', 'Inter', 'Segoe UI', sans-serif",
    h1: {
      fontWeight: 800,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      letterSpacing: 0.3,
      textTransform: "none",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 24,
          paddingBlock: 12,
          boxShadow: "0 12px 30px rgba(128, 0, 0, 0.35)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backdropFilter: "blur(18px)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
        },
      },
    },
  },
});

export default theme;
