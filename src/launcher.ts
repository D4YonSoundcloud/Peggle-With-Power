export class Launcher {
    private readonly x: number;
    private readonly y: number;
    private angle: number = 0;
    private readonly length: number = 50;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(this.length, 0);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();
    }

    public updateAngle(mouseX: number, mouseY: number): void {
        this.angle = Math.atan2(mouseY - this.y, mouseX - this.x);
    }

    public getAngle(): number {
        return this.angle;
    }

    public getEndX(): number {
        return this.x + Math.cos(this.angle) * this.length;
    }

    public getEndY(): number {
        return this.y + Math.sin(this.angle) * this.length;
    }
}