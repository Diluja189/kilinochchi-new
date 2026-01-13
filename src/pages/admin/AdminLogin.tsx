import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";

export default function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
      return setErr(error.message);
    }

    setLoading(false);
    nav("/admin/enquiries");
  };

  // ✅ Input Gradient + Autofill fix (no white pill)
  const inputSx = {
    "& .MuiOutlinedInput-root": {
      height: 54,
      borderRadius: 999,
      color: "#F8FAFC",
      background:
        "linear-gradient(135deg, rgba(15,23,42,0.70), rgba(2,6,23,0.55))",
      "& fieldset": { borderColor: "rgba(255,255,255,0.14)" },
      "&:hover fieldset": { borderColor: "rgba(245,158,11,0.26)" },
      "&.Mui-focused fieldset": { borderColor: "rgba(245,158,11,0.42)" },
    },
    "& .MuiOutlinedInput-input": {
      height: "54px",
      padding: "0 18px",
      display: "flex",
      alignItems: "center",
      boxSizing: "border-box",
      color: "#F8FAFC",
    },
    "& .MuiInputAdornment-root": { color: "rgba(226,232,240,0.75)" },
    "& .MuiInputLabel-root": { color: "rgba(226,232,240,0.72)" },
    "& .MuiInputLabel-root.Mui-focused": { color: "rgba(245,158,11,0.85)" },
    "& input::placeholder": { color: "rgba(226,232,240,0.45)", opacity: 1 },

    // ✅ Chrome autofill override (prevents white/blue fill)
    "& input:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 1000px rgba(15,23,42,0.75) inset !important",
      WebkitTextFillColor: "#F8FAFC !important",
      caretColor: "#F8FAFC",
      borderRadius: "999px",
      transition: "background-color 9999s ease-out 0s",
    },
    "& input:-webkit-autofill:hover": {
      WebkitBoxShadow: "0 0 0 ffective-1000px rgba(15,23,42,0.75) inset !important",
    },
    "& input:-webkit-autofill:focus": {
      WebkitBoxShadow: "0 0 0 1000px rgba(15,23,42,0.75) inset !important",
    },
  } as const;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        bgcolor: "#0b1220",
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, sm: 5 }, // ✅ card height feel increased
            borderRadius: 4,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 18px 50px rgba(0,0,0,0.45)",
          }}
        >
          <Box sx={{ mb: 2.5 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 950,
                color: "#F8FAFC",
                letterSpacing: 0.2,
              }}
            >
              Admin Login
            </Typography>
            <Typography sx={{ mt: 0.8, fontSize: 13, color: "rgba(226,232,240,0.70)" }}>
              Use your admin credentials to continue
            </Typography>
          </Box>

          <form onSubmit={onSubmit}>
            <TextField
              label="Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="admin@company.com"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlineRoundedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ ...inputSx, mb: 2.2 }}
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="Enter your password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockRoundedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ ...inputSx, mb: 2.4 }}
            />

            {err && (
              <Box
                sx={{
                  mb: 2.2,
                  p: 1.1,
                  borderRadius: 2,
                  border: "1px solid rgba(239,68,68,0.25)",
                  background: "rgba(239,68,68,0.10)",
                }}
              >
                <Typography color="error" variant="body2" sx={{ fontWeight: 700 }}>
                  {err}
                </Typography>
              </Box>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.25,
                borderRadius: 3,
                fontWeight: 950,
                textTransform: "none",
                color: "#0b1220",
                background:
                  "linear-gradient(135deg, rgba(245,158,11,0.95), rgba(185,28,28,0.85))",
                boxShadow: "0 14px 34px rgba(0,0,0,0.35)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, rgba(245,158,11,1), rgba(185,28,28,0.95))",
                  transform: "translateY(-1px)",
                  boxShadow: "0 18px 44px rgba(0,0,0,0.42)",
                },
                "&:disabled": {
                  background: "rgba(148,163,184,0.20)",
                  color: "rgba(248,250,252,0.70)",
                },
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

            <Typography
              sx={{
                mt: 2.2,
                textAlign: "center",
                fontSize: 12,
                color: "rgba(226,232,240,0.55)",
              }}
            >
              Protected area • Admin only
            </Typography>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
