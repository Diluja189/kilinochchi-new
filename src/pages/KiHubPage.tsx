import React from "react";
import { Box, Button, Chip, Container, Stack, Typography } from "@mui/material";
import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import ConstructionRoundedIcon from "@mui/icons-material/ConstructionRounded";
import RocketLaunchRoundedIcon from "@mui/icons-material/RocketLaunchRounded";
import HubRoundedIcon from "@mui/icons-material/HubRounded";
import SectionHeader from "../components/SectionHeader";
import GlowCard from "../components/GlowCard";

const hubTracks = [
  {
    title: "Innovation Challenges",
    description:
      "Monthly sprints where students co-create proofs of concept with public sector and NGO partners.",
    icon: <LightbulbRoundedIcon sx={{ fontSize: 38 }} />,
    outcomes: [
      "Design briefs rooted in Northern Province needs.",
      "Mentorship from product strategists and UX coaches.",
    ],
  },
  {
    title: "Builders Lab",
    description:
      "Hardware, XR, and rapid prototyping gear to test ideas from BIM, automation, and robotics cohorts.",
    icon: <ConstructionRoundedIcon sx={{ fontSize: 38 }} />,
    outcomes: [
      "Fabrication resources and testing rigs.",
      "24/7 access for hackathon and research teams.",
    ],
  },
  {
    title: "Launchpad Fellowship",
    description:
      "A 12-week program that helps teams turn capstones into ventures with mini-grants and investor previews.",
    icon: <RocketLaunchRoundedIcon sx={{ fontSize: 38 }} />,
    outcomes: [
      "Legal and finance clinics via partner firms.",
      "Pitch reviews with alumni founders.",
    ],
  },
  {
    title: "Partner Residency",
    description:
      "Companies embed product leads on campus to co-supervise squads and accelerate adoption of new solutions.",
    icon: <HubRoundedIcon sx={{ fontSize: 38 }} />,
    outcomes: [
      "Dedicated studio workspace.",
      "Joint IP and deployment roadmaps.",
    ],
  },
];

const KiHubPage: React.FC = () => {
  return (
    <Box
      id="kihub"
      sx={{
        position: "relative",
        py: { xs: 12, md: 16 },
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <SectionHeader
          eyebrow="KI Hub"
          title="Kilinochchi Innovation Hub"
          subtitle="Where prototypes evolve into products, and civic ideas become regional impact."
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
          {hubTracks.map((track) => (
            <GlowCard
              key={track.title}
              glow="neutral"
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
                    width: 54,
                    height: 54,
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
              <Stack spacing={1}>
                {track.outcomes.map((outcome) => (
                  <Typography
                    key={outcome}
                    variant="body2"
                    sx={{ color: "rgba(255,245,234,0.85)" }}
                  >
                    {outcome}
                  </Typography>
                ))}
              </Stack>
            </GlowCard>
          ))}
        </Box>

        <GlowCard
          glow="primary"
          sx={{
            mt: { xs: 6, md: 8 },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: { xs: 3, md: 5 },
          }}
        >
          <Stack spacing={1.5} sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight={700}>
              Book the KI-Hub
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "rgba(255,245,234,0.75)" }}
            >
              Universities, startups, and community groups can request the lab
              for hackathons, policy workshops, or student showcases. Slots are
              prioritized for teams building public-good technology.
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {["Hackathons", "Community briefs", "Startup demos"].map(
                (label) => (
                  <Chip
                    key={label}
                    label={label}
                    sx={{
                      borderRadius: 2,
                      backgroundColor: "rgba(255,255,255,0.1)",
                      color: "#fff5ea",
                    }}
                  />
                )
              )}
            </Stack>
          </Stack>
          <Button
            variant="outlined"
            color="inherit"
            sx={{
              borderRadius: 3,
              textTransform: "none",
              minWidth: 180,
            }}
          >
            Request a slot
          </Button>
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
            top: "-120px",
            left: "-140px",
            width: "360px",
            height: "360px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(128,0,0,0.25) 0%, transparent 70%)",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: "-180px",
            right: "-140px",
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

export default KiHubPage;




