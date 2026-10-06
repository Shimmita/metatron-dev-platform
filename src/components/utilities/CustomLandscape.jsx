function CustomLandScape() {
    // check the width 
    const deviceWidth = window.screen.availWidth;
  
    return deviceWidth>1000 && deviceWidth<=1400;
  }
  
  export default CustomLandScape;
  