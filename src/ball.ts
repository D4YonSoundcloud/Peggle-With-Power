export class Ball {
    private x: number;
    private y: number;
    private velocityX: number = 0;
    private velocityY: number = 0;
    private readonly radius: number = 10;
    private readonly mass: number = 1;
    private gravity: number = 0.2;
    private friction: number = 0.99;
    private bounceImpulse: number = 0.8;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public update(): void {
        this.velocityY += this.gravity;
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.velocityX *= this.friction;
        this.velocityY *= this.friction;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();
    }

    public launch(x: number, y: number, angle: number, speed: number): void {
        this.x = x;
        this.y = y;
        this.velocityX = Math.cos(angle) * speed;
        this.velocityY = Math.sin(angle) * speed;
    }

    public applyCollision(collision: { x: number; y: number; velocityX: number; velocityY: number }): void {
        this.x = collision.x;
        this.y = collision.y;
        this.velocityX = collision.velocityX * this.bounceImpulse;
        this.velocityY = collision.velocityY * this.bounceImpulse;
    }

    public getX(): number {
        return this.x;
    }

    public getY(): number {
        return this.y;
    }

    public getRadius(): number {
        return this.radius;
    }

    public getVelocityX(): number {
        return this.velocityX;
    }

    public getVelocityY(): number {
        return this.velocityY;
    }

    public getMass(): number {
        return this.mass;
    }

    public setPosition(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    public setVelocity(velocityX: number, velocityY: number): void {
        this.velocityX = velocityX;
        this.velocityY = velocityY;
    }

    public setPhysicsProperties(gravity: number, friction: number, bounceImpulse: number): void {
        this.gravity = gravity;
        this.friction = friction;
        this.bounceImpulse = bounceImpulse;
    }

    public clone(): Ball {
        const clonedBall = new Ball(this.x, this.y);
        clonedBall.setVelocity(this.velocityX, this.velocityY);
        clonedBall.setPhysicsProperties(this.gravity, this.friction, this.bounceImpulse);
        return clonedBall;
    }
}