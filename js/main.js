const MAX_DPR = 2; // mobile-safe
const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

const config = {
  type: Phaser.WEBGL,
  parent: 'game-container',

  width: window.innerWidth,
  height: window.innerHeight,

  resolution: dpr,
  backgroundColor: GameConfig.Colors.BACKGROUND,

  render: {
    antialias: true,
    pixelArt: false,
    roundPixels: true
  },

  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
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
