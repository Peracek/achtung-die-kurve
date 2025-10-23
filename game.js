const PLAYER_CONFIGS = [
    { name: 'Player 1', color: '#ff6b6b', leftKey: 'a', rightKey: 'd' },
    { name: 'Player 2', color: '#4ecdc4', leftKey: 'ArrowLeft', rightKey: 'ArrowRight' },
    { name: 'Player 3', color: '#ffe66d', leftKey: 'j', rightKey: 'l' },
    { name: 'Player 4', color: '#a8e6cf', leftKey: 'v', rightKey: 'n' },
    { name: 'Player 5', color: '#ff8b94', leftKey: 'Numpad4', rightKey: 'Numpad6' },
    { name: 'Player 6', color: '#c7ceea', leftKey: 'Numpad7', rightKey: 'Numpad9' }
];

const WINNING_SCORES = {
    2: 10,
    3: 20,
    4: 30,
    5: 40,
    6: 50
};
const SCOREBOARD_HEIGHT = 60;
const GAME_BORDER = 10;

let canvas, ctx;
let players = [];
let numPlayers = 2;
let gameState = 'menu';
let lastTime = 0;
let animationId;
let gameArea = { x: 0, y: 0, width: 0, height: 0 };
let tokenManager;
let borderPulsePhase = 0;

function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    gameArea = {
        x: GAME_BORDER,
        y: SCOREBOARD_HEIGHT + GAME_BORDER,
        width: canvas.width - GAME_BORDER * 2,
        height: canvas.height - SCOREBOARD_HEIGHT - GAME_BORDER * 2
    };
    
    if (tokenManager) {
        tokenManager.updateGameArea(gameArea);
    }
}

function handleKeyDown(e) {
    if (gameState !== 'playing') return;
    
    players.forEach(player => {
        if (e.key.toLowerCase() === player.leftKey.toLowerCase() || e.key === player.leftKey) {
            player.leftPressed = true;
            e.preventDefault();
        }
        if (e.key.toLowerCase() === player.rightKey.toLowerCase() || e.key === player.rightKey) {
            player.rightPressed = true;
            e.preventDefault();
        }
    });
}

function handleKeyUp(e) {
    if (gameState !== 'playing') return;
    
    players.forEach(player => {
        if (e.key.toLowerCase() === player.leftKey.toLowerCase() || e.key === player.leftKey) {
            player.leftPressed = false;
        }
        if (e.key.toLowerCase() === player.rightKey.toLowerCase() || e.key === player.rightKey) {
            player.rightPressed = false;
        }
    });
}

function createPlayers(count) {
    players = [];
    const margin = 100;
    
    for (let i = 0; i < count; i++) {
        const config = PLAYER_CONFIGS[i];
        const angle = (Math.PI * 2 / count) * i;
        const x = gameArea.x + gameArea.width / 2 + Math.cos(angle) * 200;
        const y = gameArea.y + gameArea.height / 2 + Math.sin(angle) * 200;
        const startAngle = angle + Math.PI + (Math.random() - 0.5) * 0.5;
        
        players.push(new Player(
            i,
            config.name,
            config.color,
            x,
            y,
            startAngle,
            config.leftKey,
            config.rightKey
        ));
    }
}

function startGame(count) {
    numPlayers = count;
    createPlayers(count);
    tokenManager = new TokenManager(gameArea);
    
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('game').classList.remove('hidden');
    
    gameState = 'playing';
    lastTime = performance.now();
    gameLoop(lastTime);
}

function restartGame() {
    document.getElementById('gameOver').classList.add('hidden');
    startGame(numPlayers);
}

function showMenu() {
    document.getElementById('gameOver').classList.add('hidden');
    document.getElementById('game').classList.add('hidden');
    document.getElementById('menu').classList.remove('hidden');
    
    gameState = 'menu';
    
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
}

function startNewRound() {
    const margin = 100;
    
    players.forEach((player, i) => {
        const angle = (Math.PI * 2 / players.length) * i;
        const x = gameArea.x + gameArea.width / 2 + Math.cos(angle) * 200;
        const y = gameArea.y + gameArea.height / 2 + Math.sin(angle) * 200;
        const startAngle = angle + Math.PI + (Math.random() - 0.5) * 0.5;
        
        player.reset(x, y, startAngle);
    });
    
    tokenManager.reset();
    
    gameState = 'playing';
    lastTime = performance.now();
}

function gameLoop(currentTime) {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    
    update(deltaTime);
    render();
    
    animationId = requestAnimationFrame(gameLoop);
}

function update(deltaTime) {
    if (gameState !== 'playing') return;
    
    players.forEach(player => player.update(deltaTime, gameArea, tokenManager.globalWraparoundEnabled));
    
    tokenManager.update(deltaTime, players);
    
    players.forEach(player => {
        if (player.checkCollision(gameArea, players, tokenManager.globalWraparoundEnabled)) {
            if (player.alive) {
                player.alive = false;
                
                const alivePlayers = players.filter(p => p.alive);
                alivePlayers.forEach(p => p.score++);
            }
        }
    });
    
    const alivePlayers = players.filter(p => p.alive);
    
    if (alivePlayers.length <= 1) {
        const winningScore = WINNING_SCORES[numPlayers] || 10;
        const winner = players.find(p => p.score >= winningScore);
        if (winner) {
            endGame(winner);
        } else {
            gameState = 'roundOver';
            setTimeout(() => {
                startNewRound();
            }, 2000);
        }
    }
}

function render() {
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(gameArea.x, gameArea.y, gameArea.width, gameArea.height);
    
    drawBorder();
    
    drawScoreboard();
    
    tokenManager.draw(ctx);
    
    const currentTime = performance.now();
    players.forEach(player => player.draw(ctx, currentTime));
}

function drawBorder() {
    if (tokenManager.globalWraparoundEnabled) {
        borderPulsePhase += 0.1;
        const pulse = Math.sin(borderPulsePhase) * 0.5 + 0.5;
        const brightness = 200 + pulse * 55;
        ctx.strokeStyle = `rgb(${brightness}, ${brightness}, 0)`;
        ctx.lineWidth = 3 + pulse * 2;
    } else {
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 3;
    }
    
    ctx.strokeRect(gameArea.x, gameArea.y, gameArea.width, gameArea.height);
}

function drawScoreboard() {
    ctx.fillStyle = '#eee';
    ctx.font = '16px Arial';
    ctx.textBaseline = 'middle';
    
    const spacing = canvas.width / players.length;
    players.forEach((player, i) => {
        const x = spacing * i + spacing / 2;
        const y = SCOREBOARD_HEIGHT / 2;
        
        ctx.fillStyle = player.color;
        const status = player.alive ? '●' : '○';
        const text = `${status} ${player.name}: ${player.score}`;
        ctx.textAlign = 'center';
        ctx.fillText(text, x, y);
    });
}

function endGame(winner) {
    gameState = 'gameOver';
    
    document.getElementById('game').classList.add('hidden');
    document.getElementById('gameOver').classList.remove('hidden');
    
    document.getElementById('winner').innerHTML = 
        `<span style="color: ${winner.color}">${winner.name} Wins!</span>`;
    
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    document.getElementById('finalScores').innerHTML = 
        '<h3>Final Scores</h3>' +
        sortedPlayers.map((player, i) => 
            `<div class="score-item" style="color: ${player.color}">${i + 1}. ${player.name}: ${player.score}</div>`
        ).join('');
    
    players.forEach(player => player.score = 0);
}

window.addEventListener('load', init);
