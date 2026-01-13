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
   Theme
========================================= */
const COLORS = {
  text: "#0F172A",
  subText: "#475569",

  paper: "rgba(255,255,255,0.82)",
  paperStrong: "rgba(255,255,255,0.95)",

  border: "rgba(15,23,42,0.10)",
  border2: "rgba(15,23,42,0.16)", // ✅ FIXED: was missing
  borderHover: "rgba(15,23,42,0.18)",

  shadow: "0 14px 40px rgba(2,6,23,0.10)",
  shadowHover: "0 18px 54px rgba(2,6,23,0.14)",

  // date picker look (like screenshot)
  dpHeader: "#111827",
  dpBg: "#FFFFFF",
  dpCellHover: "rgba(2,6,23,0.06)",
  dpSelected: "#EF4444",
  dpSelectedText: "#FFFFFF",
  dpMuted: "rgba(15,23,42,0.45)",
};

/* =========================================
   Date helpers (no extra packages)
========================================= */
const pad2 = (n: number) => String(n).padStart(2, "0");
const monthShort = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
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
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
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
    const firstDow = first.getDay(); // 0=Su
    const totalDays = last.getDate();

    const cells: Array<{ day: number; inMonth: boolean; date: Date }> = [];

    // prev month
    const prevMonthEnd = new Date(view.getFullYear(), view.getMonth(), 0);
    const prevDays = prevMonthEnd.getDate();
    for (let i = 0; i < firstDow; i++) {
      const day = prevDays - (firstDow - 1 - i);
      const date = new Date(view.getFullYear(), view.getMonth() - 1, day);
      cells.push({ day, inMonth: false, date });
    }

    // current month
    for (let d = 1; d <= totalDays; d++) {
      const date = new Date(view.getFullYear(), view.getMonth(), d);
      cells.push({ day: d, inMonth: true, date });
    }

    // next month fill to 42 cells
    while (cells.length < 42) {
      const nextDay = cells.length - (firstDow + totalDays) + 1;
      const date = new Date(view.getFullYear(), view.getMonth() + 1, nextDay);
      cells.push({ day: nextDay, inMonth: false, date });
    }

    return cells;
  }, [view]);

  const today = new Date();
  const selectedStr = selected ? toDDMMYYYY(selected) : "All Dates";

  // Input text like 05/07/2019
  const inputText = selected
    ? `${pad2(selected.getMonth() + 1)}/${pad2(selected.getDate())}/${selected.getFullYear()}`
    : "";

  return (
    <Box sx={{ width: 330 }}>
      {/* Input (style like screenshot) */}
      <Box
        sx={{
          border: `1px solid ${COLORS.border}`,
          borderRadius: 1.8,
          overflow: "hidden",
          background: "#fff",
          boxShadow: "0 10px 26px rgba(2,6,23,0.12)",
        }}
      >
        <Stack direction="row" alignItems="center" sx={{ height: 40 }}>
          <Box
            sx={{
              flex: 1,
              px: 1.4,
              fontWeight: 800,
              color: COLORS.text,
              fontSize: 13,
            }}
          >
            {inputText}
          </Box>

          <Box
            sx={{
              width: 44,
              height: 40,
              display: "grid",
              placeItems: "center",
              background: "#111827",
              color: "#fff",
            }}
          >
            <CalendarMonthRoundedIcon fontSize="small" />
          </Box>
        </Stack>
      </Box>

      {/* Calendar card */}
      <Box
        sx={{
          mt: 1.2,
          borderRadius: 1.8,
          background: COLORS.dpBg,
          border: `1px solid ${COLORS.border}`,
          boxShadow: "0 18px 46px rgba(2,6,23,0.14)",
          overflow: "hidden",
        }}
      >
        {/* Month header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            px: 1.2,
            py: 1.0,
            borderBottom: `1px solid ${COLORS.border}`,
            background: "rgba(2,6,23,0.02)",
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
              minWidth: 34,
              width: 34,
              height: 34,
              borderRadius: 1.4,
              color: COLORS.text,
              background: "transparent",
              "&:hover": { background: COLORS.dpCellHover },
              fontWeight: 900,
            }}
          >
            ‹
          </Button>

          <Typography sx={{ fontWeight: 950, color: COLORS.dpHeader, fontSize: 13 }}>
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
              minWidth: 34,
              width: 34,
              height: 34,
              borderRadius: 1.4,
              color: COLORS.text,
              background: "transparent",
              "&:hover": { background: COLORS.dpCellHover },
              fontWeight: 900,
            }}
          >
            ›
          </Button>
        </Stack>

        {/* Week header + days */}
        <Box sx={{ px: 1.2, pt: 1.0 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 0.6,
              mb: 0.6,
            }}
          >
            {weekShort.map((w) => (
              <Typography
                key={w}
                sx={{
                  textAlign: "center",
                  fontSize: 11,
                  fontWeight: 900,
                  color: COLORS.dpMuted,
                  py: 0.6,
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
              gap: 0.6,
              pb: 1.2,
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
                    height: 34,
                    borderRadius: 1.6,
                    p: 0,
                    fontWeight: 900,
                    fontSize: 12,
                    color: isSel
                      ? COLORS.dpSelectedText
                      : c.inMonth
                      ? COLORS.text
                      : "rgba(15,23,42,0.35)",
                    background: isSel ? COLORS.dpSelected : "transparent",
                    boxShadow: isSel ? "0 10px 20px rgba(239,68,68,0.25)" : "none",
                    border: isToday && !isSel ? "1px solid rgba(239,68,68,0.30)" : "1px solid transparent",
                    "&:hover": {
                      background: isSel ? COLORS.dpSelected : COLORS.dpCellHover,
                    },
                  }}
                >
                  {c.day}
                </Button>
              );
            })}
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ px: 1.4, py: 1.1, borderTop: `1px solid ${COLORS.border}` }}>
          <Typography sx={{ fontWeight: 800, color: COLORS.subText, fontSize: 12 }}>
            Current: <span style={{ color: COLORS.text }}>{selectedStr}</span>
          </Typography>

          <Stack direction="row" justifyContent="flex-end" spacing={1.2} sx={{ mt: 1 }}>
            <Button
              onClick={() => onSelect(new Date())}
              sx={{
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 950,
                color: COLORS.text,
                background: "#FFFFFF",
                border: `1px solid ${COLORS.border}`,
                boxShadow: "0 10px 24px rgba(2,6,23,0.10)",
                px: 2.4,
                "&:hover": {
                  background: "#fff",
                  borderColor: COLORS.border2, // ✅ FIXED (border2 exists now)
                },
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
                color: "#B91C1C",
                background: "rgba(185,28,28,0.08)",
                border: "1px solid rgba(185,28,28,0.18)",
                boxShadow: "0 10px 24px rgba(185,28,28,0.14)",
                px: 2.4,
                "&:hover": { background: "rgba(185,28,28,0.12)" },
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
        backdropFilter: "blur(10px)",
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
            color: "rgba(185,28,28,1)",
            background: "rgba(185,28,28,0.08)",
            border: "1px solid rgba(185,28,28,0.18)",
            "&:hover": {
              background: "rgba(185,28,28,0.12)",
              borderColor: "rgba(185,28,28,0.26)",
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
            background: "rgba(245,158,11,0.10)",
            border: "1px solid rgba(245,158,11,0.18)",
            fontWeight: 700,
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

  // ✅ date filter
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [dateAnchor, setDateAnchor] = useState<HTMLElement | null>(null);

  const admissionsRef = useRef<HTMLDivElement | null>(null);
  const angelRef = useRef<HTMLDivElement | null>(null);
  const seedRef = useRef<HTMLDivElement | null>(null);
  const remoteRef = useRef<HTMLDivElement | null>(null);

  const scrollTo = (key: TabKey) => {
    const map = {
      admissions: admissionsRef,
      angel: angelRef,
      seed: seedRef,
      remote: remoteRef,
    } as const;

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
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order("created_at", { ascending: false });

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
    background: "rgba(255,255,255,0.60)",
    borderRadius: 4,
    p: { xs: 2.2, md: 3.0 },
    boxShadow: "0 12px 34px rgba(2,6,23,0.06)",
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
            "radial-gradient(1100px 700px at 18% 8%, rgba(185,28,28,0.10), transparent 55%), radial-gradient(900px 600px at 90% 20%, rgba(245,158,11,0.10), transparent 55%), linear-gradient(120deg, #f8fafc, #eef2ff)",
        }}
      >
        <Typography sx={{ opacity: 0.9, fontWeight: 800 }}>Loading enquiries...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        color: COLORS.text,
        background:
          "radial-gradient(1100px 700px at 18% 8%, rgba(185,28,28,0.10), transparent 55%), radial-gradient(900px 600px at 90% 20%, rgba(245,158,11,0.10), transparent 55%), linear-gradient(120deg, #f8fafc, #eef2ff)",
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
            backdropFilter: "blur(16px)",
            background: "rgba(255,255,255,0.70)",
            borderRadius: 4,
            border: `1px solid ${COLORS.border}`,
            boxShadow: "0 12px 34px rgba(2,6,23,0.08)",
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
                  fontWeight: 950,
                  letterSpacing: 0.2,
                  lineHeight: 1.1,
                  color: COLORS.text,
                }}
              >
                Admin Enquiries
              </Typography>

              <Typography sx={{ color: COLORS.subText, mt: 0.6, fontWeight: 800 }}>
                Filter: <span style={{ color: COLORS.text }}>{dateLabel}</span>
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.2} alignItems="center" justifyContent="flex-end">
              {/* Date pill */}
              <Button
                onClick={(e) => setDateAnchor(e.currentTarget)}
                startIcon={<CalendarMonthRoundedIcon />}
                endIcon={<KeyboardArrowDownRoundedIcon />}
                sx={{
                  borderRadius: 999,
                  px: 2.2,
                  py: 1.05,
                  fontWeight: 950,
                  textTransform: "none",
                  color: COLORS.text,
                  background: "#FFFFFF",
                  border: `1px solid ${COLORS.border}`,
                  boxShadow: "0 10px 26px rgba(2,6,23,0.10)",
                  "&:hover": {
                    background: "#FFFFFF",
                    borderColor: COLORS.borderHover,
                    boxShadow: "0 12px 30px rgba(2,6,23,0.14)",
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
                  px: 2.6,
                  py: 1.05,
                  fontWeight: 950,
                  textTransform: "none",
                  color: "#0F172A",
                  background:
                    "linear-gradient(135deg, rgba(185,28,28,0.16), rgba(245,158,11,0.20))",
                  border: "1px solid rgba(185,28,28,0.14)",
                  boxShadow: "0 10px 26px rgba(2,6,23,0.10)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, rgba(185,28,28,0.22), rgba(245,158,11,0.26))",
                    boxShadow: "0 12px 30px rgba(2,6,23,0.14)",
                    transform: "translateY(-1px)",
                  },
                  "&:disabled": {
                    background: "rgba(148,163,184,0.30)",
                    color: "rgba(15,23,42,0.65)",
                    border: `1px solid ${COLORS.border}`,
                  },
                }}
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </Button>
            </Stack>
          </Stack>

          <Divider sx={{ my: 2, borderColor: "rgba(15,23,42,0.08)" }} />

          {/* Tabs */}
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
                  fontWeight: 900,
                  borderRadius: 999,
                  px: 1.2,
                  py: 2.2,
                  color: COLORS.text,
                  background:
                    activeTab === key ? "rgba(185,28,28,0.12)" : "rgba(255,255,255,0.82)",
                  border:
                    activeTab === key ? "1px solid rgba(185,28,28,0.22)" : `1px solid ${COLORS.border}`,
                  "&:hover": { background: "rgba(255,255,255,0.96)" },
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* Calendar Popover (style like screenshot) */}
        <Popover
          open={Boolean(dateAnchor)}
          anchorEl={dateAnchor}
          onClose={() => setDateAnchor(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            sx: {
              mt: 1,
              borderRadius: 2,
              border: `1px solid ${COLORS.border}`,
              boxShadow: "0 22px 70px rgba(2,6,23,0.18)",
              overflow: "visible",
              background: "transparent",
            },
          }}
        >
          <Box sx={{ position: "relative", p: 0.6 }}>
            <IconButton
              onClick={() => setDateAnchor(null)}
              size="small"
              sx={{
                position: "absolute",
                top: 2,
                right: 2,
                zIndex: 3,
                background: "#fff",
                border: `1px solid ${COLORS.border}`,
                boxShadow: "0 10px 22px rgba(2,6,23,0.12)",
                "&:hover": { background: "#fff" },
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
          {/* Admissions */}
          <Box ref={admissionsRef} sx={{ scrollMarginTop: "140px", ...sectionBg }}>
            <Typography variant="h5" sx={{ fontWeight: 950, color: COLORS.text, mb: 2 }}>
              Admissions Desk
            </Typography>

            {!filtered.admissions.length ? (
              <Typography sx={{ color: COLORS.subText }}>No Enquiries yet</Typography>
            ) : (
              <Stack spacing={1.8}>
                {filtered.admissions.map((r) => (
                  <RowCard
                    key={r.id}
                    r={r}
                    onDelete={deleteRowByActiveTab}
                    deleting={deletingId === r.id}
                  />
                ))}
              </Stack>
            )}
          </Box>

          {/* Angel */}
          <Box ref={angelRef} sx={{ scrollMarginTop: "140px", ...sectionBg }}>
            <Typography variant="h5" sx={{ fontWeight: 950, color: COLORS.text, mb: 2 }}>
              Angel Investment
            </Typography>

            {!filtered.angel.length ? (
              <Typography sx={{ color: COLORS.subText }}>No Enquiries yet</Typography>
            ) : (
              <Stack spacing={1.8}>
                {filtered.angel.map((r) => (
                  <RowCard
                    key={r.id}
                    r={r}
                    onDelete={deleteRowByActiveTab}
                    deleting={deletingId === r.id}
                  />
                ))}
              </Stack>
            )}
          </Box>

          {/* Seed */}
          <Box ref={seedRef} sx={{ scrollMarginTop: "140px", ...sectionBg }}>
            <Typography variant="h5" sx={{ fontWeight: 950, color: COLORS.text, mb: 2 }}>
              Seed Funding
            </Typography>

            {!filtered.seed.length ? (
              <Typography sx={{ color: COLORS.subText }}>No Enquiries yet</Typography>
            ) : (
              <Stack spacing={1.8}>
                {filtered.seed.map((r) => (
                  <RowCard
                    key={r.id}
                    r={r}
                    onDelete={deleteRowByActiveTab}
                    deleting={deletingId === r.id}
                  />
                ))}
              </Stack>
            )}
          </Box>

          {/* Remote */}
          <Box ref={remoteRef} sx={{ scrollMarginTop: "140px", ...sectionBg }}>
            <Typography variant="h5" sx={{ fontWeight: 950, color: COLORS.text, mb: 2 }}>
              Remote Employment
            </Typography>

            {!filtered.remote.length ? (
              <Typography sx={{ color: COLORS.subText }}>No Enquiries yet</Typography>
            ) : (
              <Stack spacing={1.8}>
                {filtered.remote.map((r) => (
                  <RowCard
                    key={r.id}
                    r={r}
                    onDelete={deleteRowByActiveTab}
                    deleting={deletingId === r.id}
                  />
                ))}
              </Stack>
            )}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
