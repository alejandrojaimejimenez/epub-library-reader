import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

// Importación condicional de WebView para manejar plataformas no soportadas
let WebView: any;
let isWebViewSupported = false;

// Intentamos importar WebView y verificamos si está disponible
try {
  // Intentamos importar WebView de manera dinámica
  WebView = require('react-native-webview').WebView;
  // Verificamos si WebView es un componente válido
  isWebViewSupported = !!WebView;
} catch (error) {
  console.warn('react-native-webview no está disponible en esta plataforma');
  isWebViewSupported = false;
}

// Componente WebView con soporte para refs, solo si WebView está disponible
const ForwardedWebView = forwardRef<any, any>((props, ref) => {
  if (!isWebViewSupported) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>WebView no está disponible en esta plataforma</Text>
      </View>
    );
  }
  return <WebView {...props} ref={ref} />;
});

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
  initialLocation?: string; // CFI para navegar a una posición específica al cargar
}

// Definimos la interfaz para las funciones que expondremos a través de la ref
export interface EpubReaderRef {
  nextPage: () => void;
  prevPage: () => void;
  setLocation: (cfi: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'sepia') => void;
  setFontSize: (size: number) => void;
  setFontFamily: (fontFamily: string) => void;
}

// Utilizamos forwardRef para permitir pasar referencias al componente
const EpubReader = forwardRef<EpubReaderRef, EpubReaderProps>(({
  source,
  onLocationChange,
  onReady,
  onPress,
  onError,
  width = Dimensions.get('window').width,
  height = Dimensions.get('window').height,
  defaultTheme = 'light',
  defaultFontSize = 16,
  defaultFontFamily = 'system',
  showControls = true,
  initialLocation,
}, ref) => {
  const webViewRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookContent, setBookContent] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<string>('');
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);

  useEffect(() => {
    // Preparar el libro
    prepareBook();
  }, [source]);

  // Exponemos las funciones que queremos que sean accesibles a través de la ref
  useImperativeHandle(ref, () => ({
    nextPage: () => {
      if (webViewRef.current) {
        const message = JSON.stringify({ type: 'nextPage' });
        webViewRef.current.postMessage(message);
      }
    },
    prevPage: () => {
      if (webViewRef.current) {
        const message = JSON.stringify({ type: 'prevPage' });
        webViewRef.current.postMessage(message);
      }
    },
    setLocation: (cfi: string) => {
      if (webViewRef.current) {
        const message = JSON.stringify({ type: 'setLocation', cfi });
        webViewRef.current.postMessage(message);
      }
    },
    setTheme: (theme: 'light' | 'dark' | 'sepia') => {
      if (webViewRef.current) {
        const message = JSON.stringify({ type: 'setTheme', theme });
        webViewRef.current.postMessage(message);
      }
    },
    setFontSize: (size: number) => {
      if (webViewRef.current) {
        const message = JSON.stringify({ type: 'setFontSize', size });
        webViewRef.current.postMessage(message);
      }
    },
    setFontFamily: (fontFamily: string) => {
      if (webViewRef.current) {
        const message = JSON.stringify({ type: 'setFontFamily', fontFamily });
        webViewRef.current.postMessage(message);
      }
    }
  }));
  const prepareBook = async () => {
    try {
      // Si WebView no está soportado, no intentamos preparar el libro
      if (!isWebViewSupported) {
        setError("React Native WebView no está disponible en esta plataforma");
        if (onError) {
          onError("React Native WebView no está disponible en esta plataforma");
        }
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);

      // HTML que contiene la estructura básica para epubjs
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
            <title>EPUB Reader</title>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/epubjs/dist/epub.min.js"></script>
            <style>
              body {
                margin: 0;
                padding: 0;
                overflow: hidden;
                background-color: ${defaultTheme === 'light' ? '#ffffff' : defaultTheme === 'dark' ? '#1a1a1a' : '#f6f0e0'};
              }
              #viewer {
                width: 100%;
                height: 100vh;
                margin: 0;
                overflow: hidden;
              }
              * {
                -webkit-tap-highlight-color: transparent;
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                user-select: none;
              }
              .epub-container iframe {
                border: none;
                width: 100% !important;
              }
              #viewer iframe {
                width: 100% !important;
              }
              /* Mensaje de error */
              .error-message {
                color: red;
                text-align: center;
                padding: 20px;
                font-family: system-ui, -apple-system, sans-serif;
              }
              /* Mensaje de carga */
              .loading-message {
                text-align: center;
                padding: 20px;
                font-family: system-ui, -apple-system, sans-serif;
              }
            </style>
          </head>
          <body>
            <div id="viewer"></div>
            <script>
              // Configuración global para evitar problemas con React Native
              window.JSDOM = true;
              
              // Función para inicializar el libro
              function initBook(bookData) {
                try {
                  // Mensaje inicial
                  document.getElementById('viewer').innerHTML = '<div class="loading-message">Inicializando libro...</div>';
                  
                  // Inicializar el libro con los datos recibidos
                  let book;                  
                  if (bookData.startsWith('http') || bookData.startsWith('file') || bookData.startsWith('blob:')) {
                    // Si es una URL, una ruta de archivo o un blob URL
                    book = ePub(bookData);
                  } else {
                    // Si es Base64, convertirlo a un objeto Blob
                    const binary = atob(bookData.replace(/^data:binary\\/epub;base64,/, ''));
                    const array = new Uint8Array(binary.length);
                    for (let i = 0; i < binary.length; i++) {
                      array[i] = binary.charCodeAt(i);
                    }
                    const blob = new Blob([array], { type: 'application/epub+zip' });
                    book = ePub(blob);
                  }
                  
                  // Limpiar el contenedor
                  document.getElementById('viewer').innerHTML = '';
                  
                  // Manejar error de carga
                  book.on('openFailed', function(error) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'error',
                      message: 'No se pudo abrir el archivo EPUB: ' + error
                    }));
                  });
                  
                  // Renderizar el libro
                  const rendition = book.renderTo('viewer', {
                    width: '100%',
                    height: '100%',
                    spread: 'none',
                    flow: 'paginated'
                  });
                  
                  // Aplicar configuraciones iniciales
                  rendition.themes.fontSize('${defaultFontSize}px');
                  if ('${defaultFontFamily}' !== 'system') {
                    rendition.themes.font('${defaultFontFamily}');
                  }
                  
                  // Aplicar tema
                  const theme = {
                    light: { body: { color: '#000', background: '#fff' } },
                    dark: { body: { color: '#fff', background: '#1a1a1a' } },
                    sepia: { body: { color: '#5b4636', background: '#f6f0e0' } }
                  };
                  
                  rendition.themes.register('${defaultTheme}', theme['${defaultTheme}']);
                  rendition.themes.select('${defaultTheme}');
                  
                  // Mostrar el libro
                  rendition.display().catch(error => {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'error',
                      message: 'Error al mostrar el contenido: ' + error.message
                    }));
                  });
                    // Generar ubicaciones para el cálculo de páginas (opcional pero recomendado)
                  book.ready.then(() => {
                    // Crear ubicaciones para cálculo más preciso del número de páginas
                    if (!book.locations.length()) {
                      book.locations.generate(1024).then(() => {
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                          type: 'ready',
                          locations: book.locations.total
                        }));
                        
                        // Comprobar si hay una posición inicial para navegar
                        if ('${initialLocation}') {
                          setTimeout(() => {
                            rendition.display('${initialLocation}').catch(error => {
                              console.log('Error al navegar a la posición inicial:', error);
                            });
                          }, 100);
                        }
                      }).catch(err => {
                        // Si falla la generación de ubicaciones, continuamos de todos modos
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                          type: 'ready'
                        }));
                        
                        // Intentar navegar a la posición inicial de todas formas
                        if ('${initialLocation}') {
                          setTimeout(() => {
                            rendition.display('${initialLocation}').catch(error => {
                              console.log('Error al navegar a la posición inicial:', error);
                            });
                          }, 100);
                        }
                      });
                    } else {
                      window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'ready',
                        locations: book.locations.total
                      }));
                      
                      // Comprobar si hay una posición inicial para navegar
                      if ('${initialLocation}') {
                        setTimeout(() => {
                          rendition.display('${initialLocation}').catch(error => {
                            console.log('Error al navegar a la posición inicial:', error);
                          });
                        }, 100);
                      }
                    }
                  }).catch(error => {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'error',
                      message: 'Error al inicializar el libro: ' + error.message
                    }));
                  });
                  
                  // Escuchar eventos de ubicación
                  rendition.on('relocated', function(location) {
                    const currentCfi = location.start.cfi;
                    let percentage = 0;
                    let currentPage = 0;
                    let totalPages = 100;
                    
                    // Calcular porcentaje y número de página si las ubicaciones están disponibles
                    if (book.locations && book.locations.length()) {
                      percentage = book.locations.percentageFromCfi(currentCfi);
                      totalPages = book.locations.total;
                      currentPage = Math.ceil(percentage * totalPages);
                    } else {
                      // Cálculo aproximado si no hay ubicaciones disponibles
                      const spinePos = location.start.displayed.page;
                      const spineLength = book.spine.length;
                      percentage = spinePos / spineLength;
                      currentPage = spinePos;
                      totalPages = spineLength;
                    }
                    
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'locationChange',
                      cfi: currentCfi,
                      percentage: percentage,
                      currentPage: currentPage,
                      totalPages: totalPages,
                      chapterTitle: location.start.chapterTitle || ''
                    }));
                  });
                  
                  // Eventos de toque
                  rendition.on('click', function(e) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'press'
                    }));
                    
                    // Determinar qué área de la pantalla fue tocada
                    const screenWidth = window.innerWidth;
                    const touchX = e.screenX;
                    const touchArea = touchX / screenWidth;
                    
                    if (touchArea < 0.3) {
                      // Izquierda - página anterior
                      rendition.prev();
                    } else if (touchArea > 0.7) {
                      // Derecha - página siguiente
                      rendition.next();
                    }
                  });
                  
                  // Almacenar referencias globalmente para poder controlarlas desde fuera
                  window.book = book;
                  window.rendition = rendition;
                } catch (error) {
                  document.getElementById('viewer').innerHTML = '<div class="error-message">Error al cargar el libro: ' + error.message + '</div>';
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'error',
                    message: error.toString()
                  }));
                }
              }
              
              // Escuchar mensajes desde React Native
              document.addEventListener('message', function(event) {
                const message = JSON.parse(event.data);
                
                switch (message.type) {
                  case 'setLocation':
                    if (window.rendition) {
                      window.rendition.display(message.cfi);
                    }
                    break;
                  case 'nextPage':
                    if (window.rendition) {
                      window.rendition.next();
                    }
                    break;
                  case 'prevPage':
                    if (window.rendition) {
                      window.rendition.prev();
                    }
                    break;
                  case 'setTheme':
                    if (window.rendition && window.rendition.themes) {
                      const theme = {
                        light: { body: { color: '#000', background: '#fff' } },
                        dark: { body: { color: '#fff', background: '#1a1a1a' } },
                        sepia: { body: { color: '#5b4636', background: '#f6f0e0' } }
                      };
                      
                      window.rendition.themes.register(message.theme, theme[message.theme]);
                      window.rendition.themes.select(message.theme);
                    }
                    break;
                  case 'setFontSize':
                    if (window.rendition && window.rendition.themes) {
                      window.rendition.themes.fontSize(message.size + 'px');
                    }
                    break;
                  case 'setFontFamily':
                    if (window.rendition && window.rendition.themes) {
                      window.rendition.themes.font(message.fontFamily);
                    }
                    break;
                }
              });
              
              // Para navegadores web donde document.addEventListener('message') no funciona
              window.addEventListener('message', function(event) {
                if (typeof event.data === 'string') {
                  const message = JSON.parse(event.data);
                  
                  // Mismo manejo que arriba
                  switch (message.type) {
                    case 'setLocation':
                      if (window.rendition) {
                        window.rendition.display(message.cfi);
                      }
                      break;
                    case 'nextPage':
                      if (window.rendition) {
                        window.rendition.next();
                      }
                      break;
                    case 'prevPage':
                      if (window.rendition) {
                        window.rendition.prev();
                      }
                      break;
                    case 'setTheme':
                      if (window.rendition && window.rendition.themes) {
                        const theme = {
                          light: { body: { color: '#000', background: '#fff' } },
                          dark: { body: { color: '#fff', background: '#1a1a1a' } },
                          sepia: { body: { color: '#5b4636', background: '#f6f0e0' } }
                        };
                        
                        window.rendition.themes.register(message.theme, theme[message.theme]);
                        window.rendition.themes.select(message.theme);
                      }
                      break;
                    case 'setFontSize':
                      if (window.rendition && window.rendition.themes) {
                        window.rendition.themes.fontSize(message.size + 'px');
                      }
                      break;
                    case 'setFontFamily':
                      if (window.rendition && window.rendition.themes) {
                        window.rendition.themes.font(message.fontFamily);
                      }
                      break;
                  }
                }
              });
            </script>
          </body>
        </html>
      `;      let bookSource = '';
      
      if (source.uri) {
        // Si recibimos una URI directa (URL remota)
        bookSource = source.uri;
      } else if (source.base64) {
        // Si recibimos datos en base64
        bookSource = source.base64;
      } else {
        throw new Error('Se requiere una fuente válida (uri o base64)');
      }
      
      // Establecer el contenido HTML
      setBookContent(htmlContent);
      
      // Esperamos un poco para asegurarnos de que el WebView esté listo
      setTimeout(() => {
        if (webViewRef.current) {
          const bookDataScript = `initBook("${bookSource}");`;
          webViewRef.current.injectJavaScript(bookDataScript);
        }
      }, 500);
    } catch (err) {
      const errorMessage = `Error al preparar el libro: ${err instanceof Error ? err.message : String(err)}`;
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      switch (data.type) {
        case 'locationChange':
          setCurrentLocation(data.cfi);
          setCurrentPage(data.currentPage);
          setTotalPages(data.totalPages);
          if (onLocationChange) {
            onLocationChange(data.cfi);
          }
          break;
        case 'ready':
          if (data.locations) {
            setTotalPages(data.locations);
          }
          if (onReady) {
            onReady();
          }
          break;
        case 'press':
          if (onPress) {
            onPress();
          }
          break;
        case 'error':
          setError(data.message);
          if (onError) {
            onError(data.message);
          }
          break;
      }
    } catch (err) {
      console.error('Error al procesar mensaje:', err);
    }
  };
  // Estas funciones ahora están disponibles a través de la ref usando useImperativeHandle
  // También las definimos localmente para los botones de navegación
  const nextPage = () => {
    if (webViewRef.current) {
      const message = JSON.stringify({ type: 'nextPage' });
      webViewRef.current.postMessage(message);
    }
  };

  const prevPage = () => {
    if (webViewRef.current) {
      const message = JSON.stringify({ type: 'prevPage' });
      webViewRef.current.postMessage(message);
    }
  };
  if (error) {
    return (
      <View style={[styles.container, { width, height }]}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  // Mostramos un mensaje específico si WebView no está soportado
  if (!isWebViewSupported) {
    return (
      <View style={[styles.container, { width, height }, styles.unsupportedContainer]}>
        <Text style={styles.errorText}>React Native WebView no está disponible en esta plataforma</Text>
        <Text style={styles.infoText}>El lector EPUB requiere WebView para funcionar correctamente.</Text>
        {Platform.OS !== 'web' && (
          <Text style={styles.infoText}>Considera usar la versión nativa específica para esta plataforma.</Text>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { width, height }]}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Cargando libro...</Text>
        </View>      )}      
      {bookContent && (
        <ForwardedWebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: bookContent }}
          style={styles.webView}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          onMessage={handleMessage}
          onLoad={() => setLoading(false)}
          onError={(e) => {
            const errorMsg = `Error en WebView: ${e.nativeEvent.description || 'Error desconocido'}`;
            setError(errorMsg);
            if (onError) {
              onError(errorMsg);
            }
          }}
          // Necesario para evitar problemas en iOS
          scalesPageToFit={Platform.OS === 'ios'}
          // Para permitir acceso a archivos locales en Android
          allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
          allowFileAccessFromFileURLs={true}
          // Para mejorar el rendimiento
          cacheEnabled={true}
        />
      )}
      
      {/* Controles básicos de navegación - puedes personalizarlos o quitarlos */}
      {showControls && (
        <View style={styles.navigationControls}>
          <TouchableOpacity style={styles.navButton} onPress={prevPage}>
            <Text style={styles.navButtonText}>Anterior</Text>
          </TouchableOpacity>
          
          <Text style={styles.pageInfo}>
            {currentPage} / {totalPages}
          </Text>
          
          <TouchableOpacity style={styles.navButton} onPress={nextPage}>
            <Text style={styles.navButtonText}>Siguiente</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    margin: 20,
    fontSize: 16,
  },
  infoText: {
    color: '#666',
    textAlign: 'center',
    margin: 10,
    fontSize: 14,
  },
  unsupportedContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  navigationControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#f9f9f9',
  },
  navButton: {
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  navButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  pageInfo: {
    fontSize: 14,
    color: '#333',  },
});

export default EpubReader;