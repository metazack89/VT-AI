import { useState, useRef } from 'react';

function UploadForm({ onFileSelect, onProcess, loading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [idioma, setIdioma] = useState('es');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (file) => {
    // Validar tipo de archivo
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/bmp', 'image/tiff'];
    if (!allowedTypes.includes(file.type)) {
      alert('Tipo de archivo no permitido. Por favor, sube un PDF o imagen (JPG, PNG, BMP, TIFF).');
      return;
    }

    // Validar tamaño (10 MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('El archivo es demasiado grande. Tamaño máximo: 10 MB');
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFile) {
      onProcess(selectedFile, idioma);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Subir Documento</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Área de drag & drop */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.bmp,.tiff,.tif"
            onChange={(e) => e.target.files[0] && handleFileChange(e.target.files[0])}
            className="hidden"
          />

          {!selectedFile ? (
            <>
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-600">
                Arrastra un archivo o{' '}
                <button
                  type="button"
                  onClick={handleButtonClick}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  selecciona
                </button>
              </p>
              <p className="mt-1 text-xs text-gray-500">
                PDF, JPG, PNG (máx. 10MB)
              </p>
            </>
          ) : (
            <div className="flex items-center justify-center space-x-3">
              <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  onFileSelect(null);
                }}
                className="text-red-600 hover:text-red-700"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Selector de idioma */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Idioma del documento
          </label>
          <select
            value={idioma}
            onChange={(e) => setIdioma(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          >
            <option value="es">🇪🇸 Español</option>
            <option value="en">🇬🇧 English</option>
          </select>
        </div>

        {/* Botón de procesar */}
        <button
          type="submit"
          disabled={!selectedFile || loading}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
            !selectedFile || loading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </span>
          ) : (
            '🚀 Procesar Documento'
          )}
        </button>
      </form>
    </div>
  );
}

export default UploadForm;