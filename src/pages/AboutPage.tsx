import React from "react";
import { Box, Container, Tab, Tabs } from "@mui/material";
import { styled } from "@mui/material/styles";
import AboutDonbosco from "./About-Donbosco";
import AboutInfotech from "./About-Infotech";
import MissionVision from "./Mission-Vision";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}


const StyledTabs = styled(Tabs)(() => ({
  "& .MuiTabs-indicator": {
    backgroundColor: "#d4a017",
    height: 3,
  },
}));


const StyledTab = styled(Tab)(() => ({
  "&.Mui-selected": {
    color: "#d4a017",
    fontWeight: 700,
  },
  color: "#ffffff",
  textTransform: "none",
  fontSize: "1rem",
}));

interface AboutPageProps {
  selectedTab: number;
  onTabChange: (value: number) => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ selectedTab, onTabChange }) => {
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    onTabChange(newValue);
  };

  return (
    <Box
      id="about"
      sx={{
        position: "relative",
        py: { xs: 12, md: 16 },
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <StyledTabs
              value={selectedTab}
              onChange={handleChange}
              aria-label="about tabs"
              centered={false}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                '& .MuiTabs-flexContainer': {
                  justifyContent: { xs: 'flex-start', md: 'center' },
                },
              }}
            >
              <StyledTab label="About Don Bosco" />
              <StyledTab label="About Infotech" />
              <StyledTab label="Mission & Vision" />
            </StyledTabs>
          </Box>

          <TabPanel value={selectedTab} index={0}>
            <AboutDonbosco />
          </TabPanel>
          <TabPanel value={selectedTab} index={1}>
            <AboutInfotech />
          </TabPanel>
          <TabPanel value={selectedTab} index={2}>
            <MissionVision />
          </TabPanel>
        </Box>
      </Container>

      {/* Background glows */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "-140px",
            left: "-120px",
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
            right: "-160px",
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

export default AboutPage;
