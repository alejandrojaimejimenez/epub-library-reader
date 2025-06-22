import React from 'react';
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
export interface EpubReaderRef {
    nextPage: () => void;
    prevPage: () => void;
    setLocation: (cfi: string) => void;
    setTheme: (theme: 'light' | 'dark' | 'sepia') => void;
    setFontSize: (size: number) => void;
    setFontFamily: (fontFamily: string) => void;
}
declare const EpubReader: React.ForwardRefExoticComponent<EpubReaderProps & React.RefAttributes<EpubReaderRef>>;
export default EpubReader;
