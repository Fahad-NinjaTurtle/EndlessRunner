class MudFill extends Phaser.GameObjects.TileSprite {
    constructor(scene, x, y, width, height) {
      super(scene, x, y, width, height, "mud_tile");
  
      scene.add.existing(this);
  
      this.setOrigin(0.5, 0);
      this.setDepth(0); // behind ground
    }
  
    update(delta) {
      this.tilePositionX += GameConfig.Ground.Speed * (delta / 1000);
    }
  }
  