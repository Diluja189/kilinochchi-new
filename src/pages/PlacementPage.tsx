import React from "react";
import { Box, Chip, Container, Stack, Typography } from "@mui/material";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import Diversity3RoundedIcon from "@mui/icons-material/Diversity3Rounded";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import SectionHeader from "../components/SectionHeader";
import GlowCard from "../components/GlowCard";

const placementTracks = [
  {
    title: "Career Navigation Studio",
    description:
      "Weekly sprints with mentors to shape your portfolio, interviewing story, and positioning for emerging tech roles.",
    icon: <WorkOutlineRoundedIcon sx={{ fontSize: 40 }} />,
    points: [
      "Resume architecture labs with design support.",
      "Mock interviews run with partner companies.",
      "Personal brand audits for LinkedIn and GitHub.",
    ],
    glow: "primary" as const,
  },
  {
    title: "Industry Partner Pods",
    description:
      "Cross-functional teams co-build solutions alongside companies from Colombo, Chennai, and Singapore.",
    icon: <Diversity3RoundedIcon sx={{ fontSize: 40 }} />,
    points: [
      "Solve live automation and AI briefs.",
      "Access hiring managers every sprint review.",
      "Secure referrals through delivery excellence.",
    ],
    glow: "secondary" as const,
  },
  {
    title: "Future of Work Playbooks",
    description:
      "Get clarity on job roles, salary data, and visa pathways through market research and alumni stories.",
    icon: <TimelineRoundedIcon sx={{ fontSize: 40 }} />,
    points: [
      "City-by-city demand maps for tech skills.",
      "Compensation benchmarks with negotiation prep.",
      "Remote-first and hybrid role readiness.",
    ],
    glow: "neutral" as const,
  },
  {
    title: "Graduate Accelerator",
    description:
      "Structured transition from final project to full-time placement or venture incubation at KI-Hub.",
    icon: <SchoolRoundedIcon sx={{ fontSize: 40 }} />,
    points: [
      "90-day job tracking dashboard for each student.",
      "Alumni-led accountability sessions.",
      "Scholarships to explore startup ideas with KI-Hub.",
    ],
    glow: "primary" as const,
  },
];

const partnerChips = [
  "Virtusa",
  "Dialog",
  "Hemas",
  "Orange Electric",
  "Anora Labs",
  "CodeZar",
];

const PlacementPage: React.FC = () => {
  return (
    <Box
      id="placement"
      sx={{
        position: "relative",
        py: { xs: 12, md: 16 },
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <SectionHeader
          eyebrow="Placement"
          title="Guided pathways into meaningful work"
          subtitle="From industry pods to global alumni mentors, every learner receives a structured placement roadmap."
        />

        <Box
          sx={{
            mt: { xs: 5, md: 7 },
            display: "grid",
            gap: { xs: 3, md: 4 },
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, minmax(0, 1fr))",
            },
          }}
        >
          {placementTracks.map((track) => (
            <GlowCard
              key={track.title}
              glow={track.glow}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 58,
                    height: 58,
                    borderRadius: 3,
                    backgroundColor: "rgba(255,255,255,0.08)",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  {track.icon}
                </Box>
                <Typography variant="h6" fontWeight={700}>
                  {track.title}
                </Typography>
              </Stack>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255,245,234,0.75)" }}
              >
                {track.description}
              </Typography>
              <Stack spacing={1.2} component="ul" sx={{ pl: 2, m: 0 }}>
                {track.points.map((point) => (
                  <Typography
                    key={point}
                    component="li"
                    variant="body2"
                    sx={{ color: "rgba(255,245,234,0.85)" }}
                  >
                    {point}
                  </Typography>
                ))}
              </Stack>
            </GlowCard>
          ))}
        </Box>

        <GlowCard
          glow="neutral"
          sx={{
            mt: { xs: 6, md: 8 },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: { xs: 3, md: 5 },
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight={700}>
              Hiring partners & residency options
            </Typography>
            <Typography
              variant="body1"
              sx={{ mt: 1.5, color: "rgba(255,245,234,0.7)" }}
            >
              Final year students pitch to recruiters through demo days hosted in
              Kilinochchi and Colombo. Select teams extend their work through KI
              Hub residencies or sponsored fellowships.
            </Typography>
          </Box>
          <Stack
            direction="row"
            flexWrap="wrap"
            gap={1.2}
            justifyContent="center"
          >
            {partnerChips.map((company) => (
              <Chip
                key={company}
                label={company}
                sx={{
                  borderRadius: 2,
                  backgroundColor: "rgba(255,255,255,0.08)",
                  color: "#fff5ea",
                }}
              />
            ))}
          </Stack>
        </GlowCard>
      </Container>

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "-160px",
            right: "-120px",
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

export default PlacementPage;




