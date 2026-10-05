'use client';

import { useState } from 'react';
import FileUploader from '@/components/FileUploader';
import ResultsDisplay from '@/components/ResultsDisplay';

export default function Home() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleFileAnalysis = async (file: File) => {
    setLoading(true);
    setResults(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error:', error);
      setResults({ error: 'Error al analizar el archivo' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">
              🛡️ Hash Checker
            </h1>
            <p className="text-xl text-gray-300">
              Analiza archivos y verifica si son malware en múltiples bases de datos
            </p>
          </div>

          <FileUploader onFileSelect={handleFileAnalysis} loading={loading} />

          {loading && (
            <div className="mt-8 text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
              <p className="text-white mt-4">Analizando archivo...</p>
            </div>
          )}

          {results && <ResultsDisplay results={results} />}
        </div>
      </div>

      <footer className="text-center text-gray-400 py-8">
        <p>Desarrollado para análisis de seguridad</p>
      </footer>
    </main>
  );
}
