import { useState, useEffect } from 'react';

function FilePreview({ file }) {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!file) return;

    // Generar preview para imágenes
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else if (file.type === 'application/pdf') {
      // Para PDFs, mostrar icono (no podemos renderizar PDF sin librerías adicionales)
      setPreview(null);
    }

    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [file]);

  if (!file) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Vista Previa</h3>
      
      <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
        {file.type.startsWith('image/') && preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-auto max-h-96 object-contain bg-gray-50"
          />
        ) : file.type === 'application/pdf' ? (
          <div className="flex flex-col items-center justify-center p-12 bg-gray-50">
            <svg className="w-20 h-20 text-red-500 mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium text-gray-900">{file.name}</p>
            <p className="text-xs text-gray-500 mt-1">Archivo PDF</p>
          </div>
        ) : null}
      </div>

      {/* Información del archivo */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Tipo</p>
          <p className="font-medium text-gray-900">{file.type || 'Desconocido'}</p>
        </div>
        <div>
          <p className="text-gray-500">Tamaño</p>
          <p className="font-medium text-gray-900">
            {(file.size / 1024).toFixed(1)} KB
          </p>
        </div>
      </div>
    </div>
  );
}

export default FilePreview;