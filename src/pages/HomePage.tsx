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
        // ✅ reduce top/bottom space (idaveli)
        py: { xs: 6, md: 9 },
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          // ✅ reduce gap between left & right sections
          spacing={{ xs: 5, md: 7 }}
          alignItems="center"
          justifyContent="space-between"
        >
          <Box sx={{ width: { xs: "100%", md: "52%" } }}>
            <Stack spacing={2.2}>
              <Chip
                label="The Digital Ai based Educational Campus of the Northern Province"
                sx={{
                  alignSelf: { xs: "flex-start", md: "flex-start" },
                  backgroundColor: "rgba(128,0,0,0.18)",
                  border: "1px solid rgba(212,160,23,0.4)",
                  color: "#fffdf8",
                  fontWeight: 700,
                  letterSpacing: 0.4,
                  fontSize: { xs: "0.82rem", sm: "0.92rem" },
                  height: { xs: "auto", sm: 36 },
                  "& .MuiChip-label": {
                    whiteSpace: { xs: "normal", sm: "nowrap" },
                    padding: { xs: "8px 10px", sm: "0 14px" },
                  },
                }}
              />

              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "3.05rem", md: "3.95rem" },
                  fontWeight: 800,
                  lineHeight: 1.05,
                  color: "#ffffff",
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
                  color: "rgba(255, 255, 255, 0.86)",
                  fontSize: { xs: "1.15rem", md: "1.28rem" },
                  maxWidth: 560,
                  lineHeight: 1.75,
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
                    color: "rgba(255,255,255,0.92)",
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

              <Stack spacing={1.15} sx={{ pt: 0.4 }}>
                {highlights.map((item) => (
                  <Stack
                    key={item}
                    direction="row"
                    alignItems="center"
                    spacing={1.3}
                    sx={{ color: "rgba(255,255,255,0.82)" }}
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
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      sx={{
                        fontSize: { xs: "0.98rem", md: "1.05rem" },
                        color: "rgba(255,255,255,0.88)",
                      }}
                    >
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
                px: { xs: 2, md: 0 }, // ✅ reduce side padding
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
                    inset: -26, // ✅ glow area slightly smaller
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
                      fontWeight={700}
                      sx={{
                        color: "#ffffff",
                        fontSize: { xs: "1.05rem", md: "1.12rem" },
                      }}
                    >
                      Upcoming immersion week
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "rgba(255,255,255,0.80)",
                        mt: 0.6,
                        fontSize: { xs: "0.95rem", md: "1.02rem" },
                        lineHeight: 1.65,
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
          sx={{ mt: { xs: 6, md: 7 } }} // ✅ reduce top margin before stats
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
                  gap: 0.7,
                  height: "100%",
                  py: { xs: 2.2, md: 2.6 },
                  px: { xs: 2.6, md: 3.2 },
                  minHeight: { xs: 86, md: 96 },
                  borderRadius: "999px",
                }}
              >
                <Typography
                  variant="h3"
                  fontWeight={800}
                  sx={{
                    color: "#d4a017",
                    fontSize: { xs: "2.0rem", md: "2.2rem" },
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: "rgba(255,255,255,0.92)",
                    maxWidth: 240,
                    fontSize: { xs: "0.98rem", md: "1.05rem" },
                    lineHeight: 1.2,
                  }}
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
            color: "#ffffff",
            fontSize: { xs: "1.05rem", md: "1.15rem" },
            fontWeight: 700,
          }}
        >
          Don Bosco InfoTech Our Story
          <IconButton
            onClick={handleCloseVideo}
            sx={{ color: "rgba(255,255,255,0.78)" }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pb: 3 }}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              pt: "56.25%",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
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
