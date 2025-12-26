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

        // 1️⃣ Fullscreen
        if (this.scale && !this.scale.isFullscreen) {
          await this.scale.startFullscreen();
        }
      
        // 2️⃣ Lock landscape (mobile)
        if (screen.orientation && screen.orientation.lock) {
          try {
            await screen.orientation.lock("landscape");
          } catch (e) {}
        }
      
        // 3️⃣ 🔥 WAIT for orientation + viewport settle
        setTimeout(() => {
      
          const w = window.innerWidth;
          const h = window.innerHeight;
      
          // 4️⃣ FORCE Phaser resize
        //   this.scale.resize(w, h);
      
          // 5️⃣ Restart scene CLEAN (important)
          this.scene.start("GameScene");
      
        }, 300); // 🔥 CRITICAL DELAY
      });
      
    }
  }
}
