class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MenuScene" });
  }

  create() {
    // Show menu overlay
    const menuOverlay = document.getElementById("menu-overlay");
    if (menuOverlay) {
      menuOverlay.classList.remove("hidden");
    }

    // Hide game over overlay if visible
    const gameOverOverlay = document.getElementById("gameover-overlay");
    if (gameOverOverlay) {
      gameOverOverlay.classList.add("hidden");
    }

    // Update high score display
    this.updateHighScore();

    // Set up button handlers
    this.setupMenuButtons();
  }

  updateHighScore() {
    const highScoreElement = document.getElementById("high-score-menu");
    const highScore = localStorage.getItem("endlessRunnerHighScore") || 0;

    if (highScore > 0 && highScoreElement) {
      highScoreElement.textContent = `High Score: ${highScore}`;
      highScoreElement.style.display = "block";
    } else if (highScoreElement) {
      highScoreElement.style.display = "none";
    }
  }

  setupMenuButtons() {
    const startBtn = document.getElementById("start-btn");
    if (startBtn) {
      // Remove existing listeners by cloning
      const newStartBtn = startBtn.cloneNode(true);
      startBtn.parentNode.replaceChild(newStartBtn, startBtn);

      newStartBtn.addEventListener("click", async () => {
        // 1️⃣ FULLSCREEN (FIRST)
        if (this.scale && !this.scale.isFullscreen) {
          await this.scale.startFullscreen();
        }
        // 2️⃣ Try to force landscape
        if (screen.orientation && screen.orientation.lock) {
          try {
            await screen.orientation.lock("landscape");
            console.log("Orientation locked to landscape");
          } catch (e) {
            console.warn("Orientation lock failed:", e);
          }
        }

        // Hide menu
        const menuOverlay = document.getElementById("menu-overlay");
        if (menuOverlay) {
          menuOverlay.classList.add("hidden");
        }

        // Start game
        this.scene.start("GameScene");
      });
    }
  }
}
