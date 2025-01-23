import CustomDeviceIsSmall from "./CustomDeviceIsSmall";
import CustomDeviceTablet from "./CustomDeviceTablet";

const CustomDeviceScreenSize = () => {
  let screen = window.screen.availWidth;
  // tablet portrait
  if (CustomDeviceTablet()) {
    return "370px";
  }
  // typical smartphone portrait
  if (CustomDeviceIsSmall()) {
    return "270px";
  }
  // tablet landscape
  if (screen > 1000 && screen <= 1300) {
    return "330px";
  }
  // large screens
  if (screen > 1300) {
    return "350px";
  }

  return;
};

export default CustomDeviceScreenSize;
