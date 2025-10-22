const GAP_DURATION_MS = 400;

class Player {
    constructor(id, name, color, x, y, angle, leftKey, rightKey) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = 0.5;
        this.turnSpeed = 0.02;
        this.radius = 3;
        this.lineWidth = 4;
        
        this.leftKey = leftKey;
        this.rightKey = rightKey;
        this.leftPressed = false;
        this.rightPressed = false;
        
        this.trailSegments = [[]];
        this.alive = true;
        this.score = 0;
        
        this.gapTimer = 0;
        this.gapInterval = Math.random() * 2000 + 1000;
        this.inGap = false;
        
        this.controlsReversed = false;
        this.reverseTimeout = null;
        
        this.wraparoundEnabled = false;
        this.wraparoundTimeout = null;
    }
    
    update(deltaTime, gameArea) {
        if (!this.alive) return;
        
        const turnDirection = this.controlsReversed ? -1 : 1;
        
        if (this.leftPressed) {
            this.angle -= this.turnSpeed * turnDirection;
        }
        if (this.rightPressed) {
            this.angle += this.turnSpeed * turnDirection;
        }
        
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        
        this.handleWraparound(gameArea);
        
        if (!this.inGap) {
            const currentSegment = this.trailSegments[this.trailSegments.length - 1];
            currentSegment.push({
                x: this.x,
                y: this.y
            });
        }
        
        this.gapTimer += deltaTime;
        if (this.gapTimer >= this.gapInterval && !this.inGap) {
            this.inGap = true;
            this.gapTimer = 0;
            this.gapInterval = Math.random() * 2000 + 1000;
            setTimeout(() => {
                if (this.alive) {
                    this.trailSegments.push([]);
                    this.inGap = false;
                }
            }, GAP_DURATION_MS);
        }
    }
    
    draw(ctx) {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        for (let segment of this.trailSegments) {
            if (segment.length > 1) {
                ctx.beginPath();
                ctx.moveTo(segment[0].x, segment[0].y);
                for (let i = 1; i < segment.length; i++) {
                    ctx.lineTo(segment[i].x, segment[i].y);
                }
                ctx.stroke();
            }
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
    
    checkCollision(gameArea, allPlayers) {
        if (!this.alive) return false;
        
        if (!this.wraparoundEnabled) {
            if (this.x - this.radius < gameArea.x || 
                this.x + this.radius > gameArea.x + gameArea.width || 
                this.y - this.radius < gameArea.y || 
                this.y + this.radius > gameArea.y + gameArea.height) {
                return true;
            }
        }
        
        for (let player of allPlayers) {
            for (let segmentIndex = 0; segmentIndex < player.trailSegments.length; segmentIndex++) {
                const segment = player.trailSegments[segmentIndex];
                
                if (segment.length < 2) continue;
                
                const isOwnSegment = player.id === this.id;
                const isLastSegment = segmentIndex === player.trailSegments.length - 1;
                const skipLast = isOwnSegment && isLastSegment ? 20 : 0;
                
                for (let i = 0; i < segment.length - 1 - skipLast; i++) {
                    const p1 = segment[i];
                    const p2 = segment[i + 1];
                    
                    if (this.lineCircleCollision(p1, p2, {x: this.x, y: this.y}, this.radius + this.lineWidth / 2)) {
                        return true;
                    }
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
    
    applyReverseControls(duration) {
        if (this.reverseTimeout) {
            clearTimeout(this.reverseTimeout);
        }
        
        this.controlsReversed = true;
        this.reverseTimeout = setTimeout(() => {
            this.controlsReversed = false;
            this.reverseTimeout = null;
        }, duration);
    }
    
    applyWraparound(duration) {
        if (this.wraparoundTimeout) {
            clearTimeout(this.wraparoundTimeout);
        }
        
        this.wraparoundEnabled = true;
        this.wraparoundTimeout = setTimeout(() => {
            this.wraparoundEnabled = false;
            this.wraparoundTimeout = null;
        }, duration);
    }
    
    handleWraparound(gameArea) {
        if (!this.wraparoundEnabled) return;
        
        let wrapped = false;
        
        if (this.x - this.radius < gameArea.x) {
            this.x = gameArea.x + gameArea.width - this.radius;
            wrapped = true;
        } else if (this.x + this.radius > gameArea.x + gameArea.width) {
            this.x = gameArea.x + this.radius;
            wrapped = true;
        }
        
        if (this.y - this.radius < gameArea.y) {
            this.y = gameArea.y + gameArea.height - this.radius;
            wrapped = true;
        } else if (this.y + this.radius > gameArea.y + gameArea.height) {
            this.y = gameArea.y + this.radius;
            wrapped = true;
        }
        
        if (wrapped) {
            this.trailSegments.push([]);
        }
    }
    
    reset(x, y, angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.trailSegments = [[]];
        this.alive = true;
        this.gapTimer = 0;
        this.inGap = false;
        this.leftPressed = false;
        this.rightPressed = false;
        
        if (this.reverseTimeout) {
            clearTimeout(this.reverseTimeout);
        }
        this.controlsReversed = false;
        this.reverseTimeout = null;
        
        if (this.wraparoundTimeout) {
            clearTimeout(this.wraparoundTimeout);
        }
        this.wraparoundEnabled = false;
        this.wraparoundTimeout = null;
    }
}
