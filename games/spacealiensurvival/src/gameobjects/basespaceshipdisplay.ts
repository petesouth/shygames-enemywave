


export interface BaseSpaceshipDisplay {
    getCentroid(): Phaser.Geom.Point;
    rotateAroundPoint(rotationDifference: number): void;
    rotateRight(rotationRate: number): void;
    rotateLeft(rotationRate: number): void;
    thrustForward(thrust: number, centroid: Phaser.Geom.Point, velocity: Phaser.Math.Vector2): Phaser.Math.Vector2;
    spawn(initialPositionOffset: number): void;
    drawObjectAlive(velocity: Phaser.Math.Vector2): Phaser.Geom.Point[];
    weakHitpointsFlashIndicator(hitpoints: number, flashLastTime: number, flashColorIndex: number, flashLightChangeWaitLength: number, explosionColors: number[]): number;
    getForwardAngle(): number;
    getReverseAngle(): number;
    getCurrentRotation(): number;
    getDistanceFromTopToBottom(): number;
    getCollisionPoints(): Phaser.Geom.Point[];
    hide(): void;
    destroy(): void
}