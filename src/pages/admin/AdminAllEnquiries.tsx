import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
  Popover,
  IconButton,
} from "@mui/material";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

/* =========================================
   Types
========================================= */
type Row = {
  id: string;
  created_at?: string;
  name?: string;
  phone?: string;
  email?: string;
  course?: string;
  message?: string;

  company?: string;
  organisation?: string;
  investment_range?: string;
  range?: string;

  [key: string]: any;
};

const TABLES = {
  admissions: "admissions_enquiries",
  angel: "angel_investment_enquiries",
  seed: "seed_funding_enquiries",
  remote: "remote_employment_enquiries",
} as const;

type TabKey = keyof typeof TABLES;

/* =========================================
   Helpers
========================================= */
function safeText(v: any) {
  return String(v ?? "").trim();
}

function pickCompany(r: Row) {
  return (
    safeText(r.company) ||
    safeText(r.organisation) ||
    safeText(r.company_name) ||
    safeText(r.organization) ||
    safeText(r.organisation_name) ||
    "-"
  );
}

function pickRange(r: Row) {
  return (
    safeText(r.investment_range) ||
    safeText(r.range) ||
    safeText(r.approximate_investment_range) ||
    safeText(r.investmentRange) ||
    "-"
  );
}

function looksLikeCompany(r: Row) {
  return Boolean(
    safeText(r.company) ||
      safeText(r.organisation) ||
      safeText(r.company_name) ||
      safeText(r.organization) ||
      safeText(r.organisation_name)
  );
}

function looksLikeRange(r: Row) {
  return Boolean(
    safeText(r.investment_range) ||
      safeText(r.range) ||
      safeText(r.approximate_investment_range) ||
      safeText(r.investmentRange)
  );
}

/* =========================================
   LIGHTER Dark-Brown Theme ✅
========================================= */
const COLORS = {
  text: "#FFF7ED",
  subText: "rgba(255,247,237,0.82)",

  paper: "rgba(44,29,20,0.62)",
  paperStrong: "rgba(44,29,20,0.78)",

  border: "rgba(255,247,237,0.14)",
  border2: "rgba(255,247,237,0.22)",
  borderHover: "rgba(255,247,237,0.30)",

  shadow: "0 16px 48px rgba(0,0,0,0.34)",
  shadowHover: "0 20px 62px rgba(0,0,0,0.42)",

  dpHeader: "#FFF7ED",
  dpBg: "rgba(34,23,16,0.92)",
  dpCellHover: "rgba(255,247,237,0.07)",
  dpSelected: "#C26A1A",
  dpSelectedText: "#1B120C",
  dpMuted: "rgba(255,247,237,0.60)",

  accent: "#B45309",
  accent2: "#9A3412",
  danger: "#FB7185",
};

/* =========================================
   Date helpers
========================================= */
const pad2 = (n: number) => String(n).padStart(2, "0");
const monthShort = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const weekShort = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function toDDMMYYYY(d: Date) {
  return `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}.${d.getFullYear()}`;
}

