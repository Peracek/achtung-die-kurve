class Player {
    constructor(id, name, color, x, y, angle, leftKey, rightKey) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = 2;
        this.turnSpeed = 0.08;
        this.radius = 3;
        this.lineWidth = 4;
        
        this.leftKey = leftKey;
        this.rightKey = rightKey;
        this.leftPressed = false;
        this.rightPressed = false;
        
        this.trail = [];
        this.alive = true;
        this.drawing = true;
        this.score = 0;
        
        this.gapTimer = 0;
        this.gapInterval = Math.random() * 2000 + 1000;
        this.inGap = false;
    }
    
    update(deltaTime) {
        if (!this.alive) return;
        
        if (this.leftPressed) {
            this.angle -= this.turnSpeed;
        }
        if (this.rightPressed) {
            this.angle += this.turnSpeed;
        }
        
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        
        if (this.drawing && !this.inGap) {
            this.trail.push({
                x: this.x,
                y: this.y
            });
        }
        
        this.gapTimer += deltaTime;
        if (this.gapTimer >= this.gapInterval) {
            this.inGap = true;
            setTimeout(() => {
                this.inGap = false;
                this.gapTimer = 0;
                this.gapInterval = Math.random() * 2000 + 1000;
            }, 150);
        }
    }
    
    draw(ctx) {
        if (this.trail.length > 1) {
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.lineWidth;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            ctx.beginPath();
            ctx.moveTo(this.trail[0].x, this.trail[0].y);
            for (let i = 1; i < this.trail.length; i++) {
                ctx.lineTo(this.trail[i].x, this.trail[i].y);
            }
            ctx.stroke();
        }
        
        if (this.alive) {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            
            if (!this.inGap) {
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.color;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }
    }
    
    checkCollision(canvas, allPlayers) {
        if (!this.alive) return false;
        
        if (this.x - this.radius < 0 || 
            this.x + this.radius > canvas.width || 
            this.y - this.radius < 0 || 
            this.y + this.radius > canvas.height) {
            return true;
        }
        
        for (let player of allPlayers) {
            const trail = player.trail;
            const startIndex = player.id === this.id ? 0 : 0;
            const endIndex = player.id === this.id ? trail.length - 20 : trail.length;
            
            for (let i = startIndex; i < endIndex - 1; i++) {
                const p1 = trail[i];
                const p2 = trail[i + 1];
                
                if (this.lineCircleCollision(p1, p2, {x: this.x, y: this.y}, this.radius + this.lineWidth / 2)) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    lineCircleCollision(lineStart, lineEnd, circle, radius) {
        const dx = lineEnd.x - lineStart.x;
        const dy = lineEnd.y - lineStart.y;
        const fx = lineStart.x - circle.x;
        const fy = lineStart.y - circle.y;
        
        const a = dx * dx + dy * dy;
        const b = 2 * (fx * dx + fy * dy);
        const c = (fx * fx + fy * fy) - radius * radius;
        
        let discriminant = b * b - 4 * a * c;
        
        if (discriminant < 0) {
            return false;
        }
        
        discriminant = Math.sqrt(discriminant);
        
        const t1 = (-b - discriminant) / (2 * a);
        const t2 = (-b + discriminant) / (2 * a);
        
        if ((t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1)) {
            return true;
        }
        
        return false;
    }
    
    reset(x, y, angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.trail = [];
        this.alive = true;
        this.drawing = true;
        this.gapTimer = 0;
        this.inGap = false;
        this.leftPressed = false;
        this.rightPressed = false;
    }
}
