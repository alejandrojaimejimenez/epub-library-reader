"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const EpubReader_1 = __importDefault(require("./src/components/EpubReader"));
function App() {
    const [showReader, setShowReader] = (0, react_1.useState)(false);
    const [theme, setTheme] = (0, react_1.useState)('light');
    const [fontSize, setFontSize] = (0, react_1.useState)(18);
    const [showControls, setShowControls] = (0, react_1.useState)(true);
    const epubReaderRef = (0, react_1.useRef)(null);
    // URLs de ejemplo de archivos EPUB
    const sampleEpubUrl = 'https://s3.amazonaws.com/epubjs.org/books/alice.epub';
    // También puedes usar este archivo OPF de Moby Dick como alternativa
    // const sampleOPFUrl = 'https://s3.amazonaws.com/moby-dick/OPS/package.opf';
    if (showReader) {
        return (<react_native_1.SafeAreaView style={styles.readerContainer}>
        <react_native_1.View style={styles.readerHeader}>
          <react_native_1.Button title="Volver" onPress={() => setShowReader(false)}/>
          <react_native_1.View style={styles.themeButtons}>
            <react_native_1.Button title="Light" onPress={() => setTheme('light')}/>
            <react_native_1.Button title="Dark" onPress={() => setTheme('dark')}/>
            <react_native_1.Button title="Sepia" onPress={() => setTheme('sepia')}/>
          </react_native_1.View>
          <react_native_1.View style={styles.fontButtons}>
            <react_native_1.Button title="A-" onPress={() => setFontSize(prev => Math.max(12, prev - 2))}/>
            <react_native_1.Button title="A+" onPress={() => setFontSize(prev => Math.min(24, prev + 2))}/>
          </react_native_1.View>
        </react_native_1.View>
        
        <react_native_1.View style={styles.controlsToggle}>
          <react_native_1.Text>Mostrar controles de navegación</react_native_1.Text>
          <react_native_1.Switch value={showControls} onValueChange={setShowControls}/>
        </react_native_1.View>
        
        <EpubReader_1.default ref={epubReaderRef} source={{ uri: sampleEpubUrl }} defaultTheme={theme} defaultFontSize={fontSize} showControls={showControls} onReady={() => console.log('El libro está listo')} onLocationChange={(cfi) => console.log('Ubicación actual:', cfi)} onError={(error) => react_native_1.Alert.alert('Error', error)}/>
      </react_native_1.SafeAreaView>);
    }
    return (<react_native_1.View style={styles.container}>
      <react_native_1.Text style={styles.title}>EPUB Library Reader</react_native_1.Text>
      <react_native_1.Text style={styles.subtitle}>Un lector de EPUB compatible con todas las plataformas</react_native_1.Text>
      
      <react_native_1.View style={styles.buttonContainer}>
        <react_native_1.Button title="Abrir EPUB de ejemplo (Alice in Wonderland)" onPress={() => setShowReader(true)}/>
      </react_native_1.View>
      
      <react_native_1.View style={styles.infoContainer}>
        <react_native_1.Text style={styles.infoTitle}>Formatos soportados:</react_native_1.Text>
        <react_native_1.Text style={styles.infoItem}>• Archivos EPUB directos (.epub)</react_native_1.Text>
        <react_native_1.Text style={styles.infoItem}>• Archivos OPF (Open Packaging Format)</react_native_1.Text>
        <react_native_1.Text style={styles.infoItem}>• Datos Base64 codificados</react_native_1.Text>
        <react_native_1.Text style={styles.infoItem}>• URLs remotas</react_native_1.Text>
      </react_native_1.View>
    </react_native_1.View>);
}
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
        color: '#666',
    },
    buttonContainer: {
        marginTop: 20,
        marginBottom: 30,
        width: '100%',
    },
    infoContainer: {
        width: '100%',
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    infoItem: {
        fontSize: 14,
        marginBottom: 5,
        color: '#555',
    },
    readerContainer: {
        flex: 1,
    },
    readerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    controlsToggle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    themeButtons: {
        flexDirection: 'row',
    },
    fontButtons: {
        flexDirection: 'row',
    },
});
