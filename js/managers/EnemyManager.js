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
      const y =
        data.type === 'flying'
          ? this.scene.groundY + data.yOffset
          : this.scene.groundY;
  
      const enemy = new Enemy(this.scene, x, y, data);
      this.enemies.add(enemy);
    }
  
    update() {
      this.enemies.getChildren().forEach(e => e.update());
    }
  }
  