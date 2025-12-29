class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  create() {

    
    // Hide all overlays when game starts
    const menuOverlay = document.getElementById("menu-overlay");
    const gameOverOverlay = document.getElementById("gameover-overlay");

    if (menuOverlay) {
      menuOverlay.classList.add("hidden");
    }
    if (gameOverOverlay) {
      gameOverOverlay.classList.add("hidden");
    }

    // Initialize game state
    this.gameOver = false;
    this.gameSpeed = 1; // Base speed multiplier

    // Create parallax background FIRST (so it renders behind everything)
    this.parallaxManager = new ParallaxManager(this);

    // Create ground FIRST - this sets this.groundY
    this.createGround();

    // Create player - use this.groundY for correct positioning
    this.player = new Player(this, GameConfig.Player.Start_X, this.groundY);

    this.physics.add.collider(this.player, this.ground);

    this.setupInput();
    this.enemiesAvoided = 0;
    this.enemiesForDoubleJump = 4;

    this.enemyManager = new EnemyManager(this);

    // Collision → GAME OVER
    this.physics.add.collider(
      this.player,
      this.enemyManager.enemies,
      this.onPlayerHit,
      null,
      this
    );

    this.physics.add.collider(this.enemyManager.enemies, this.ground);

    this.scale.on('resize', () => {
      this.createGround();
    });
    this.scale.on('resize', this.handleResize, this);

  }
  handleResize(gameSize) {
    if (!gameSize) return;
  
    const { width, height } = gameSize;
  
    // 1️⃣ Recalculate ground
    this.groundY = height * 0.8;
  
    // 2️⃣ Rebuild parallax completely (CRITICAL)
    if (this.parallaxManager) {
      this.parallaxManager.destroy();
      this.parallaxManager = new ParallaxManager(this);
    }
  
    // 3️⃣ Resize ground
    if (this.ground) {
      this.ground.setPosition(width / 2, this.groundY);
      this.ground.displayWidth = width;
      this.ground.body.setSize(width, this.ground.height);
      this.ground.body.updateFromGameObject();
    }
  
    // 4️⃣ Resize mud
    if (this.mud) {
      this.mud.setPosition(
        width / 2,
        this.groundY + this.ground.height
      );
      this.mud.displayWidth = width;
      this.mud.displayHeight =
        height - (this.groundY + this.ground.height);
    }
  
    // 5️⃣ Snap player
    if (this.player) {
      this.player.y = this.groundY;
      this.player.body.setVelocity(0);
      this.player.isOnGround = true;
      this.player.isJumping = false;
    }
  
    // 6️⃣ Fix existing enemies
    this.enemyManager?.enemies?.children?.iterate(enemy => {
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

    this.time.delayedCall(800, () => {
      this.endGame();
    });
  }
  onEnemyAvoided() {
    this.enemiesAvoided++;

    if (this.enemiesAvoided % this.enemiesForDoubleJump === 0) {
      this.grantDoubleJump();
    }
  }

  grantDoubleJump() {
    this.player.extraJumps = this.player.maxExtraJumps;

    // 🔔 Optional feedback
    console.log("🎉 Double Jump Ready!");
  }

  createGround() {
    const screenHeight = this.cameras.main.height;
    const screenWidth = this.cameras.main.width;

    const groundTopY = screenHeight * 0.8;

    const groundTile = this.textures.get("ground_tile").getSourceImage();
    const groundHeight = groundTile.height;

    // TOP GROUND (collision)
    this.ground = new Ground(
      this,
      screenWidth / 2,
      groundTopY,
      screenWidth,
      groundHeight
    );

    // MUD BELOW (fill till bottom)
    this.mud = new MudFill(
      this,
      screenWidth / 2,
      groundTopY + groundHeight,
      screenWidth,
      screenHeight - (groundTopY + groundHeight)
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

  update(time, delta) {
    if (this.gameOver) return;

    this.parallaxManager?.update(delta);
    this.player?.update();

    this.ground?.update(delta);
    this.mud?.update(delta);
    this.enemyManager.update();
  }

  endGame() {
    if (this.gameOver) return;

    this.gameOver = true;
    const finalScore = 0; // this.scoreManager.getScore();

    // Pass score to GameOverScene
    this.scene.start("GameOverScene", { score: finalScore });
  }
}
