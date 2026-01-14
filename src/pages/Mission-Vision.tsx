import React from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import GlowCard from "../components/GlowCard";
import SectionHeader from "../components/SectionHeader";

const MotionBox = motion(Box);

const MissionAndVisionSection: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 4, md: 6 }}
        alignItems="stretch"
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <SectionHeader
            eyebrow="Our Heartbeat"
            title="Vision & Mission"
            subtitle="Why Don Bosco InfoTech exists, and how we journey with young people in Sri Lanka."
            align="left"
          />
        </Box>

        <Stack sx={{ flex: 1.2, minWidth: 0 }} spacing={3}>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <GlowCard
              glow="primary"
              sx={{
                background:
                  "linear-gradient(135deg, rgba(42,8,10,0.9), rgba(84,14,10,0.9))",
              }}
            >
              <Typography
                variant="overline"
                sx={{
                  letterSpacing: 2,
                  color: "rgba(255,255,255,0.86)", // ✅ brighter
                  fontSize: "0.78rem", // ✅ slightly bigger
                }}
              >
                Vision
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  mt: 1.5,
                  color: "rgba(255,255,255,0.92)", // ✅ brighter
                  fontSize: { xs: "1.08rem", md: "1.16rem" }, // ✅ bigger
                  lineHeight: 1.85,
                }}
              >
                We are committed in creating a center for excellence where we
                provide holistic education, professional training and placement
                for the marginalized and the needy young people in the onward
                vision of march of an emerging and developing Sri Lanka.
              </Typography>
            </GlowCard>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <GlowCard
              glow="secondary"
              sx={{
                background:
                  "linear-gradient(150deg, rgba(84,14,10,0.95), rgba(42,8,10,0.9))",
              }}
            >
              <Typography
                variant="overline"
                sx={{
                  letterSpacing: 2,
                  color: "rgba(255,255,255,0.86)", // ✅ brighter
                  fontSize: "0.78rem", // ✅ slightly bigger
                }}
              >
                Mission
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  mt: 1.5,
                  color: "rgba(255,255,255,0.92)", // ✅ brighter
                  fontSize: { xs: "1.08rem", md: "1.16rem" }, // ✅ bigger
                  lineHeight: 1.85,
                }}
              >
                We empower the marginalized and disadvantaged youth to reach
                their dreams by developing their skills and thus to transform
                the society.
              </Typography>
            </GlowCard>
          </MotionBox>
        </Stack>
      </Stack>
    </Container>
  );
};

export default MissionAndVisionSection;
