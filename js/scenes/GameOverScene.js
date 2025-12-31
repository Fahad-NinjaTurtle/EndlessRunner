class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameOverScene" });
  }

  init(data) {
    // Receive score from GameScene
    this.finalScore = data.score || 0;
  }

  create() {
    // Hide menu overlay
    const menuOverlay = document.getElementById("menu-overlay");
    if (menuOverlay) {
      menuOverlay.classList.add("hidden");
    }
    
    // Hide pause overlay if visible
    const pauseOverlay = document.getElementById("pause-overlay");
    if (pauseOverlay) {
      pauseOverlay.classList.add("hidden");
    }
    
    // Hide pause button
    const pauseBtn = document.getElementById("pauseBtn");
    if (pauseBtn) {
      pauseBtn.classList.add("hidden");
      pauseBtn.style.display = "none";
    }

    // Show game over overlay
    const gameOverOverlay = document.getElementById("gameover-overlay");
    if (gameOverOverlay) {
      gameOverOverlay.classList.remove("hidden");
    }

    // Update score display
    this.updateScoreDisplay();

    // Set up button handlers
    this.setupGameOverButtons();
    document.getElementById("hud")?.classList.add("hidden");

  }

  updateScoreDisplay() {
    // Update final score
    const finalScoreElement = document.getElementById("final-score");
    if (finalScoreElement) {
      finalScoreElement.textContent = `Distance: ${this.finalScore}m`;
    }

    // Check and update high score
    const highScore = parseInt(
      localStorage.getItem("endlessRunnerHighScore") || 0
    );
    let newHighScore = false;

    if (this.finalScore > highScore) {
      localStorage.setItem("endlessRunnerHighScore", this.finalScore);
      newHighScore = true;
    }

    // Update high score display
    const highScoreElement = document.getElementById("high-score-display");
    if (highScoreElement) {
      const displayScore = newHighScore ? this.finalScore : highScore;
      highScoreElement.textContent = `Best Distance: ${displayScore}m${
        newHighScore ? " 🎉 NEW!" : ""
      }`;
      highScoreElement.className = newHighScore
        ? "high-score new"
        : "high-score";
    }
  }

  setupGameOverButtons() {
    // Restart button
    const restartBtn = document.getElementById("restart-btn");
    if (restartBtn) {
      const newRestartBtn = restartBtn.cloneNode(true);
      restartBtn.parentNode.replaceChild(newRestartBtn, restartBtn);

      newRestartBtn.addEventListener("click", () => {
        // Hide game over overlay
        const gameOverOverlay = document.getElementById("gameover-overlay");
        if (gameOverOverlay) {
          gameOverOverlay.classList.add("hidden");
        }
        // Start game scene
        this.scene.start("GameScene");
      });
    }

    // Menu button
    const menuBtn = document.getElementById("menu-btn");
    if (menuBtn) {
      const newMenuBtn = menuBtn.cloneNode(true);
      menuBtn.parentNode.replaceChild(newMenuBtn, menuBtn);

      newMenuBtn.addEventListener('click', () => {
        const gameOverOverlay = document.getElementById('gameover-overlay');
        if (gameOverOverlay) {
          gameOverOverlay.classList.add('hidden');
        }
      
        // Ensure menu overlay is in the correct container
        const fsElement =
          document.fullscreenElement ||
          document.webkitFullscreenElement;
        
        const container = fsElement || document.getElementById('game-container');
        const menuOverlay = document.getElementById('menu-overlay');
        
        if (menuOverlay && container) {
          // Only move if not already in the correct container
          if (menuOverlay.parentNode !== container) {
            container.appendChild(menuOverlay);
          }
          menuOverlay.classList.remove('hidden');
        }
      
        this.scene.start('MenuScene');
      });
      
    }

    const overlay = document.getElementById("gameover-overlay");

    // Ensure overlay is in the correct container (fullscreen or game-container)
    const fsElement =
      document.fullscreenElement ||
      document.webkitFullscreenElement;
    
    const container = fsElement || document.getElementById("game-container");
    
    if (overlay && container) {
      // Only move if not already in the correct container
      if (overlay.parentNode !== container) {
        container.appendChild(overlay);
      }
      overlay.classList.remove("hidden");
    }
  }
}
