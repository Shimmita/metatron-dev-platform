function CustomDeviceIsSmall() {
  const device_widith = window.screen.availWidth;
  return device_widith <= 500;
}

export default CustomDeviceIsSmall;
