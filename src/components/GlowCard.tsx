import { Paper, PaperProps } from "@mui/material";

interface GlowCardProps extends PaperProps {
  glow?: "primary" | "secondary" | "neutral";
}

const glowMap: Record<NonNullable<GlowCardProps["glow"]>, string> = {
  primary:
    "linear-gradient(140deg, rgba(128, 0, 0, 0.45), rgba(163, 46, 46, 0.25))",
  secondary:
    "linear-gradient(140deg, rgba(212, 160, 23, 0.45), rgba(255, 219, 120, 0.25))",
  neutral:
    "linear-gradient(140deg, rgba(255, 255, 255, 0.23), rgba(255, 215, 191, 0.18))",
};

const GlowCard: React.FC<GlowCardProps> = ({
  children,
  glow = "neutral",
  sx,
  ...rest
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        position: "relative",
        overflow: "hidden",
        background: "rgba(30, 6, 7, 0.6)",
        borderRadius: 4,
        px: { xs: 3, md: 4 },
        py: { xs: 3, md: 4 },
        boxShadow: "0 22px 40px rgba(0, 0, 0, 0.25)",
        transition: "transform 300ms ease, box-shadow 300ms ease",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          padding: "1px",
          background: glowMap[glow],
          mask: "linear-gradient(#000, #000) content-box, linear-gradient(#000, #000)",
          WebkitMask:
            "linear-gradient(#000, #000) content-box, linear-gradient(#000, #000)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
        },
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 35px 50px rgba(64, 8, 8, 0.5)",
        },
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Paper>
  );
};

export default GlowCard;
