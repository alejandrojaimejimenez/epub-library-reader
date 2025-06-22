/// <reference types="react" />
import { WebView } from 'react-native-webview';
interface EpubReaderProps {
    source: {
        uri?: string;
        base64?: string;
    };
    onLocationChange?: (cfi: string) => void;
    onReady?: () => void;
    onPress?: () => void;
    onError?: (error: string) => void;
    width?: number;
    height?: number;
    defaultTheme?: 'light' | 'dark' | 'sepia';
    defaultFontSize?: number;
    defaultFontFamily?: string;
    showControls?: boolean;
    initialLocation?: string;
}
declare const EpubReader: React.FC<EpubReaderProps>;
export default EpubReader;
