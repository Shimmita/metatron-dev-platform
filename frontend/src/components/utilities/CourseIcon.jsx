import {
  AndroidRounded,
  Apple,
  AppsRounded,
  CloudRounded,
  CodeRounded,
  DesktopMacRounded,
  DeveloperBoardRounded,
  DevicesOtherRounded,
  DomainVerificationRounded,
  DrawRounded,
  FingerprintRounded,
  HubRounded,
  LanguageRounded,
  LaptopRounded,
  LayersRounded,
  LeaderboardRounded,
  MemoryRounded,
  PsychologyAltRounded,
  PsychologyRounded,
  SettingsRounded,
  SmartphoneRounded,
  SportsEsportsRounded,
  StorageRounded,
  SupportAgentRounded,
  TimelineRounded,
  TuneRounded,
  WebRounded,
} from "@mui/icons-material";
import { Avatar } from "@mui/material";
import React from "react";
import bitcoin from "../../images/bitcoin.png";
import cyber from "../../images/cybersecurity.jpeg";
import devops from "../../images/devOps.jpeg";
import docker from "../../images/docker.png";
import linuxLogo from "../../images/linux.jpeg";
import wordpress from "../../images/wordpress.png";

function CourseIcon({ option = "" }) {
  if (option.toLowerCase().includes("all")) {
    return <AppsRounded sx={{ width: 20, height: 20 }} />;
  }
  if (option.toLowerCase().includes("android")) {
    return <AndroidRounded color="success" sx={{ width: 22, height: 22 }} />;
  }

  if (option.toLowerCase().includes("arduino")) {
    return <MemoryRounded sx={{ width: 26, height: 26 }} />;
  }
  if (option.toLowerCase().includes("frontend")) {
    return <LaptopRounded sx={{ width: 22, height: 22 }} />;
  }
  if (option.toLowerCase().includes("backend")) {
    return <SettingsRounded sx={{ width: 22, height: 22 }} />;
  }
  if (option.toLowerCase().includes("ios")) {
    return <Apple sx={{ width: 22, height: 22 }} />;
  }
  if (option.toLowerCase().includes("database")) {
    return <StorageRounded sx={{ width: 24, height: 24 }} />;
  }

    if (option.toLowerCase().includes("principle")) {
    return <TuneRounded color="primary" sx={{ width: 22, height: 22 }} />;
  }

  if (option.toLowerCase().includes("design")) {
    return <DrawRounded color="secondary" sx={{ width: 22, height: 22 }} />;
  }

  if (option.toLowerCase().includes("cloud")) {
    return <CloudRounded color="primary" sx={{ width: 22, height: 22, }} />;
  }

   if (option.toLowerCase().includes("technical")) {
    return <SupportAgentRounded color="primary" sx={{ width: 22, height: 22, }} />;
  }

  if (option.toLowerCase().includes("block chain")) {
    return <Avatar src={bitcoin} alt={""} sx={{ width: 22, height: 22 }} />;
  }
  if (option.toLowerCase().includes("networks")) {
    return <HubRounded sx={{ width: 20, height: 20 }} />;
  }
  if (option.toLowerCase().includes("containerisation")) {
    return <Avatar src={docker} alt="image" sx={{ width: 22, height: 22 }} />;
  }
  if (option.toLowerCase().includes("devops")) {
    return <Avatar src={devops} alt="image" sx={{ width: 24, height: 24 }} />;
  }
  if (option.toLowerCase().includes("programming")) {
    return <CodeRounded sx={{ width: 22, height: 22 }} />;
  }
  if (option.toLowerCase().includes("game")) {
    return <SportsEsportsRounded sx={{ width: 22, height: 22 }} />;
  }
  if (option.toLowerCase().includes("cybersecurity")) {
    return <Avatar src={cyber} alt={"image"} sx={{ width: 22, height: 22 }} />;
  }
  if (
    option.toLowerCase().includes("machine") ||
    option.toLowerCase().includes("artificial")
  ) {
    return <PsychologyRounded sx={{ width: 22, height: 22 }} />;
  }

  if (option.toLowerCase().includes("fullstack")) {
    return <LayersRounded color="info" sx={{ width: 22, height: 22 }} />;
  }
  if (option.toLowerCase().includes("internet")) {
    return <DevicesOtherRounded sx={{ width: 22, height: 22 }} />;
  }
  if (option.toLowerCase().includes("data science")) {
    return <LeaderboardRounded sx={{ width: 22, height: 22 }} />;
  }
  if (option.toLowerCase().includes("desktop")) {
    return <DesktopMacRounded sx={{ width: 22, height: 22 }} />;
  }
  if (option.toLowerCase().includes("developer")) {
    return <TimelineRounded sx={{ width: 22, height: 22 }} />;
  }
  if (option.toLowerCase().includes("digital")) {
    return <FingerprintRounded sx={{ width: 22, height: 22 }} />;
  }
  if (option.toLowerCase().includes("multiplatform")) {
    return <SmartphoneRounded sx={{ width: 22, height: 22 }} />;
  }
  if (option.toLowerCase().includes("system")) {
    return <Avatar src={linuxLogo} alt="" sx={{ width: 24, height: 24 }} />;
  }
  if (option.toLowerCase().includes("wordpres")) {
    return <Avatar src={wordpress} alt={""} sx={{ width: 22, height: 22 }} />;
  }
  if (option.toLowerCase().includes("web app")) {
    return <WebRounded sx={{ width: 22, height: 22 }} />;
  }
  if (option.toLowerCase().includes("web hosting")) {
    return <LanguageRounded sx={{ width: 22, height: 22 }} />;
  }
  if (option.toLowerCase().includes("robot")) {
    return <PsychologyAltRounded sx={{ width: 22, height: 22 }} />;
  }
  if (option.toLowerCase().includes("platform")) {
    return <DeveloperBoardRounded sx={{ width: 22, height: 22 }} />;
  }
  if (option.toLowerCase().includes("site reliability")) {
    return <DomainVerificationRounded sx={{ width: 22, height: 22 }} />;
  }
}

export default CourseIcon;
