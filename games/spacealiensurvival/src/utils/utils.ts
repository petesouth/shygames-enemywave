import { MainScene } from "../scenes/MainScene";





export class Utils {

    public static computeRatioValue(speed: number): number {
        const scale = Math.max(window.innerWidth, window.innerHeight);
        const origScale = Math.max(MainScene.GOLDEN_RATIO.width, MainScene.GOLDEN_RATIO.height);
        const percentDifference = scale / origScale;
        const scaledSpeed = speed * percentDifference;
        return scaledSpeed;
    }
    

    public static compuateWidthHeightRatioMax(width:number, height:number) : { ratioWidth: number, ratioHeight: number } {
        return { ratioWidth: Utils.computeRatioValue(width), ratioHeight: Utils.computeRatioValue(height) }
        
    }


    
}