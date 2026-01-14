import React, { useMemo, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
  useScrollTrigger,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import donbosco from "../assets/donbosco.png";
// ✅ removed Link import (no admin button now)

interface NavbarProps {
  scrollToSection: (id: string) => void;
  onSelectAboutTab: (tabIndex: number) => void;
  activeSection: string;
}

const navLinks = [
  { label: "Home", id: "home" },
  { label: "Courses", id: "courses" },
  { label: "News", id: "news" },
  { label: "Placement", id: "placement" },
  { label: "Contact Directory", id: "contact-directory" },
  { label: "KI-Hub", id: "kihub" },
  { label: "Career Guide", id: "careerguide" },
];

const aboutTabs = [
  { label: "About Don Bosco", value: 0 },
  { label: "About Infotech", value: 1 },
  { label: "Mission & Vision", value: 2 },
];

// ✅ Same size for ALL buttons
const btnBase = {
  borderRadius: 999,
  textTransform: "none",
  fontWeight: 650,
  fontSize: 13,
  px: 1.6,
  py: 0.65,
  minHeight: 34,
  lineHeight: 1.1,
  whiteSpace: "nowrap" as const,
} as const;

const navButtonStyles = (active: boolean) => ({
  ...btnBase,
  color: active ? "#fff" : "rgba(255,245,234,0.78)",
  backgroundColor: active ? "rgba(128,0,0,0.22)" : "transparent",
  transition: "all 0.2s ease",
  "&:hover": { backgroundColor: "rgba(255,255,255,0.12)" },
});

const ctaBtnSx = { ...btnBase } as const;

const Navbar: React.FC<NavbarProps> = ({
  scrollToSection,
  onSelectAboutTab,
  activeSection,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [aboutAnchorEl, setAboutAnchorEl] = useState<null | HTMLElement>(null);

  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 24 });
  const backgroundColor = useMemo(
    () => (trigger ? "rgba(32, 6, 8, 0.95)" : "rgba(32, 6, 8, 0.82)"),
    [trigger]
  );

  const handleNavigate = (id: string) => {
    scrollToSection(id);
    setDrawerOpen(false);
  };

  const handleAboutButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAboutAnchorEl(event.currentTarget);
  };

  const handleAboutMenuClose = () => setAboutAnchorEl(null);

  const handleAboutSelection = (tabIndex: number) => {
    onSelectAboutTab(tabIndex);
    setDrawerOpen(false);
    handleAboutMenuClose();
  };

  const aboutActive = activeSection === "about";

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(18px)",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ py: 1.5 }}>
            {/* Brand */}
            <Stack
              direction="row"
              spacing={1.4}
              alignItems="center"
              sx={{ cursor: "pointer", flexShrink: 0, minWidth: 260 }}
              onClick={() => handleNavigate("home")}
            >
              <Box
                sx={{
                  width: 40,
                  height: 46,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: "10px",
                  background:
                    "linear-gradient(135deg, rgba(128, 0, 0, 0.9), rgba(212, 160, 23, 0.65))",
                  border: "1px solid rgba(255,255,255,0.12)",
                  overflow: "hidden",
                }}
              >
                <img
                  src={donbosco}
                  alt="db"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "invert(1)",
                  }}
                />
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle1" fontWeight={700} noWrap>
                  Don Bosco InfoTech
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "rgba(255,245,234,0.7)",
                    letterSpacing: 0.4,
                    display: { xs: "none", sm: "block" },
                  }}
                  noWrap
                >
                  Kilinochchi Campus
                </Typography>
              </Box>
            </Stack>

            {/* Desktop Nav */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                flex: 1,
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 0.9,
                flexWrap: "nowrap",
                minWidth: 0,
              }}
            >
              <Button
                endIcon={<KeyboardArrowDownRoundedIcon />}
                onClick={handleAboutButtonClick}
                sx={navButtonStyles(aboutActive)}
                aria-controls={aboutAnchorEl ? "about-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={aboutAnchorEl ? "true" : undefined}
              >
                About
              </Button>

              {navLinks.map((link) => (
                <Button
                  key={`${link.id}-${link.label}`}
                  onClick={() => handleNavigate(link.id)}
                  sx={navButtonStyles(activeSection === link.id)}
                >
                  {link.label}
                </Button>
              ))}

              {/* CTA at END */}
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleNavigate("contact")}
                sx={{ ...ctaBtnSx, ml: 1 }}
              >
                Apply
              </Button>

              {/* ✅ Admin Login removed */}
            </Box>

            {/* Mobile toggle */}
            <IconButton
              sx={{
                display: { xs: "flex", md: "none" },
                ml: "auto",
                color: "#fff5ea",
              }}
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation"
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* About Menu */}
      <Menu
        id="about-menu"
        anchorEl={aboutAnchorEl}
        open={Boolean(aboutAnchorEl)}
        onClose={handleAboutMenuClose}
        MenuListProps={{ dense: true }}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        {aboutTabs.map((tab) => (
          <MenuItem key={tab.value} onClick={() => handleAboutSelection(tab.value)}>
            {tab.label}
          </MenuItem>
        ))}
      </Menu>

      {/* Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "85vw", sm: 280 },
            maxWidth: 320,
            backgroundColor: "rgba(32, 6, 8, 0.98)",
            backdropFilter: "blur(18px)",
            color: "#fff5ea",
          },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" px={2} py={2}>
          <Typography variant="subtitle1" fontWeight={600}>
            Quick Links
          </Typography>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: "#fff5ea" }}>
            <CloseRoundedIcon />
          </IconButton>
        </Stack>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

        <List>
          <Box px={2} pt={2} pb={1}>
            <Typography variant="body2" fontWeight={600}>
              About
            </Typography>
          </Box>

          {aboutTabs.map((tab) => (
            <ListItem key={tab.value} disablePadding sx={{ pl: 2 }}>
              <ListItemButton onClick={() => handleAboutSelection(tab.value)} sx={{ borderRadius: 2 }}>
                <ListItemText primary={tab.label} />
              </ListItemButton>
            </ListItem>
          ))}

          <Divider sx={{ my: 1.5, borderColor: "rgba(255,255,255,0.08)" }} />

          {navLinks.map((link) => (
            <ListItem key={`${link.id}-${link.label}`} disablePadding>
              <ListItemButton onClick={() => handleNavigate(link.id)} sx={{ borderRadius: 2, mx: 1 }}>
                <ListItemText primary={link.label} />
              </ListItemButton>
            </ListItem>
          ))}

          {/* ✅ Admin Login removed from drawer */}
        </List>

        <Box px={2} py={3}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => handleNavigate("contact")}
            sx={{ borderRadius: 999, textTransform: "none", fontWeight: 600 }}
          >
            Apply Now
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
