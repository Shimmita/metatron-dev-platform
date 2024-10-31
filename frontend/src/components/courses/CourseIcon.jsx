import {
    AndroidRounded,
    Apple,
    CloudRounded,
    CodeRounded,
    CurrencyBitcoinRounded,
    DesktopMacRounded,
    DeveloperBoardRounded,
    DevicesOtherRounded,
    DomainVerificationRounded,
    DrawRounded,
    FingerprintRounded,
    HubRounded,
    LaptopRounded,
    LayersRounded,
    LeaderboardRounded,
    MemoryRounded,
    PsychologyAltRounded,
    PsychologyRounded,
    SettingsRounded,
    SportsEsportsRounded,
    StorageRounded,
    TimelineRounded,
    WebRounded,
    WysiwygRounded
} from "@mui/icons-material";
import { Avatar } from "@mui/material";
import React from "react";
import cyber from "../../images/cyber_3.png";
import docker from "../../images/docker.png";
import linuxLogo from "../../images/linux.jpeg";

function CourseIcon({ option = "" }) {
  if (option.toLowerCase().includes("android")) {
    return <AndroidRounded color="success" sx={{ width: 24, height: 24 }} />;
  }

  if (option.toLowerCase().includes("arduino")) {
    return <MemoryRounded sx={{ width: 26, height: 26 }} />;
  }
  if (option.toLowerCase().includes("frontend")) {
    return <LaptopRounded sx={{ width: 24, height: 24 }} />;
  }
  if (option.toLowerCase().includes("backend")) {
    return <SettingsRounded sx={{ width: 24, height: 24 }} />;
  }
  if (option.toLowerCase().includes("ios")) {
    return <Apple sx={{ width: 24, height: 24 }} />;
  }
  if (option.toLowerCase().includes("database")) {
    return <StorageRounded sx={{ width: 24, height: 24 }} />;
  }

  if (option.toLowerCase().includes("design")) {
    return <DrawRounded color="primary" sx={{ width: 24, height: 24 }} />;
  }
  if (option.toLowerCase().includes("cloud")) {
    return <CloudRounded sx={{ width: 24, height: 24 }} />;
  }
  if (option.toLowerCase().includes("block chain")) {
    return <CurrencyBitcoinRounded sx={{ width: 26, height: 26 }} />;
  }
  if (option.toLowerCase().includes("networks")) {
    return <HubRounded sx={{ width: 24, height: 24 }} />;
  }
  if (option.toLowerCase().includes("containerisation")) {
    return <Avatar src={docker} alt="image" sx={{ width: 26, height: 26 }} />;
  }
  if (option.toLowerCase().includes("programming")) {
    return <CodeRounded sx={{ width: 24, height: 24 }} />;
  }
  if (option.toLowerCase().includes("game")) {
    return <SportsEsportsRounded sx={{ width: 26, height: 26 }} />;
  }
  if (option.toLowerCase().includes("cybersecurity")) {
    return <Avatar src={cyber} alt={"image"} sx={{ width: 35, height: 35 }} />;
  }
  if (option.toLowerCase().includes("machine")) {
    return <PsychologyRounded sx={{ width: 28, height: 28 }} />;
  }

  if (option.toLowerCase().includes("fullstack")) {
    return <LayersRounded sx={{ width: 28, height: 28 }} />;
  }
  if (option.toLowerCase().includes("internet")) {
    return <DevicesOtherRounded sx={{ width: 25, height: 25 }} />;
  }
  if (option.toLowerCase().includes("data science")) {
    return <LeaderboardRounded sx={{ width: 25, height: 25 }} />;
  }
  if (option.toLowerCase().includes("desktop")) {
    return <DesktopMacRounded sx={{ width: 25, height: 25 }} />;
  }
  if (option.toLowerCase().includes("developer")) {
    return <TimelineRounded sx={{ width: 25, height: 25 }} />;
  }
  if (option.toLowerCase().includes("digital")) {
    return <FingerprintRounded sx={{ width: 25, height: 25 }} />;
  }
  if (option.toLowerCase().includes("multiplatform")) {
    return (
      <>
        <AndroidRounded sx={{ width: 24, height: 24 }} /> +
        <Apple sx={{ width: 22, height: 22 }} />
      </>
    );
  }
  if (option.toLowerCase().includes("system")) {
    return (
      <Avatar src={linuxLogo} alt="image" sx={{ width: 30, height: 30 }} />
    );
  }
  if (option.toLowerCase().includes("wordpres")) {
    return <WysiwygRounded sx={{ width: 25, height: 25 }} />;
  }
  if (option.toLowerCase().includes("web hosting")) {
    return <WebRounded sx={{ width: 25, height: 25 }} />;
  }
  if (option.toLowerCase().includes("robot")) {
    return <PsychologyAltRounded sx={{ width: 26, height: 26 }} />;
  }
  if (option.toLowerCase().includes("platform")) {
    return <DeveloperBoardRounded sx={{ width: 25, height: 25 }} />;
  }
  if (option.toLowerCase().includes("site reliability")) {
    return <DomainVerificationRounded sx={{ width: 25, height: 25 }} />;
  }
}

export default CourseIcon;
