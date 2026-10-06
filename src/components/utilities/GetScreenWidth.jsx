export const GetScreenWidth = () => {
  return window.screen.availWidth < 350
    ? 300
    : window.screen.availWidth <= 370
    ? 345
    : window.screen.availWidth < 390
    ? 358
    : window.screen.availWidth <= 400
    ? 376
    : window.screen.availWidth <= 420
    ? 395
    : window.screen.availWidth <= 450
    ? 410
    : window.screen.availwidth <= 500
    ? 420
    : window.screen.availWidth <= 600
    ? 435
    :window.screen.availWidth <=800
    ? 475
    :window.screen.availWidth <=850
    ? 540
    : window.screen.availWidth <= 1000
    ? 550
    : window.screen.availWidth <= 1150
    ? 400
    : window.screen.availWidth <= 1200
    ? 490
    : window.screen.availWidth <= 1500
    ? 540
    : window.screen.availWidth <= 1700
    ? 600
    : window.screen.availWidth <= 2000
    ? 625
    : window.screen.availWidth <= 2500
    ? 850
    : window.screen.availWidth <= 3000
    ? 1000
    : window.screen.availWidth <= 3500
    ? 1300
    : window.screen.availWidth <= 4000
    ? 1500
    : window.screen.availWidth <= 5000
    ? 1800
    : 2500;
};
