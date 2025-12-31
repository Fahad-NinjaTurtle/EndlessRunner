class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, config) {
    super(scene, x, y, config.key);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.scene = scene;
    this.speed = config.speed;

    this.setOrigin(1, 1);
    this.setDepth(10);
    // 1️⃣ Visual size
    this.setScale(0.5);

    // 2️⃣ IMPORTANT: update body after scaling
    // For flying enemies, use smaller, centered collision box that matches the sprite better
    if (config.type === 'flying') {
      // Flying enemies: much smaller collision box, positioned in upper center
      // Since origin is (1, 1) = bottom-right, we offset upward to prevent collision when player is below
      this.body.setSize(this.width * 0.4, this.height * 0.4);
      // Offset upward more (0.5) to center hitbox higher, preventing collision when player is below
      this.body.setOffset(this.width * 0.1, this.height * 0.1);
    } else {
      // Ground enemies: normal collision box
      this.body.setSize(this.width * 0.6, this.height * 0.6);
      this.body.setOffset(this.width * 0.2, this.height * 0.4);
    }

    // 🔴 CRITICAL - Disable gravity for all enemies
    this.body.setAllowGravity(false);
    this.body.setImmovable(true);
    
    // Store enemy type and config for reference
    this.enemyType = config.type;
    this.config = config;

    // Ensure body is enabled
    this.body.enable = true;

    if (
      config.key === "slime_normal_walk_a" ||
      config.key === "slime_normal_walk_b"
    ) {
      this.play("slime_normal_walk");
    } else if (config.key === "snail_walk_a" || config.key === "snail_walk_b") {
      this.play("snail_walk");
    } else if (config.key === "bee_a" || config.key === "bee_b") {
      this.play("bee_walk");
    } else if (config.key === "fly_a" || config.key === "fly_b") {
      this.play("fly_walk");
    } else if (config.key === "saw_a" || config.key === "saw_b") {
      this.play("saw_walk");
    } else if (
      config.key === "Slime_Spike_a" ||
      config.key === "Slime_Spike_b"
    ) {
      this.play("slime_spike_walk");
    }
  }

  update() {
    // Enemies now move with ground speed (from GameScene)
    // Movement is handled by GameScene to sync with ground
    const groundSpeed = this.scene.groundSpeed || GameConfig.Ground.Speed;
    this.x -= groundSpeed * 1.2 * (this.scene.game.loop.delta / 1000);
    
    // For flying enemies (bee, fly), keep them at their Y position - no gravity
    if (this.enemyType === 'flying' && this.config) {
      const groundY = this.scene.groundY ?? this.scene.cameras.main.height * 0.8;
      const targetY = groundY + this.config.yOffset;
      // Lock Y position - prevent gravity from affecting them
      this.y = targetY;
      // Ensure gravity is disabled and no vertical velocity
      if (this.body) {
        this.body.setAllowGravity(false);
        this.body.setVelocityY(0);
      }
    }

    if (this.x < -this.width) {
        // 🔥 Enemy successfully avoided
        if (this.scene && this.scene.onEnemyAvoided) {
          this.scene.onEnemyAvoided();
          console.log("Enemy avoided");
        }
        this.destroy();
      }
      
  }
}
