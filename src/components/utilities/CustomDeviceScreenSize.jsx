import CustomDeviceTablet from "./CustomDeviceTablet";

const CustomDeviceScreenSize = () => {
  let screen = window.screen.availWidth;
  // tablet portrait
  if (CustomDeviceTablet()) {
    return "450px";
  }
  // smartphone portrait
  if (screen < 600) {
    return "350px";
  }
  // tablet landscape
  if (screen > 1000 && screen <= 1300) {
    return "350px";
  }
  // large screens
  if (screen > 1300) {
    return "455px";
  }

  return;
};

export default CustomDeviceScreenSize;
