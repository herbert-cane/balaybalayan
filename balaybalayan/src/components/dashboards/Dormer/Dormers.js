import React, { useState } from "react";
import DormNavBar from "./DormerNavBar";
import DormerHomeSection from "./DormerHomeSection";
import DormerProfile from "./DormerProfileSection";
import DormerAccountInfo from "./DormerAccountInfo";
import DormerRoommateInfo from "./DormerRoommateInfo";
import DormerReportTab from "../../reportSystem/dormerReportTab";
import DormerRules from "./DormerRules";
import "./FullScreenToggle.css";
import PendingVerificationPage from "../../PendingVerificationPage";
import { useAuth } from "../../../AuthContext";

const Dormers = () => {
  const { isVerified } = useAuth();
  const [activeSection, setActiveSection] = useState("home");

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return <DormerHomeSection />;
      case "profile":
        return <DormerProfile />;
      case "accountInfo":
        return <DormerAccountInfo />;
      case "roommateInfo":
        return <DormerRoommateInfo />;
      case "dormerReports":
        return <DormerReportTab />;
      case "rules":
        return <DormerRules />;
      default:
        return <DormerHomeSection />;
    }
  };

  if (!isVerified) {
    return <PendingVerificationPage />;
  }

  return (
    <div className="main-layout">
      <DormNavBar setSection={setActiveSection} activeSection={activeSection} />
      <div className="section-content">{renderSection()}</div>
    </div>
  );
};

export default Dormers;
