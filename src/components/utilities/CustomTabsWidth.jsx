import CustomDeviceIsSmall from "./CustomDeviceIsSmall";
import CustomDeviceTablet from "./CustomDeviceTablet";
import CustomLandScape from "./CustomLandscape";

function CustomTabsWidth() {
  // check the width
  const deviceWidth = window.screen.availWidth;

  if (CustomDeviceIsSmall()) {
    return deviceWidth - 15;
  }
  if (CustomDeviceTablet()) {
    return deviceWidth *0.60;
  }

  if (CustomLandScape()) {
    return deviceWidth *0.40;
  }

  return deviceWidth*0.26;
}

export default CustomTabsWidth;
