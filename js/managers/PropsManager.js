class PropsManager {
  constructor(scene) {
    try {
      this.scene = scene;
      this.props = scene.physics.add.group();
      this.spawnedProps = []; // Track spawned props for cleanup
      
      // Spawn props randomly on ground (delayed to ensure everything is ready)
      this.spawnInitialProps();
    } catch (error) {
      console.error("Error initializing PropsManager:", error);
      this.props = scene.physics.add.group();
      this.spawnedProps = [];
    }
  }

  spawnInitialProps() {
    // Wait a frame to ensure groundY is set
    this.scene.time.delayedCall(100, () => {
      const screenWidth = this.scene.cameras.main.width;
      // Use groundY directly - props should be ON the ground, not above it
      const groundY = this.scene.groundY ?? this.scene.cameras.main.height * 0.8;
      
      // Spawn props across the initial ground area, but NOT near player start position
      // Spawn props only on the right side of the screen (beyond player start)
      const playerStartX = GameConfig.Player.Start_X || 100;
      const safeZone = playerStartX + 300; // Safe zone: 300px after player start
      const propsToSpawn = Math.max(1, Math.floor((screenWidth - safeZone) / 250)); // One prop every 250 pixels
      
      for (let i = 0; i < propsToSpawn; i++) {
        // Spawn props only on the right side, away from player
        const x = Phaser.Math.Between(safeZone, screenWidth - 50);
        // groundY is the top of the ground, props should be placed ON the ground
        this.spawnProp(x, groundY);
      }
    });
  }

  spawnProp(x, y) {
    try {
      // Randomly choose between rock and log
      const propType = Phaser.Math.Between(0, 1) === 0 ? "rock" : "log";
      
      // Check if texture exists
      if (!this.scene.textures.exists(propType)) {
        // Silently skip if texture doesn't exist
        return null;
      }
      
      // Create sprite using scene.add instead of physics.add for better control
      const prop = this.scene.add.sprite(x, y, propType);
      
      if (!prop) {
        return null;
      }
      
      // Add physics after creation
      this.scene.physics.add.existing(prop);
      
      // Set scale and physics - make props very very small
      prop.setScale(0.05); // Extremely small - reduced from 0.1 to 0.05
      prop.setOrigin(0.5, 1); // Bottom center origin
      prop.setDepth(5); // Above ground, below enemies
      prop.setVisible(true); // Ensure visible
      prop.setActive(true); // Ensure active
      
      // Disable physics body collision - props are decorative only
      if (prop.body) {
        prop.body.setAllowGravity(false);
        prop.body.setImmovable(true);
        // Disable collision by making body inactive
        prop.body.enable = false; // This disables collision detection
      }
      
      this.props.add(prop);
      this.spawnedProps.push({ prop, x });
      
      return prop;
    } catch (error) {
      console.error("Error spawning prop:", error);
      return null;
    }
  }

  update(groundSpeed) {
    // Move props with ground speed (left to right, so negative)
    const speed = groundSpeed || this.scene.groundSpeed || GameConfig.Ground.Speed;
    const screenWidth = this.scene.cameras.main.width;
    const groundY = this.scene.groundY ?? this.scene.cameras.main.height * 0.8;
    
    // Track how many props are on screen
    let propsOnScreen = 0;
    
    this.props.getChildren().forEach(prop => {
      if (prop && prop.active) {
        // Only update X position - don't update Y every frame to prevent glitching
        prop.x -= speed * (this.scene.game.loop.delta / 1000);
        
        // Store initial Y and only update if groundY actually changed (e.g., on resize)
        if (!prop._groundYSet) {
          prop.y = groundY;
          prop._groundYSet = true;
          prop._lastGroundY = groundY;
        } else if (Math.abs(prop._lastGroundY - groundY) > 10) {
          // Only update Y if groundY changed significantly (like on screen resize)
          prop.y = groundY;
          prop._lastGroundY = groundY;
        }
        
        // Check if prop is on screen
        if (prop.x > -prop.width && prop.x < screenWidth + prop.width) {
          propsOnScreen++;
        }
        
        // Remove props that have moved off screen
        if (prop.x < -prop.width * 2) {
          // Spawn new prop on the right side
          const newX = screenWidth + Phaser.Math.Between(100, 300);
          prop.x = newX;
          // Set Y once when respawning, don't update every frame
          prop.y = groundY;
        }
      }
    });
    
    // Continuously spawn new props if we don't have enough on screen
    const minPropsOnScreen = 3; // Keep at least 3 props on screen
    if (propsOnScreen < minPropsOnScreen) {
      const newX = screenWidth + Phaser.Math.Between(100, 300);
      this.spawnProp(newX, groundY);
    }
  }

  destroy() {
    this.props.clear(true, true);
    this.spawnedProps = [];
  }
}

