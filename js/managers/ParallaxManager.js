class ParallaxManager {
  constructor(scene) {
    this.scene = scene;
    this.layers = [];
    this.baseSpeed = 1;

    this.createLayers();
  }

  createLayers() {
    // 🔐 Camera safety
    if (!this.scene.cameras || !this.scene.cameras.main) {
      console.warn("⚠ Camera not ready for parallax");
      return;
    }
  
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;
  
    // 🔐 Texture safety
    if (
      !this.scene.textures.exists("bg_layer1") ||
      !this.scene.textures.get("bg_layer1").source[0]
    ) {
      console.warn("⚠ Parallax textures not ready yet");
      return;
    }
  
    // Layer 1: Sky (farthest, slowest) - Positioned 50% higher (at 25% of screen height)
    this.createLayer({
      key: "bg_layer1",
      speed: GameConfig.Parallax.Layer_1_Speed,
      y: height * 0.25,
      depth: -100,
      fillScreen: true,
    });

    // Layer 2: Clouds (mid, medium speed) - Positioned 50% higher (at 25% of screen height)
    this.createLayer({
      key: "bg_layer2",
      speed: GameConfig.Parallax.Layer_2_Speed,
      y: height * 0.25,
      depth: -15,
      fillScreen: true,
    });

    // Layer 3: Trees (closest, fastest) - Keep at center for ground-level view
    this.createLayer({
      key: "bg_layer3",
      speed: GameConfig.Parallax.Layer_3_Speed,
      y: height / 2,
      depth: -10,
      fillScreen: true,
    });
  }
  
  resize() {
    this.destroy();
    this.createLayers();
  }
  
  createLayer(config) {
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;

    if (!this.scene.textures.exists(config.key)) {
      console.warn(`Texture ${config.key} does not exist`);
      return;
    }

    const texture = this.scene.textures.get(config.key);
    const imageWidth = texture.source[0].width;
    const imageHeight = texture.source[0].height;

    // Scale layers based on their position
    // Layers 1 and 2 (sky/clouds) at 25% height - scale to cover upper portion better
    // Layer 3 (trees) at center - scale to fill screen height
    let scale;
    if (config.key === "bg_layer1" || config.key === "bg_layer2") {
      // Scale to 150% of screen height for better visibility in upper portion
      scale = (height * 1.5) / imageHeight;
    } else {
      // Layer 3: Scale to fill screen height
      scale = height / imageHeight;
    }
    
    const scaledWidth = imageWidth * scale;
    const scaledHeight = imageHeight * scale;
    
    // Debug log for clouds to verify they're being created
    if (config.key === 'bg_layer2') {
      console.log(`Creating cloud layer (${config.key}):`, {
        textureExists: this.scene.textures.exists(config.key),
        imageWidth,
        imageHeight,
        scale,
        scaledWidth,
        scaledHeight,
        positionY: config.y,
        depth: config.depth
      });
    }

    // Create first image
    const image1 = this.scene.add
      .image(0, config.y, config.key)
      .setOrigin(0, 0.5)
      .setScale(scale)
      .setDepth(config.depth)
      .setAlpha(1); // Ensure full opacity

    // Calculate how many images we need for seamless scrolling
    const imagesNeeded = Math.ceil((width * 2) / scaledWidth) + 2;

    const layerData = {
      images: [image1],
      speed: config.speed,
      x: 0,
      scaledWidth: scaledWidth,
      scaledHeight: scaledHeight,
    };

    // Create additional images for seamless scrolling
    for (let i = 1; i < imagesNeeded; i++) {
      const image = this.scene.add
        .image(i * scaledWidth, config.y, config.key)
        .setOrigin(0, 0.5)
        .setScale(scale)
        .setDepth(config.depth)
        .setAlpha(1); // Ensure full opacity

      layerData.images.push(image);
    }

    // Position images to cover screen
    const totalWidth = imagesNeeded * scaledWidth;
    const offsetX = (totalWidth - width) / 2;

    layerData.images.forEach((img) => {
      img.x -= offsetX;
    });

    this.layers.push(layerData);
  }

  update(delta) {
    // delta is in milliseconds, convert to seconds for consistent speed
    const deltaSeconds = delta / 1000;

    this.layers.forEach((layer) => {
      // Calculate movement based on speed and delta time
      const movement = layer.speed * deltaSeconds * this.baseSpeed;

      // Move all images in this layer
      layer.images.forEach((image) => {
        image.x -= movement;
      });

      // Reset images that have moved off screen
      const width = this.scene.cameras.main.width;

      layer.images.forEach((image, index) => {
        // If image has moved completely off left side
        if (image.x + layer.scaledWidth < 0) {
          // Find the rightmost image
          const rightmostImage = layer.images.reduce((rightmost, img) => {
            return img.x > rightmost.x ? img : rightmost;
          }, layer.images[0]);

          // Place this image to the right of the rightmost image
          image.x = rightmostImage.x + layer.scaledWidth;
        }
      });
    });
  }

  setSpeedMultiplier(multiplier) {
    this.baseSpeed = multiplier;
  }

  // Method to reset parallax position
  reset() {
    const width = this.scene.cameras.main.width;

    this.layers.forEach((layer) => {
      const totalWidth = layer.images.length * layer.scaledWidth;
      const offsetX = (totalWidth - width) / 2;

      layer.images.forEach((img, index) => {
        img.x = index * layer.scaledWidth - offsetX;
      });
    });
  }

  // Method to destroy all layers (cleanup)
  destroy() {
    this.layers.forEach((layer) => {
      layer.images.forEach((image) => {
        image.destroy();
      });
    });
    this.layers = [];
  }
}
