import { MainScene } from "../scenes/MainScene";





export class Utils {

    public static compuateSingleNumberRatio(value:number) {
        return Utils.computeRatioSizeDimension(window.innerWidth, window.innerHeight, MainScene.GOLDEN_RATIO.width, MainScene.GOLDEN_RATIO.height, value, value).ratioHeight;
    }

    public static compuateWidthHeightRatio(width:number, height:number) : { ratioWidth: number, ratioHeight: number } {
        return Utils.computeRatioSizeDimension(window.innerWidth, window.innerHeight, MainScene.GOLDEN_RATIO.width, MainScene.GOLDEN_RATIO.height, width, height);
        
    }

    private static computeRatioSizeDimension(
        newGameWindowWidth: number, 
        newGameWindowHeight: number,  
        originalWidth: number, 
        originalHeight: number, 
        originalShipSizeW: number,
        originalShipSizeH: number
    ): { ratioWidth: number, ratioHeight: number } {
        // Calculate scaling factors for width and height
        const widthScale = newGameWindowWidth / originalWidth;
        const heightScale = newGameWindowHeight / originalHeight;
    
        // Use the larger scale to have a preference for the new screen size
        const scale = Math.max(widthScale, heightScale);
    
        // Calculate the new ship dimensions
        const newShipWidth = originalShipSizeW * scale;
        const newShipHeight = originalShipSizeH * scale;  // Assuming the ship is square
    
        return { ratioWidth: newShipWidth, ratioHeight: newShipHeight };
    }
    
    
}