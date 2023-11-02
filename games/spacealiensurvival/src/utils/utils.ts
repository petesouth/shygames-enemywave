import { MainScene } from "../scenes/MainScene";





export class Utils {

    public static computeRatioSpeed(speed:number) : number {
        return speed;
        //const percent = (window.innerWidth / MainScene.GOLDEN_RATIO.width) * speed;
        //const returnValue = speed - percent;
        //return returnValue;
    }

    public static compuateSingleNumberRatioMax(value:number) {
        return Utils.computeRatioSizeDimensionMax(window.innerWidth, window.innerHeight, MainScene.GOLDEN_RATIO.width, MainScene.GOLDEN_RATIO.height, value, value).ratioHeight;
    }

    public static compuateWidthHeightRatioMax(width:number, height:number) : { ratioWidth: number, ratioHeight: number } {
        return Utils.computeRatioSizeDimensionMax(window.innerWidth, window.innerHeight, MainScene.GOLDEN_RATIO.width, MainScene.GOLDEN_RATIO.height, width, height);
        
    }

    public static compuateSingleNumberRatioMin(value:number) {
        return Utils.computeRatioSizeDimensionMin(window.innerWidth, window.innerHeight, MainScene.GOLDEN_RATIO.width, MainScene.GOLDEN_RATIO.height, value, value).ratioHeight;
    }

    public static compuateWidthHeightRatioMin(width:number, height:number) : { ratioWidth: number, ratioHeight: number } {
        return Utils.computeRatioSizeDimensionMin(window.innerWidth, window.innerHeight, MainScene.GOLDEN_RATIO.width, MainScene.GOLDEN_RATIO.height, width, height);
        
    }

    private static computeRatioSizeDimensionMax(
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

    private static computeRatioSizeDimensionMin(
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
        const scale = Math.min(widthScale, heightScale);
    
        // Calculate the new ship dimensions
        const newShipWidth = originalShipSizeW * scale;
        const newShipHeight = originalShipSizeH * scale;  // Assuming the ship is square
    
        return { ratioWidth: newShipWidth, ratioHeight: newShipHeight };
    }
    
    
}