import React, { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  CircularProgress,
} from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { motion } from "framer-motion";
import heroImage from "../images/1.png";
import GlowCard from "../components/GlowCard";

const MotionBox = motion(Box);

const stats = [
  { label: "Trained Students", value: "83+" },
  { label: "Partner Companies", value: "11" },
  { label: "Placed Students", value: "40+" },
];

const highlights = [
  "Industry Betted syllabus",
  "Project-based Learning Culture",
  "Corporate Certification",
  "Mentors from global Tech companies",
  "Scholarships/Seed Funding/ Venture Capital Investment for emerging tech innovators",
];

const HomeSection: React.FC = () => {
  const [videoOpen, setVideoOpen] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);

  const handleOpenVideo = () => {
    setVideoLoading(true); // show loader whenever dialog opens
    setVideoOpen(true);
  };

  const handleCloseVideo = () => {
    setVideoOpen(false);
  };

  return (
    <Box
      id="home"
      sx={{
        position: "relative",
        py: { xs: 12, md: 16 },
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 8, md: 10 }}
          alignItems="center"
          justifyContent="space-between"
        >
          <Box sx={{ width: { xs: "100%", md: "52%" } }}>
            <Stack spacing={3}>
              <Chip
                label="The Digital Ai based Educational Campus of the Northern Province"
                sx={{
                  alignSelf: { xs: "flex-start", md: "flex-start" },
                  backgroundColor: "rgba(128,0,0,0.18)",
                  border: "1px solid rgba(212,160,23,0.4)",
                  color: "#fff5ea",
                  fontWeight: 600,
                  letterSpacing: 0.4,
                  fontSize: { xs: '0.7rem', sm: '0.8125rem' },
                  height: { xs: 'auto', sm: 32 },
                  '& .MuiChip-label': {
                    whiteSpace: { xs: 'normal', sm: 'nowrap' },
                    padding: { xs: '6px 8px', sm: '0 12px' },
                  },
                }}
              />

              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "2.8rem", md: "3.6rem" },
                  fontWeight: 800,
                  lineHeight: 1.05,
                }}
              >
                Crafting Tech Leaders for{" "}
                <Box
                  component="span"
                  sx={{
                    background:
                      "linear-gradient(90deg, #800000 0%, #d4a017 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  the Future of Sri Lanka
                </Box>
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255, 245, 234, 0.72)",
                  fontSize: { xs: "1.05rem", md: "1.15rem" },
                  maxWidth: 540,
                }}
              >
                Don Bosco InfoTech Kilinochchi blends frontier technologies with
                hands-on mentorship, empowering students to engineer solutions
                that matter to communities, startups, and global companies.
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  variant="contained"
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{ minWidth: 180 }}
                >
                  Explore Programs
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  endIcon={<PlayArrowRoundedIcon />}
                  onClick={handleOpenVideo}
                  sx={{
                    borderColor: "rgba(255,245,234,0.3)",
                    color: "rgba(255,245,234,0.9)",
                    minWidth: 180,
                    "&:hover": {
                      borderColor: "rgba(212,160,23,0.6)",
                      backgroundColor: "rgba(128,0,0,0.08)",
                    },
                  }}
                >
                  Watch Our Story
                </Button>
              </Stack>

              <Stack spacing={1.5} sx={{ pt: 1 }}>
                {highlights.map((item) => (
                  <Stack
                    key={item}
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                    sx={{ color: "rgba(255,245,234,0.7)" }}
                  >
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background:
                          "linear-gradient(135deg, #800000, #d4a017)",
                        boxShadow: "0 0 18px rgba(128,0,0,0.45)",
                      }}
                    />
                    <Typography variant="body2" fontWeight={500}>
                      {item}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Box>

          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <Box
              sx={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                px: { xs: 3, md: 0 },
              }}
            >
              <MotionBox
                initial={{ opacity: 0, scale: 0.9, rotate: -6 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                sx={{
                  width: { xs: "100%", md: "90%" },
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    inset: -30,
                    background:
                      "radial-gradient(circle at 30% 20%, rgba(128,0,0,0.35), transparent 60%), radial-gradient(circle at 80% 40%, rgba(212,160,23,0.28), transparent 60%)",
                    filter: "blur(14px)",
                    borderRadius: "36px",
                  }}
                />
                <GlowCard
                  glow="primary"
                  sx={{
                    background:
                      "linear-gradient(160deg, rgba(151, 7, 7, 0.92), rgba(44, 2, 8, 0.7))",
                    py: { xs: 4, md: 5 },
                    px: { xs: 3, md: 4 },
                  }}
                >
                  <Box
                    component="img"
                    src={heroImage}
                    alt="Students collaborating on code"
                    sx={{
                      width: "100%",
                      aspectRatio: "4 / 3",
                      objectFit: "contain",
                      transform: "scale(1.02)",
                    }}
                  />

                  <GlowCard
                    glow="secondary"
                    sx={{
                      mt: 3,
                      background:
                        "linear-gradient(135deg, rgba(128,0,0,0.15), rgba(212,160,23,0.1))",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      sx={{ color: "#fff5ea" }}
                    >
                      Upcoming immersion week
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "rgba(255,245,234,0.65)",
                        mt: 0.5,
                      }}
                    >
                      7-day sprint with AI labs, Zoho Creator bootcamp, and
                      industry mentorship circles.
                    </Typography>
                  </GlowCard>
                </GlowCard>
              </MotionBox>
            </Box>
          </Box>
        </Stack>

        {/* Stats Section */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2.5}
          justifyContent="space-between"
          sx={{ mt: { xs: 8, md: 10 } }}
        >
          {stats.map((stat) => (
            <MotionBox
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              sx={{ flex: 1 }}
            >
              <GlowCard
                glow="primary"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  height: "100%",
                }}
              >
                {/* Numbers in solid dark yellow */}
                <Typography
                  variant="h3"
                  fontWeight={700}
                  sx={{ color: "#d4a017" }}
                >
                  {stat.value}
                </Typography>
                {/* Labels in white */}
                <Typography
                  variant="body1"
                  sx={{ color: "#ffffff", maxWidth: 220 }}
                >
                  {stat.label}
                </Typography>
              </GlowCard>
            </MotionBox>
          ))}
        </Stack>
      </Container>

      {/* Video Dialog */}
      <Dialog
        open={videoOpen}
        onClose={handleCloseVideo}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background:
              "linear-gradient(160deg, rgba(38, 6, 8, 0.96), rgba(82, 25, 6, 0.9))",
            borderRadius: 3,
            border: "1px solid rgba(212,160,23,0.4)",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#fff5ea",
          }}
        >
          Don Bosco InfoTech Our Story
          <IconButton
            onClick={handleCloseVideo}
            sx={{ color: "rgba(255,245,234,0.7)" }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pb: 3 }}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              pt: "56.25%", // 16:9 aspect ratio
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            {/* Loading overlay */}
            {videoLoading && (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(38, 6, 8, 0.85)",
                  zIndex: 5,
                  transition: "opacity 0.4s ease",
                }}
              >
                <CircularProgress size={50} sx={{ color: "#800000" }} />
              </Box>
            )}

            {/* YouTube iframe */}
            <Box
              component="iframe"
              src="https://www.youtube.com/embed/u1jjgx9Hilc?si=pNknkQaf3h6yuev9"
              title="Don Bosco InfoTech - Our Story"
              onLoad={() => setVideoLoading(false)}
              sx={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                border: 0,
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </Box>
        </DialogContent>
      </Dialog>

      {/* Background glows */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          "&::before": {
            content: '""',
            position: "absolute",
            top: { xs: "8%", md: "12%" },
            left: "-120px",
            width: "320px",
            height: "320px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(128,0,0,0.25) 0%, transparent 70%)",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: { xs: "-140px", md: "-200px" },
            right: "-120px",
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

export default HomeSection;
