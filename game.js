const PLAYER_CONFIGS = [
    { name: 'Player 1', color: '#ff6b6b', leftKey: 'a', rightKey: 'd' },
    { name: 'Player 2', color: '#4ecdc4', leftKey: 'ArrowLeft', rightKey: 'ArrowRight' },
    { name: 'Player 3', color: '#ffe66d', leftKey: 'j', rightKey: 'l' },
    { name: 'Player 4', color: '#a8e6cf', leftKey: 'v', rightKey: 'n' },
    { name: 'Player 5', color: '#ff8b94', leftKey: 'Numpad4', rightKey: 'Numpad6' },
    { name: 'Player 6', color: '#c7ceea', leftKey: 'Numpad7', rightKey: 'Numpad9' }
];

const WINNING_SCORE = 10;

let canvas, ctx;
let players = [];
let numPlayers = 2;
let gameState = 'menu';
let lastTime = 0;
let animationId;

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
        const x = canvas.width / 2 + Math.cos(angle) * 200;
        const y = canvas.height / 2 + Math.sin(angle) * 200;
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
        const x = canvas.width / 2 + Math.cos(angle) * 200;
        const y = canvas.height / 2 + Math.sin(angle) * 200;
        const startAngle = angle + Math.PI + (Math.random() - 0.5) * 0.5;
        
        player.reset(x, y, startAngle);
    });
    
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
    
    players.forEach(player => player.update(deltaTime));
    
    players.forEach(player => {
        if (player.checkCollision(canvas, players)) {
            player.alive = false;
        }
    });
    
    const alivePlayers = players.filter(p => p.alive);
    
    if (alivePlayers.length <= 1) {
        if (alivePlayers.length === 1) {
            alivePlayers[0].score++;
        }
        
        updateScoreboard();
        
        const winner = players.find(p => p.score >= WINNING_SCORE);
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
    
    players.forEach(player => player.draw(ctx));
    
    updateScoreboard();
}

function updateScoreboard() {
    const scoreboard = document.getElementById('scoreboard');
    scoreboard.innerHTML = players.map(player => {
        const status = player.alive ? '●' : '○';
        return `<div class="score-item" style="color: ${player.color}">${status} ${player.name}: ${player.score}</div>`;
    }).join('');
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
