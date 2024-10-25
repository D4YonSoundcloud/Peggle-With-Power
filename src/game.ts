import { Ball } from './ball';
import { Peg } from './peg';
import { Launcher } from './launcher';
import { GhostLauncher } from './ghostLauncher';
import { checkCollision, checkWallCollisions } from './utils';
import { UIControls } from './uiControls';
import { levelFormations, createPegsFromFormation } from './levelFormations';

export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private ball: Ball | null = null;
    private pegs: Peg[] = [];
    private launcher: Launcher;
    private ghostLauncher: GhostLauncher;
    private uiControls: UIControls;
    private currentLevelIndex: number = 0;
    private isShootingAllowed: boolean = true;

    // Path tracking
    private currentShotPath: { x: number; y: number; isBounce: boolean }[] = [];
    private nextShotPath: { x: number; y: number; isBounce: boolean }[] = [];
    private nextShotMouseX: number = 0;
    private nextShotMouseY: number = 0;

    private readonly CANVAS_WIDTH = 800;
    private readonly CANVAS_HEIGHT = 600;
    private readonly LAUNCHER_X = this.CANVAS_WIDTH / 2;
    private readonly LAUNCHER_Y = 30;
    private readonly PIT_HEIGHT = 20;

    constructor() {
        this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        this.launcher = new Launcher(this.LAUNCHER_X, this.LAUNCHER_Y);
        this.ghostLauncher = new GhostLauncher(this.LAUNCHER_X, this.LAUNCHER_Y);
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
        this.resetBall();
    }

    private resetBall(): void {
        this.ball = null;
        this.isShootingAllowed = true;
        // If there's a preview path, make it the new current path
        if (this.nextShotPath.length > 0) {
            this.currentShotPath = [...this.nextShotPath];
            this.launcher.updateAngle(this.nextShotMouseX, this.nextShotMouseY);
        } else {
            this.currentShotPath = [];
        }
        this.nextShotPath = [];
    }

    private addEventListeners(): void {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            if (!this.ball) {
                // No active shot, update main launcher
                this.launcher.updateAngle(mouseX, mouseY);
                this.ghostLauncher.hide();
            } else {
                // Ball in play, update ghost launcher and preview
                this.ghostLauncher.show();
                this.ghostLauncher.updateAngle(mouseX, mouseY);
                this.nextShotMouseX = mouseX;
                this.nextShotMouseY = mouseY;
            }
        });

        this.canvas.addEventListener('click', () => {
            if (this.isShootingAllowed) {
                this.currentShotPath = this.predictTrajectory(this.launcher.getAngle());
                this.launchBall();
                this.isShootingAllowed = false;
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'n' || e.key === 'N') {
                this.loadLevel(this.currentLevelIndex + 1);
            }
        });
    }

    private updateBallProperties(gravity: number, friction: number, bounceImpulse: number): void {
        if (this.ball) {
            this.ball.setPhysicsProperties(gravity, friction, bounceImpulse);
        }
    }

    private launchBall(): void {
        const speed = 10;
        const launchAngle = this.launcher.getAngle();
        this.ball = new Ball(this.launcher.getEndX(), this.launcher.getEndY());
        this.ball.launch(this.launcher.getEndX(), this.launcher.getEndY(), launchAngle, speed);

        // Set the physics properties from UI controls
        const gravitySlider = document.getElementById('gravitySlider') as HTMLInputElement;
        const frictionSlider = document.getElementById('frictionSlider') as HTMLInputElement;
        const bounceImpulseSlider = document.getElementById('bounceImpulseSlider') as HTMLInputElement;

        this.ball.setPhysicsProperties(
            parseFloat(gravitySlider.value),
            parseFloat(frictionSlider.value),
            parseFloat(bounceImpulseSlider.value)
        );
    }

    private gameLoop(): void {
        this.ctx.clearRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);

        // Draw pit area
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.fillRect(0, this.CANVAS_HEIGHT - this.PIT_HEIGHT, this.CANVAS_WIDTH, this.PIT_HEIGHT);

        // Draw and update ball
        if (this.ball) {
            // Draw current shot path in red
            this.drawTrajectory(this.currentShotPath, 'rgba(255, 0, 0, 0.5)');

            // Calculate and draw preview path in blue
            this.nextShotPath = this.predictTrajectory(this.ghostLauncher.getAngle());
            this.drawTrajectory(this.nextShotPath, 'rgba(0, 0, 255, 0.5)');

            this.ball.update();
            this.checkCollisions();
            this.ball.draw(this.ctx);

            // Draw ghost launcher only when ball is in play
            this.ghostLauncher.draw(this.ctx);

            // Check if ball entered the pit
            if (this.ball.getY() > this.CANVAS_HEIGHT - this.PIT_HEIGHT) {
                this.resetBall();
            }
        } else {
            // No ball in play, show current path
            this.currentShotPath = this.predictTrajectory(this.launcher.getAngle());
            this.drawTrajectory(this.currentShotPath, 'rgba(255, 0, 0, 0.5)');
        }

        this.launcher.draw(this.ctx);
        this.pegs.forEach(peg => peg.draw(this.ctx));
        this.drawLevelInfo();

        requestAnimationFrame(() => this.gameLoop());
    }

    private checkCollisions(): void {
        if (!this.ball) return;

        // Only check side and top wall collisions, not bottom
        const ballRadius = this.ball.getRadius();
        const ballX = this.ball.getX();
        const ballY = this.ball.getY();
        const velocityX = this.ball.getVelocityX();
        const velocityY = this.ball.getVelocityY();

        // Side walls
        if (ballX - ballRadius < 0) {
            this.ball.setPosition(ballRadius, ballY);
            this.ball.setVelocity(Math.abs(velocityX) * 0.8, velocityY);
        } else if (ballX + ballRadius > this.CANVAS_WIDTH) {
            this.ball.setPosition(this.CANVAS_WIDTH - ballRadius, ballY);
            this.ball.setVelocity(-Math.abs(velocityX) * 0.8, velocityY);
        }

        // Top wall only
        if (ballY - ballRadius < 0) {
            this.ball.setPosition(ballX, ballRadius);
            this.ball.setVelocity(velocityX, Math.abs(velocityY) * 0.8);
        }

        // Check peg collisions
        for (const peg of this.pegs) {
            const collision = checkCollision(this.ball, peg);
            if (collision) {
                this.ball.applyCollision(collision);
                peg.hit = true;
            }
        }
    }

    private predictTrajectory(angle: number): { x: number; y: number; isBounce: boolean }[] {
        const startX = this.LAUNCHER_X + Math.cos(angle) * 50; // Use fixed length of 50
        const startY = this.LAUNCHER_Y + Math.sin(angle) * 50;
        const predictionBall = new Ball(startX, startY);
        const speed = 10;

        // Get current physics values from UI
        const gravitySlider = document.getElementById('gravitySlider') as HTMLInputElement;
        const frictionSlider = document.getElementById('frictionSlider') as HTMLInputElement;
        const bounceImpulseSlider = document.getElementById('bounceImpulseSlider') as HTMLInputElement;

        predictionBall.setPhysicsProperties(
            parseFloat(gravitySlider.value),
            parseFloat(frictionSlider.value),
            parseFloat(bounceImpulseSlider.value)
        );

        predictionBall.launch(startX, startY, angle, speed);

        const path: { x: number; y: number; isBounce: boolean }[] = [
            { x: predictionBall.getX(), y: predictionBall.getY(), isBounce: false }
        ];

        let bounceCount = 0;
        const maxBounces = 100;

        while (bounceCount <= maxBounces && predictionBall.getY() < this.CANVAS_HEIGHT - this.PIT_HEIGHT) {
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
        const ballRadius = predictionBall.getRadius();
        const ballX = predictionBall.getX();
        const ballY = predictionBall.getY();
        const velocityX = predictionBall.getVelocityX();
        const velocityY = predictionBall.getVelocityY();
        let didCollide = false;

        // Side walls
        if (ballX - ballRadius < 0) {
            predictionBall.setPosition(ballRadius, ballY);
            predictionBall.setVelocity(Math.abs(velocityX) * 0.8, velocityY);
            didCollide = true;
        } else if (ballX + ballRadius > this.CANVAS_WIDTH) {
            predictionBall.setPosition(this.CANVAS_WIDTH - ballRadius, ballY);
            predictionBall.setVelocity(-Math.abs(velocityX) * 0.8, velocityY);
            didCollide = true;
        }

        // Top wall only
        if (ballY - ballRadius < 0) {
            predictionBall.setPosition(ballX, ballRadius);
            predictionBall.setVelocity(velocityX, Math.abs(velocityY) * 0.8);
            didCollide = true;
        }

        // Check peg collisions
        for (const peg of this.pegs) {
            const collision = checkCollision(predictionBall, peg);
            if (collision) {
                predictionBall.applyCollision(collision);
                didCollide = true;
                break;
            }
        }

        return didCollide;
    }

    private drawTrajectory(path: { x: number; y: number; isBounce: boolean }[], color: string): void {
        if (path.length < 2) return;

        this.ctx.beginPath();
        this.ctx.moveTo(path[0].x, path[0].y);

        path.forEach((point, index) => {
            if (index > 0) {
                this.ctx.lineTo(point.x, point.y);
            }
            if (point.isBounce) {
                this.ctx.strokeStyle = color;
                this.ctx.stroke();
                this.ctx.beginPath();
                this.ctx.moveTo(point.x, point.y);
            }
        });

        this.ctx.strokeStyle = color;
        this.ctx.stroke();
    }

    private drawLevelInfo(): void {
        this.ctx.font = '20px Arial';
        this.ctx.fillStyle = 'black';
        this.ctx.fillText(`Level: ${levelFormations[this.currentLevelIndex].name}`, 10, 30);
        this.ctx.fillText('Press "N" for next level', 10, 60);
    }
}