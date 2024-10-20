function CustomModalHeight() {
  // check the width and decide whether to display the tabletsidebar
  const screenWidth = window.screen.availWidth;

  if (screenWidth <= 350) {
    return 400;
  }

  if (screenWidth <= 500) {
    return 480;
  }

  return 550;
}

export default CustomModalHeight;
