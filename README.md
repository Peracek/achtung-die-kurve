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

- **Player 1 (Red):** A / D
- **Player 2 (Cyan):** ← / →
- **Player 3 (Yellow):** J / L
- **Player 4 (Green):** V / N
- **Player 5 (Pink):** Numpad 4 / Numpad 6
- **Player 6 (Purple):** Numpad 7 / Numpad 9

## Features

- 2-6 player local multiplayer
- Smooth gameplay at 60 FPS
- Random gaps in trails for added challenge
- **Power-up tokens** with special effects
- Round-based scoring system
- Responsive canvas that adapts to window size
- Advanced collision detection

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
- No dependencies or build process required
- Works in all modern browsers
- Object-oriented architecture with separate classes for Players, Tokens, and Game Manager

## Game Rules

- Your line moves continuously - you can only turn left or right
- Random gaps appear in your trail periodically
- Touching any trail or wall eliminates you from the round (unless wraparound is active)
- Power-up tokens spawn every 5-15 seconds at random locations
- Each round won earns 1 point
- First to 10 points wins the match

## Files

- `index.html` - Main HTML structure and UI
- `game.js` - Core game loop, rendering, and state management
- `player.js` - Player class with movement, collision detection, and trail rendering
- `token.js` - Token system with power-up effects
- `styles.css` - UI styling and layout

Enjoy the game!
