import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { motion } from "framer-motion";
import GlowCard from "../components/GlowCard";
import SectionHeader from "../components/SectionHeader";
import {
  NewsEntry,
  deleteTitleEntry,
  fetchTitleEntries,
  insertTitleEntry,
  updateTitleEntry,
} from "../api/newsService";
import NewsForm, { NewsFormSubmitValues } from "./news";

const MotionBox = motion(Box);

const iconPalette = [
  <InsightsRoundedIcon sx={{ fontSize: 38 }} />,
  <ArticleRoundedIcon sx={{ fontSize: 38 }} />,
  <CalendarMonthRoundedIcon sx={{ fontSize: 38 }} />,
];

const formatDisplayDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

type NewsSectionProps = {
  enableManagement?: boolean;
};

const getTagForDate = (value: string) => {
  const parsed = new Date(value).getTime();
  if (Number.isNaN(parsed)) return "Update";
  const daysElapsed = Math.floor((Date.now() - parsed) / (1000 * 60 * 60 * 24));
  if (daysElapsed <= 7) return "New";
  if (daysElapsed <= 30) return "Recent";
  return "Archive";
};

const NewsSection: React.FC<NewsSectionProps> = ({ enableManagement = false }) => {
  const [entries, setEntries] = useState<NewsEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | null>(null);
  const [activeEntry, setActiveEntry] = useState<NewsEntry | null>(null);
  const [dialogSubmitting, setDialogSubmitting] = useState(false);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<NewsEntry | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTitleEntries();
      setEntries(data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to load news entries from Supabase.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  const showEmptyState = useMemo(
    () => !loading && !error && entries.length === 0,
    [entries.length, error, loading],
  );

  const handleOpenCreate = () => {
    setDialogMode("create");
    setActiveEntry(null);
    setDialogError(null);
  };

  const handleOpenEdit = (entry: NewsEntry) => {
    setActiveEntry(entry);
    setDialogMode("edit");
    setDialogError(null);
  };

  const closeDialog = () => {
    if (dialogSubmitting) return;
    setDialogMode(null);
    setActiveEntry(null);
    setDialogError(null);
  };

  const handleFormSubmit = async (values: NewsFormSubmitValues) => {
    setDialogError(null);
    setDialogSubmitting(true);
    try {
      if (dialogMode === "create") {
        const created = await insertTitleEntry({
          title: values.title,
          description: values.description,
          imageData: values.imageBytes ?? null,
        });
        setEntries((prev) => [created, ...prev]);
        closeDialog();
      } else if (dialogMode === "edit" && activeEntry) {
        const updated = await updateTitleEntry(activeEntry.id, {
          title: values.title,
          description: values.description,
          imageData: values.imageBytes,
        });
        setEntries((prev) =>
          prev.map((entry) => (entry.id === updated.id ? updated : entry)),
        );
        closeDialog();
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to save this news item. Please try again.";
      setDialogError(message);
    } finally {
      setDialogSubmitting(false);
    }
  };

  const handleOpenDelete = (entry: NewsEntry) => {
    setDeleteTarget(entry);
    setDeleteError(null);
  };

  const closeDeleteDialog = () => {
    if (deleteSubmitting) return;
    setDeleteTarget(null);
    setDeleteError(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteError(null);
    setDeleteSubmitting(true);
    try {
      await deleteTitleEntry(deleteTarget.id);
      setEntries((prev) => prev.filter((entry) => entry.id !== deleteTarget.id));
      closeDeleteDialog();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to delete this news item. Please retry.";
      setDeleteError(message);
    } finally {
      setDeleteSubmitting(false);
    }
  };

  return (
    <Box
      id="news"
      sx={{
        position: "relative",
        py: { xs: 12, md: 16 },
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 3, md: 4 }}
          alignItems={{ xs: "flex-start", md: "center" }}
        >
          <Box flex={1} width="100%">
            <SectionHeader
              eyebrow="Pulse"
              title="Fresh milestones, events, and stories from campus"
              subtitle="Every item is pulled live from your Supabase `titles` table, so keeping DonBosco InfoTech up to date is as simple as adding a new row."
            />
          </Box>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ alignSelf: { xs: "stretch", md: "flex-end" } }}
          >
            <Button
              variant="outlined"
              color="secondary"
              onClick={loadNews}
              disabled={loading}
              sx={{ minWidth: 160 }}
            >
              {loading ? "Refreshing..." : "Refresh feed"}
            </Button>
            {enableManagement && (
              <Button
                variant="contained"
                color="secondary"
                startIcon={<AddRoundedIcon />}
                onClick={handleOpenCreate}
                sx={{ minWidth: 160 }}
              >
                Create
              </Button>
            )}
          </Stack>
        </Stack>

        {error && (
          <Alert
            severity="error"
            sx={{
              mt: 4,
              backgroundColor: "rgba(255,82,82,0.1)",
              border: "1px solid rgba(255,82,82,0.3)",
            }}
          >
            {error}
          </Alert>
        )}

        <Box
          sx={{
            mt: { xs: 6, md: 8 },
            display: "grid",
            gap: { xs: 3, md: 4 },
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, minmax(0, 1fr))",
            },
          }}
        >
          {loading && (
            <Stack
              alignItems="center"
              justifyContent="center"
              spacing={2}
              sx={{ gridColumn: "1 / -1", py: 6 }}
            >
              <CircularProgress color="secondary" />
              <Typography variant="body2" sx={{ color: "rgba(255,245,234,0.65)" }}>
                Fetching the latest campus stories from Supabase&hellip;
              </Typography>
            </Stack>
          )}

          {!loading &&
            entries.map((entry, index) => (
              <MotionBox
                key={entry.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <GlowCard
                  glow={index % 2 === 0 ? "primary" : "secondary"}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    height: "100%",
                  }}
                >
                  {entry.imageUrl && (
                    <Box
                      component="img"
                      src={entry.imageUrl}
                      alt={`${entry.title} illustration`}
                      sx={{
                        width: "100%",
                        height: 180,
                        objectFit: "cover",
                        borderRadius: 3,
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    />
                  )}

                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 54,
                        height: 54,
                        borderRadius: 18,
                        display: "grid",
                        placeItems: "center",
                        backgroundColor: "rgba(255,255,255,0.08)",
                        color: "#fff5ea",
                      }}
                    >
                      {iconPalette[index % iconPalette.length]}
                    </Box>
                    <Chip
                      label={getTagForDate(entry.createdAt)}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(255,255,255,0.1)",
                        color: "rgba(255,245,234,0.75)",
                        borderRadius: 2,
                        fontWeight: 600,
                        letterSpacing: 0.3,
                      }}
                    />
                  </Stack>

                  <Typography variant="h6" fontWeight={700}>
                    {entry.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255,245,234,0.7)", flexGrow: 1 }}
                  >
                    {entry.description}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{ color: "rgba(255,245,234,0.5)", letterSpacing: 0.4 }}
                  >
                    {formatDisplayDate(entry.createdAt)}
                  </Typography>
                  {enableManagement && (
                    <Stack
                      direction="row"
                      spacing={1.5}
                      sx={{ pt: 1 }}
                      justifyContent="flex-end"
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        color="secondary"
                        startIcon={<EditRoundedIcon fontSize="small" />}
                        onClick={() => handleOpenEdit(entry)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteRoundedIcon fontSize="small" />}
                        onClick={() => handleOpenDelete(entry)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  )}
                </GlowCard>
              </MotionBox>
            ))}

          {showEmptyState && (
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              sx={{ gridColumn: "1 / -1" }}
            >
              <GlowCard
                glow="primary"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  alignItems: "center",
                  textAlign: "center",
                  py: 6,
                }}
              >
                <Typography variant="h6" fontWeight={700}>
                  No news has been published yet
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255,245,234,0.7)", maxWidth: 520 }}
                >
                  Add a row to the <code>titles</code> table in Supabase (with title,
                  description, and optional image bytes) and it will appear here instantly.
                </Typography>
              </GlowCard>
            </MotionBox>
          )}
        </Box>
      </Container>

      <Dialog
        open={Boolean(dialogMode)}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {dialogMode === "edit" ? "Edit news entry" : "Create news entry"}
        </DialogTitle>
        <DialogContent dividers>
          {dialogError && (
            <Alert
              severity="error"
              sx={{ mb: 3, backgroundColor: "rgba(255,82,82,0.08)" }}
            >
              {dialogError}
            </Alert>
          )}
          {dialogMode && (
            <NewsForm
              key={dialogMode === "edit" ? activeEntry?.id ?? "edit" : "create"}
              mode={dialogMode}
              initialValues={
                dialogMode === "edit"
                  ? {
                      title: activeEntry?.title,
                      description: activeEntry?.description,
                      imageUrl: activeEntry?.imageUrl ?? null,
                    }
                  : undefined
              }
              submitting={dialogSubmitting}
              onSubmit={handleFormSubmit}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} disabled={dialogSubmitting}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(deleteTarget)}
        onClose={closeDeleteDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Delete this news entry?</DialogTitle>
        <DialogContent dividers>
          {deleteError && (
            <Alert
              severity="error"
              sx={{ mb: 2, backgroundColor: "rgba(255,82,82,0.08)" }}
            >
              {deleteError}
            </Alert>
          )}
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            {`You're about to remove "${deleteTarget?.title ?? "this entry"}". This action cannot be undone.`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Do you want to continue?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} disabled={deleteSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleteSubmitting}
          >
            {deleteSubmitting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "-140px",
            right: "-160px",
            width: "360px",
            height: "360px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(128,0,0,0.27) 0%, transparent 70%)",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: "-200px",
            left: "-140px",
            width: "420px",
            height: "420px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(212,160,23,0.24) 0%, transparent 70%)",
          },
        }}
      />
    </Box>
  );
};

export default NewsSection;




