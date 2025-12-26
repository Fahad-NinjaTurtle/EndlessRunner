class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        // Create loading bar
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Loading text
        const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
            fontSize: '32px',
            fill: '#FFFFFF',
            fontFamily: 'Arial'
        });
        loadingText.setOrigin(0.5);

        // Progress bar background
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2, 320, 50);

        // Update progress bar
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xFFFFFF, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 + 10, 300 * value, 30);
        });

        // Load assets
        this.loadAssets();
    }

    loadAssets() {
        // Load player sprites (walking animation)
        this.load.image('player_idle', 'assets/images/Characters/character_beige_idle.png');
        this.load.image('player_walk_a', 'assets/images/Characters/character_beige_walk_a.png');
        this.load.image('player_walk_b', 'assets/images/Characters/character_beige_walk_b.png');
        this.load.image('player_jump', 'assets/images/Characters/character_beige_jump.png');
        this.load.image('ground_tile', 'assets/images/Tiles/terrain_grass_block_top.png');
        this.load.image('mud_tile', 'assets/images/Tiles/terrain_grass_block_center.png');

        // Load background layers for parallax effect
        // Layer 1: Far background - Solid Sky (slowest - appears farthest)
        this.load.image('bg_layer1', 'assets/images/Backgrounds/background_solid_sky.png');
        
        // Layer 2: Mid background - Clouds (medium speed)
        // Try solid_cloud first (more visible), fallback to clouds if needed
        this.load.image('bg_layer2', 'assets/images/Backgrounds/background_clouds.png');
        // Alternative: this.load.image('bg_layer2', 'assets/images/Backgrounds/background_solid_cloud.png');
        
        // Layer 3: Near background - Trees/Hills (fastest - appears closest)
        this.load.image('bg_layer3', 'assets/images/Backgrounds/background_color_trees.png');
        
        // Alternative background options if you want different themes:
        // For desert theme:
        // this.load.image('bg_layer2', 'assets/images/Backgrounds/background_color_desert.png');
        // this.load.image('bg_layer3', 'assets/images/Backgrounds/background_fade_desert.png');
        
        // For hills theme:
        // this.load.image('bg_layer3', 'assets/images/Backgrounds/background_color_hills.png');
        
        // Load sounds (optional)
        // this.load.audio('jump_sound', 'assets/Sounds/sfx_jump.ogg');
        // this.load.audio('hit_sound', 'assets/Sounds/sfx_hurt.ogg');
    }

    create() {
        // Create player animation
        this.anims.create({
            key: 'player_run',
            frames: [
                { key: 'player_walk_a' },
                { key: 'player_walk_b' }
            ],
            frameRate: 10,
            repeat: -1
        });

        // Start MenuScene after loading completes
        this.scene.start('MenuScene');
    }
}