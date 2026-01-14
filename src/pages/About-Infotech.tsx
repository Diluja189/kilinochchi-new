import React from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import Groups2RoundedIcon from "@mui/icons-material/Groups2Rounded";
import ScienceRoundedIcon from "@mui/icons-material/ScienceRounded";
import RocketLaunchRoundedIcon from "@mui/icons-material/RocketLaunchRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import { motion } from "framer-motion";
import GlowCard from "../components/GlowCard";
import SectionHeader from "../components/SectionHeader";

const MotionBox = motion(Box);

const pillars = [
  {
    icon: <Groups2RoundedIcon sx={{ fontSize: 38 }} />,
    title: "Collaborative tech tribes",
    description:
      "Students operate in cross-disciplinary squads that mirror modern product teamsÃ¢â‚¬â€designers, engineers, storytellers, and strategists solving problems together.",
  },
  {
    icon: <ScienceRoundedIcon sx={{ fontSize: 38 }} />,
    title: "Research in motion",
    description:
      "From AI to climate tech, we run living labs where prototypes are tested with communities and partner companies, generating research with immediate impact.",
  },
  {
    icon: <RocketLaunchRoundedIcon sx={{ fontSize: 38 }} />,
    title: "Launchpad for ventures",
    description:
      "Founders-in-residence coach our innovators to pitch, validate, and pilot ventures that create new opportunities across the Northern Province.",
  },
  {
    icon: <PublicRoundedIcon sx={{ fontSize: 38 }} />,
    title: "Global exchange",
    description:
      "Exchange programs connect Kilinochchi talent with studios in Singapore, Bangalore, and Berlin, creating pathways to global careers.",
  },
];

const milestones = [
  {
    year: "2023",
    heading: "Campus revival",
    detail:
      "Refurbished labs with modern hardware, VR zones, and collaboration pods powered by community support and alumni contributions.",
  },
  {
    year: "2024",
    heading: "Industry alliances",
    detail:
      "Signed strategic partnerships with technology companies, enabling co-designed curricula and internship pipelines.",
  },
  {
    year: "2025",
    heading: "Innovation park launch",
    detail:
      "Inaugurated the Kilinochchi Innovation Park with startup incubators, maker spaces, and a digital twin command centre.",
  },
];

const InfotechSection: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 6, md: 10 }}
      >
        <Box sx={{ flex: { md: 1 }, minWidth: 0 }}>
          <SectionHeader
            eyebrow="About"
            title="A purpose-built playground for future technologists"
            subtitle="DonBosco InfoTech Kilinochchi reinvents vocational education with ventures studios, research labs, and global mentorship rooted in community resilience."
            align="left"
          />

          <Stack spacing={2.5} sx={{ mt: { xs: 4, md: 6 } }}>
            {pillars.map((pillar) => (
              <MotionBox
                key={pillar.title}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <GlowCard
                  glow="primary"
                  sx={{
                    background:
                      "linear-gradient(135deg, rgba(42,8,10,0.85), rgba(84,14,10,0.72))",
                    display: "flex",
                    flexDirection: "row",
                    gap: 2.5,
                    alignItems: "flex-start",
                  }}
                >
                  <Box
                    sx={{
                      width: 54,
                      height: 54,
                      borderRadius: 18,
                      display: "grid",
                      placeItems: "center",
                      backgroundColor: "rgba(128,0,0,0.25)",
                      color: "#ffffff", // ✅ brighter
                    }}
                  >
                    {pillar.icon}
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      fontWeight={800}
                      sx={{
                        color: "#ffffff", // ✅ bright white
                        fontSize: { xs: "1.22rem", md: "1.32rem" }, // ✅ bigger
                        lineHeight: 1.25,
                      }}
                    >
                      {pillar.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        mt: 1,
                        color: "rgba(255,255,255,0.84)", // ✅ brighter
                        fontSize: { xs: "1.02rem", md: "1.08rem" }, // ✅ bigger
                        lineHeight: 1.75,
                      }}
                    >
                      {pillar.description}
                    </Typography>
                  </Box>
                </GlowCard>
              </MotionBox>
            ))}
          </Stack>
        </Box>

        <Box
          sx={{
            flex: { md: 1 },
            minWidth: 0,
          }}
        >
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            sx={{ position: "sticky", top: { md: 112 } }}
          >
            <GlowCard
              glow="secondary"
              sx={{
                background:
                  "linear-gradient(160deg, rgba(84,14,10,0.92), rgba(42,8,10,0.8))",
              }}
            >
              <Typography
                variant="h5"
                fontWeight={800}
                sx={{
                  color: "#ffffff", // ✅ brighter
                  fontSize: { xs: "1.45rem", md: "1.62rem" }, // ✅ bigger
                  lineHeight: 1.2,
                }}
              >
                Kilinochchi Innovation Timeline
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255,255,255,0.82)", // ✅ brighter
                  mt: 1.2,
                  mb: 3,
                  fontSize: { xs: "1.0rem", md: "1.08rem" }, // ✅ bigger
                  lineHeight: 1.75,
                }}
              >
                A snapshot of how we are transforming the Northern Province into
                a launchpad for technology, creativity, and enterprise.
              </Typography>

              <Stack spacing={3.5}>
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.year}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Stack direction="row" spacing={3} alignItems="flex-start">
                      <Box
                        sx={{
                          minWidth: 68,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 1,
                          color: "rgba(255,255,255,0.86)", // ✅ brighter
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          fontWeight={800}
                          sx={{
                            letterSpacing: 1.2,
                            color: "#ffffff", // ✅ brighter
                            fontSize: { xs: "1.0rem", md: "1.05rem" }, // ✅ bigger
                          }}
                        >
                          {milestone.year}
                        </Typography>
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background:
                              "linear-gradient(135deg, #800000, #d4a017)",
                            boxShadow: "0 0 18px rgba(212,160,23,0.6)",
                          }}
                        />
                      </Box>

                      <Box>
                        <Typography
                          variant="subtitle1"
                          fontWeight={800}
                          sx={{
                            color: "#ffffff", // ✅ brighter
                            fontSize: { xs: "1.12rem", md: "1.18rem" }, // ✅ bigger
                            lineHeight: 1.25,
                          }}
                        >
                          {milestone.heading}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            mt: 0.8,
                            color: "rgba(255,255,255,0.82)", // ✅ brighter
                            maxWidth: 340,
                            fontSize: { xs: "1.0rem", md: "1.06rem" }, // ✅ bigger
                            lineHeight: 1.75,
                          }}
                        >
                          {milestone.detail}
                        </Typography>
                      </Box>
                    </Stack>
                  </motion.div>
                ))}
              </Stack>
            </GlowCard>
          </MotionBox>
        </Box>
      </Stack>
    </Container>
  );
};

export default InfotechSection;
