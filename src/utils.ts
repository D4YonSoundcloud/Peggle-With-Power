import { Ball } from './ball';
import { Peg } from './peg';

const MINIMUM_BOUNCE_VELOCITY = 2;

export function checkCollision(ball: Ball, peg: Peg): { x: number; y: number; velocityX: number; velocityY: number } | null {
    const distanceX = ball.getX() - peg.getX();
    const distanceY = ball.getY() - peg.getY();
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (distance < ball.getRadius() + peg.getRadius()) {
        // Calculate the collision normal
        const normalX = distanceX / distance;
        const normalY = distanceY / distance;

        // Calculate the relative velocity
        const relativeVelocityX = ball.getVelocityX();
        const relativeVelocityY = ball.getVelocityY();

        // Calculate the velocity along the normal
        const velocityAlongNormal = relativeVelocityX * normalX + relativeVelocityY * normalY;

        // Don't resolve if velocities are separating
        if (velocityAlongNormal > 0) {
            return null;
        }

        // Calculate restitution (bounciness)
        const restitution = 0.8;

        // Calculate impulse scalar
        let impulseScalar = -(1 + restitution) * velocityAlongNormal;
        impulseScalar /= 1 / ball.getMass() + 1 / peg.getMass();

        // Apply impulse
        const impulseX = impulseScalar * normalX;
        const impulseY = impulseScalar * normalY;

        const newVelocityX = relativeVelocityX + impulseX / ball.getMass();
        const newVelocityY = relativeVelocityY + impulseY / ball.getMass();

        // Apply minimum bounce velocity
        const currentSpeed = Math.sqrt(newVelocityX * newVelocityX + newVelocityY * newVelocityY);
        let finalVelocityX = newVelocityX;
        let finalVelocityY = newVelocityY;

        if (currentSpeed < MINIMUM_BOUNCE_VELOCITY) {
            const scaleFactor = MINIMUM_BOUNCE_VELOCITY / currentSpeed;
            finalVelocityX *= scaleFactor;
            finalVelocityY *= scaleFactor;
        }

        // Move the ball out of collision
        const overlap = (ball.getRadius() + peg.getRadius()) - distance;
        const separationX = overlap * normalX;
        const separationY = overlap * normalY;

        return {
            x: ball.getX() + separationX,
            y: ball.getY() + separationY,
            velocityX: finalVelocityX,
            velocityY: finalVelocityY
        };
    }

    return null;
}

export function checkWallCollisions(ball: Ball, canvasWidth: number, canvasHeight: number): boolean {
    let collided = false;
    const ballRadius = ball.getRadius();
    const ballX = ball.getX();
    const ballY = ball.getY();
    const velocityX = ball.getVelocityX();
    const velocityY = ball.getVelocityY();

    let newX = ballX;
    let newY = ballY;
    let newVelocityX = velocityX;
    let newVelocityY = velocityY;

    if (ballX - ballRadius < 0) {
        newX = ballRadius;
        newVelocityX = Math.abs(velocityX);
        collided = true;
    } else if (ballX + ballRadius > canvasWidth) {
        newX = canvasWidth - ballRadius;
        newVelocityX = -Math.abs(velocityX);
        collided = true;
    }

    if (ballY - ballRadius < 0) {
        newY = ballRadius;
        newVelocityY = Math.abs(velocityY);
        collided = true;
    } else if (ballY + ballRadius > canvasHeight) {
        newY = canvasHeight - ballRadius;
        newVelocityY = -Math.abs(velocityY);
        collided = true;
    }

    if (collided) {
        ball.setPosition(newX, newY);
        ball.setVelocity(newVelocityX * 0.8, newVelocityY * 0.8);  // Apply some energy loss
    }

    return collided;
}