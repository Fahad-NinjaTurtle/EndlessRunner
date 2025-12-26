class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        // Hide all overlays when game starts
        const menuOverlay = document.getElementById('menu-overlay');
        const gameOverOverlay = document.getElementById('gameover-overlay');
        
        if (menuOverlay) {
            menuOverlay.classList.add('hidden');
        }
        if (gameOverOverlay) {
            gameOverOverlay.classList.add('hidden');
        }
    
        // Initialize game state
        this.gameOver = false;
        this.gameSpeed = 1; // Base speed multiplier
        
        // Create parallax background FIRST (so it renders behind everything)
        this.parallaxManager = new ParallaxManager(this);
        
        // Create ground
        this.createGround();
        
        // Create player - use ground Y for starting position
        this.player = new Player(
            this, 
            GameConfig.Player.Start_X, 
            this.groundY
        );
        
        // Set up collision between player and ground (optional, but helps)
        // Uncomment if you want Phaser's automatic collision handling
        // this.physics.add.collider(this.player, this.ground);
        
        // Create other managers (will be implemented in later steps)
        // this.obstacleSpawner = new ObstacleSpawner(this);
        // this.scoreManager = new ScoreManager(this);
        // this.difficultyManager = new DifficultyManager(this);
        
        // Set up input
        this.setupInput();
    }

    createGround() {
        // Get screen dimensions
        const screenHeight = this.cameras.main.height;
        const screenWidth = this.cameras.main.width;
        
        // Calculate ground Y as percentage of screen (e.g., 80% from top)
        const groundY = screenHeight * 0.8;
        const groundHeight = GameConfig.Ground.Height;
        const groundWidth = screenWidth * 2;
        
        // Store ground Y for player reference
        this.groundY = groundY;
        
        // Create ground visual
        this.ground = this.add.rectangle(
            screenWidth / 2,
            groundY + groundHeight / 2,
            groundWidth,
            groundHeight,
            0x8B4513
        );
        
        // Set depth so ground renders in front of backgrounds but behind player
        this.ground.setDepth(0);
        
        // Add physics to ground
        this.physics.add.existing(this.ground, true);
        
        // Set ground body properties
        this.ground.body.setSize(groundWidth, groundHeight);
    }

    setupInput() {
        // Jump on click/tap/spacebar
        this.input.on('pointerdown', () => {
            if (!this.gameOver && this.player) {
                this.player.jump();
            }
        });

        // Keyboard input
        if (this.input.keyboard) {
            this.input.keyboard.on('keydown-SPACE', () => {
                if (!this.gameOver && this.player) {
                    this.player.jump();
                }
            });
        }
    }

    update(time, delta) {
        if (this.gameOver) return;

        // Update parallax backgrounds (pass delta time for frame-independent movement)
        if (this.parallaxManager) {
            this.parallaxManager.update(delta);
        }

        // Update player
        if (this.player) {
            this.player.update();
        }

        // Update other managers (will be implemented in later steps)
        // this.obstacleSpawner.update(delta);
        // this.scoreManager.update(delta);
        // this.difficultyManager.update(time);
    }

    endGame() {
        if (this.gameOver) return;
        
        this.gameOver = true;
        const finalScore = 0; // this.scoreManager.getScore();
        
        // Pass score to GameOverScene
        this.scene.start('GameOverScene', { score: finalScore });
    }
}