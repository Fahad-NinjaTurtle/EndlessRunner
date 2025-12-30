# 🎮 Endless Runner Game

A modern, responsive endless runner game built with Phaser 3. Jump over enemies, earn double jumps, and see how far you can go! Features beautiful parallax scrolling backgrounds, smooth animations, and full mobile/desktop support.

## 🚀 Live Demo

**[Play the Game Here](https://fahad-ninjaturtle.github.io/EndlessRunner/)** 

> **Note:** Update the link above with your actual hosted URL (GitHub Pages, Netlify, Vercel, etc.)

## ✨ Features

- 🎯 **Smooth Jump Mechanics** - Tap/click to jump, with gravity-based physics
- 🚀 **Double Jump System** - Earn extra jumps by avoiding enemies (1 double jump per 4 enemies avoided)
- 🎨 **Parallax Scrolling** - Beautiful 3-layer parallax background system
- 👾 **Multiple Enemy Types** - 6 different enemy types (slime, snail, bee, fly, saw, slime_spike)
- 📱 **Full Responsive Design** - Optimized for both mobile and desktop devices
- 🎵 **Audio System** - Background music and sound effects
- 💾 **High Score Tracking** - LocalStorage-based high score system
- ⏸️ **Pause Functionality** - Pause and resume gameplay
- 🖥️ **Fullscreen Support** - Fullscreen mode for immersive gameplay
- 📊 **Real-time HUD** - Track enemies avoided and available extra jumps

## 🛠️ Technologies Used

- **Phaser 3.80.1** - Game framework
- **HTML5** - Structure
- **CSS3** - Styling and responsive design
- **JavaScript (ES6+)** - Game logic
- **Arcade Physics** - Collision detection and physics

## 📦 Installation & Setup

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (for development)

### Running Locally

1. **Clone or download the repository:**
   ```bash
   git clone repoName
   cd "HTML 5 Week 7"
   ```

2. **Start a local web server:**

   **Option 1: Using Python**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```

   **Option 2: Using Node.js (http-server)**
   ```bash
   npx http-server -p 8000
   ```

   **Option 3: Using VS Code Live Server**
   - Install the "Live Server" extension
   - Right-click on `index.html` and select "Open with Live Server"

3. **Open in browser:**
   ```
   http://localhost:8000
   ```

## 🎮 How to Play

### Controls

- **Desktop:**
  - `SPACEBAR` or `MOUSE CLICK` - Jump
  - `Pause Button` - Pause/Resume game

- **Mobile:**
  - `TAP` anywhere on screen - Jump
  - `Pause Button` - Pause/Resume game

### Gameplay

1. **Start the Game** - Click the "START" button on the menu screen
2. **Jump Over Enemies** - Tap/click to jump and avoid incoming enemies
3. **Earn Double Jumps** - Avoid 4 enemies to earn 1 extra jump (can be used mid-air)
4. **Survive as Long as Possible** - Your score is based on enemies avoided
5. **Beat Your High Score** - Try to beat your previous best!

### Tips

- Time your jumps carefully to avoid ground enemies
- Use double jumps strategically for flying enemies
- The game gets progressively more challenging
- Watch out for different enemy speeds and types

## 📁 Project Structure

```
HTML 5 Week 7/
├── index.html                 # Main HTML file
├── README.md                  # This file
├── plan.md                    # Development plan
├── css/
│   └── style.css             # Global styles and responsive utilities
├── js/
│   ├── main.js               # Game initialization and Phaser config
│   ├── scenes/
│   │   ├── PreloadScene.js   # Asset loading scene
│   │   ├── MenuScene.js      # Main menu scene
│   │   ├── GameScene.js      # Main game scene
│   │   └── GameOverScene.js  # Game over screen
│   ├── entities/
│   │   ├── Player.js         # Player character class
│   │   ├── Enemy.js          # Enemy class
│   │   ├── Ground.js         # Ground tile sprite
│   │   └── MudFill.js        # Mud fill below ground
│   ├── managers/
│   │   ├── ParallaxManager.js # Parallax background manager
│   │   └── EnemyManager.js    # Enemy spawning manager
│   └── config/
│       ├── gameConfig.js      # Game configuration constants
│       └── EnemyConfig.js     # Enemy configuration
└── assets/
    ├── images/
    │   ├── Characters/        # Player sprites
    │   ├── Enemies/          # Enemy sprites
    │   ├── Backgrounds/      # Background layers
    │   └── Tiles/            # Ground tiles
    └── Sounds/               # Audio files
```

## 🎯 Game Mechanics

### Player Physics
- **Gravity:** 1500 pixels/second²
- **Jump Force:** -700 pixels/second
- **Ground Collision:** Tolerance-based detection for smooth landing

### Enemy System
- **Spawn Interval:** 3 seconds (configurable)
- **Enemy Types:**
  - **Ground Enemies:** Slime, Snail, Slime Spike
  - **Flying Enemies:** Bee, Fly
  - **Hazards:** Saw
- **Speed Variation:** Different speeds per enemy type (180-300 pixels/second)

### Scoring System
- **Score:** Based on enemies avoided
- **Double Jump Reward:** 1 extra jump per 4 enemies avoided
- **High Score:** Saved in browser's localStorage

### Parallax System
- **Layer 1 (Sky):** 100 pixels/second (slowest, farthest)
- **Layer 2 (Clouds):** 200 pixels/second (medium)
- **Layer 3 (Trees):** 300 pixels/second (fastest, closest)

## 🎨 Customization

### Adjusting Game Difficulty

Edit `js/config/gameConfig.js`:

```javascript
Player: {
    Gravity: 1500,        // Increase for faster falling
    Jump_Force: -700,      // Increase magnitude for higher jumps
    // ...
},

Enemy: {
    Spawn_Interval: 3000,  // Decrease for more frequent enemies
},
```

### Adding New Enemies

1. Add enemy sprites to `assets/images/Enemies/`
2. Load sprites in `js/scenes/PreloadScene.js`
3. Create animation in `PreloadScene.js`
4. Add configuration in `js/config/EnemyConfig.js`
5. Enemy will automatically spawn via `EnemyManager`

## 🌐 Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Mobile Optimization

- Responsive HUD scaling
- Touch-optimized controls
- Orientation lock support
- Fullscreen mode
- Device pixel ratio handling

## 🐛 Known Issues

- None currently reported

## 🚧 Future Enhancements

- [ ] Difficulty scaling over time
- [ ] Particle effects on enemy destruction
- [ ] More enemy variety and patterns
- [ ] Power-ups system
- [ ] Multiple character skins
- [ ] Leaderboard system
- [ ] Achievement system

## 📝 Development Notes

This project was developed as part of HTML5 Week 7 coursework, demonstrating:
- Phaser 3 game development
- Parallax scrolling implementation
- Physics-based gameplay
- Responsive web game design
- Modular code architecture

## 📄 License

This project is open source and available for educational purposes.

## 👨‍💻 Author

**Your Name**
- GitHub: [@your-username](https://github.com/your-username)

## 🙏 Acknowledgments

- **Phaser 3** - Amazing game framework
- **Asset Credits** - (Add credits for any assets used)
- **Inspiration** - Classic endless runner games

---

**Enjoy the game! 🎮**

If you encounter any issues or have suggestions, please feel free to open an issue or submit a pull request.

