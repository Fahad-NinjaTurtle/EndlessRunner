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
    this.body.setSize(this.width * 0.6, this.height * 0.6);

    // 3️⃣ Move hitbox downward (feet area)
    this.body.setOffset(this.width * 0.2, this.height * 0.4);

    // 🔴 CRITICAL
    this.body.setAllowGravity(false);
    this.body.setImmovable(true);

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
    // 🔥 MOVE LEFT EVERY FRAME (guaranteed)
    this.x -= this.speed * (this.scene.game.loop.delta / 1000);

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
