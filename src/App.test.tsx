import React, { useState } from "react";
import Navbar from "./components/Navbar";
import NewsSection from "./pages/NewsPage";
import AboutSection from "./pages/AboutPage";
import CoursesSection from "./pages/ContactPage";
import HomeSection from "./pages/HomePage";


const App: React.FC = () => {
  const [aboutTab, setAboutTab] = useState(0);
  const [activeSection, setActiveSection] = useState("home");

  const handleScrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleAboutTabSelect = (tabIndex: number) => {
    setAboutTab(tabIndex);
    handleScrollToSection("about");
  };

  return (
    <>
      <Navbar
        scrollToSection={handleScrollToSection}
        onSelectAboutTab={handleAboutTabSelect}
        activeSection={activeSection}
      />
      {/* Add top padding to account for fixed Navbar */}
      <div style={{ paddingTop: "64px" }}>
        <HomeSection />
        <CoursesSection />
        <AboutSection selectedTab={aboutTab} onTabChange={setAboutTab} />
        <NewsSection />
      </div>
    </>
  );
};

export default App;
