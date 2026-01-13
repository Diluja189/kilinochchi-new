import { Box, Container, IconButton, Stack, Typography } from "@mui/material";
import {
  Facebook,
  Instagram,
  LinkedIn,
  YouTube,
} from "@mui/icons-material";

const socialLinks = [
  { label: "Facebook", Icon: Facebook },
  { label: "Instagram", Icon: Instagram },
  { label: "LinkedIn", Icon: LinkedIn },
  { label: "YouTube", Icon: YouTube },
];

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 12,
        pt: 8,
        pb: 6,
        background:
          "radial-gradient(circle at 20% -10%, rgba(209, 212, 7, 0.56), transparent 65%), rgba(114, 0, 0, 0.95)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
        >
          <Stack spacing={1.2}>
            <Typography variant="h5" fontWeight={700}>
              DonBosco InfoTech
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "rgba(255, 245, 234, 0.6)", maxWidth: 420 }}
            >
              Building a vibrant technology community in Kilinochchi through
              immersive learning, industry mentorship, and future-ready skills.
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "rgba(255, 245, 234, 0.45)" }}
            >
              Copyright {new Date().getFullYear()} DonBosco InfoTech. All rights
              reserved.
            </Typography>
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="subtitle2" sx={{ color: "rgba(255,255,255,0.7)" }}>
              Follow our journey
            </Typography>
            <Stack direction="row" spacing={1.5}>
              {socialLinks.map(({ label, Icon }) => (
                <IconButton
                  key={label}
                  sx={{
                    border: "1px solid rgba(255,255,255,0.25)",
                    color: "#fff5ea",
                    backdropFilter: "blur(10px)",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.12)",
                    },
                  }}
                  aria-label={`Visit our ${label} page`}
                >
                  <Icon fontSize="medium" />
                </IconButton>
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;



