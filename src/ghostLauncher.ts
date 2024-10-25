export class GhostLauncher {
    private readonly x: number;
    private readonly y: number;
    private angle: number = 0;
    private readonly length: number = 50;
    private isVisible: boolean = false;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        if (!this.isVisible) return;

        ctx.save();
        ctx.globalAlpha = 0.5; // Make the ghost launcher semi-transparent
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // Draw launcher body
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(this.length, 0);
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw a small circle at the base
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'blue';
        ctx.fill();

        ctx.restore();
    }

    public updateAngle(mouseX: number, mouseY: number): void {
        this.angle = Math.atan2(mouseY - this.y, mouseX - this.x);
    }

    public show(): void {
        this.isVisible = true;
    }

    public hide(): void {
        this.isVisible = false;
    }

    public getEndX(): number {
        return this.x + Math.cos(this.angle) * this.length;
    }

    public getEndY(): number {
        return this.y + Math.sin(this.angle) * this.length;
    }

    public getAngle(): number {
        return this.angle;
    }
}