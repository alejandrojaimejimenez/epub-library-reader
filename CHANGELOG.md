# Changelog

Todas las modificaciones notables a este proyecto serán documentadas en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Versionado Semántico](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-06-22

### Añadido
- Soporte para referencias React usando React.forwardRef
- Interfaz EpubReaderRef para tipar correctamente las referencias
- Scripts de validación para asegurar calidad de los archivos compilados
- Script post-build para organizar correctamente archivos compilados

### Modificado
- Actualizada la configuración de TypeScript para mejorar compatibilidad
- Mejorada la configuración de Babel para transformar JSX correctamente
- Eliminada dependencia de Expo para mayor compatibilidad

### Corregido
- Error "Function components cannot be given refs" al usar el componente
- Problemas de "Module parse failed: Unexpected token" al importar la biblioteca
- Referencias incorrectas a archivos en la estructura compilada

### Eliminado
- Dependencia innecesaria de Expo
- Referencias a App.js que no se utilizaban
