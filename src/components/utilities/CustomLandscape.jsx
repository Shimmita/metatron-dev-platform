function CustomLandScape() {
    // check the width and decide whether to display the tabletsidebar
    const deviceWidth = window.screen.availWidth;
  
    return deviceWidth>1000;
  }
  
  export default CustomLandScape;
  