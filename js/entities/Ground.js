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
  
    update(delta) {
      this.tilePositionX += GameConfig.Ground.Speed * (delta / 1000);
    }
  }
  