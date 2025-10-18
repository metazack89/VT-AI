import { useState } from 'react';
import UploadForm from './components/UploadForm';
import ResultsDisplay from './components/ResultsDisplay';
import FilePreview from './components/FilePreview';
import ProcessHistory from './components/ProcessHistory';

function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [history, setHistory] = useState([]);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setError(null);
  };

  const handleProcess = async (file, idioma) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('idioma', idioma);

      // Configurar API URL (cambiar en producción)
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

      const response = await fetch(`${API_URL}/procesar`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al procesar el archivo');
      }

      const data = await response.json();
      setResults(data);

      // Agregar al historial
      const newHistoryItem = {
        id: Date.now(),
        filename: data.filename,
        timestamp: new Date().toLocaleString('es-ES'),
        idioma: data.idioma_detectado,
        results: data
      };
      setHistory([newHistoryItem, ...history.slice(0, 9)]); // Máximo 10 items

    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleHistorySelect = (item) => {
    setResults(item.results);
    setSelectedFile(null);
  };

  const handleDownloadJSON = () => {
    if (!results) return;
    
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `resultado_${results.filename}_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = () => {
    if (!results) return;

    // Crear CSV con palabras clave y entidades
    let csv = 'Tipo,Texto,Score/Tipo\n';
    
    results.palabras_clave.forEach(kw => {
      csv += `Palabra Clave,"${kw.keyword}",${kw.score}\n`;
    });

    results.entidades.forEach(ent => {
      csv += `Entidad,"${ent.texto}",${ent.tipo}\n`;
    });

    const dataBlob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `resultado_${results.filename}_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">VisionText AI</h1>
                <p className="text-sm text-gray-500">Extracción de texto y análisis con IA</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {results && (
                <>
                  <button
                    onClick={handleDownloadJSON}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    📥 JSON
                  </button>
                  <button
                    onClick={handleDownloadCSV}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    📊 CSV
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna Izquierda: Upload y Preview */}
          <div className="lg:col-span-1 space-y-6">
            <UploadForm
              onFileSelect={handleFileSelect}
              onProcess={handleProcess}
              loading={loading}
            />
            
            {selectedFile && (
              <FilePreview file={selectedFile} />
            )}

            {history.length > 0 && (
              <ProcessHistory
                history={history}
                onSelect={handleHistorySelect}
              />
            )}
          </div>

          {/* Columna Derecha: Resultados */}
          <div className="lg:col-span-2">
            {loading && (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                <p className="mt-4 text-gray-600 font-medium">Procesando documento...</p>
                <p className="text-sm text-gray-500 mt-2">Esto puede tomar unos segundos</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-red-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error al procesar</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {results && !loading && (
              <ResultsDisplay results={results} />
            )}

            {!results && !loading && !error && (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Sin resultados</h3>
                <p className="text-gray-500">Sube un archivo PDF o imagen para comenzar el análisis</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 pb-8 text-center text-sm text-gray-500">
        <p>VisionText AI - 3Tech | Powered by FastAPI, React & AWS</p>
      </footer>
    </div>
  );
}

export default App;