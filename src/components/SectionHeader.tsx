import { Box, Typography, Stack } from "@mui/material";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  subtitle,
  align = "center",
}) => {
  return (
    <Stack
      spacing={2}
      alignItems={align === "center" ? "center" : "flex-start"}
      textAlign={align}
      sx={{ position: "relative", zIndex: 2 }}
    >
      {eyebrow && (
        <Box
          component="span"
          sx={{
            textTransform: "uppercase",
            letterSpacing: 4,
            fontSize: 12,
            fontWeight: 700,
            color: "rgba(255,255,255,0.7)",
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(128,0,0,0.5) 100%)",
            py: 0.5,
            px: 2.2,
            borderRadius: 999,
          }}
        >
          {eyebrow}
        </Box>
      )}
      <Typography
        variant="h3"
        sx={{
          fontWeight: 700,
          fontSize: { xs: "1.75rem", sm: "2.3rem", md: "3rem" },
          lineHeight: 1.1,
          background:
            "linear-gradient(90deg, #ffffff 0%, rgba(212, 160, 23, 0.95) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant="body1"
          sx={{
            maxWidth: 560,
            color: "rgba(255, 245, 234, 0.7)",
            fontSize: { xs: "1rem", md: "1.1rem" },
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Stack>
  );
};

export default SectionHeader;
