import { Box } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import React from "react";
import AwsLogo from "../../images/aws.jpeg";
import NodeLogo from "../../images/node.jpeg";
import PythonLogo from "../../images/python.jpeg";
import ReactLogo from "../../images/react.png";
import KotlinLogo from "../../images/Kotlin.png";

export default function SkillAvatars() {
  return (
    <Box
      display={"flex"}
      gap={1}
      justifyContent={"space-between"}
      alignItems={"center"}
    >
      <Avatar
        sx={{ maxWidth: 36, maxHeight: 36 }}
        className="border shadow"
        alt="react"
        src={ReactLogo}
      />
      <Avatar
        sx={{ maxWidth: 36, maxHeight: 36 }}
        className="border shadow"
        alt="node"
        src={NodeLogo}
      />
      <Avatar
        sx={{ maxWidth: 36, maxHeight: 36 }}
        className="border shadow"
        alt="python"
        src={PythonLogo}
      />
      <Avatar
        sx={{ maxWidth: 36, maxHeight: 36 }}
        className="border shadow"
        alt="mysql"
        src={AwsLogo}
      />
      
      <Avatar
        sx={{ maxWidth: 36, maxHeight: 36 }}
        className="border shadow"
        alt="mysql"
        src={KotlinLogo}
      />
    </Box>
  );
}
