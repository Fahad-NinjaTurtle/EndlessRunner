class EnemyManager {
    constructor(scene) {
      this.scene = scene;
  
      this.enemies = scene.physics.add.group();
  
      this.spawnTimer = scene.time.addEvent({
        delay: GameConfig.Enemy.Spawn_Interval,
        callback: this.spawnEnemy,
        callbackScope: this,
        loop: true
      });
    }
  
    spawnEnemy() {
      const keys = Object.keys(EnemyConfig);
      const randomKey = Phaser.Utils.Array.GetRandom(keys);
      const data = EnemyConfig[randomKey];
  
      const x = this.scene.cameras.main.width + 50;
      const groundY = this.scene.groundY ?? this.scene.cameras.main.height * 0.8;

      const y =
        data.type === 'flying'
          ? groundY + data.yOffset
          : groundY;
      
  
      const enemy = new Enemy(this.scene, x, y, data);
      this.enemies.add(enemy);
    }
  
    update() {
      this.enemies.getChildren().forEach(e => e.update());
    }
  }
  