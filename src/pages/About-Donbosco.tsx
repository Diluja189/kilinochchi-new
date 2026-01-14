import React from "react";
import {
  Box,
  Container,
  Stack,
  Typography,
  Grid,
  Chip,
  Divider,
} from "@mui/material";
import Groups2RoundedIcon from "@mui/icons-material/Groups2Rounded";
import ScienceRoundedIcon from "@mui/icons-material/ScienceRounded";
import RocketLaunchRoundedIcon from "@mui/icons-material/RocketLaunchRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import { motion } from "framer-motion";
import GlowCard from "../components/GlowCard";
import SectionHeader from "../components/SectionHeader";

const MotionBox = motion(Box);

const coreIdeas = [
  {
    icon: <Groups2RoundedIcon sx={{ fontSize: 22 }} />,
    label: "Good Christians",
    text: "He wanted young people to become â€œgood Christians and honest citizens,â€ rooted in faith and daily life.",
  },
  {
    icon: <ScienceRoundedIcon sx={{ fontSize: 22 }} />,
    label: "Work & skill",
    text: "From his own experience of poverty, he built trade schools that dignified work and prepared youth for real jobs.",
  },
  {
    icon: <RocketLaunchRoundedIcon sx={{ fontSize: 22 }} />,
    label: "Preventive method",
    text: "Don Bosco focused on preventing delinquency through presence, kindness, and joyful community.",
  },
  {
    icon: <PublicRoundedIcon sx={{ fontSize: 22 }} />,
    label: "Open to all",
    text: "His houses and schools welcomed boys from every background, a spirit continued in Don Bosco institutes worldwide.",
  },
];

const storyBlocks = [
  {
    title: "Humble beginnings in Becchi (1815)",
    highlight: "Born on August 16, 1815, near the Italian Alps",
    body: "St. John Bosco, commonly called Don Bosco, grew up poor and lost his father at the age of two. He worked at various trades while studying, learning skills he later shared with his students.",
  },
  {
    title: "Priest in industrial Turin",
    highlight: "A youth club in an open field and chapel",
    body: "After his ordination in 1841, Don Bosco was sent to Turin, where factories and workshops drew thousands of young workers. He opened an oratory where boys gathered every Sunday for Mass, sacraments, catechism, games, and friendship.",
  },
  {
    title: "The first Catholic trade school",
    highlight: "Mother's  kitchen turned into workshops",
    body: "Aware of their material needs, he created a boys’ home where they could live, work, or study. He converted his mother’s kitchen into a cobbler and carpenter shop — the beginning of the first Catholic trade school in Italy.",
  },
  {
    title: "The Salesian family & global mission",
    highlight: "From Turin to the whole world",
    body: "In 1859, encouraged by Pope Pius IX, Don Bosco founded the Salesians, officially approved in 1874. He died in Turin on January 31, 1888, and was canonized in 1934. His feast is celebrated on January 31.",
  },
  {
    title: "Why Don Bosco matters to us",
    highlight: "Good Christians and honest citizens",
    body: "Don Bosco Technical Institutes are open to young people of all faiths and creeds, yet rooted in the Gospel vision that real happiness comes from love and service to God and neighbor.",
  },
];

