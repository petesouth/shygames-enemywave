import { MainScene } from "../scenes/MainScene";





export class Utils {

    public static resizeImateToRatio(image: Phaser.GameObjects.Image | Phaser.Physics.Arcade.Sprite | Phaser.GameObjects.TileSprite,
        screenWidth: number, screenHeight: number) {
        if (!image) {
            return;
        }
        const imageWidth = image.width;
        const imageHeight = image.height;
        const imageAspectRatio = imageWidth / imageHeight;

        let newWidth, newHeight;

        // The image is wider relative to the screen, set the image width to match the screen width
        newWidth = screenWidth;
        newHeight = newWidth / imageAspectRatio;  // Adjust height proportionally

        // Check if the new height is less than the screen height, if so adjust the dimensions
        if (newHeight < screenHeight) {
            newHeight = screenHeight;
            newWidth = newHeight * imageAspectRatio;  // Adjust width proportionally
        }
        image.setDisplaySize(newWidth, newHeight);

        // Ensure the image is positioned in the center of the screen
        image.setPosition(screenWidth / 2, screenHeight / 2);

    }

    public static computeRatioValue(speed: number): number {
        const scale = Math.max(window.innerWidth, window.innerHeight);
        const origScale = Math.max(MainScene.GOLDEN_RATIO.width, MainScene.GOLDEN_RATIO.height);
        let percentDifference = scale / origScale;
        if (percentDifference < .5) {
            percentDifference = .5;
        }

        const scaledSpeed = speed * percentDifference;
        return scaledSpeed;
    }


    public static compuateWidthHeightRatioMax(width: number, height: number): { ratioWidth: number, ratioHeight: number } {
        return { ratioWidth: Utils.computeRatioValue(width), ratioHeight: Utils.computeRatioValue(height) }

    }



}