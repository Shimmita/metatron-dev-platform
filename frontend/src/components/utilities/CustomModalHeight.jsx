import CustomDeviceIsSmall from "./CustomDeviceIsSmall";
import CustomDeviceSmallest from "./CustomDeviceSmallest";

function CustomModalHeight() {
  // check the width and decide whether to display the tabletsidebar
  if (CustomDeviceSmallest()) {
    return 400;
  }

  if (CustomDeviceIsSmall()) {
    return 500;
  }

  return 450;
}

export default CustomModalHeight;