function parseCreatedAt(v?: string) {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function filterBySelectedDate(rows: Row[], selected: Date | null) {
  if (!selected) return rows;
  return rows.filter((r) => {
    const d = parseCreatedAt(r.created_at);
    if (!d) return false;
    return isSameDay(d, selected);
  });
}

/* =========================================
   Mini calendar (no MUI X)
   ✅ HEIGHT REDUCED (kurachchu)
========================================= */
function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
function addMonths(d: Date, delta: number) {
  return new Date(d.getFullYear(), d.getMonth() + delta, 1);
}
function clampToMonthDay(view: Date, day: number) {
  const last = endOfMonth(view).getDate();
  const dd = Math.min(Math.max(day, 1), last);
  return new Date(view.getFullYear(), view.getMonth(), dd);
}
function sameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function MiniDatePicker({
  selected,
  onSelect,
  onClear,
}: {
  selected: Date | null;
  onSelect: (d: Date) => void;
  onClear: () => void;
}) {
  const initialView = selected
    ? new Date(selected.getFullYear(), selected.getMonth(), 1)
    : startOfMonth(new Date());

  const [view, setView] = useState<Date>(initialView);

  useEffect(() => {
    if (selected) setView(new Date(selected.getFullYear(), selected.getMonth(), 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.getFullYear(), selected?.getMonth()]);

  const grid = useMemo(() => {
    const first = startOfMonth(view);
    const last = endOfMonth(view);
    const firstDow = first.getDay();
    const totalDays = last.getDate();

    const cells: Array<{ day: number; inMonth: boolean; date: Date }> = [];

    const prevMonthEnd = new Date(view.getFullYear(), view.getMonth(), 0);
    const prevDays = prevMonthEnd.getDate();
    for (let i = 0; i < firstDow; i++) {
      const day = prevDays - (firstDow - 1 - i);
      const date = new Date(view.getFullYear(), view.getMonth() - 1, day);
      cells.push({ day, inMonth: false, date });
    }

    for (let d = 1; d <= totalDays; d++) {
      const date = new Date(view.getFullYear(), view.getMonth(), d);
      cells.push({ day: d, inMonth: true, date });
    }

    while (cells.length < 42) {
      const nextDay = cells.length - (firstDow + totalDays) + 1;
      const date = new Date(view.getFullYear(), view.getMonth() + 1, nextDay);
      cells.push({ day: nextDay, inMonth: false, date });
    }

    return cells;
  }, [view]);

  const today = new Date();
  const selectedStr = selected ? toDDMMYYYY(selected) : "All Dates";
  const inputText = selected
    ? `${pad2(selected.getMonth() + 1)}/${pad2(selected.getDate())}/${selected.getFullYear()}`
    : "";

  return (
    <Box sx={{ width: 230 }}>
      {/* Input (compact) */}
      <Box
        sx={{
          border: `1px solid ${COLORS.border}`,
          borderRadius: 1.3,
          overflow: "hidden",
          background: COLORS.dpBg,
          boxShadow: "0 10px 20px rgba(0,0,0,0.32)",
        }}
      >
        <Stack direction="row" alignItems="center" sx={{ height: 28 }}>
          <Box
            sx={{
              flex: 1,
              px: 0.9,
              fontWeight: 900,
              color: COLORS.text,
              fontSize: 11,
            }}
          >
            {inputText}
          </Box>

          <Box
            sx={{
              width: 32,
              height: 28,
              display: "grid",
              placeItems: "center",
              background: "linear-gradient(135deg, rgba(180,83,9,0.90), rgba(154,52,18,0.90))",
              color: "#fff",
              borderLeft: `1px solid ${COLORS.border}`,
            }}
          >
            <CalendarMonthRoundedIcon sx={{ fontSize: 15 }} />
          </Box>
        </Stack>
      </Box>

      {/* Calendar card (✅ reduced height by smaller paddings/cells/footer) */}
      <Box
        sx={{
          mt: 0.7,
          borderRadius: 1.3,
          background: COLORS.dpBg,
          border: `1px solid ${COLORS.border}`,
          boxShadow: "0 14px 34px rgba(0,0,0,0.42)",
          overflow: "hidden",
        }}
      >
        {/* Month header (compact) */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            px: 0.7,
            py: 0.45,
            borderBottom: `1px solid ${COLORS.border}`,
            background: "rgba(255,247,237,0.04)",
          }}
        >
          <Button
            onClick={() => {
              const next = addMonths(view, -1);
              setView(next);
              if (selected && !sameMonth(selected, next)) {
                onSelect(clampToMonthDay(next, selected.getDate()));
              }
            }}
            sx={{
              minWidth: 22,
              width: 22,
              height: 22,
              borderRadius: 1.0,
              color: COLORS.text,
              background: "transparent",
              "&:hover": { background: COLORS.dpCellHover },
              fontWeight: 950,
              p: 0,
              lineHeight: 1,
            }}
          >
            ‹
          </Button>

          <Typography sx={{ fontWeight: 950, color: COLORS.dpHeader, fontSize: 11 }}>
            {monthShort[view.getMonth()]} {view.getFullYear()}
          </Typography>

          <Button
            onClick={() => {
              const next = addMonths(view, 1);
              setView(next);
              if (selected && !sameMonth(selected, next)) {
                onSelect(clampToMonthDay(next, selected.getDate()));
              }
            }}
            sx={{
              minWidth: 22,
              width: 22,
              height: 22,
              borderRadius: 1.0,
              color: COLORS.text,
              background: "transparent",
              "&:hover": { background: COLORS.dpCellHover },
              fontWeight: 950,
              p: 0,
              lineHeight: 1,
            }}
          >
            ›
          </Button>
        </Stack>

        {/* Week header + days (compact) */}
        <Box sx={{ px: 0.7, pt: 0.45 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 0.25,
              mb: 0.25,
            }}
          >
            {weekShort.map((w) => (
              <Typography
                key={w}
                sx={{
                  textAlign: "center",
                  fontSize: 9,
                  fontWeight: 900,
                  color: COLORS.dpMuted,
                  py: 0.2,
                }}
              >
                {w}
              </Typography>
            ))}
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 0.25,
              pb: 0.55, // ✅ reduced
            }}
          >
            {grid.map((c, idx) => {
              const isSel = selected ? isSameDay(c.date, selected) : false;
              const isToday = isSameDay(c.date, today);

              return (
                <Button
                  key={idx}
                  onClick={() => onSelect(new Date(c.date))}
                  sx={{
                    minWidth: 0,
                    height: 21, // ✅ reduced cell height
                    borderRadius: 1.1,
                    p: 0,
                    fontWeight: 900,
                    fontSize: 10,
                    lineHeight: 1,
                    color: isSel
                      ? COLORS.dpSelectedText
                      : c.inMonth
                      ? COLORS.text
                      : "rgba(255,247,237,0.35)",
                    background: isSel ? COLORS.dpSelected : "transparent",
                    boxShadow: isSel ? "0 6px 10px rgba(194,106,26,0.20)" : "none",
                    border: isToday && !isSel ? "1px solid rgba(194,106,26,0.40)" : "1px solid transparent",
                    "&:hover": { background: isSel ? COLORS.dpSelected : COLORS.dpCellHover },
                  }}
                >
                  {c.day}
                </Button>
              );
            })}
          </Box>
        </Box>

        {/* Footer (✅ tighter) */}
        <Box sx={{ px: 0.75, py: 0.55, borderTop: `1px solid ${COLORS.border}` }}>
          <Typography sx={{ fontWeight: 800, color: COLORS.subText, fontSize: 10 }}>
            Current: <span style={{ color: COLORS.text }}>{selectedStr}</span>
          </Typography>

          <Stack direction="row" justifyContent="flex-end" spacing={0.6} sx={{ mt: 0.45 }}>
            <Button
              onClick={() => onSelect(new Date())}
              sx={{
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 950,
                fontSize: 10.5,
                color: COLORS.text,
                background: "rgba(255,247,237,0.07)",
                border: `1px solid ${COLORS.border}`,
                boxShadow: "0 8px 14px rgba(0,0,0,0.22)",
                px: 1.2,
                py: 0.25,
                minHeight: 22, // ✅ smaller button height
                "&:hover": { background: "rgba(255,247,237,0.11)", borderColor: COLORS.border2 },
              }}
            >
              Today
            </Button>

            <Button
              onClick={onClear}
              sx={{
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 950,
                fontSize: 10.5,
                color: "#FFE4D2",
                background: "rgba(251,113,133,0.10)",
                border: "1px solid rgba(251,113,133,0.22)",
                boxShadow: "0 8px 14px rgba(0,0,0,0.22)",
                px: 1.2,
                py: 0.25,
                minHeight: 22, // ✅ smaller button height
                "&:hover": { background: "rgba(251,113,133,0.14)" },
              }}
            >
              Clear
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

/* =========================================
   Row Card
========================================= */
function RowCard({
  r,
  onDelete,
  deleting,
}: {
  r: Row;
  onDelete: (id: string) => void;
  deleting?: boolean;
}) {
  const title = `${r.name || "-"}${r.phone ? ` — ${r.phone}` : ""}`;

  return (
    <Box
      sx={{
        p: { xs: 2.4, md: 3.0 },
        borderRadius: 3.2,
        border: `1px solid ${COLORS.border}`,
        background: COLORS.paper,
        backdropFilter: "blur(14px)",
        boxShadow: COLORS.shadow,
        transition: "0.25s",
        "&:hover": {
          transform: "translateY(-2px)",
          borderColor: COLORS.borderHover,
          boxShadow: COLORS.shadowHover,
        },
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        spacing={1}
        sx={{ mb: 1 }}
      >
        <Typography sx={{ fontWeight: 950, letterSpacing: 0.2, color: COLORS.text }}>
          {title}
        </Typography>

        <Button
          onClick={() => onDelete(r.id)}
          disabled={deleting}
          startIcon={<DeleteOutlineRoundedIcon />}
          sx={{
            borderRadius: 999,
            px: 1.8,
            py: 0.7,
            fontWeight: 900,
            textTransform: "none",
            color: "#FFE4D2",
            background: "rgba(251,113,133,0.10)",
            border: "1px solid rgba(251,113,133,0.22)",
            "&:hover": {
              background: "rgba(251,113,133,0.14)",
              borderColor: "rgba(251,113,133,0.30)",
            },
            "&:disabled": { opacity: 0.6 },
          }}
        >
          {deleting ? "Deleting..." : "Delete"}
        </Button>
      </Stack>

      <Typography sx={{ color: COLORS.subText, mb: 0.8 }}>{r.email || "-"}</Typography>

      {r.course ? (
        <Chip
          size="small"
          label={r.course}
          sx={{
            mb: 1.2,
            mr: 1,
            color: COLORS.text,
            background: "rgba(194,106,26,0.16)",
            border: "1px solid rgba(194,106,26,0.26)",
            fontWeight: 800,
            "& .MuiChip-label": { whiteSpace: "nowrap" },
          }}
        />
      ) : null}

      <Stack spacing={0.5} sx={{ mb: r.message ? 1.2 : 0 }}>
        {looksLikeCompany(r) ? (
          <Typography sx={{ color: COLORS.subText }}>
            <b style={{ color: COLORS.text }}>Company:</b> {pickCompany(r)}
          </Typography>
        ) : null}

        {looksLikeRange(r) ? (
          <Typography sx={{ color: COLORS.subText }}>
            <b style={{ color: COLORS.text }}>Range:</b> {pickRange(r)}
          </Typography>
        ) : null}
      </Stack>

      {r.message ? (
        <Box
          sx={{
            mt: 0.5,
            p: { xs: 1.4, md: 1.6 },
            borderRadius: 2.4,
            border: `1px solid ${COLORS.border}`,
            background: COLORS.paperStrong,
          }}
        >
          <Typography sx={{ color: COLORS.text, lineHeight: 1.65 }}>{r.message}</Typography>
        </Box>
      ) : null}
    </Box>
  );
}

/* =========================================
   Page
========================================= */
export default function AdminAllEnquiries() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const [activeTab, setActiveTab] = useState<TabKey>("admissions");

  const [admissions, setAdmissions] = useState<Row[]>([]);
  const [angel, setAngel] = useState<Row[]>([]);
  const [seed, setSeed] = useState<Row[]>([]);
  const [remote, setRemote] = useState<Row[]>([]);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [dateAnchor, setDateAnchor] = useState<HTMLElement | null>(null);

  const admissionsRef = useRef<HTMLDivElement | null>(null);
  const angelRef = useRef<HTMLDivElement | null>(null);
  const seedRef = useRef<HTMLDivElement | null>(null);
  const remoteRef = useRef<HTMLDivElement | null>(null);

  const scrollTo = (key: TabKey) => {
    const map = { admissions: admissionsRef, angel: angelRef, seed: seedRef, remote: remoteRef } as const;
    map[key].current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const filtered = useMemo(() => {
    return {
      admissions: filterBySelectedDate(admissions, selectedDate),
      angel: filterBySelectedDate(angel, selectedDate),
      seed: filterBySelectedDate(seed, selectedDate),
      remote: filterBySelectedDate(remote, selectedDate),
    };
  }, [admissions, angel, seed, remote, selectedDate]);

  const counts = useMemo(
    () => ({
      admissions: filtered.admissions.length,
      angel: filtered.angel.length,
      seed: filtered.seed.length,
      remote: filtered.remote.length,
    }),
    [filtered]
  );

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await supabase.auth.signOut();
      navigate("/admin/login", { replace: true });
    } catch (e) {
      console.error("Logout error:", e);
      alert("Logout failed. Try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  const fetchTable = async (table: string) => {
    const { data, error } = await supabase.from(table).select("*").order("created_at", { ascending: false });
    if (error) {
      console.error(`Fetch error for ${table}:`, error);
      return [] as Row[];
    }
    return (data || []) as Row[];
  };

  const loadAll = async () => {
    const [a, b, c, d] = await Promise.all([
      fetchTable(TABLES.admissions),
      fetchTable(TABLES.angel),
      fetchTable(TABLES.seed),
      fetchTable(TABLES.remote),
    ]);
    setAdmissions(a);
    setAngel(b);
    setSeed(c);
    setRemote(d);
  };

  const deleteRowByActiveTab = async (id: string) => {
    const table = TABLES[activeTab];
    const ok = window.confirm("Are you sure you want to delete this enquiry?");
    if (!ok) return;

    try {
      setDeletingId(id);
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) {
        console.error("Delete error:", error);
        alert("Delete failed. Check console.");
        return;
      }
      if (activeTab === "admissions") setAdmissions((p) => p.filter((x) => x.id !== id));
      else if (activeTab === "angel") setAngel((p) => p.filter((x) => x.id !== id));
      else if (activeTab === "seed") setSeed((p) => p.filter((x) => x.id !== id));
      else setRemote((p) => p.filter((x) => x.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);

      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        setAdmissions([]);
        setAngel([]);
        setSeed([]);
        setRemote([]);
        setLoading(false);
        navigate("/admin/login", { replace: true });
        return;
      }

      await loadAll();
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  useEffect(() => {
    scrollTo(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const sectionBg = {
    border: `1px solid ${COLORS.border}`,
    background: "rgba(44,29,20,0.46)",
    borderRadius: 4,
    p: { xs: 2.2, md: 3.0 },
    boxShadow: "0 16px 44px rgba(0,0,0,0.28)",
  } as const;

  const dateLabel = selectedDate ? toDDMMYYYY(selectedDate) : "All Dates";

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "grid",
          placeItems: "center",
          color: COLORS.text,
          background:
            "radial-gradient(1100px 700px at 18% 8%, rgba(180,83,9,0.22), transparent 55%), radial-gradient(900px 600px at 90% 20%, rgba(154,52,18,0.18), transparent 55%), linear-gradient(120deg, #1A120D, #2C1D14)",
        }}
      >
        <Typography sx={{ opacity: 0.9, fontWeight: 900 }}>Loading enquiries...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        color: COLORS.text,
        background:
          "radial-gradient(1100px 700px at 18% 8%, rgba(180,83,9,0.22), transparent 55%), radial-gradient(900px 600px at 90% 20%, rgba(154,52,18,0.18), transparent 55%), linear-gradient(120deg, #1A120D, #2C1D14)",
        py: { xs: 8, md: 10 },
      }}
    >
      <Container maxWidth="xl">
        {/* Sticky Top Header */}
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 5,
            pb: 2,
            pt: 2,
            mb: 2,
            backdropFilter: "blur(18px)",
            background: "rgba(44,29,20,0.55)",
            borderRadius: 4,
            border: `1px solid ${COLORS.border}`,
            boxShadow: "0 18px 54px rgba(0,0,0,0.36)",
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", md: "center" }}
            justifyContent="space-between"
            sx={{ px: { xs: 2, md: 3 } }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 980,
                  letterSpacing: 0.2,
                  lineHeight: 1.1,
                  color: COLORS.text,
                }}
              >
                Admin Enquiries
              </Typography>

              <Typography sx={{ color: COLORS.subText, mt: 0.6, fontWeight: 900 }}>
                Filter: <span style={{ color: COLORS.text }}>{dateLabel}</span>
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.2} alignItems="center" justifyContent="flex-end">
              <Button
                onClick={(e) => setDateAnchor(e.currentTarget)}
                startIcon={<CalendarMonthRoundedIcon sx={{ fontSize: 18 }} />}
                endIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: 18 }} />}
                sx={{
                  borderRadius: 999,
                  px: 1.5,
                  py: 0.65,
                  minHeight: 36,
                  fontWeight: 950,
                  fontSize: 13,
                  textTransform: "none",
                  color: COLORS.text,
                  background: "rgba(255,247,237,0.08)",
                  border: `1px solid ${COLORS.border}`,
                  boxShadow: "0 12px 28px rgba(0,0,0,0.28)",
                  "&:hover": {
                    background: "rgba(255,247,237,0.12)",
                    borderColor: COLORS.borderHover,
                    boxShadow: "0 16px 34px rgba(0,0,0,0.38)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                {dateLabel}
              </Button>

              <Button
                onClick={handleLogout}
                disabled={loggingOut}
                startIcon={<LogoutRoundedIcon />}
                sx={{
                  borderRadius: 999,
                  px: 2.1,
                  py: 0.8,
                  minHeight: 36,
                  fontWeight: 950,
                  textTransform: "none",
                  color: COLORS.text,
                  background: "linear-gradient(135deg, rgba(180,83,9,0.55), rgba(154,52,18,0.50))",
                  border: `1px solid ${COLORS.border}`,
                  boxShadow: "0 12px 28px rgba(0,0,0,0.28)",
                  "&:hover": {
                    background: "linear-gradient(135deg, rgba(180,83,9,0.70), rgba(154,52,18,0.65))",
                    boxShadow: "0 16px 34px rgba(0,0,0,0.38)",
                    transform: "translateY(-1px)",
                  },
                  "&:disabled": {
                    background: "rgba(255,247,237,0.10)",
                    color: "rgba(255,247,237,0.55)",
                    border: `1px solid ${COLORS.border}`,
                  },
                }}
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </Button>
            </Stack>
          </Stack>

          <Divider sx={{ my: 2, borderColor: "rgba(255,247,237,0.12)" }} />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ px: { xs: 2, md: 3 }, pb: 0.5 }}>
            {(
              [
                ["admissions", "Admissions Desk", counts.admissions],
                ["angel", "Angel Investment", counts.angel],
                ["seed", "Seed Funding", counts.seed],
                ["remote", "Remote Employment", counts.remote],
              ] as Array<[TabKey, string, number]>
            ).map(([key, label, count]) => (
              <Chip
                key={key}
                label={`${label} (${count})`}
                onClick={() => setActiveTab(key)}
                sx={{
                  cursor: "pointer",
                  fontWeight: 950,
                  borderRadius: 999,
                  px: 1.2,
                  py: 2.2,
                  color: COLORS.text,
                  background: activeTab === key ? "rgba(194,106,26,0.26)" : "rgba(255,247,237,0.08)",
                  border: activeTab === key ? "1px solid rgba(194,106,26,0.40)" : `1px solid ${COLORS.border}`,
                  "&:hover": { background: "rgba(255,247,237,0.12)" },
                }}
              />
            ))}
          </Stack>
        </Box>

        <Popover
          open={Boolean(dateAnchor)}
          anchorEl={dateAnchor}
          onClose={() => setDateAnchor(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            sx: {
              mt: 0.6,
              borderRadius: 2,
              border: `1px solid ${COLORS.border}`,
              boxShadow: "0 26px 80px rgba(0,0,0,0.52)",
              overflow: "visible",
              background: "transparent",
            },
          }}
        >
          <Box sx={{ position: "relative", p: 0.4 }}>
            <IconButton
              onClick={() => setDateAnchor(null)}
              size="small"
              sx={{
                position: "absolute",
                top: 2,
                right: 2,
                zIndex: 3,
                background: COLORS.dpBg,
                border: `1px solid ${COLORS.border}`,
                boxShadow: "0 10px 22px rgba(0,0,0,0.40)",
                color: COLORS.text,
                "&:hover": { background: "rgba(34,23,16,0.96)" },
              }}
            >
              <CloseRoundedIcon fontSize="small" />
            </IconButton>

            <MiniDatePicker
              selected={selectedDate}
              onSelect={(d) => setSelectedDate(d)}
              onClear={() => setSelectedDate(null)}
            />
          </Box>
        </Popover>

        {/* Sections */}
        <Stack spacing={3.2}>
          <Box ref={admissionsRef} sx={{ scrollMarginTop: "140px", border: `1px solid ${COLORS.border}`, background: "rgba(44,29,20,0.46)", borderRadius: 4, p: { xs: 2.2, md: 3.0 }, boxShadow: "0 16px 44px rgba(0,0,0,0.28)" }}>
            <Typography variant="h5" sx={{ fontWeight: 980, color: COLORS.text, mb: 2 }}>
              Admissions Desk
            </Typography>
            {!filtered.admissions.length ? (
              <Typography sx={{ color: COLORS.subText }}>No Enquiries yet</Typography>
            ) : (
              <Stack spacing={1.8}>
                {filtered.admissions.map((r) => (
                  <RowCard key={r.id} r={r} onDelete={deleteRowByActiveTab} deleting={deletingId === r.id} />
                ))}
              </Stack>
            )}
          </Box>

          <Box ref={angelRef} sx={{ scrollMarginTop: "140px", border: `1px solid ${COLORS.border}`, background: "rgba(44,29,20,0.46)", borderRadius: 4, p: { xs: 2.2, md: 3.0 }, boxShadow: "0 16px 44px rgba(0,0,0,0.28)" }}>
            <Typography variant="h5" sx={{ fontWeight: 980, color: COLORS.text, mb: 2 }}>
              Angel Investment
            </Typography>
            {!filtered.angel.length ? (
              <Typography sx={{ color: COLORS.subText }}>No Enquiries yet</Typography>
            ) : (
              <Stack spacing={1.8}>
                {filtered.angel.map((r) => (
                  <RowCard key={r.id} r={r} onDelete={deleteRowByActiveTab} deleting={deletingId === r.id} />
                ))}
              </Stack>
            )}
          </Box>

          <Box ref={seedRef} sx={{ scrollMarginTop: "140px", border: `1px solid ${COLORS.border}`, background: "rgba(44,29,20,0.46)", borderRadius: 4, p: { xs: 2.2, md: 3.0 }, boxShadow: "0 16px 44px rgba(0,0,0,0.28)" }}>
            <Typography variant="h5" sx={{ fontWeight: 980, color: COLORS.text, mb: 2 }}>
              Seed Funding
            </Typography>
            {!filtered.seed.length ? (
              <Typography sx={{ color: COLORS.subText }}>No Enquiries yet</Typography>
            ) : (
              <Stack spacing={1.8}>
                {filtered.seed.map((r) => (
                  <RowCard key={r.id} r={r} onDelete={deleteRowByActiveTab} deleting={deletingId === r.id} />
                ))}
              </Stack>
            )}
          </Box>

          <Box ref={remoteRef} sx={{ scrollMarginTop: "140px", border: `1px solid ${COLORS.border}`, background: "rgba(44,29,20,0.46)", borderRadius: 4, p: { xs: 2.2, md: 3.0 }, boxShadow: "0 16px 44px rgba(0,0,0,0.28)" }}>
            <Typography variant="h5" sx={{ fontWeight: 980, color: COLORS.text, mb: 2 }}>
              Remote Employment
            </Typography>
            {!filtered.remote.length ? (
              <Typography sx={{ color: COLORS.subText }}>No Enquiries yet</Typography>
            ) : (
              <Stack spacing={1.8}>
                {filtered.remote.map((r) => (
                  <RowCard key={r.id} r={r} onDelete={deleteRowByActiveTab} deleting={deletingId === r.id} />
                ))}
              </Stack>
            )}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
