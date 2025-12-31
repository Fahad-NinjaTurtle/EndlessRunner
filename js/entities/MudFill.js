class MudFill extends Phaser.GameObjects.TileSprite {
    constructor(scene, x, y, width, height) {
      super(scene, x, y, width, height, "mud_tile");
  
      scene.add.existing(this);
  
      this.setOrigin(0.5, 0);
      this.setDepth(0); // behind ground
    }
  
    update(delta, speed) {
      // Move mud with ground speed
      const groundSpeed = speed || GameConfig.Ground.Speed;
      this.tilePositionX += groundSpeed * (delta / 1000);
    }
  }
  