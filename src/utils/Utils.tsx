

export class Utils {

    static displayLongString(value: String, maxLength: number) : String {

        if( ! value || value.length < 1 ) return "";

        return ( value.length > maxLength ) ? value.substring(0, maxLength ) + "..." : value;
        
    }

}