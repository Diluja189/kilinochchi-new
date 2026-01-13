import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Button, Container } from "@mui/material";
import { Link as RouterLink, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";

// ✅ FIX: Courses page import (your Courses.tsx)
import CoursesPage from "./pages/Courses";

import AboutPage from "./pages/AboutPage";
import NewsPage from "./pages/NewsPage";
import Footer from "./components/Footer";
import PlacementPage from "./pages/PlacementPage";

// ✅ FIX: Contact Us page import
import ContactPage from "./pages/ContactPage";

// ✅ Contact Directory page import
import Contactdirectory from "./pages/Contactdirectory";

import KiHubPage from "./pages/KiHubPage";
import CareerGuidePage from "./pages/careerguide";
import ChatWidget from "./components/ChatWidget";

// ✅ Admin imports
import AdminLogin from "./pages/admin/AdminLogin";
import AdminGuard from "./pages/admin/AdminGuard";

// ✅ NEW: One page for ALL 4 enquiries (Admissions + Angel + Seed + Remote)
import AdminAllEnquiries from "./pages/admin/AdminAllEnquiries";

const LandingPage: React.FC = () => {
  const [aboutTab, setAboutTab] = useState(0);
  const [activeSection, setActiveSection] = useState<string>("home");
  const activeSectionRef = useRef<string>("home");

  const sectionIds = useRef<string[]>([
    "home",
    "about",
    "courses",
    "placement",
    "kihub",
    "contact-directory", // ✅ Contact Directory section
    "contact", // ✅ Contact Us section
    "news",
    "careerguide",
  ]);

  const handleScrollToSection = useCallback((id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleAboutNavigation = (tabIndex: number) => {
    setAboutTab(tabIndex);
    handleScrollToSection("about");
  };

  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry) {
          const nextId = (visibleEntry.target as HTMLElement).id;
          if (nextId && activeSectionRef.current !== nextId) {
            setActiveSection(nextId);
          }
        }
      },
      {
        threshold: 0.35,
        rootMargin: "-25% 0px -40% 0px",
      }
    );

    sectionIds.current.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        color: "text.primary",
        backgroundColor: "transparent",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <Navbar
        scrollToSection={handleScrollToSection}
        onSelectAboutTab={handleAboutNavigation}
        activeSection={activeSection}
      />

      <Box
        component="main"
        sx={{
          pt: { xs: 10, md: 12 },
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            pointerEvents: "none",
            "&::before": {
              content: '""',
              position: "absolute",
              top: "-180px",
              right: "-220px",
              width: "540px",
              height: "540px",
              background:
                "radial-gradient(circle, rgba(165, 6, 6, 0.84) 0%, rgba(14, 5, 5, 0) 70%)",
              filter: "blur(0px)",
            },
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: "-260px",
              left: "-180px",
              width: "520px",
              height: "520px",
              background:
                "radial-gradient(circle, rgba(212,160,23,0.26) 0%, rgba(4,8,20,0) 70%)",
              filter: "blur(0px)",
            },
          }}
        />

        <HomePage />
        <AboutPage selectedTab={aboutTab} onTabChange={setAboutTab} />

        {/* ✅ Courses section now renders on website */}
        <CoursesPage />

        <PlacementPage />
        <KiHubPage />

        {/* ✅ Contact Directory section */}
        <Contactdirectory />

        {/* ✅ Contact Us section */}
        <ContactPage />

        <NewsPage />

        <Box id="careerguide">
          <CareerGuidePage />
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

const StandalonePageLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <Box
    sx={{
      minHeight: "100vh",
      color: "text.primary",
      backgroundColor: "transparent",
      position: "relative",
      overflowX: "hidden",
    }}
  >
    <Box
      component="main"
      sx={{
        pt: { xs: 10, md: 12 },
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "-180px",
            right: "-220px",
            width: "540px",
            height: "540px",
            background:
              "radial-gradient(circle, rgba(68, 0, 0, 0.51) 0%, rgba(4,8,20,0) 70%)",
            filter: "blur(0px)",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: "-260px",
            left: "-180px",
            width: "520px",
            height: "520px",
            background:
              "radial-gradient(circle, rgba(212,160,23,0.26) 0%, rgba(4,8,20,0) 70%)",
            filter: "blur(0px)",
          },
        }}
      />
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2, mb: 2 }}>
        <Button
          component={RouterLink}
          to="/"
          variant="outlined"
          color="secondary"
          sx={{ borderRadius: 999, textTransform: "none", fontWeight: 600 }}
        >
          Back to home
        </Button>
      </Container>
      <Box sx={{ position: "relative", zIndex: 2 }}>{children}</Box>
    </Box>
    <Footer />
  </Box>
);

const NewsFeedRoute: React.FC = () => (
  <StandalonePageLayout>
    <NewsPage enableManagement />
  </StandalonePageLayout>
);

const CareerGuideRoute: React.FC = () => (
  <StandalonePageLayout>
    <CareerGuidePage />
  </StandalonePageLayout>
);

const App: React.FC = () => {

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/news" element={<NewsFeedRoute />} />
        <Route path="/careerguide" element={<CareerGuideRoute />} />

        {/* ✅ Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ✅ ONE Admin Page: All 4 enquiries + buttons + scroll */}
        <Route
          path="/admin/enquiries"
          element={
            <AdminGuard>
              <AdminAllEnquiries />
            </AdminGuard>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ChatWidget />
    </>
  );
};

export default App;
