import React, { useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, SafeAreaView, Alert, Switch } from 'react-native';
import EpubReader from './src/components/EpubReader';
import { WebView } from 'react-native-webview';

export default function App() {
  const [showReader, setShowReader] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'sepia'>('light');
  const [fontSize, setFontSize] = useState(18);
  const [showControls, setShowControls] = useState(true);
  const epubReaderRef = useRef<{ nextPage: () => void; prevPage: () => void }>(null);

  // URLs de ejemplo de archivos EPUB
  const sampleEpubUrl = 'https://s3.amazonaws.com/epubjs.org/books/alice.epub';
  // También puedes usar este archivo OPF de Moby Dick como alternativa
  // const sampleOPFUrl = 'https://s3.amazonaws.com/moby-dick/OPS/package.opf';

  if (showReader) {
    return (
      <SafeAreaView style={styles.readerContainer}>
        <View style={styles.readerHeader}>
          <Button title="Volver" onPress={() => setShowReader(false)} />
          <View style={styles.themeButtons}>
            <Button title="Light" onPress={() => setTheme('light')} />
            <Button title="Dark" onPress={() => setTheme('dark')} />
            <Button title="Sepia" onPress={() => setTheme('sepia')} />
          </View>
          <View style={styles.fontButtons}>
            <Button title="A-" onPress={() => setFontSize(prev => Math.max(12, prev - 2))} />
            <Button title="A+" onPress={() => setFontSize(prev => Math.min(24, prev + 2))} />
          </View>
        </View>
        
        <View style={styles.controlsToggle}>
          <Text>Mostrar controles de navegación</Text>
          <Switch value={showControls} onValueChange={setShowControls} />
        </View>
        
        <EpubReader
          source={{ uri: sampleEpubUrl }}
          defaultTheme={theme}
          defaultFontSize={fontSize}
          showControls={showControls}
          onReady={() => console.log('El libro está listo')}
          onLocationChange={(cfi) => console.log('Ubicación actual:', cfi)}
          onError={(error) => Alert.alert('Error', error)}
        />
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EPUB Library Reader</Text>
      <Text style={styles.subtitle}>Un lector de EPUB compatible con todas las plataformas</Text>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Abrir EPUB de ejemplo (Alice in Wonderland)"
          onPress={() => setShowReader(true)} 
        />
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Formatos soportados:</Text>
        <Text style={styles.infoItem}>• Archivos EPUB directos (.epub)</Text>
        <Text style={styles.infoItem}>• Archivos OPF (Open Packaging Format)</Text>
        <Text style={styles.infoItem}>• Datos Base64 codificados</Text>
        <Text style={styles.infoItem}>• URLs remotas</Text>
        <Text style={styles.infoItem}>• Archivos locales</Text>
      </View>
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
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
