# EPUB Library Reader

[![React Native](https://img.shields.io/badge/React_Native-0.79-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-53.0-blue.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)

Un componente para la lectura de archivos EPUB en aplicaciones React Native con TypeScript y Expo, compatible con plataformas web, iOS y Android.

![EPUB Reader Demo](https://via.placeholder.com/800x400?text=EPUB+Reader+Demo)

## Características

- ✅ Soporte multiplataforma (web, iOS, Android)
- ✅ Compatible con archivos EPUB y OPF
- ✅ Múltiples fuentes de datos (URL, local, base64)
- ✅ Temas personalizables (claro, oscuro, sepia)
- ✅ Ajuste de tamaño de fuente
- ✅ Navegación entre páginas
- ✅ Control de ubicación y progreso de lectura
- ✅ Sin dependencia directa del DOM

## Requisitos

- React Native ≥ 0.79
- Expo ≥ 53.0
- TypeScript ≥ 5.8

## Instalación

### 1. Instalar las dependencias necesarias

```bash
npx expo install epubjs react-native-webview expo-file-system
```

### 2. Copiar el componente

Copia el archivo `src/components/EpubReader.tsx` de este repositorio a tu proyecto.

## Uso básico

```tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import EpubReader from './ruta/a/EpubReader';

export default function App() {
  return (
    <View style={styles.container}>
      <EpubReader
        source={{ uri: 'https://ejemplo.com/mi-libro.epub' }}
        defaultTheme="light"
        defaultFontSize={18}
        onReady={() => console.log('El libro está listo')}
        onLocationChange={(cfi) => console.log('Ubicación actual:', cfi)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

## Opciones de configuración

El componente `EpubReader` acepta las siguientes propiedades:

| Propiedad | Tipo | Descripción | Requerido | Valor por defecto |
|-----------|------|-------------|-----------|-------------------|
| `source` | Object | Fuente del libro EPUB | Sí | - |
| `source.uri` | String | URL del archivo EPUB o OPF | No* | - |
| `source.base64` | String | Datos del EPUB en formato Base64 | No* | - |
| `source.localPath` | String | Ruta local al archivo EPUB | No* | - |
| `defaultTheme` | 'light' \| 'dark' \| 'sepia' | Tema inicial | No | 'light' |
| `defaultFontSize` | Number | Tamaño inicial de la fuente (px) | No | 16 |
| `defaultFontFamily` | String | Familia de fuente inicial | No | 'system' |
| `width` | Number | Ancho del componente | No | Ancho de pantalla |
| `height` | Number | Alto del componente | No | Alto de pantalla |
| `showControls` | Boolean | Mostrar controles de navegación | No | true |
| `onLocationChange` | Function | Callback al cambiar de posición | No | - |
| `onReady` | Function | Callback cuando el libro está listo | No | - |
| `onPress` | Function | Callback al tocar el libro | No | - |
| `onError` | Function | Callback al ocurrir un error | No | - |

*Se requiere al menos una de las tres opciones: `uri`, `base64` o `localPath`.

## Ejemplos de uso

### Cargar un archivo EPUB desde una URL

```tsx
<EpubReader
  source={{ uri: 'https://ejemplo.com/mi-libro.epub' }}
  onReady={() => console.log('El libro está listo')}
/>
```

### Cargar un archivo OPF desde una URL

```tsx
<EpubReader
  source={{ uri: 'https://ejemplo.com/libro/package.opf' }}
  onReady={() => console.log('El libro está listo')}
/>
```

### Cargar un archivo local en dispositivos móviles

```tsx
import * as FileSystem from 'expo-file-system';

// En tu componente:
const filePath = FileSystem.documentDirectory + 'mi-libro.epub';

<EpubReader
  source={{ localPath: filePath }}
  onReady={() => console.log('El libro está listo')}
/>
```

### Cargar un archivo usando datos Base64

```tsx
import * as FileSystem from 'expo-file-system';

// Función para leer un archivo como Base64
const readEpubAsBase64 = async (filePath) => {
  const base64 = await FileSystem.readAsStringAsync(filePath, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return base64;
};

// En una función asíncrona:
const loadBook = async () => {
  try {
    const base64Data = await readEpubAsBase64('/ruta/al/libro.epub');
    setBookData(`data:binary/epub;base64,${base64Data}`);
  } catch (error) {
    console.error('Error al cargar el libro:', error);
  }
};

// Y luego usarlo:
<EpubReader
  source={{ base64: bookData }}
  onReady={() => console.log('El libro está listo')}
/>
```

### Personalizar el tema y tamaño de fuente

```tsx
<EpubReader
  source={{ uri: 'https://ejemplo.com/mi-libro.epub' }}
  defaultTheme="sepia"
  defaultFontSize={20}
  defaultFontFamily="Georgia"
/>
```

### Controlar la navegación programáticamente

```tsx
import React, { useRef } from 'react';
import { View, Button } from 'react-native';
import EpubReader from './ruta/a/EpubReader';

export default function App() {
  const epubRef = useRef(null);

  const goToNextPage = () => {
    epubRef.current?.nextPage();
  };

  const goToPrevPage = () => {
    epubRef.current?.prevPage();
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <Button title="Anterior" onPress={goToPrevPage} />
        <Button title="Siguiente" onPress={goToNextPage} />
      </View>
      
      <EpubReader
        ref={epubRef}
        source={{ uri: 'https://ejemplo.com/mi-libro.epub' }}
        showControls={false} // Ocultar los controles predeterminados
      />
    </View>
  );
}
```

### Guardar la posición de lectura

```tsx
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [currentCfi, setCurrentCfi] = useState('');
  const bookUrl = 'https://ejemplo.com/mi-libro.epub';
  const storageKey = `book-position-${bookUrl}`;

  // Cargar posición guardada
  React.useEffect(() => {
    const loadPosition = async () => {
      try {
        const savedPosition = await AsyncStorage.getItem(storageKey);
        if (savedPosition) {
          setCurrentCfi(savedPosition);
        }
      } catch (error) {
        console.error('Error al cargar la posición:', error);
      }
    };
    
    loadPosition();
  }, []);

  // Guardar posición actual
  const handleLocationChange = (cfi) => {
    setCurrentCfi(cfi);
    try {
      AsyncStorage.setItem(storageKey, cfi);
    } catch (error) {
      console.error('Error al guardar la posición:', error);
    }
  };

  return (
    <EpubReader
      source={{ uri: bookUrl }}
      onLocationChange={handleLocationChange}
      // Si tenemos una posición guardada, la usamos
      initialLocation={currentCfi}
    />
  );
}
```

## Métodos disponibles

El componente expone los siguientes métodos que pueden ser accedidos a través de una referencia:

| Método | Descripción |
|--------|-------------|
| `nextPage()` | Avanza a la página siguiente |
| `prevPage()` | Retrocede a la página anterior |
| `setLocation(cfi)` | Navega a una posición específica por CFI |
| `setTheme(theme)` | Cambia el tema ('light', 'dark', 'sepia') |
| `setFontSize(size)` | Cambia el tamaño de fuente |
| `setFontFamily(family)` | Cambia la familia de fuente |

## Cómo funciona

Este componente utiliza [react-native-webview](https://github.com/react-native-webview/react-native-webview) como contenedor y [epubjs](https://github.com/futurepress/epub.js/) para procesar y renderizar los archivos EPUB. La comunicación entre React Native y WebView se realiza mediante mensajes, permitiendo el control del libro desde el lado de React Native.

## Limitaciones

- En la plataforma web, cargar archivos locales requiere convertirlos a base64 primero
- Algunas características avanzadas de epubjs pueden no estar disponibles
- El rendimiento puede variar en dispositivos de gama baja con libros grandes

## Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue para discutir cambios mayores antes de enviar un pull request.

## Licencia

MIT
