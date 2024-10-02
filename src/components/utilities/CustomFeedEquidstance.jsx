function CustomFeedEquidstance() {
  // screen width
  const screenWidth = window.screen.availWidth;
  //handle feed equidistant state

  if (screenWidth >700 && screenWidth<=1030){
    return '1.5%'
  }

  if (screenWidth > 1250 && screenWidth <= 1400) {
    return "3.3%";
  }

  if (screenWidth > 1400 && screenWidth <= 1600) {
    return "4%";
  }

  if (screenWidth > 1600 && screenWidth <= 1800) {
    return "4.8%";
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