const DonboscoSection: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 6, md: 10 }}
      >
        {/* LEFT: Founder highlight + core ideas cards */}
        <Box sx={{ flex: { md: 1 }, minWidth: 0 }}>
          <SectionHeader
            eyebrow="Our Founder"
            title="Don Bosco – Father, Education,Innovation, and Strategist to Empower the Youth TowardsTransformation"
            subtitle="From a small village in Becchi to the factories of Turin, Don Bosco dedicated his life to poor and working-class youth, forming them through faith, friendship, and skills for life."
            align="left"
          />

          <MotionBox
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            sx={{ mt: { xs: 4, md: 5 } }}
          >
            <GlowCard
              glow="primary"
              sx={{
                background:
                  "linear-gradient(140deg, rgba(42,8,10,0.9), rgba(92,18,12,0.9))",
                p: 3,
              }}
            >
              <Typography
                variant="overline"
                sx={{
                  color: "rgba(255,255,255,0.82)", // ✅ brighter
                  letterSpacing: 1.4,
                  fontSize: "0.78rem", // ✅ slightly bigger
                }}
              >
                Don Bosco in one sentence
              </Typography>

              <Typography
                variant="h6"
                fontWeight={800} // ✅ bolder
                sx={{
                  mt: 1.5,
                  color: "#ffffff", // ✅ bright white
                  fontSize: { xs: "1.22rem", md: "1.35rem" }, // ✅ bigger
                  lineHeight: 1.35,
                }}
              >
                He formed young people to be{" "}
                <Box component="span" sx={{ color: "#800000" }}>
                  good Christians and honest citizens
                </Box>{" "}
                through kindness, reason, and a family-like atmosphere of joy.
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  mt: 2,
                  color: "rgba(255,255,255,0.84)", // ✅ brighter
                  fontSize: { xs: "1.02rem", md: "1.08rem" }, // ✅ bigger
                  lineHeight: 1.75,
                }}
              >
                His way of education blended spiritual formation, character
                building, and practical skill training-an approach that still
                inspires Don Bosco technical institutes around the world.
              </Typography>

              <Stack
                direction="row"
                spacing={1.5}
                sx={{ mt: 2.5, flexWrap: "wrap" }}
              >
                <Chip
                  label="Born 1815 – Becchi, Italy"
                  size="small"
                  sx={{
                    bgcolor: "rgba(212,160,23,0.1)",
                    borderColor: "rgba(212,160,23,0.4)",
                    borderWidth: 1,
                    borderStyle: "solid",
                    color: "#ffffff", // ✅ brighter
                    "& .MuiChip-label": { fontSize: "0.9rem" }, // ✅ bigger
                  }}
                />
                <Chip
                  label="Priest in Turin"
                  size="small"
                  sx={{
                    bgcolor: "rgba(244,193,73,0.08)",
                    borderColor: "rgba(244,193,73,0.4)",
                    borderWidth: 1,
                    borderStyle: "solid",
                    color: "#ffffff", // ✅ brighter
                    "& .MuiChip-label": { fontSize: "0.9rem" }, // ✅ bigger
                  }}
                />

                <Chip
                  label="Founder of the Salesians"
                  size="small"
                  sx={{
                    bgcolor: "rgba(120,220,190,0.08)",
                    borderColor: "rgba(120,220,190,0.4)",
                    borderWidth: 1,
                    borderStyle: "solid",
                    color: "#ffffff", // ✅ brighter
                    "& .MuiChip-label": { fontSize: "0.9rem" }, // ✅ bigger
                  }}
                />
              </Stack>
            </GlowCard>
          </MotionBox>

          <Grid
            container
            spacing={2.5}
            sx={{ mt: { xs: 4, md: 5 } }}
            columns={{ xs: 1, sm: 2 }}
          >
            {coreIdeas.map((idea, index) => (
              <Grid key={idea.label}>
                <MotionBox
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  viewport={{ once: true }}
                >
                  <GlowCard
                    glow="primary"
                    sx={{
                      height: "100%",
                      background:
                        "linear-gradient(145deg, rgba(52,8,10,0.95), rgba(92,18,12,0.9))",
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="center"
                      sx={{ mb: 0.5 }}
                    >
                      <Box
                        sx={{
                          width: 34,
                          height: 34,
                          borderRadius: 12,
                          display: "grid",
                          placeItems: "center",
                          backgroundColor: "rgba(128,0,0,0.26)",
                          color: "#ffffff", // ✅ brighter
                        }}
                      >
                        {idea.icon}
                      </Box>
                      <Typography
                        variant="subtitle2"
                        fontWeight={800}
                        sx={{
                          color: "#ffffff", // ✅ brighter
                          fontSize: { xs: "1.02rem", md: "1.08rem" }, // ✅ bigger
                        }}
                      >
                        {idea.label}
                      </Typography>
                    </Stack>

                    <Typography
                      variant="body2"
                      sx={{
                        color: "rgba(255,255,255,0.82)", // ✅ brighter
                        fontSize: { xs: "0.98rem", md: "1.05rem" }, // ✅ bigger
                        lineHeight: 1.7,
                      }}
                    >
                      {idea.text}
                    </Typography>
                  </GlowCard>
                </MotionBox>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* RIGHT: Vertical story line / narrative */}
        <Box sx={{ flex: { md: 1 }, minWidth: 0 }}>
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            sx={{
              position: { md: "sticky" },
              top: { md: 112 },
            }}
          >
            <GlowCard
              glow="secondary"
              sx={{
                background:
                  "linear-gradient(160deg, rgba(84,14,10,0.95), rgba(42,8,10,0.9))",
              }}
            >
              <Typography
                variant="h5"
                fontWeight={800}
                sx={{
                  color: "#ffffff", // ✅ brighter
                  fontSize: { xs: "1.45rem", md: "1.6rem" }, // ✅ bigger
                }}
              >
                Don Bosco’s Journey
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
                A narrative arc from a struggling farm boy to a saint whose
                educational vision shapes Don Bosco institutes — and our campus
                — even today.
              </Typography>

              <Box
                sx={{
                  position: "relative",
                  pl: 3,
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    left: 12,
                    top: 4,
                    bottom: 4,
                    width: 2,
                    bgcolor: "rgba(212,160,23,0.35)",
                  },
                }}
              >
                <Stack spacing={3}>
                  {storyBlocks.map((block, index) => (
                    <motion.div
                      key={block.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Stack
                        direction="row"
                        spacing={2.5}
                        alignItems="flex-start"
                      >
                        <Box
                          sx={{
                            mt: 0.5,
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            background:
                              "linear-gradient(135deg, #800000, #d4a017)",
                            boxShadow: "0 0 18px rgba(212,160,23,0.7)",
                            flexShrink: 0,
                          }}
                        />
                        <Box>
                          <Typography
                            variant="subtitle2"
                            fontWeight={800}
                            sx={{
                              color: "#ffffff", // ✅ brighter
                              fontSize: { xs: "1.02rem", md: "1.1rem" }, // ✅ bigger
                            }}
                          >
                            {block.title}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              mt: 0.5,
                              color: "rgba(255,235,190,0.92)",
                              fontWeight: 600,
                              fontSize: { xs: "0.98rem", md: "1.05rem" }, // ✅ bigger
                            }}
                          >
                            {block.highlight}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              mt: 0.8,
                              color: "rgba(255,255,255,0.82)", // ✅ brighter
                              fontSize: { xs: "0.98rem", md: "1.05rem" }, // ✅ bigger
                              lineHeight: 1.75,
                            }}
                          >
                            {block.body}
                          </Typography>

                          {index === storyBlocks.length - 1 && (
                            <>
                              <Divider
                                sx={{
                                  mt: 2,
                                  mb: 1.5,
                                  borderColor: "rgba(212,160,23,0.25)",
                                }}
                              />
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "rgba(255,255,255,0.86)", // ✅ brighter
                                  fontSize: { xs: "1.0rem", md: "1.08rem" }, // ✅ bigger
                                  lineHeight: 1.75,
                                }}
                              >
                                Bosco Tech’s mission follows this same
                                philosophy: open to young people of all faiths,
                                yet firmly grounded in the belief that true
                                happiness comes from loving God and serving our
                                neighbor through our gifts, skills, and daily
                                work
                              </Typography>
                            </>
                          )}
                        </Box>
                      </Stack>
                    </motion.div>
                  ))}
                </Stack>
              </Box>
            </GlowCard>
          </MotionBox>
        </Box>
      </Stack>
    </Container>
  );
};

export default DonboscoSection;
