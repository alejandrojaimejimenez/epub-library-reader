/**
 * Script post-build para organizar correctamente los archivos compilados
 */
const fs = require('fs');
const path = require('path');

// Rutas
const distDir = path.join(__dirname, '../dist');
const componentsDir = path.join(distDir, 'components');
const srcComponentsDir = path.join(distDir, 'src/components');

// Asegurarnos de que el directorio components existe
if (!fs.existsSync(componentsDir)) {
  fs.mkdirSync(componentsDir, { recursive: true });
}

// Copiar los archivos del componente a la ubicación correcta
console.log('Copiando archivos de componentes...');
fs.readdirSync(srcComponentsDir).forEach(file => {
  const srcPath = path.join(srcComponentsDir, file);
  const destPath = path.join(componentsDir, file);
  
  // Copiar el archivo
  fs.copyFileSync(srcPath, destPath);
  console.log(`Copiado: ${srcPath} -> ${destPath}`);
});

// Actualizar el archivo index.js para usar la ruta correcta
const indexJsPath = path.join(distDir, 'index.js');
if (fs.existsSync(indexJsPath)) {
  let indexContent = fs.readFileSync(indexJsPath, 'utf8');
  indexContent = indexContent.replace('./src/components/EpubReader', './components/EpubReader');
  fs.writeFileSync(indexJsPath, indexContent);
  console.log('Actualizado: index.js con las rutas correctas');
}

// Actualizar el archivo index.d.ts para usar la ruta correcta
const indexDtsPath = path.join(distDir, 'index.d.ts');
if (fs.existsSync(indexDtsPath)) {
  let indexDtsContent = fs.readFileSync(indexDtsPath, 'utf8');
  indexDtsContent = indexDtsContent.replace('./src/components/EpubReader', './components/EpubReader');
  fs.writeFileSync(indexDtsPath, indexDtsContent);
  console.log('Actualizado: index.d.ts con las rutas correctas');
}

// Eliminar cualquier referencia a App.js (que ya no necesitamos)
const appJsPath = path.join(distDir, 'App.js');
if (fs.existsSync(appJsPath)) {
  fs.unlinkSync(appJsPath);
  console.log('Eliminado: App.js innecesario');
}

console.log('Post-build completado con éxito!');
