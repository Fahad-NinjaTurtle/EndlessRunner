class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: "PreloadScene" });
  }

  preload() {
    // Create loading bar
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Loading text
    const loadingText = this.add.text(
      width / 2,
      height / 2 - 50,
      "Loading...",
      {
        fontSize: "32px",
        fill: "#FFFFFF",
        fontFamily: "Arial",
      }
    );
    loadingText.setOrigin(0.5);

    // Progress bar background
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2, 320, 50);

    // Update progress bar
    this.load.on("progress", (value) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 + 10, 300 * value, 30);
    });

    // Load assets
    this.loadAssets();
  }

  loadAssets() {
    // Load player sprites (walking animation)
    this.load.image(
      "player_idle",
      "assets/images/Characters/character_beige_idle.png"
    );
    this.load.image(
      "player_walk_a",
      "assets/images/Characters/character_beige_walk_a.png"
    );
    this.load.image(
      "player_walk_b",
      "assets/images/Characters/character_beige_walk_b.png"
    );
    this.load.image(
      "player_jump",
      "assets/images/Characters/character_beige_jump.png"
    );
    this.load.image(
      "ground_tile",
      "assets/images/Tiles/terrain_grass_block_top.png"
    );
    this.load.image(
      "mud_tile",
      "assets/images/Tiles/terrain_grass_block_center.png"
    );

    // Load background layers for parallax effect
    // Layer 1: Far background - Solid Sky (slowest - appears farthest)
    this.load.image(
      "bg_layer1",
      "assets/images/Backgrounds/background_solid_sky.png"
    );

    // Layer 2: Mid background - Clouds (medium speed)
    // Try solid_cloud first (more visible), fallback to clouds if needed
    this.load.image(
      "bg_layer2",
      "assets/images/Backgrounds/background_clouds.png"
    );
    // Alternative: this.load.image('bg_layer2', 'assets/images/Backgrounds/background_solid_cloud.png');

    // Layer 3: Near background - Trees/Hills (fastest - appears closest)
    this.load.image(
      "bg_layer3",
      "assets/images/Backgrounds/background_color_trees.png"
    );

    // ===============================
    // ENEMIES
    // ===============================

    // Slime
    this.load.image("slime_normal_walk_a", "assets/images/Enemies/slime_normal_walk_a.png");
    this.load.image("slime_normal_walk_b", "assets/images/Enemies/slime_normal_walk_b.png");
    // Snail
    this.load.image("snail_walk_a", "assets/images/Enemies/snail_walk_a.png");
    this.load.image("snail_walk_b", "assets/images/Enemies/snail_walk_b.png");

    // Bee
    this.load.image("bee_a", "assets/images/Enemies/bee_a.png");
    this.load.image("bee_b", "assets/images/Enemies/bee_b.png");

    // Fly
    this.load.image("fly_a", "assets/images/Enemies/fly_a.png");
    this.load.image("fly_b", "assets/images/Enemies/fly_b.png");

    // Saw
    this.load.image("saw_a", "assets/images/Enemies/saw_a.png");
    this.load.image("saw_b", "assets/images/Enemies/saw_b.png");

    this.load.image("Slime_Spike_a","assets/images/Enemies/slime_spike_walk_a.png");
    this.load.image("Slime_Spike_b","assets/images/Enemies/slime_spike_walk_b.png");


    // sounds
    this.load.audio("jump", "assets/Sounds/sfx_Jump.ogg");
    this.load.audio("double_jump", "assets/Sounds/sfx_Jump-high.ogg");
    this.load.audio("hit", "assets/Sounds/sfx_hurt.ogg");
    this.load.audio("bg_music", "assets/Sounds/gameplaySound.mp3");

  }

  create() {
    // Create player animation
    this.anims.create({
      key: "player_run",
      frames: [{ key: "player_walk_a" }, { key: "player_walk_b" }],
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
        key: "slime_normal_walk",
        frames: [{ key: "slime_normal_walk_a" }, { key: "slime_normal_walk_b" }],
        frameRate: 10,
        repeat: -1,
    });

    this.anims.create({
        key: "snail_walk",
        frames: [{ key: "snail_walk_a" }, { key: "snail_walk_b" }],
        frameRate: 10,
        repeat: -1,
    });

    this.anims.create({
        key: "bee_walk",
        frames: [{ key: "bee_a" }, { key: "bee_b" }],
        frameRate: 10,
        repeat: -1,
    });
    
    this.anims.create({
        key: "fly_walk",
        frames: [{ key: "fly_a" }, { key: "fly_b" }],
        frameRate: 10,
        repeat: -1,
    });

    this.anims.create({
        key: "saw_walk",
        frames: [{ key: "saw_a" }, { key: "saw_b" }],
        frameRate: 10,
        repeat: -1,
    });

    this.anims.create({
        key: "slime_spike_walk",
        frames: [{ key: "Slime_Spike_a" }, { key: "Slime_Spike_b" }],
        frameRate: 10,
        repeat: -1,
    });

    // Start MenuScene after loading completes
    this.scene.start("MenuScene");
  }
}
