import { useSelector } from "react-redux";

function CustomFeedEquidstance() {
  // screen width
  const screenWidth = window.screen.availWidth;
  //handle feed equidistant state

  const { isTabSideBar } = useSelector((state) => state.appUI);

  if (screenWidth > 750 && screenWidth <= 1030) {
    // if sidebar being shown in tab 1% is fine but full screen no
    return isTabSideBar ? "1%" : "0%";
  }

  if (screenWidth > 1250 && screenWidth <= 1400) {
    return "3.3%";
  }

  if (screenWidth > 1400 && screenWidth <= 1600) {
    return "4%";
  }

  if (screenWidth > 1600 && screenWidth <= 1800) {
    return "5%";
  }

  if (screenWidth > 1800 && screenWidth <= 2200) {
    return "5.5%";
  }

  if (screenWidth > 2200 && screenWidth <= 2400) {
    return "6%";
  }

  if (screenWidth > 2400 && screenWidth <= 2600) {
    return "6.5%";
  }

  if (screenWidth > 2600 && screenWidth <= 3000) {
    return "7%";
  }

  if (screenWidth > 3000) {
    return "8%";
  }
}

export default CustomFeedEquidstance;
