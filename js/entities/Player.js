class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    // Create sprite with physics
    super(scene, x, y, "player_idle");

    // Add to scene and enable physics
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Set origin to bottom-center (so Y position represents bottom of sprite)
    this.setOrigin(0.5, 1.0);

    // Store reference to scene
    this.scene = scene;

    // Player state - Initialize based on actual position
    this.isJumping = false;
    // Set initial ground state based on position
    this.groundY = GameConfig.Ground.Y_Position;
    this.isOnGround = true; // Player starts on ground
    this.canJump = true; // Can jump when on ground

    // Configure physics body
    this.setupPhysics();

    // Set up animations
    this.setupAnimations();

    // Start running animation
    this.play("player_run");
    // 🔥 Double jump system
    this.maxExtraJumps = 1; // kitne bonus jumps mil sakte hain
    this.extraJumps = 0; // currently available bonus jumps

    // Set initial position - player's BOTTOM at ground level
    this.setPosition(x, this.groundY);
  }

  setupPhysics() {
    // Set body size (adjust to match sprite)
    this.body.setSize(this.width * 0.7, this.height * 0.9);
    this.body.setOffset(this.width * 0.15, this.height * 0.05);

    // Set bounce (optional - for landing effect)
    this.setBounce(0);

    // Set friction
    this.body.setDragX(0);

    // Get ground Y from scene (responsive to screen size)
    // If scene has groundY property, use it; otherwise use config
    this.groundY = this.scene.groundY || GameConfig.Ground.Y_Position;
  }

  setupAnimations() {
    // Running animation should already be created in PreloadScene
    // But we can verify it exists and play it
    if (this.scene.anims.exists("player_run")) {
      this.play("player_run");
    }
  }

  jump() {
    const jumpForce = GameConfig.Player.Jump_Force;

    // Ground jump
    if (this.isOnGround) {
        this.body.setVelocityY(jumpForce);
        this.isOnGround = false;
        this.isJumping = true;
        this.canJump = false;

        if (this.scene.textures.exists('player_jump')) {
            this.setTexture('player_jump');
        }
        return;
    }

    // 🔥 DOUBLE JUMP
    if (this.extraJumps > 0) {
        this.body.setVelocityY(jumpForce);
        this.extraJumps--;

        // optional feedback
        this.setTint(0x00ff00);
        this.scene.time.delayedCall(100, () => this.clearTint());
    }
}

  update() {
    // Check if player has landed
    this.checkGroundCollision();

    // Update animation based on state
    this.updateAnimation();
  }

  checkGroundCollision() {
    const tolerance = 15; // Increased tolerance for mobile

    // Update ground Y from scene if available (for responsive sizing)
    if (this.scene.groundY !== undefined) {
      this.groundY = this.scene.groundY;
    }

    // Check if player is at or below ground level
    // Since origin is at bottom (0.5, 1.0), y represents bottom of sprite
    const isAtGround = this.y >= this.groundY - tolerance;
    const isMovingDown = this.body.velocity.y >= 0;

    if (isAtGround && isMovingDown) {
      // Player is on ground
      if (this.isJumping || !this.isOnGround) {
        // Just landed
        this.isOnGround = true;
        this.isJumping = false;
        this.canJump = true;
        // 🔥 RESET DOUBLE JUMP ON LAND
        this.extraJumps = this.maxExtraJumps;
        
        // Reset to running animation
        if (this.scene.anims.exists("player_run")) {
          this.play("player_run");
        }
      }

      // Keep player's bottom at ground level (only if not jumping)
      if (!this.isJumping) {
        this.y = this.groundY;
        this.body.setVelocityY(0);
      }
    } else if (this.y < this.groundY - tolerance) {
      // Player is in the air
      this.isOnGround = false;

      // If falling and below ground, snap to ground
      if (this.y > this.groundY + 50) {
        this.y = this.groundY;
        this.body.setVelocityY(0);
        this.isOnGround = true;
        this.isJumping = false;
        this.canJump = true;
      }
    }
  }
  updateAnimation() {
    // Switch between running and jumping animations
    if (this.isJumping && this.scene.textures.exists("player_jump")) {
      // Keep jump sprite while jumping
      if (this.texture.key !== "player_jump") {
        this.setTexture("player_jump");
      }
    } else if (this.isOnGround && this.scene.anims.exists("player_run")) {
      // Play running animation when on ground
      if (
        this.anims.currentAnim &&
        this.anims.currentAnim.key !== "player_run"
      ) {
        this.play("player_run");
      }
    }
  }

  // Get player bounds for collision detection
  getBounds() {
    return this.getBounds();
  }

  // Reset player to initial state
  reset() {
    this.setPosition(GameConfig.Player.Start_X, GameConfig.Player.Start_Y);
    this.body.setVelocity(0, 0);
    this.isJumping = false;
    this.isOnGround = true;
    this.canJump = true;
    this.play("player_run");
  }
}
