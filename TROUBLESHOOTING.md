# Solución de problemas

## Error al importar en un proyecto JavaScript

Si estás teniendo problemas al importar el componente `EpubReader` en un proyecto que no tiene soporte para TypeScript o está configurado incorrectamente para procesar archivos TypeScript, puedes seguir estas instrucciones para solucionarlo:

### Opción 1: Configurar Babel para usar TypeScript

Añade `@babel/preset-typescript` a tu configuración de Babel:

```bash
npm install --save-dev @babel/preset-typescript
```

Y luego actualiza tu configuración de Babel en `babel.config.js` o `.babelrc`:

```javascript
module.exports = {
  presets: [
    'babel-preset-expo',
    '@babel/preset-typescript',
  ],
};
```

### Opción 2: Usar la versión pre-compilada

Este paquete ahora incluye archivos JavaScript pre-compilados en la carpeta `dist/`. Si estás teniendo problemas con TypeScript, asegúrate de importar el componente así:

```javascript
// En lugar de:
// import { EpubReader } from 'epub-library-reader';

// Usa:
import { EpubReader } from 'epub-library-reader/dist';
```

### Opción 3: Para proyectos React con Webpack

Si estás usando Webpack en un proyecto React, asegúrate de que tu configuración incluye el manejo de archivos .tsx:

```javascript
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      // ...
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
};
```

## Error con react-native-reanimated

Si encuentras un error relacionado con `react-native-gesture-handler` intentando importar `react-native-reanimated`, puedes:

1. Instalar esta dependencia opcional:

```bash
npm install react-native-reanimated
```

2. O ignorar la advertencia, ya que es solo una dependencia opcional que `react-native-gesture-handler` intenta usar si está disponible.

## Otros errores comunes

- **Asegúrate de tener todas las peer dependencies instaladas**:
  ```bash
  npm install react-native-webview epubjs
  ```

- **Para proyectos Expo**, asegúrate de tener instalado el paquete webview:
  ```bash
  npx expo install react-native-webview
  ```

- **Si estás recibiendo errores de Metro Bundler**, prueba a limpiar la caché:
  ```bash
  npx react-native start --reset-cache
  ```
  
- **Para errores de compilación en Android o iOS**, asegúrate de que los paquetes nativos están correctamente vinculados:
  ```bash
  npx react-native link react-native-webview
  ```

## Problemas al actualizar a la última versión

Si estás utilizando la referencia directa al repositorio GitHub en tu package.json para mantener siempre la última versión, puedes encontrar algunos problemas después de actualizaciones importantes.

### La actualización no se aplica

A veces npm o yarn pueden no detectar los cambios en el repositorio remoto. Prueba lo siguiente:

```bash
# Para forzar la actualización con npm
npm cache clean --force
npm update epub-library-reader --force

# Para forzar la actualización con yarn
yarn cache clean
yarn upgrade epub-library-reader --latest
```

### Conflictos después de la actualización

Si después de actualizar a la última versión encuentras errores o comportamientos inesperados:

1. **Verifica tus versiones de dependencias**: Asegúrate de que las versiones de `react-native-webview` y `epubjs` son compatibles con la última versión del componente.

2. **Comprueba los cambios recientes**: Revisa el [CHANGELOG.md](https://github.com/alejandrojaimejimenez/epub-library-reader/blob/main/CHANGELOG.md) para ver si ha habido cambios significativos en la API.

3. **Vuelve temporalmente a una versión estable**: Si necesitas estabilidad, especifica un tag o commit específico:

```json
"dependencies": {
  "epub-library-reader": "github:alejandrojaimejimenez/epub-library-reader#v0.1.0"
}
```

4. **Reporta el problema**: Si consideras que es un bug, abre un issue en el repositorio de GitHub.
