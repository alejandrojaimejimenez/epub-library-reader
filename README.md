# EPUB Library Reader

[![React Native](https://img.shields.io/badge/React_Native-0.79-blue.svg)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)

Un componente para la lectura de archivos EPUB en aplicaciones React Native con TypeScript, compatible con plataformas web, iOS y Android.

![EPUB Reader Demo](https://via.placeholder.com/800x400?text=EPUB+Reader+Demo)

## Características

- ✅ Soporte multiplataforma (web, iOS, Android)
- ✅ Compatible con archivos EPUB y OPF
- ✅ Múltiples fuentes de datos (URL, base64)
- ✅ Temas personalizables (claro, oscuro, sepia)
- ✅ Ajuste de tamaño de fuente
- ✅ Navegación entre páginas
- ✅ Control de ubicación y progreso de lectura
- ✅ Sin dependencia directa del DOM
- ✅ Sin dependencia de Expo

## Requisitos

- React Native ≥ 0.79
- TypeScript ≥ 5.8

## Instalación

### Opción 1: Instalar desde GitHub

Puedes instalar este componente directamente desde GitHub:

```bash
# Instalar el componente
npm install git+https://github.com/alejandrojaimejimenez/epub-library-reader.git

# Instalar las dependencias requeridas (peer dependencies)
npm install epubjs react-native-webview
```

O usando yarn:

```bash
# Instalar el componente
yarn add git+https://github.com/alejandrojaimejimenez/epub-library-reader.git

# Instalar las dependencias requeridas (peer dependencies)
yarn add epubjs react-native-webview
```

#### Usar siempre la última versión disponible

Para asegurarte de que tu proyecto siempre use la última versión disponible de este componente, puedes modificar directamente tu `package.json` de la siguiente manera:

```json
"dependencies": {
  "epub-library-reader": "github:alejandrojaimejimenez/epub-library-reader"
}
```

Con esta configuración, cada vez que ejecutes `npm update` o `yarn upgrade`, obtendrás automáticamente la última versión de la rama principal del repositorio.

Para actualizar manualmente a la última versión en cualquier momento:

```bash
# Con npm
npm update epub-library-reader

# Con yarn
yarn upgrade epub-library-reader
```

Luego puedes importarlo directamente:

```tsx
import { EpubReader } from 'epub-library-reader';
```

Para proyectos JavaScript o si tienes problemas con TypeScript:

```javascript
import { EpubReader } from 'epub-library-reader/dist';
```

> **Nota importante:** Si encuentras problemas de instalación o conflictos de versiones, la instalación manual (opción 2) es más recomendable.

### Opción 2: Instalación manual (recomendada)

Esta opción es más sencilla y evita problemas de compatibilidad entre versiones:

1. Instalar las dependencias necesarias:

```bash
npm install epubjs react-native-webview
```

2. Copiar el componente:

Copia el archivo `src/components/EpubReader.tsx` de este repositorio a tu proyecto.

3. Usar el componente directamente:

```tsx
import EpubReader from './ruta/a/EpubReader';
```

## Uso básico

### Si instalaste desde npm o GitHub:

```tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { EpubReader } from 'epub-library-reader';

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

### Si copiaste manualmente el componente:

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
| `defaultTheme` | 'light' \| 'dark' \| 'sepia' | Tema inicial | No | 'light' |
| `defaultFontSize` | Number | Tamaño inicial de la fuente (px) | No | 16 |
| `defaultFontFamily` | String | Familia de fuente inicial | No | 'system' |
| `width` | Number | Ancho del componente | No | Ancho de pantalla |
| `height` | Number | Alto del componente | No | Alto de pantalla |
| `showControls` | Boolean | Mostrar controles de navegación | No | true |
| `initialLocation` | String | CFI para navegar a una posición específica al cargar | No | - |
| `onLocationChange` | Function | Callback al cambiar de posición | No | - |
| `onReady` | Function | Callback cuando el libro está listo | No | - |
| `onPress` | Function | Callback al tocar el libro | No | - |
| `onError` | Function | Callback al ocurrir un error | No | - |

*Se requiere al menos una de las dos opciones: `uri` o `base64`.

## Ejemplos de uso

### Cargar un archivo EPUB desde una URL

```tsx
import { EpubReader } from 'epub-library-reader';

<EpubReader
  source={{ uri: 'https://ejemplo.com/mi-libro.epub' }}
  onReady={() => console.log('El libro está listo')}
/>
```

### Cargar un archivo EPUB desde un Blob URL (navegador web)

A partir de la versión 0.1.3, el componente también soporta URLs de tipo blob generados por el navegador:

```tsx
import { EpubReader } from 'epub-library-reader';

// En el contexto de un componente React
const MyComponent = () => {
  const [blobUrl, setBlobUrl] = useState(null);
  
  useEffect(() => {
    // Ejemplo: Obtener un archivo y crear un blob URL
    fetch('https://ejemplo.com/mi-libro.epub')
      .then(response => response.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
      });
  }, []);
  
  return (
    <>
      {blobUrl && (
        <EpubReader
          source={{ uri: blobUrl }}
          onReady={() => console.log('El libro está listo')}
        />
      )}
    </>
  );
};
```

> **Nota importante**: Los Blob URLs son específicos del contexto del navegador donde fueron creados. Esto funciona en la plataforma web pero no en aplicaciones nativas iOS/Android.

### Cargar un archivo EPUB desde una URL con posición inicial

```tsx
import { EpubReader } from 'epub-library-reader';

// CFI ejemplo de posición guardada previamente
const savedPosition = 'epubcfi(/6/14[chap4]!/4/2/2[id456]/6,/1:0,/3:32)';

<EpubReader
  source={{ uri: 'https://ejemplo.com/mi-libro.epub' }}
  initialLocation={savedPosition}
  onReady={() => console.log('El libro está listo')}
  onLocationChange={(cfi) => console.log('Nueva posición:', cfi)}
/>
```

### Cargar un libro y continuar desde la última posición

```tsx
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { EpubReader } from 'epub-library-reader';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BookReader() {
  const [lastLocation, setLastLocation] = useState('');
  const bookUrl = 'https://ejemplo.com/mi-libro.epub';
  
  // Cargar la última posición de lectura al iniciar
  useEffect(() => {
    const loadLastPosition = async () => {
      try {
        // Usar una clave única para cada libro
        const storedLocation = await AsyncStorage.getItem(`book_location_${bookUrl}`);
        if (storedLocation) {
          setLastLocation(storedLocation);
        }
      } catch (error) {
        console.error('Error al cargar la posición:', error);
      }
    };
    
    loadLastPosition();
  }, []);
  
  // Guardar la posición actual al cambiar de ubicación
  const handleLocationChange = async (cfi) => {
    try {
      await AsyncStorage.setItem(`book_location_${bookUrl}`, cfi);
    } catch (error) {
      console.error('Error al guardar la posición:', error);
    }
  };
  
  return (
    <View style={{ flex: 1 }}>
      <EpubReader
        source={{ uri: bookUrl }}
        initialLocation={lastLocation} // Pasar la última posición guardada
        onLocationChange={handleLocationChange}
        onReady={() => console.log('Libro cargado y listo')}
      />
    </View>
  );
}
```

### Cargar un archivo usando datos Base64

```tsx
import { EpubReader } from 'epub-library-reader';
import { useState } from 'react';

// En tu componente:
const [bookData, setBookData] = useState('');

// Ejemplo de cargar base64 desde una respuesta API
const loadBook = async () => {
  try {
    const response = await fetch('https://tu-api.com/libro');
    const base64Data = await response.text();
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
import { EpubReader } from 'epub-library-reader';

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
import { EpubReader, EpubReaderRef } from 'epub-library-reader';

export default function App() {
  // Usar la interfaz EpubReaderRef para tipar correctamente la referencia
  const epubRef = useRef<EpubReaderRef>(null);

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
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EpubReader } from 'epub-library-reader';

export default function App() {
  const [currentCfi, setCurrentCfi] = useState('');
  const bookUrl = 'https://ejemplo.com/mi-libro.epub';
  const storageKey = `book-position-${bookUrl}`;

  // Cargar posición guardada
  useEffect(() => {
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

## Uso de referencias

Para controlar el componente de manera programática, puedes usar referencias. El componente `EpubReader` está diseñado con `React.forwardRef()` para permitir el uso de referencias de manera segura:

```tsx
import { EpubReader, EpubReaderRef } from 'epub-library-reader';
import React, { useRef } from 'react';

// En tu componente
const epubRef = useRef<EpubReaderRef>(null);

// Y luego usarlo en la renderización
<EpubReader
  ref={epubRef}
  source={{ uri: 'https://ejemplo.com/mi-libro.epub' }}
/>

// Ahora puedes llamar a los métodos de la referencia
epubRef.current?.nextPage();
epubRef.current?.setFontSize(20);
```

La interfaz `EpubReaderRef` expone los siguientes métodos:

```typescript
interface EpubReaderRef {
  nextPage: () => void;
  prevPage: () => void;
  setLocation: (cfi: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'sepia') => void;
  setFontSize: (size: number) => void;
  setFontFamily: (fontFamily: string) => void;
}
```

Esto te permite controlar completamente el comportamiento del lector desde componentes padres.

## Cómo funciona

Este componente utiliza [react-native-webview](https://github.com/react-native-webview/react-native-webview) como contenedor y [epubjs](https://github.com/futurepress/epub.js/) para procesar y renderizar los archivos EPUB. La comunicación entre React Native y WebView se realiza mediante mensajes, permitiendo el control del libro desde el lado de React Native.

## Información para desarrolladores

### Archivos precompilados

Este repositorio incluye la carpeta `/dist` con archivos JavaScript precompilados, lo que permite:

- Usar el componente directamente en proyectos sin TypeScript
- Evitar errores de compilación en proyectos con diferentes configuraciones
- Importar el paquete sin necesidad de transpilación adicional

Si haces cambios en el código fuente, asegúrate de volver a compilar el paquete con:

```bash
npm run build
```

Y luego incluir los cambios de la carpeta `/dist` en tu commit.

## Solución de problemas

Si estás teniendo problemas al integrar o utilizar el componente, consulta nuestra [guía de solución de problemas](TROUBLESHOOTING.md) que incluye soluciones para:

- Errores de importación en proyectos JavaScript
- Problemas con TypeScript
- Errores con react-native-reanimated
- Configuración para diferentes tipos de proyectos

## Limitaciones

- El componente está diseñado para cargar EPUB desde URLs o datos base64
- No soporta la carga directa de archivos locales
- Algunas características avanzadas de epubjs pueden no estar disponibles
- El rendimiento puede variar en dispositivos de gama baja con libros grandes

## Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue para discutir cambios mayores antes de enviar un pull request.

## Licencia

MIT

## Solución de problemas

### Problemas al instalar desde GitHub

Si experimentas errores al instalar el paquete directamente desde GitHub, como conflictos de dependencias o errores de versiones incompatibles, considera usar la instalación manual (Opción 2).

### Problemas al actualizar a la última versión

Si estás usando la configuración para mantener siempre la última versión (con `github:alejandrojaimejimenez/epub-library-reader` en tu package.json) y experimentas problemas después de una actualización:

1. **Borrar la caché de npm/yarn:**
   ```bash
   # Para npm
   npm cache clean --force
   
   # Para yarn
   yarn cache clean
   ```

2. **Borrar node_modules y reinstalar:**
   ```bash
   rm -rf node_modules
   npm install
   # o yarn install
   ```

3. **Si el problema persiste**, puedes fijar temporalmente la versión a un commit específico o tag estable:
   ```json
   "dependencies": {
     "epub-library-reader": "github:alejandrojaimejimenez/epub-library-reader#v0.1.0"
   }
   ```

**Errores comunes y soluciones:**

1. **Conflictos de versiones con dependencias:**
   ```
   npm warn Could not resolve dependency:
   npm warn peer react-native@"*" from epub-library-reader
   ```
   Solución: Usa la instalación manual y asegúrate de que las versiones de tus dependencias sean compatibles con tu proyecto.

2. **Errores con scripts de preparación:**
   ```
   npm error > epub-library-reader@1.0.0 prepare
   npm error > expo-module prepare
   ```
   Solución: La instalación manual evita este problema.

3. **Problemas de importación tras instalación:**
   
   Si has instalado el paquete correctamente pero tienes problemas al importarlo, asegúrate de:
   - Tener todas las dependencias requeridas instaladas (react-native-webview y epubjs)
   - Usar la sintaxis de importación correcta según el método de instalación

La instalación manual (copiar el componente directamente a tu proyecto) es generalmente la opción más robusta y flexible.
