// Este archivo es un script para verificar que los archivos generados
// en la carpeta dist sean correctos y no contengan JSX sin procesar

const fs = require('fs');
const path = require('path');

const distFolder = path.join(__dirname, 'dist');

// Verificar que la carpeta dist existe
if (!fs.existsSync(distFolder)) {
  console.error('Error: La carpeta dist no existe. Ejecuta npm run build primero.');
  process.exit(1);
}

// Verificar los archivos JavaScript
const jsFiles = findFilesByExtension(distFolder, '.js');
console.log(`Encontrados ${jsFiles.length} archivos JavaScript en la carpeta dist.`);

// Buscar patrones que indiquen JSX sin procesar
let hasErrors = false;
for (const file of jsFiles) {
  const content = fs.readFileSync(file, 'utf8');
  
  // Ignoramos los tags HTML en strings de template literals
  // que son normales en este caso ya que generamos HTML para WebView
  const lines = content.split('\n');
  let inTemplateLiteral = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Contar backticks para saber si estamos dentro de un template literal
    const backticks = (line.match(/`/g) || []).length;
    if (backticks % 2 !== 0) {
      inTemplateLiteral = !inTemplateLiteral;
    }
    
    // Si no estamos en un template literal, buscar JSX no procesado
    if (!inTemplateLiteral) {
      // Patrones que indican JSX sin procesar (fuera de string templates)
      const jsxPattern = /<[A-Z][a-zA-Z0-9]*(\.[a-zA-Z][a-zA-Z0-9]*)*\s*[^>]*>/;
      if (jsxPattern.test(line)) {
        console.error(`Error: El archivo ${file} contiene JSX sin procesar en la línea ${i+1}.`);
        console.error('Línea problemática:');
        console.error(line);
        hasErrors = true;
      }
    }
  }
}

if (hasErrors) {
  console.error('\nSe encontraron errores en los archivos generados. Revisa la configuración de Babel.');
  process.exit(1);
} else {
  console.log('¡La validación fue exitosa! Los archivos en la carpeta dist parecen estar correctamente procesados.');
}

// Función auxiliar para buscar archivos por extensión
function findFilesByExtension(directory, extension) {
  let result = [];
  
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      result = result.concat(findFilesByExtension(filePath, extension));
    } else if (path.extname(file) === extension) {
      result.push(filePath);
    }
  }
  
  return result;
}
