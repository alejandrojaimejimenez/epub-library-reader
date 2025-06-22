var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet, Dimensions, Platform, ActivityIndicator, Text, TouchableOpacity, SafeAreaView, } from 'react-native';
import { WebView } from 'react-native-webview';
// Utilizamos forwardRef para permitir pasar referencias al componente
var EpubReader = forwardRef(function (_a, ref) {
    var source = _a.source, onLocationChange = _a.onLocationChange, onReady = _a.onReady, onPress = _a.onPress, onError = _a.onError, _b = _a.width, width = _b === void 0 ? Dimensions.get('window').width : _b, _c = _a.height, height = _c === void 0 ? Dimensions.get('window').height : _c, _d = _a.defaultTheme, defaultTheme = _d === void 0 ? 'light' : _d, _e = _a.defaultFontSize, defaultFontSize = _e === void 0 ? 16 : _e, _f = _a.defaultFontFamily, defaultFontFamily = _f === void 0 ? 'system' : _f, _g = _a.showControls, showControls = _g === void 0 ? true : _g, initialLocation = _a.initialLocation;
    var webViewRef = useRef(null);
    var _h = useState(true), loading = _h[0], setLoading = _h[1];
    var _j = useState(null), error = _j[0], setError = _j[1];
    var _k = useState(null), bookContent = _k[0], setBookContent = _k[1];
    var _l = useState(''), currentLocation = _l[0], setCurrentLocation = _l[1];
    var _m = useState(0), totalPages = _m[0], setTotalPages = _m[1];
    var _o = useState(0), currentPage = _o[0], setCurrentPage = _o[1];
    useEffect(function () {
        // Preparar el libro
        prepareBook();
    }, [source]);
    // Exponemos las funciones que queremos que sean accesibles a través de la ref
    useImperativeHandle(ref, function () { return ({
        nextPage: function () {
            if (webViewRef.current) {
                var message = JSON.stringify({ type: 'nextPage' });
                webViewRef.current.postMessage(message);
            }
        },
        prevPage: function () {
            if (webViewRef.current) {
                var message = JSON.stringify({ type: 'prevPage' });
                webViewRef.current.postMessage(message);
            }
        },
        setLocation: function (cfi) {
            if (webViewRef.current) {
                var message = JSON.stringify({ type: 'setLocation', cfi: cfi });
                webViewRef.current.postMessage(message);
            }
        },
        setTheme: function (theme) {
            if (webViewRef.current) {
                var message = JSON.stringify({ type: 'setTheme', theme: theme });
                webViewRef.current.postMessage(message);
            }
        },
        setFontSize: function (size) {
            if (webViewRef.current) {
                var message = JSON.stringify({ type: 'setFontSize', size: size });
                webViewRef.current.postMessage(message);
            }
        },
        setFontFamily: function (fontFamily) {
            if (webViewRef.current) {
                var message = JSON.stringify({ type: 'setFontFamily', fontFamily: fontFamily });
                webViewRef.current.postMessage(message);
            }
        }
    }); });
    var prepareBook = function () { return __awaiter(void 0, void 0, void 0, function () {
        var htmlContent, bookSource_1, errorMessage;
        return __generator(this, function (_a) {
            try {
                setLoading(true);
                setError(null);
                htmlContent = "\n        <!DOCTYPE html>\n        <html>\n          <head>\n            <meta charset=\"utf-8\">\n            <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no\">\n            <title>EPUB Reader</title>\n            <script src=\"https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js\"></script>\n            <script src=\"https://cdn.jsdelivr.net/npm/epubjs/dist/epub.min.js\"></script>\n            <style>\n              body {\n                margin: 0;\n                padding: 0;\n                overflow: hidden;\n                background-color: ".concat(defaultTheme === 'light' ? '#ffffff' : defaultTheme === 'dark' ? '#1a1a1a' : '#f6f0e0', ";\n              }\n              #viewer {\n                width: 100%;\n                height: 100vh;\n                margin: 0;\n                overflow: hidden;\n              }\n              * {\n                -webkit-tap-highlight-color: transparent;\n                -webkit-touch-callout: none;\n                -webkit-user-select: none;\n                user-select: none;\n              }\n              .epub-container iframe {\n                border: none;\n                width: 100% !important;\n              }\n              #viewer iframe {\n                width: 100% !important;\n              }\n              /* Mensaje de error */\n              .error-message {\n                color: red;\n                text-align: center;\n                padding: 20px;\n                font-family: system-ui, -apple-system, sans-serif;\n              }\n              /* Mensaje de carga */\n              .loading-message {\n                text-align: center;\n                padding: 20px;\n                font-family: system-ui, -apple-system, sans-serif;\n              }\n            </style>\n          </head>\n          <body>\n            <div id=\"viewer\"></div>\n            <script>\n              // Configuraci\u00F3n global para evitar problemas con React Native\n              window.JSDOM = true;\n              \n              // Funci\u00F3n para inicializar el libro\n              function initBook(bookData) {\n                try {\n                  // Mensaje inicial\n                  document.getElementById('viewer').innerHTML = '<div class=\"loading-message\">Inicializando libro...</div>';\n                  \n                  // Inicializar el libro con los datos recibidos\n                  let book;\n                  \n                  if (bookData.startsWith('http') || bookData.startsWith('file')) {\n                    // Si es una URL o una ruta de archivo\n                    book = ePub(bookData);\n                  } else {\n                    // Si es Base64, convertirlo a un objeto Blob\n                    const binary = atob(bookData.replace(/^data:binary\\/epub;base64,/, ''));\n                    const array = new Uint8Array(binary.length);\n                    for (let i = 0; i < binary.length; i++) {\n                      array[i] = binary.charCodeAt(i);\n                    }\n                    const blob = new Blob([array], { type: 'application/epub+zip' });\n                    book = ePub(blob);\n                  }\n                  \n                  // Limpiar el contenedor\n                  document.getElementById('viewer').innerHTML = '';\n                  \n                  // Manejar error de carga\n                  book.on('openFailed', function(error) {\n                    window.ReactNativeWebView.postMessage(JSON.stringify({\n                      type: 'error',\n                      message: 'No se pudo abrir el archivo EPUB: ' + error\n                    }));\n                  });\n                  \n                  // Renderizar el libro\n                  const rendition = book.renderTo('viewer', {\n                    width: '100%',\n                    height: '100%',\n                    spread: 'none',\n                    flow: 'paginated'\n                  });\n                  \n                  // Aplicar configuraciones iniciales\n                  rendition.themes.fontSize('").concat(defaultFontSize, "px');\n                  if ('").concat(defaultFontFamily, "' !== 'system') {\n                    rendition.themes.font('").concat(defaultFontFamily, "');\n                  }\n                  \n                  // Aplicar tema\n                  const theme = {\n                    light: { body: { color: '#000', background: '#fff' } },\n                    dark: { body: { color: '#fff', background: '#1a1a1a' } },\n                    sepia: { body: { color: '#5b4636', background: '#f6f0e0' } }\n                  };\n                  \n                  rendition.themes.register('").concat(defaultTheme, "', theme['").concat(defaultTheme, "']);\n                  rendition.themes.select('").concat(defaultTheme, "');\n                  \n                  // Mostrar el libro\n                  rendition.display().catch(error => {\n                    window.ReactNativeWebView.postMessage(JSON.stringify({\n                      type: 'error',\n                      message: 'Error al mostrar el contenido: ' + error.message\n                    }));\n                  });\n                    // Generar ubicaciones para el c\u00E1lculo de p\u00E1ginas (opcional pero recomendado)\n                  book.ready.then(() => {\n                    // Crear ubicaciones para c\u00E1lculo m\u00E1s preciso del n\u00FAmero de p\u00E1ginas\n                    if (!book.locations.length()) {\n                      book.locations.generate(1024).then(() => {\n                        window.ReactNativeWebView.postMessage(JSON.stringify({\n                          type: 'ready',\n                          locations: book.locations.total\n                        }));\n                        \n                        // Comprobar si hay una posici\u00F3n inicial para navegar\n                        if ('").concat(initialLocation, "') {\n                          setTimeout(() => {\n                            rendition.display('").concat(initialLocation, "').catch(error => {\n                              console.log('Error al navegar a la posici\u00F3n inicial:', error);\n                            });\n                          }, 100);\n                        }\n                      }).catch(err => {\n                        // Si falla la generaci\u00F3n de ubicaciones, continuamos de todos modos\n                        window.ReactNativeWebView.postMessage(JSON.stringify({\n                          type: 'ready'\n                        }));\n                        \n                        // Intentar navegar a la posici\u00F3n inicial de todas formas\n                        if ('").concat(initialLocation, "') {\n                          setTimeout(() => {\n                            rendition.display('").concat(initialLocation, "').catch(error => {\n                              console.log('Error al navegar a la posici\u00F3n inicial:', error);\n                            });\n                          }, 100);\n                        }\n                      });\n                    } else {\n                      window.ReactNativeWebView.postMessage(JSON.stringify({\n                        type: 'ready',\n                        locations: book.locations.total\n                      }));\n                      \n                      // Comprobar si hay una posici\u00F3n inicial para navegar\n                      if ('").concat(initialLocation, "') {\n                        setTimeout(() => {\n                          rendition.display('").concat(initialLocation, "').catch(error => {\n                            console.log('Error al navegar a la posici\u00F3n inicial:', error);\n                          });\n                        }, 100);\n                      }\n                    }\n                  }).catch(error => {\n                    window.ReactNativeWebView.postMessage(JSON.stringify({\n                      type: 'error',\n                      message: 'Error al inicializar el libro: ' + error.message\n                    }));\n                  });\n                  \n                  // Escuchar eventos de ubicaci\u00F3n\n                  rendition.on('relocated', function(location) {\n                    const currentCfi = location.start.cfi;\n                    let percentage = 0;\n                    let currentPage = 0;\n                    let totalPages = 100;\n                    \n                    // Calcular porcentaje y n\u00FAmero de p\u00E1gina si las ubicaciones est\u00E1n disponibles\n                    if (book.locations && book.locations.length()) {\n                      percentage = book.locations.percentageFromCfi(currentCfi);\n                      totalPages = book.locations.total;\n                      currentPage = Math.ceil(percentage * totalPages);\n                    } else {\n                      // C\u00E1lculo aproximado si no hay ubicaciones disponibles\n                      const spinePos = location.start.displayed.page;\n                      const spineLength = book.spine.length;\n                      percentage = spinePos / spineLength;\n                      currentPage = spinePos;\n                      totalPages = spineLength;\n                    }\n                    \n                    window.ReactNativeWebView.postMessage(JSON.stringify({\n                      type: 'locationChange',\n                      cfi: currentCfi,\n                      percentage: percentage,\n                      currentPage: currentPage,\n                      totalPages: totalPages,\n                      chapterTitle: location.start.chapterTitle || ''\n                    }));\n                  });\n                  \n                  // Eventos de toque\n                  rendition.on('click', function(e) {\n                    window.ReactNativeWebView.postMessage(JSON.stringify({\n                      type: 'press'\n                    }));\n                    \n                    // Determinar qu\u00E9 \u00E1rea de la pantalla fue tocada\n                    const screenWidth = window.innerWidth;\n                    const touchX = e.screenX;\n                    const touchArea = touchX / screenWidth;\n                    \n                    if (touchArea < 0.3) {\n                      // Izquierda - p\u00E1gina anterior\n                      rendition.prev();\n                    } else if (touchArea > 0.7) {\n                      // Derecha - p\u00E1gina siguiente\n                      rendition.next();\n                    }\n                  });\n                  \n                  // Almacenar referencias globalmente para poder controlarlas desde fuera\n                  window.book = book;\n                  window.rendition = rendition;\n                } catch (error) {\n                  document.getElementById('viewer').innerHTML = '<div class=\"error-message\">Error al cargar el libro: ' + error.message + '</div>';\n                  window.ReactNativeWebView.postMessage(JSON.stringify({\n                    type: 'error',\n                    message: error.toString()\n                  }));\n                }\n              }\n              \n              // Escuchar mensajes desde React Native\n              document.addEventListener('message', function(event) {\n                const message = JSON.parse(event.data);\n                \n                switch (message.type) {\n                  case 'setLocation':\n                    if (window.rendition) {\n                      window.rendition.display(message.cfi);\n                    }\n                    break;\n                  case 'nextPage':\n                    if (window.rendition) {\n                      window.rendition.next();\n                    }\n                    break;\n                  case 'prevPage':\n                    if (window.rendition) {\n                      window.rendition.prev();\n                    }\n                    break;\n                  case 'setTheme':\n                    if (window.rendition && window.rendition.themes) {\n                      const theme = {\n                        light: { body: { color: '#000', background: '#fff' } },\n                        dark: { body: { color: '#fff', background: '#1a1a1a' } },\n                        sepia: { body: { color: '#5b4636', background: '#f6f0e0' } }\n                      };\n                      \n                      window.rendition.themes.register(message.theme, theme[message.theme]);\n                      window.rendition.themes.select(message.theme);\n                    }\n                    break;\n                  case 'setFontSize':\n                    if (window.rendition && window.rendition.themes) {\n                      window.rendition.themes.fontSize(message.size + 'px');\n                    }\n                    break;\n                  case 'setFontFamily':\n                    if (window.rendition && window.rendition.themes) {\n                      window.rendition.themes.font(message.fontFamily);\n                    }\n                    break;\n                }\n              });\n              \n              // Para navegadores web donde document.addEventListener('message') no funciona\n              window.addEventListener('message', function(event) {\n                if (typeof event.data === 'string') {\n                  const message = JSON.parse(event.data);\n                  \n                  // Mismo manejo que arriba\n                  switch (message.type) {\n                    case 'setLocation':\n                      if (window.rendition) {\n                        window.rendition.display(message.cfi);\n                      }\n                      break;\n                    case 'nextPage':\n                      if (window.rendition) {\n                        window.rendition.next();\n                      }\n                      break;\n                    case 'prevPage':\n                      if (window.rendition) {\n                        window.rendition.prev();\n                      }\n                      break;\n                    case 'setTheme':\n                      if (window.rendition && window.rendition.themes) {\n                        const theme = {\n                          light: { body: { color: '#000', background: '#fff' } },\n                          dark: { body: { color: '#fff', background: '#1a1a1a' } },\n                          sepia: { body: { color: '#5b4636', background: '#f6f0e0' } }\n                        };\n                        \n                        window.rendition.themes.register(message.theme, theme[message.theme]);\n                        window.rendition.themes.select(message.theme);\n                      }\n                      break;\n                    case 'setFontSize':\n                      if (window.rendition && window.rendition.themes) {\n                        window.rendition.themes.fontSize(message.size + 'px');\n                      }\n                      break;\n                    case 'setFontFamily':\n                      if (window.rendition && window.rendition.themes) {\n                        window.rendition.themes.font(message.fontFamily);\n                      }\n                      break;\n                  }\n                }\n              });\n            </script>\n          </body>\n        </html>\n      ");
                bookSource_1 = '';
                if (source.uri) {
                    // Si recibimos una URI directa (URL remota)
                    bookSource_1 = source.uri;
                }
                else if (source.base64) {
                    // Si recibimos datos en base64
                    bookSource_1 = source.base64;
                }
                else {
                    throw new Error('Se requiere una fuente válida (uri o base64)');
                }
                // Establecer el contenido HTML
                setBookContent(htmlContent);
                // Esperamos un poco para asegurarnos de que el WebView esté listo
                setTimeout(function () {
                    if (webViewRef.current) {
                        var bookDataScript = "initBook(\"".concat(bookSource_1, "\");");
                        webViewRef.current.injectJavaScript(bookDataScript);
                    }
                }, 500);
            }
            catch (err) {
                errorMessage = "Error al preparar el libro: ".concat(err instanceof Error ? err.message : String(err));
                setError(errorMessage);
                if (onError) {
                    onError(errorMessage);
                }
            }
            finally {
                setLoading(false);
            }
            return [2 /*return*/];
        });
    }); };
    var handleMessage = function (event) {
        try {
            var data = JSON.parse(event.nativeEvent.data);
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
        }
        catch (err) {
            console.error('Error al procesar mensaje:', err);
        }
    };
    // Estas funciones ahora están disponibles a través de la ref usando useImperativeHandle
    // También las definimos localmente para los botones de navegación
    var nextPage = function () {
        if (webViewRef.current) {
            var message = JSON.stringify({ type: 'nextPage' });
            webViewRef.current.postMessage(message);
        }
    };
    var prevPage = function () {
        if (webViewRef.current) {
            var message = JSON.stringify({ type: 'prevPage' });
            webViewRef.current.postMessage(message);
        }
    };
    if (error) {
        return (React.createElement(View, { style: [styles.container, { width: width, height: height }] },
            React.createElement(Text, { style: styles.errorText },
                "Error: ",
                error)));
    }
    return (React.createElement(SafeAreaView, { style: [styles.container, { width: width, height: height }] },
        loading && (React.createElement(View, { style: styles.loadingContainer },
            React.createElement(ActivityIndicator, { size: "large", color: "#0000ff" }),
            React.createElement(Text, { style: styles.loadingText }, "Cargando libro..."))),
        bookContent && (React.createElement(WebView, { ref: webViewRef, originWhitelist: ['*'], source: { html: bookContent }, style: styles.webView, javaScriptEnabled: true, domStorageEnabled: true, startInLoadingState: true, onMessage: handleMessage, onLoad: function () { return setLoading(false); }, onError: function (e) {
                var errorMsg = "Error en WebView: ".concat(e.nativeEvent.description || 'Error desconocido');
                setError(errorMsg);
                if (onError) {
                    onError(errorMsg);
                }
            }, 
            // Necesario para evitar problemas en iOS
            scalesPageToFit: Platform.OS === 'ios', 
            // Para permitir acceso a archivos locales en Android
            allowFileAccess: true, allowUniversalAccessFromFileURLs: true, allowFileAccessFromFileURLs: true, 
            // Para mejorar el rendimiento
            cacheEnabled: true })),
        showControls && (React.createElement(View, { style: styles.navigationControls },
            React.createElement(TouchableOpacity, { style: styles.navButton, onPress: prevPage },
                React.createElement(Text, { style: styles.navButtonText }, "Anterior")),
            React.createElement(Text, { style: styles.pageInfo },
                currentPage,
                " / ",
                totalPages),
            React.createElement(TouchableOpacity, { style: styles.navButton, onPress: nextPage },
                React.createElement(Text, { style: styles.navButtonText }, "Siguiente"))))));
});
var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    webView: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    loadingContainer: __assign(__assign({}, StyleSheet.absoluteFillObject), { justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.9)', zIndex: 10 }),
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
        color: '#333',
    },
});
export default EpubReader;
