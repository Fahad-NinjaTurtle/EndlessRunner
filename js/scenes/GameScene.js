class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  create() {

        // HTML HUD refs
        this.hudEl = document.getElementById("hud");
        this.hudScoreEl = document.getElementById("hud-score");
        this.hudJumpsEl = document.getElementById("hud-jumps");
    
        // show HUD during gameplay
        this.hudEl?.classList.remove("hidden");
    // Hide all overlays when game starts
    const menuOverlay = document.getElementById("menu-overlay");
    const gameOverOverlay = document.getElementById("gameover-overlay");
    const pauseOverlay = document.getElementById("pause-overlay");

    if (menuOverlay) {
      menuOverlay.classList.add("hidden");
    }
    if (gameOverOverlay) {
      gameOverOverlay.classList.add("hidden");
    }
    if (pauseOverlay) {
      pauseOverlay.classList.add("hidden");
    }

    // Initialize game state
    this.gameOver = false;
    this.gameSpeed = 1; // Base speed multiplier
    this.groundSpeed = GameConfig.Ground.Speed; // Current ground speed
    this.gameTime = 0; // Track game time for speed increase
    this.speedIncreaseInterval = 10000; // Increase speed every 10 seconds
    this.speedIncreaseAmount = 50; // Increase by 50 pixels/second
    this.metersRun = 0; // Distance in meters
    this.pixelsPerMeter = 100; // Conversion: 100 pixels = 1 meter
    this.enemiesAvoided = 0; // Track enemies avoided for double jump rewards

    // Create parallax background FIRST (so it renders behind everything)
    this.parallaxManager = new ParallaxManager(this);

    // Create ground FIRST - this sets this.groundY
    this.createGround();

    // Create player - use this.groundY for correct positioning
    this.player = new Player(this, GameConfig.Player.Start_X, this.groundY);

    this.physics.add.collider(this.player, this.ground);

    this.setupInput();

    this.enemyManager = new EnemyManager(this);
    
    // Create props manager AFTER ground is created (so groundY is available)
    // try {
    //   this.propsManager = new PropsManager(this);
    // } catch (error) {
    //   console.error("Error creating PropsManager:", error);
    //   this.propsManager = null; // Continue without props if there's an error
    // }

    // Collision → GAME OVER
    this.physics.add.collider(
      this.player,
      this.enemyManager.enemies,
      this.onPlayerHit,
      null,
      this
    );
    
    // Props are decorative only - NO collision with player
    // Removed collision detection for props

    // Only ground enemies collide with ground - flying enemies don't need collision
    // The collider is set up but flying enemies have no gravity, so they won't be affected
    this.physics.add.collider(this.enemyManager.enemies, this.ground, null, (enemy, ground) => {
      // Only allow collision for ground enemies, not flying ones
      return enemy.enemyType !== 'flying';
    });

    this.scale.on("resize", () => {
      // this.createGround();
    });


    this.scale.on("resize", this.handleResize, this);

    this.metersRun = 0;
    this.extraJumps = 0;
    this.enemiesAvoided = 0;
    this.enemiesForDoubleJump = 4;

    // Setup pause functionality
    this.setupPause();

    // Listen for fullscreen changes to reposition pause button
    document.addEventListener("fullscreenchange", () => {
      this.ensurePauseButtonPosition();
    });
    document.addEventListener("webkitfullscreenchange", () => {
      this.ensurePauseButtonPosition();
    });

    this.bgMusic = this.sound.add("bg_music",{
      loop: true,
      volume: 0.5,
    });

    if(!this.bgMusic.isPlaying) {
      this.bgMusic.play();
    }

    const cam = this.cameras.main;

    // Always lock vertical gameplay
    const worldHeight = DESIGN_HEIGHT;

    // MOBILE → fixed world
    if (!this.sys.game.device.os.desktop) {
      cam.setBounds(0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);
      cam.centerOn(DESIGN_WIDTH / 2, DESIGN_HEIGHT / 2);
      return;
    }

    // DESKTOP → expand horizontally
    const canvasWidth = this.scale.canvas.width;
    const canvasHeight = this.scale.canvas.height;

    // How many world units fit vertically
    const scale = canvasHeight / DESIGN_HEIGHT;

    // Visible world width on desktop
    const visibleWorldWidth = canvasWidth / scale;

    // Set wider camera bounds
    cam.setBounds(0, 0, visibleWorldWidth, DESIGN_HEIGHT);

    // Center camera
    cam.centerOn(visibleWorldWidth / 2, DESIGN_HEIGHT / 2);

    this.isDesktop = this.sys.game.device.os.desktop;

    // Base world size
    this.worldHeight = DESIGN_HEIGHT;
    this.worldWidth = DESIGN_WIDTH;

    // Desktop → expand world horizontally
    if (this.isDesktop) {
      const canvasWidth = this.scale.canvas.width;
      const canvasHeight = this.scale.canvas.height;

      const scale = canvasHeight / DESIGN_HEIGHT;
      this.worldWidth = canvasWidth / scale;
    }
  }

  handleResize(gameSize) {
    if (!gameSize) return;

    const { width, height } = gameSize;
    const isMobile = !this.sys.game.device.os.desktop;

    // 1️⃣ Recalculate ground
    this.groundY = height * 0.8;

    // 2️⃣ Rebuild parallax completely (CRITICAL)
    if (this.parallaxManager) {
      this.parallaxManager.resize();
    }

    // 3️⃣ Resize ground - extend on mobile
    if (this.ground) {
      const extraWidth = isMobile ? 400 : 0;
      const groundWidth = width + extraWidth;
      
      this.ground.setPosition(width / 2, this.groundY);
      this.ground.displayWidth = groundWidth;
      this.ground.body.setSize(groundWidth, this.ground.height);
      this.ground.body.updateFromGameObject();
    }

    // 4️⃣ Resize mud - extend width and height on mobile
    if (this.mud) {
      const extraWidth = isMobile ? 400 : 0;
      const extraMudHeight = isMobile ? 100 : 0;
      const mudWidth = width + extraWidth;
      const mudHeight = height - (this.groundY + this.ground.height) + extraMudHeight;
      
      this.mud.setPosition(width / 2, this.groundY + this.ground.height);
      this.mud.displayWidth = mudWidth;
      this.mud.displayHeight = mudHeight;
    }

    // 5️⃣ Snap player
    if (this.player) {
      this.player.y = this.groundY;
      this.player.body.setVelocity(0);
      this.player.isOnGround = true;
      this.player.isJumping = false;
    }

    // 6️⃣ Fix existing enemies
    this.enemyManager?.enemies?.children?.iterate((enemy) => {
      if (enemy && enemy.body) {
        enemy.y = this.groundY;
        enemy.body.updateFromGameObject();
      }
    });
  }

  onPlayerHit(player, enemy) {
    this.physics.pause();

    player.setTint(0xff0000);
    player.anims.stop();
    this.sound.play("hit", { volume: 1 });
    this.time.delayedCall(200, () => {
      this.endGame();
    });
  }
  onEnemyAvoided() {
    this.enemiesAvoided++;
    // Grant double jump every 4 enemies avoided
    if (this.enemiesAvoided % this.enemiesForDoubleJump === 0) {
      this.extraJumps++;
    }
  }

  // grantDoubleJump() {
  //   this.player.extraJumps = this.player.maxExtraJumps;

  //   // 🔔 Optional feedback
  //   console.log("🎉 Double Jump Ready!");
  // }

  createGround() {
    // 🔐 SAFETY CHECK
    if (!this.textures.exists("ground_tile")) {
      console.warn("⚠ ground_tile texture not ready yet");
      return;
    }

    const groundTile = this.textures.get("ground_tile").getSourceImage();

    if (!groundTile) {
      console.warn("⚠ ground_tile source image not ready");
      return;
    }

    const screenWidth = this.cameras.main.width;
    const screenHeight = this.cameras.main.height;
    const isMobile = !this.sys.game.device.os.desktop;

    const groundTopY = screenHeight * 0.8;
    const groundHeight = groundTile.height;

    // On mobile: extend ground width by 200 pixels on each side (400 total extra)
    // On desktop: use normal width
    const extraWidth = isMobile ? 400 : 0;
    const groundWidth = screenWidth + extraWidth;

    // TOP GROUND (collision) - extended on mobile
    this.ground = new Ground(
      this,
      screenWidth / 2, // Center position stays the same
      groundTopY,
      groundWidth,
      groundHeight
    );

    // MUD BELOW - extended width on mobile, and extra height layer
    const mudHeight = screenHeight - (groundTopY + groundHeight);
    const extraMudHeight = isMobile ? 100 : 0; // Extra 100px below screen on mobile
    
    this.mud = new MudFill(
      this,
      screenWidth / 2, // Center position stays the same
      groundTopY + groundHeight,
      groundWidth,
      mudHeight + extraMudHeight
    );

    this.groundY = groundTopY;
  }

  setupInput() {
    // Jump on click/tap/spacebar
    this.input.on("pointerdown", () => {
      if (!this.gameOver && this.player) {
        this.player.jump();
      }
    });

    // Keyboard input
    if (this.input.keyboard) {
      this.input.keyboard.on("keydown-SPACE", () => {
        if (!this.gameOver && this.player) {
          this.player.jump();
        }
      });
    }
  }

  setupPause() {
    this.pauseBtn = document.getElementById("pauseBtn");
    this.pauseOverlay = document.getElementById("pause-overlay");
    this.resumeBtn = document.getElementById("resume-btn");
    this.pauseMenuBtn = document.getElementById("pause-menu-btn");
    this.countdownDisplay = document.getElementById("countdown-display");

    // Show pause button
    if (this.pauseBtn) {
      this.pauseBtn.classList.remove("hidden");
      this.pauseBtn.style.display = "flex"; // Force display
      this.pauseBtn.style.visibility = "visible"; // Ensure visibility
    } else {
      console.error("Pause button not found!");
    }

    // Pause button click handler
    this.pauseBtn.onclick = () => {
      this.pauseGame();
    };

    // Resume button handler
    if (this.resumeBtn) {
      const newResumeBtn = this.resumeBtn.cloneNode(true);
      this.resumeBtn.parentNode.replaceChild(newResumeBtn, this.resumeBtn);
      this.resumeBtn = newResumeBtn;

      newResumeBtn.addEventListener("click", () => {
        this.resumeGame();
      });
    }

    // Pause menu button handler
    if (this.pauseMenuBtn) {
      const newPauseMenuBtn = this.pauseMenuBtn.cloneNode(true);
      this.pauseMenuBtn.parentNode.replaceChild(newPauseMenuBtn, this.pauseMenuBtn);
      this.pauseMenuBtn = newPauseMenuBtn;

      newPauseMenuBtn.addEventListener("click", () => {
        this.goToMenuFromPause();
      });
    }

    // Listen for scene pause/resume events
    this.events.on("pause", () => {
      this.showPauseOverlay();
    });

    this.events.on("resume", () => {
      // Countdown will be handled in resumeGame
    });
  }

  pauseGame() {
    if (this.gameOver) return;
    
    this.scene.pause();
    this.showPauseOverlay();
    
    // Pause background music
    if (this.bgMusic && this.bgMusic.isPlaying) {
      this.bgMusic.pause();
    }
  }

  showPauseOverlay() {
    if (this.pauseOverlay) {
      this.pauseOverlay.classList.remove("hidden");
      this.countdownDisplay?.classList.add("hidden");
    }
  }

  hidePauseOverlay() {
    if (this.pauseOverlay) {
      this.pauseOverlay.classList.add("hidden");
    }
  }

  resumeGame() {
    // Hide resume button and show countdown
    if (this.resumeBtn) {
      this.resumeBtn.style.display = "none";
    }
    if (this.pauseMenuBtn) {
      this.pauseMenuBtn.style.display = "none";
    }

    // Start countdown
    this.startCountdown(() => {
      // Countdown complete - resume game
      this.hidePauseOverlay();
      this.scene.resume();
      
      // Resume background music
      if (this.bgMusic && !this.bgMusic.isPlaying) {
        this.bgMusic.resume();
      }

      // Show buttons again for next pause
      if (this.resumeBtn) {
        this.resumeBtn.style.display = "block";
      }
      if (this.pauseMenuBtn) {
        this.pauseMenuBtn.style.display = "block";
      }
    });
  }

  startCountdown(onComplete) {
    if (!this.countdownDisplay) {
      onComplete();
      return;
    }

    this.countdownDisplay.classList.remove("hidden");
    let count = 3;

    // Use JavaScript setTimeout instead of Phaser timer (works when scene is paused)
    const updateCountdown = () => {
      if (count > 0) {
        this.countdownDisplay.textContent = count;
        count--;
        setTimeout(updateCountdown, 1000);
      } else {
        this.countdownDisplay.textContent = "GO!";
        setTimeout(() => {
          this.countdownDisplay.classList.add("hidden");
          onComplete();
        }, 500);
      }
    };

    updateCountdown();
  }

  ensurePauseButtonPosition() {
    // Make sure pause button and overlay are in the correct container (fullscreen or game-container)
    const fsElement =
      document.fullscreenElement ||
      document.webkitFullscreenElement;
    
    const container = fsElement || document.getElementById("game-container");
    
    if (container) {
      if (this.pauseBtn && this.pauseBtn.parentNode !== container) {
        container.appendChild(this.pauseBtn);
      }
      if (this.pauseOverlay && this.pauseOverlay.parentNode !== container) {
        container.appendChild(this.pauseOverlay);
      }
    }
  }

  goToMenuFromPause() {
    // Stop background music
    if (this.bgMusic) {
      this.bgMusic.stop();
    }

    // Hide pause overlay
    this.hidePauseOverlay();

    // Hide pause button
    if (this.pauseBtn) {
      this.pauseBtn.classList.add("hidden");
    }

    // Resume scene first (to clean up), then go to menu
    this.scene.resume();
    this.scene.start("MenuScene");
  }

  update(time, delta) {
    if (this.gameOver) return;
    if (this.scene.isPaused()) return; // Don't update when paused

    // Increase ground speed over time
    this.gameTime += delta;
    if (this.gameTime >= this.speedIncreaseInterval) {
      this.groundSpeed += this.speedIncreaseAmount;
      this.gameTime = 0; // Reset timer
      console.log(`Ground speed increased to: ${this.groundSpeed}`);
    }

    // Calculate meters run based on ground speed and time
    // Distance = speed * time, convert pixels to meters
    const distanceInPixels = this.groundSpeed * (delta / 1000);
    const distanceInMeters = distanceInPixels / this.pixelsPerMeter;
    this.metersRun += distanceInMeters;

    this.parallaxManager?.update(delta);
    this.player?.update();

    // Update ground and mud with current speed
    this.ground?.update(delta, this.groundSpeed);
    this.mud?.update(delta, this.groundSpeed);
    
    // Update enemies and props (they move with ground speed)
    this.enemyManager.update();
    if (this.propsManager) {
      this.propsManager.update(this.groundSpeed);
    }

    // Update HUD with formatted score and double jumps
    if (this.hudScoreEl) {
      const meters = Math.floor(this.metersRun);
      // Format as 6-digit number with leading zeros (e.g., "001071")
      this.hudScoreEl.textContent = String(meters).padStart(6, '0');
    }
    if (this.hudJumpsEl) {
      // Format as 3-digit number with leading zeros (e.g., "000", "001", "010")
      this.hudJumpsEl.textContent = String(this.extraJumps).padStart(3, '0');
    }
    
  }

  endGame() {
    if (this.gameOver) return;

    this.gameOver = true;
    
    // Hide pause button
    if (this.pauseBtn) {
      this.pauseBtn.classList.add("hidden");
    }
    
    // Hide pause overlay if visible
    this.hidePauseOverlay();
    
    if (this.bgMusic) {
      this.bgMusic.stop();
    }
    
    this.scene.start("GameOverScene", {
      score: Math.floor(this.metersRun), // 🔥 REAL SCORE (meters run)
    });
  }
}
