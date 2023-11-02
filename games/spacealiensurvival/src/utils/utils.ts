




export class Utils {


    public static computeRatioSizeDimension(
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