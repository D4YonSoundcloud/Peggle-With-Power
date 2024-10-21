import { Ball } from './ball';
import { Peg } from './peg';
import { Launcher } from './launcher';
import { checkCollision, checkWallCollisions } from './utils';
import { UIControls } from './uiControls';
import { levelFormations, createPegsFromFormation, LevelFormation } from './levelFormations';

export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private ball: Ball;
    private pegs: Peg[] = [];
    private launcher: Launcher;
    private uiControls: UIControls;
    private currentLevelIndex: number = 0;

    private readonly CANVAS_WIDTH = 800;
    private readonly CANVAS_HEIGHT = 600;
    private readonly LAUNCHER_X = this.CANVAS_WIDTH / 2;
    private readonly LAUNCHER_Y = 30;

    constructor() {
        this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        this.ball = new Ball(this.LAUNCHER_X, this.LAUNCHER_Y);
        this.launcher = new Launcher(this.LAUNCHER_X, this.LAUNCHER_Y);
        this.uiControls = new UIControls(this.updateBallProperties.bind(this));
        this.loadLevel(this.currentLevelIndex);
    }

    public init(): void {
        this.addEventListeners();
        this.gameLoop();
    }

    private loadLevel(index: number): void {
        this.currentLevelIndex = index % levelFormations.length;
        const formation = levelFormations[this.currentLevelIndex];
        this.pegs = createPegsFromFormation(formation);
    }

    private addEventListeners(): void {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            this.launcher.updateAngle(mouseX, mouseY);
        });

        this.canvas.addEventListener('click', () => this.launchBall());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'n' || e.key === 'N') {
                this.loadLevel(this.currentLevelIndex + 1);
            }
        });
    }

    private updateBallProperties(gravity: number, friction: number, bounceImpulse: number): void {
        this.ball.setPhysicsProperties(gravity, friction, bounceImpulse);
    }

    private launchBall(): void {
        const speed = 10;
        const launchAngle = this.launcher.getAngle();
        this.ball.launch(this.launcher.getEndX(), this.launcher.getEndY(), launchAngle, speed);
    }

    private gameLoop(): void {
        this.ctx.clearRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);

        this.ball.update();
        this.checkCollisions();

        this.ball.draw(this.ctx);
        this.launcher.draw(this.ctx);
        this.pegs.forEach(peg => peg.draw(this.ctx));

        const trajectoryPath = this.predictTrajectory();
        this.drawTrajectory(trajectoryPath);

        this.drawLevelInfo();

        requestAnimationFrame(() => this.gameLoop());
    }

    private checkCollisions(): void {
        checkWallCollisions(this.ball, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);

        for (const peg of this.pegs) {
            const collision = checkCollision(this.ball, peg);
            if (collision) {
                this.ball.applyCollision(collision);
                peg.hit = true;
            }
        }
    }

    private predictTrajectory(): { x: number; y: number; isBounce: boolean }[] {
        const predictionBall = this.ball.clone();
        predictionBall.setPosition(this.launcher.getEndX(), this.launcher.getEndY());
        const launchAngle = this.launcher.getAngle();
        const speed = 10;
        predictionBall.setVelocity(Math.cos(launchAngle) * speed, Math.sin(launchAngle) * speed);

        const path: { x: number; y: number; isBounce: boolean }[] = [{ x: predictionBall.getX(), y: predictionBall.getY(), isBounce: false }];
        let bounceCount = 0;
        const maxBounces = 100; // You can adjust this value as needed

        while (bounceCount <= maxBounces && predictionBall.getY() < this.CANVAS_HEIGHT) {
            predictionBall.update();

            const newPoint = {
                x: predictionBall.getX(),
                y: predictionBall.getY(),
                isBounce: false
            };

            if (this.checkPredictionCollisions(predictionBall)) {
                bounceCount++;
                newPoint.isBounce = true;
            }

            path.push(newPoint);

            if (Math.abs(predictionBall.getVelocityX()) < 0.1 && Math.abs(predictionBall.getVelocityY()) < 0.1) {
                break;
            }
        }

        return path;
    }

    private checkPredictionCollisions(predictionBall: Ball): boolean {
        if (checkWallCollisions(predictionBall, this.CANVAS_WIDTH, this.CANVAS_HEIGHT)) {
            return true;
        }

        for (const peg of this.pegs) {
            const collision = checkCollision(predictionBall, peg);
            if (collision) {
                predictionBall.applyCollision(collision);
                return true;
            }
        }

        return false;
    }

    private drawTrajectory(path: { x: number; y: number; isBounce: boolean }[]): void {
        if (path.length < 2) return;

        this.ctx.beginPath();
        this.ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) {
            this.ctx.lineTo(path[i].x, path[i].y);
        }
        this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
        this.ctx.stroke();
    }

    private drawLevelInfo(): void {
        this.ctx.font = '20px Arial';
        this.ctx.fillStyle = 'black';
        this.ctx.fillText(`Level: ${levelFormations[this.currentLevelIndex].name}`, 10, 30);
        this.ctx.fillText('Press "N" for next level', 10, 60);
    }
}