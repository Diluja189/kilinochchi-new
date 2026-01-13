import React, { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Collapse,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import SettingsSuggestRoundedIcon from "@mui/icons-material/SettingsSuggestRounded";
import ArchitectureRoundedIcon from "@mui/icons-material/ArchitectureRounded";
import LaunchRoundedIcon from "@mui/icons-material/LaunchRounded";
import AutoModeRoundedIcon from "@mui/icons-material/AutoModeRounded";
import { motion } from "framer-motion";
import GlowCard from "../components/GlowCard";
import SectionHeader from "../components/SectionHeader";

const MotionBox = motion(Box);

type Course = {
  title: string;
  tagline: string;
  description: string;
  focus: string[];
  outcomes: string[];
  icon: React.ReactNode;
  accent: "primary" | "secondary";
};

const courses: Course[] = [
  {
    title: "CodeCraft Studio",
    tagline: "Full-stack software craftsmanship",
    description:
      "Architect robust web applications with TypeScript, React 19, and cloud-native stacks. Collaborate with real startups every sprint.",
    focus: ["React 19", "TypeScript", "Cloud Functions", "Design Systems"],
    outcomes: [
      "Build production-ready interfaces with automated testing pipelines.",
      "Ship microservices with CI/CD on modern cloud platforms.",
      "Mentor junior teams through peer code reviews and design critiques.",
    ],
    icon: <CodeRoundedIcon sx={{ fontSize: 42 }} />,
    accent: "primary",
  },
  {
    title: "Zoho Creator Architects",
    tagline: "Low-code automation leaders",
    description:
      "Design enterprise automation workflows that transform operations with Zoho Creator, analytics dashboards, and API integrations.",
    focus: ["Process Design", "Automation", "Integrations", "UI/UX"],
    outcomes: [
      "Deliver multi-user business apps with secure data models.",
      "Automate legacy processes using Creator workflows and Deluge.",
      "Consult organizations on rapid digital transformation strategies.",
    ],
    icon: <SettingsSuggestRoundedIcon sx={{ fontSize: 42 }} />,
    accent: "secondary",
  },
  {
    title: "Applied Intelligence Lab",
    tagline: "AI copilots and creative automation",
    description:
      "Blend machine intelligence with human creativity. Master prompt engineering, AI toolchains, and responsible deployment patterns.",
    focus: ["LLM Apps", "Automation", "Ethical AI", "Prompt Craft"],
    outcomes: [
      "Prototype AI assistants that augment product and service teams.",
      "Design intelligent pipelines using GPTs, vision, and audio models.",
      "Evaluate bias, security, and compliance across AI rollouts.",
    ],
    icon: <SmartToyRoundedIcon sx={{ fontSize: 42 }} />,
    accent: "primary",
  },
  {
    title: "BIM & Digital Twins",
    tagline: "Immersive infrastructure engineering",
    description:
      "Harness Building Information Modeling and XR to coordinate construction and smart-city projects with data-rich digital twins.",
    focus: ["Revit", "Navisworks", "Simulation", "Collaboration"],
    outcomes: [
      "Translate architectural plans into high-fidelity BIM experiences.",
      "Coordinate multidisciplinary teams with clash detection workflows.",
      "Deploy digital twins that monitor live infrastructure health.",
    ],
    icon: <ArchitectureRoundedIcon sx={{ fontSize: 42 }} />,
    accent: "secondary",
  },
];

const CoursesSection: React.FC = () => {
  const [expandedCourse, setExpandedCourse] = useState<string | null>(
    courses[0]?.title ?? null
  );

  const handleToggle = (title: string) => {
    setExpandedCourse((prev) => (prev === title ? null : title));
  };

  return (
    <Box
      id="courses"
      sx={{
        position: "relative",
        py: { xs: 12, md: 16 },
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <SectionHeader
          eyebrow="Courses"
          title="Choose a pathway that accelerates your tech future"
          subtitle="Each pathway pairs deep technical mastery with entrepreneurial thinking, so you create impact from Kilinochchi to the world."
        />

        <Box
          sx={{
            mt: { xs: 6, md: 8 },
            display: "grid",
            gap: { xs: 3, md: 4 },
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, minmax(0, 1fr))",
            },
          }}
        >
          {courses.map((course) => (
            <MotionBox
              key={course.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <GlowCard
                glow={course.accent}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  height: "100%",
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "18px",
                      display: "grid",
                      placeItems: "center",
                      background:
                        course.accent === "primary"
                          ? "linear-gradient(135deg, rgba(128,0,0,0.25), rgba(128,0,0,0.45))"
                          : "linear-gradient(135deg, rgba(244,203,94,0.3), rgba(212,160,23,0.45))",
                      color: "#fff5ea",
                    }}
                  >
                    {course.icon}
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight={700}>
                      {course.title}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "rgba(255,245,234,0.65)", mt: 0.5 }}
                    >
                      {course.tagline}
                    </Typography>
                  </Box>
                </Stack>

                <Typography
                  variant="body1"
                  sx={{ color: "rgba(255,245,234,0.7)" }}
                >
                  {course.description}
                </Typography>

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {course.focus.map((topic) => (
                    <Chip
                      key={topic}
                      label={topic}
                      size="small"
                      sx={{
                        borderRadius: 2,
                        border: "1px solid rgba(255,245,234,0.24)",
                        color: "rgba(255,245,234,0.85)",
                        backgroundColor: "rgba(255,255,255,0.08)",
                      }}
                    />
                  ))}
                </Stack>

                <Divider
                  sx={{
                    borderColor: "rgba(255,255,255,0.06)",
                    my: 1,
                  }}
                />

                <Button
                  color="inherit"
                  endIcon={<LaunchRoundedIcon />}
                  sx={{
                    alignSelf: "flex-start",
                    borderRadius: 999,
                    px: 2.5,
                    py: 1,
                    backgroundColor: "rgba(128,0,0,0.14)",
                    color: "#fff5ea",
                    "&:hover": {
                      backgroundColor: "rgba(128,0,0,0.25)",
                    },
                  }}
                  onClick={() => handleToggle(course.title)}
                >
                  {expandedCourse === course.title ? "Hide outline" : "View outline"}
                </Button>

                <Collapse in={expandedCourse === course.title} timeout={350}>
                  <Stack spacing={1.5} sx={{ mt: 1 }}>
                    {course.outcomes.map((outcome) => (
                      <Stack
                        key={outcome}
                        direction="row"
                        spacing={1.5}
                        alignItems="flex-start"
                      >
                        <AutoModeRoundedIcon
                          sx={{
                            mt: 0.5,
                            fontSize: 18,
                            color:
                              course.accent === "primary"
                                ? "rgba(212,160,23,0.85)"
                                : "rgba(255,177,152,0.85)",
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ color: "rgba(255,245,234,0.7)" }}
                        >
                          {outcome}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Collapse>
              </GlowCard>
            </MotionBox>
          ))}
        </Box>

        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <GlowCard
            glow="primary"
            sx={{
              mt: { xs: 8, md: 12 },
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: "space-between",
              gap: { xs: 3, md: 6 },
              background:
                "linear-gradient(135deg, rgba(42,8,10,0.85), rgba(84,14,10,0.72))",
            }}
          >
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Build your signature capstone with global mentors
              </Typography>
              <Typography
                variant="body1"
                sx={{ mt: 1.5, color: "rgba(255,245,234,0.68)", maxWidth: 540 }}
              >
                Submit a problem statement, assemble a squad, and spend 12 weeks
                building solutions with technologists from industry partners in
                Colombo, Singapore, and Berlin.
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="large"
              color="secondary"
              sx={{
                fontWeight: 700,
                px: 4,
                boxShadow: "0 16px 32px rgba(212,160,23,0.35)",
              }}
            >
              Download Prospectus
            </Button>
          </GlowCard>
        </MotionBox>
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

export default CoursesSection;









