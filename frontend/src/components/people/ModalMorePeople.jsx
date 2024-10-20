import { Close, Search } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Modal,
  styled,
  Tooltip,
} from "@mui/material";
import React from "react";
import devImage from "../../images/dev.jpeg";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import PeopleResults from "./PeopleResults";

const StyledModalMorePeople = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "10px",
  marginLeft: CustomDeviceTablet() && "30%",
});

const ModalMorePeople = ({ openPostModal, setOpenPostModal }) => {
  // handle the closing of the modal
  const handleCloseModal = () => setOpenPostModal(false);
  return (
    <StyledModalMorePeople
      open={openPostModal}
      onClose={(e) => setOpenPostModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        width={400}
        p={1}
        borderRadius={3}
        bgcolor={"background.default"}
        color={"text.primary"}
      >
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          mb={2}
        >
          <Box>
            <Avatar src={devImage} />
          </Box>
          <Box>
            <Box className="d-flex justify-content-center m-2">
              {/* form for searching poople */}
              <form className="d-flex ps-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder={"search people..."}
                />

                <Tooltip title={"search"}>
                  <IconButton type="submit">
                    <Search />
                  </IconButton>
                </Tooltip>
              </form>
            </Box>
          </Box>
          <Box>
            <IconButton onClick={handleCloseModal}>
              <Close />
            </IconButton>
          </Box>
        </Box>

        <Divider component={"div"} variant="fullWidth" />
        <PeopleResults />
      </Box>
    </StyledModalMorePeople>
  );
};

export default ModalMorePeople;
