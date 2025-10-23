# Achtung, die Kurve!

A browser-based multiplayer implementation of the classic snake-like game "Achtung, die Kurve" (also known as Curve Fever or Zatacka).

## How to Play

1. Open `index.html` in your web browser
2. Select the number of players (2-6)
3. Each player controls a continuously moving line that leaves a trail
4. Use your assigned keys to turn left or right
5. Collect power-up tokens to gain special abilities
6. Avoid crashing into any trail (including your own) or the walls (unless you have wraparound active)
7. Last player surviving wins the round
8. First player to reach 10 points wins the game!

## Controls

### Keyboard Controls
- **Player 1 (Red):** A / D
- **Player 2 (Cyan):** ← / →
- **Player 3 (Yellow):** J / L
- **Player 4 (Green):** V / N
- **Player 5 (Pink):** Numpad 4 / Numpad 6
- **Player 6 (Purple):** Numpad 7 / Numpad 9

### 📱 Mobile Phone Controls
Play from your phone! Each player can use their mobile device as a wireless controller:

1. **On Computer:** Open the game and look for the mobile controller section in the menu
2. **Get the URL:** Copy the mobile controller URL or scan the QR code with your phone's camera
3. **On Phone:** Open the URL in your mobile browser
4. **Connect:** Your phone will automatically connect and be assigned to a player
5. **Play:** Use the LEFT/RIGHT touch buttons to control your line

**Note:** Both keyboard and mobile controls can be used simultaneously - mix and match as you like!

## Features

- 2-6 player local multiplayer
- **Mobile phone controllers** - Use your phone as a wireless gamepad via WebRTC
- Smooth gameplay at 60 FPS
- Random gaps in trails for added challenge
- **Power-up tokens** with special effects
- Round-based scoring system
- Responsive canvas that adapts to window size
- Advanced collision detection
- Cross-device multiplayer (keyboard + mobile mixed)

## Power-up Tokens

Special tokens spawn randomly during gameplay. Run into them to activate their effects:

### 🟣 Reverse Controls (Magenta)
- Your left/right controls are reversed
- Duration: 5-10 seconds
- Affects only the player who collected it

### 🔵 Player Wraparound (Cyan)
- You can pass through walls and appear on the opposite side
- Your player head blinks while active
- Duration: 5-10 seconds
- Affects only the player who collected it

### 🟡 Global Wraparound (Yellow)
- **ALL players** can pass through walls
- Game border pulses yellow while active
- Duration: 5-10 seconds
- Affects everyone when collected by any player

## Technical Details

- Built with vanilla JavaScript, HTML5 Canvas, and CSS
- WebRTC peer-to-peer connections via PeerJS for mobile controllers
- No server required (PeerJS cloud handles signaling only)
- No build process required
- Works in all modern browsers
- Object-oriented architecture with separate classes for Players, Tokens, Controller Manager, and Game Manager

## Game Rules

- Your line moves continuously - you can only turn left or right
- Random gaps appear in your trail periodically
- Touching any trail or wall eliminates you from the round (unless wraparound is active)
- Power-up tokens spawn every 5-15 seconds at random locations
- Each round won earns 1 point
- First to 10 points wins the match

## Files

- `index.html` - Main HTML structure and UI
- `mobile-controller.html` - Mobile phone controller interface
- `game.js` - Core game loop, rendering, and state management
- `player.js` - Player class with movement, collision detection, and trail rendering
- `token.js` - Token system with power-up effects
- `controller-manager.js` - WebRTC connection manager for mobile controllers
- `styles.css` - UI styling and layout
- `mobile-styles.css` - Mobile controller UI styles

## Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (only for initial mobile controller pairing via PeerJS cloud)
- For mobile controllers: smartphone with a modern mobile browser

## Hosting

The game can be hosted on:
- **GitHub Pages** - Simply push to a gh-pages branch
- **Any static hosting service** - Netlify, Vercel, etc.
- **Local file system** - Just open index.html directly

**Note:** Mobile controllers work best when the game is hosted on a web server (http/https), but will also work locally via the same WiFi network.

Enjoy the game!
