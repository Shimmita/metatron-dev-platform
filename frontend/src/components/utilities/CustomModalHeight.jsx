function CustomModalHeight() {
  // check the width and decide whether to display the tabletsidebar
  const screenWidth = window.screen.availWidth;

  if (screenWidth <= 350) {
    return 400;
  }

  if (screenWidth <= 500) {
    return 500;
  }

  return 450;
}

export default CustomModalHeight;
