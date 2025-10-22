const TOKEN_TYPES = {
    REVERSE_CONTROLS: {
        name: 'Reverse Controls',
        color: '#ff00ff',
        duration: () => 5000 + Math.random() * 5000
    },
    WRAPAROUND: {
        name: 'Wraparound',
        color: '#00ffff',
        duration: () => 5000 + Math.random() * 5000
    }
};

class Token {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.radius = 12;
        this.active = true;
        this.pulsePhase = Math.random() * Math.PI * 2;
    }
    
    draw(ctx) {
        if (!this.active) return;
        
        ctx.strokeStyle = this.type.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    checkCollision(player) {
        if (!this.active || !player.alive) return false;
        
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        return distance < this.radius + player.radius;
    }
}

class TokenManager {
    constructor(gameArea) {
        this.gameArea = gameArea;
        this.tokens = [];
        this.spawnTimer = 0;
        this.nextSpawnTime = this.getRandomSpawnTime();
    }
    
    getRandomSpawnTime() {
        return 5000 + Math.random() * 10000;
    }
    
    update(deltaTime, players) {
        this.spawnTimer += deltaTime;
        
        if (this.spawnTimer >= this.nextSpawnTime) {
            this.spawnToken();
            this.spawnTimer = 0;
            this.nextSpawnTime = this.getRandomSpawnTime();
        }
        
        this.tokens = this.tokens.filter(token => token.active);
        
        this.tokens.forEach(token => {
            players.forEach(player => {
                if (token.checkCollision(player)) {
                    this.applyTokenEffect(token, player);
                    token.active = false;
                }
            });
        });
    }
    
    spawnToken() {
        const margin = 50;
        const x = this.gameArea.x + margin + Math.random() * (this.gameArea.width - margin * 2);
        const y = this.gameArea.y + margin + Math.random() * (this.gameArea.height - margin * 2);
        
        const tokenTypes = Object.values(TOKEN_TYPES);
        const type = tokenTypes[Math.floor(Math.random() * tokenTypes.length)];
        
        const token = new Token(x, y, type);
        this.tokens.push(token);
        console.log('Token spawned at:', x, y, 'Total tokens:', this.tokens.length);
    }
    
    applyTokenEffect(token, player) {
        if (token.type === TOKEN_TYPES.REVERSE_CONTROLS) {
            player.applyReverseControls(token.type.duration());
        } else if (token.type === TOKEN_TYPES.WRAPAROUND) {
            player.applyWraparound(token.type.duration());
        }
    }
    
    draw(ctx) {
        this.tokens.forEach(token => token.draw(ctx));
    }
    
    reset() {
        this.tokens = [];
        this.spawnTimer = 0;
        this.nextSpawnTime = this.getRandomSpawnTime();
    }
    
    updateGameArea(gameArea) {
        this.gameArea = gameArea;
    }
}
