import { CheckCircle, Close, UpdateRounded } from "@mui/icons-material";
import {
  Alert,
  Autocomplete,
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Chip,
  Collapse,
  FormControlLabel,
  IconButton,
  MenuItem,
  Snackbar,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateUserCurrentUserRedux } from "../../../redux/CurrentUser";
import RegisterAlertTitle from "../../auth/RegisterAlertTitle";
import AllCountries from "../../data/AllCountries";
import AllSkills from "../../data/AllSkillsData";
import CountiesInKenya from "../../data/Counties";
import SpecialisationJobs from "../../data/SpecialisationJobs";
import BrowserCompress from "../../utilities/BrowserCompress";
import CustomDeviceIsSmall from "../../utilities/CustomDeviceIsSmall";
import { getImageMatch } from "../../utilities/getImageMatch";
import { CircularProgress, LinearProgress } from "@mui/material";
import MetatronSnackbar from "../../snackbar/MetatronSnackBar";

const MAX_ABOUT = 200;

const Section = ({ title, children }) => (
  <Box mt={3}>
    <Typography fontWeight={600} mb={1}>
      {title}
    </Typography>
    <Box display="flex" flexDirection="column" gap={2}>
      {children}
    </Box>
  </Box>
);

function ProfileUpdate({ user }) {
  const dispatch = useDispatch();

  const [imagePreview, setImagePreview] = useState(user?.avatar);
  const [avatarFile, setAvatarFile] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [openCustomTitle, setOpenCustomTitle] = useState(false);
  const [isError, setIsError] = useState(false);

  const [about, setAbout] = useState(user?.about || "");
  const [selectedSkills, setSelectedSkills] = useState([
    ...(user?.selectedSkills || []),
  ]);
  const [specialisationTitle, setSpecialisationTitle] = useState(
    user?.specialisationTitle || ""
  );

  const [phone, setPhone] = useState(user?.phone || "");
  const [country, setCountry] = useState(user?.country || "");
  const [county, setCounty] = useState(user?.county || "");

  const [gitHub, setGitHub] = useState(user?.gitHub || "");
  const [linkedin, setLinkedin] = useState(user?.linkedin || "");
  const [portfolio, setPortfolio] = useState(user?.portfolio || "");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [togglePassword, setTogglePassword] = useState(true);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const compressed = await BrowserCompress(file);
    setImagePreview(URL.createObjectURL(compressed));
    setAvatarFile(compressed);
  };

  const handleUserUpdate = () => {
    const userData = {
      about,
      selectedSkills,
      specialisationTitle,
      phone,
      country,
      county,
      gitHub,
      portfolio,
      linkedin,
    };

    if (!togglePassword) {
      userData.oldPassword = oldPassword;
      userData.newPassword = newPassword;
    }

    const formData = new FormData();
    formData.append("image", avatarFile);
    formData.append("user", JSON.stringify(userData));

    setIsConnecting(true);

    axios
      .put(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/users/update/${user?._id}`,
        formData,
        { withCredentials: true }
      )
      .then((res) => {
        dispatch(updateUserCurrentUserRedux(res.data.data));
        setResponseMessage(res.data.message);
      })
      .catch((err) => {
        setResponseMessage(err?.response?.data || "Error");
        setIsError(true);
      })
      .finally(() => setIsConnecting(false));
  };



  return (
    <Box p={2} maxHeight="90vh" sx={{ overflowY: "auto" }}>
      {isConnecting && (
        <LinearProgress
          sx={{
            mb: 2,
            borderRadius: 2,
            height: 4,
          }}
        />
      )}

      <Box
        px={CustomDeviceIsSmall() ? 1 : 3}
        py={2}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          background: "rgba(255,255,255,0.02)",
        }}
      >

        {/* AVATAR */}
        <Box textAlign="center" mb={2}>
          <Avatar src={imagePreview} sx={{ width: 90, height: 90, mx: "auto" }} />
          <Button component="label" size="small">
            Change
            <input hidden type="file" onChange={handleFileChange} />
          </Button>
        </Box>

        {/* BASIC */}
        <Section title="Basic Information">
          <TextField label="Name" fullWidth disabled value={user?.name} />
          <TextField label="Email" fullWidth disabled value={user?.email} />
          <TextField label="Phone" fullWidth value={phone} onChange={(e) => setPhone(e.target.value)} />
        </Section>

        {/* LOCATION */}
        <Section title="Location">
          <TextField label="Country" fullWidth value={country} onChange={(e) => setCountry(e.target.value)} />
          <TextField label="County / City" fullWidth value={county} onChange={(e) => setCounty(e.target.value)} />
        </Section>

        {/* PROFESSIONAL */}
        <Section title="Professional">
          <TextField
            select
            label="Expertise"
            value={specialisationTitle}
            onChange={(e) => setSpecialisationTitle(e.target.value)}
          >
            {SpecialisationJobs.map((item) => (
              <MenuItem key={item} value={item}>{item}</MenuItem>
            ))}
          </TextField>

          <Autocomplete
            multiple
            options={AllSkills}
            value={selectedSkills}
            onChange={(e, v) => setSelectedSkills(v)}
            renderInput={(params) => <TextField {...params} label="Skills" />}
          />

          <TextField
            multiline
            minRows={3}
            label={`About (${MAX_ABOUT - about.length})`}
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            error={about.length > MAX_ABOUT}
          />
        </Section>

        {/* LINKS */}
        <Section title="Links">
          <TextField label="GitHub" value={gitHub} onChange={(e) => setGitHub(e.target.value)} />
          <TextField label="LinkedIn" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
          <TextField label="Portfolio" value={portfolio} onChange={(e) => setPortfolio(e.target.value)} />
        </Section>

        {/* SECURITY */}
        <Section title="Security">
          <FormControlLabel
            control={<Switch onChange={() => setTogglePassword(!togglePassword)} />}
            label="Update Password"
          />

          {!togglePassword && (
            <>
              <TextField label="Old Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
              <TextField label="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </>
          )}
        </Section>

        {/* BUTTON */}
        <Button
          fullWidth
          size="large"
          disabled={isConnecting || about.length > MAX_ABOUT}
          variant="contained"
          startIcon={
            isConnecting ? (
              <CircularProgress size={16} sx={{ color: "white" }} />
            ) : (
              <UpdateRounded />
            )
          }
          onClick={handleUserUpdate}
          sx={{
            mt: 3,
            borderRadius: "12px",
            background: "linear-gradient(135deg,#0FA88F,#14D2BE)",
          }}
        >
          Save Changes
        </Button>
      </Box>

      {openCustomTitle && (
        <RegisterAlertTitle
          openAlert={openCustomTitle}
          setOpenAlert={setOpenCustomTitle}
          setSpecialisationTitle={setSpecialisationTitle}
        />
      )}

      {/* show snackbar when there is response */}
      {responseMessage && (
        <MetatronSnackbar
          open={Boolean(responseMessage)}
          message={responseMessage}
          isError={isError}
          handleClose={() => {
            setResponseMessage(null);
            setIsError(false);
          }}
        />
      )}
    </Box>
  );
}

export default ProfileUpdate;