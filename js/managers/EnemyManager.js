class EnemyManager {
    constructor(scene) {
      this.scene = scene;
  
      this.enemies = scene.physics.add.group();
      
      // Initial spawn interval (random between 1-3 seconds)
      this.minSpawnInterval = 1000; // Minimum 1 second
      this.maxSpawnInterval = 3000; // Maximum 3 seconds
      this.spawnIntervalReduction = 50; // Reduce by 50ms every interval decrease
      this.intervalDecreaseTime = 5000; // Decrease interval every 5 seconds
      this.lastIntervalDecrease = this.scene.time.now; // Initialize to current time
      this.totalReduction = 0; // Track total reduction applied
  
      // Start with random interval
      this.scheduleNextSpawn();
    }
    
    scheduleNextSpawn() {
      // Random interval between 1-3 seconds, reduced over time
      const baseRandomInterval = Phaser.Math.Between(this.minSpawnInterval, this.maxSpawnInterval);
      // Apply reduction - make intervals shorter over time
      const actualInterval = Math.max(this.minSpawnInterval, baseRandomInterval - this.totalReduction);
      
      this.spawnTimer = this.scene.time.delayedCall(actualInterval, () => {
        this.spawnEnemy();
        this.scheduleNextSpawn(); // Schedule next spawn
      });
    }
    
    update() {
      // Update all enemies
      this.enemies.getChildren().forEach(e => e.update());
      
      // Reduce spawn interval over time (every 5 seconds)
      const currentTime = this.scene.time.now;
      if (currentTime - this.lastIntervalDecrease >= this.intervalDecreaseTime) {
        // Increase total reduction, which makes spawn intervals shorter
        this.totalReduction += this.spawnIntervalReduction;
        // Cap reduction so interval doesn't go below minimum
        const maxReduction = this.maxSpawnInterval - this.minSpawnInterval;
        this.totalReduction = Math.min(this.totalReduction, maxReduction);
        this.lastIntervalDecrease = currentTime;
      }
    }
  
    spawnEnemy() {
      const keys = Object.keys(EnemyConfig);
      const randomKey = Phaser.Utils.Array.GetRandom(keys);
      const data = EnemyConfig[randomKey];
  
      const x = this.scene.cameras.main.width + 50;
      const groundY = this.scene.groundY ?? this.scene.cameras.main.height * 0.8;

      // Calculate Y position - flying enemies use yOffset (negative for above ground)
      let y = groundY;
      if (data.type === 'flying') {
        y = groundY + data.yOffset; // yOffset is negative for bees (above ground)
      }
  
      const enemy = new Enemy(this.scene, x, y, data);
      this.enemies.add(enemy);
    }
  }
  