class Ground extends Phaser.GameObjects.TileSprite {
    constructor(scene, x, y, width, height) {
      super(scene, x, y, width, height, "ground_tile");
  
      scene.add.existing(this);
      scene.physics.add.existing(this, true);
  
      this.setOrigin(0.5, 0);
      this.setDepth(1);
  
      this.body.setSize(width, height);
      this.body.updateFromGameObject();
      this.body.immovable = true;
    }
  
    update(delta, speed) {
      // Move ground left to right (negative direction for scrolling effect)
      // Speed is passed from GameScene to allow dynamic speed increase
      const groundSpeed = speed || GameConfig.Ground.Speed;
      this.tilePositionX += groundSpeed * (delta / 1000);
    }
  }
  