# Achtung, die Kurve!

A browser-based multiplayer implementation of the classic snake-like game "Achtung, die Kurve" (also known as Curve Fever or Zatacka).

## How to Play

1. Open `index.html` in your web browser
2. Select the number of players (2-6)
3. Each player controls a continuously moving line that leaves a trail
4. Use your assigned keys to turn left or right
5. Avoid crashing into any trail (including your own) or the walls
6. Last player surviving wins the round
7. First player to reach 10 points wins the game!

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
- Round-based scoring system
- Responsive canvas that adapts to window size
- Collision detection against trails and walls

## Technical Details

- Built with vanilla JavaScript, HTML5 Canvas, and CSS
- No dependencies or build process required
- Works in all modern browsers

## Game Rules

- Your line moves continuously - you can only turn left or right
- Random gaps appear in your trail periodically
- Touching any trail or wall eliminates you from the round
- Each round won earns 1 point
- First to 10 points wins the match

Enjoy the game!
