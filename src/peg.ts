export class Peg {
    private readonly x: number;
    private readonly y: number;
    private readonly radius: number = 5;
    private readonly mass: number = Infinity; // Pegs are immovable
    public hit: boolean = false;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.hit ? 'gray' : 'blue';
        ctx.fill();
        ctx.closePath();
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

    public getMass(): number {
        return this.mass;
    }

}