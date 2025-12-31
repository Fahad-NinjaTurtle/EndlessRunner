const MAX_DPR = 2; // mobile-safe
const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

const DESIGN_WIDTH = 915;
const DESIGN_HEIGHT = 412;

const config = {
  type: Phaser.WEBGL,
  parent: 'game-container',

  width: DESIGN_WIDTH,
  height: DESIGN_HEIGHT,

  resolution: dpr,
  backgroundColor: GameConfig.Colors.BACKGROUND,

  render: {
    antialias: true,
    pixelArt: false,
    roundPixels: true
  },

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DESIGN_WIDTH,
    height: DESIGN_HEIGHT
  },
  

  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: GameConfig.Player.Gravity },
      debug: false
    }
  },

  scene: [
    PreloadScene,
    MenuScene,
    GameScene,
    GameOverScene
  ]
};

const game = new Phaser.Game(config);
window.game = game;

window.addEventListener('resize', () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
});

window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    game.scale.resize(window.innerWidth, window.innerHeight);
  }, 300);
});


function isMobileDevice() {
  if (navigator.userAgentData) {
    return navigator.userAgentData.mobile;
  }
  return false;
}
if (isMobileDevice()) {
  console.log("User is on mobile");
} else {
  console.log("User is on desktop");
}


// Helper function to handle fullscreen changes
function handleFullscreenChange() {
  const hud = document.getElementById("hud");
  const pauseBtn = document.getElementById("pauseBtn");
  const pauseOverlay = document.getElementById("pause-overlay");
  const menuOverlay = document.getElementById("menu-overlay");
  const gameOverOverlay = document.getElementById("gameover-overlay");

  const fsElement =
    document.fullscreenElement ||
    document.webkitFullscreenElement;

  const container = document.getElementById("game-container");

  if (fsElement) {
    // Entering fullscreen → move all UI elements inside fullscreen element
    if (hud && hud.parentNode !== fsElement) fsElement.appendChild(hud);
    if (pauseBtn && pauseBtn.parentNode !== fsElement) fsElement.appendChild(pauseBtn);
    if (pauseOverlay && pauseOverlay.parentNode !== fsElement) fsElement.appendChild(pauseOverlay);
    if (menuOverlay && menuOverlay.parentNode !== fsElement) fsElement.appendChild(menuOverlay);
    if (gameOverOverlay && gameOverOverlay.parentNode !== fsElement) fsElement.appendChild(gameOverOverlay);
  } else {
    // Exiting fullscreen → move everything back to game container
    if (hud && container && hud.parentNode !== container) container.appendChild(hud);
    if (pauseBtn && container && pauseBtn.parentNode !== container) container.appendChild(pauseBtn);
    if (pauseOverlay && container && pauseOverlay.parentNode !== container) container.appendChild(pauseOverlay);
    if (menuOverlay && container && menuOverlay.parentNode !== container) container.appendChild(menuOverlay);
    if (gameOverOverlay && container && gameOverOverlay.parentNode !== container) container.appendChild(gameOverOverlay);
  }
}

document.addEventListener("fullscreenchange", handleFullscreenChange);
document.addEventListener("webkitfullscreenchange", handleFullscreenChange);


function scaleHudFromPixel7() {
  const hudInner = document.querySelector(".hud-inner");
  if (!hudInner) return;

  const cssWidth = window.innerWidth;
  const dpr = window.devicePixelRatio || 1;

  // Pixel 7 reference
  const PIXEL_7_WIDTH = 412;

  // Base scale relative to Pixel 7
  let scale = cssWidth / PIXEL_7_WIDTH;

  // Clamp scale so it never breaks UI
  scale = Math.max(1, Math.min(scale, 2));

  // Boost high-end phones slightly (S21 Ultra etc.)
  if (dpr >= 3) {
    scale *= 2.15;
  }

  hudInner.style.transform = `scale(${scale})`;
}

// Call it
scaleHudFromPixel7();
window.addEventListener("resize", scaleHudFromPixel7);
document.addEventListener("fullscreenchange", scaleHudFromPixel7);
