function ResultsDisplay({ results }) {
  return (
    <div className="space-y-6">
      {/* Encabezado de resultados */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Resultados del Análisis</h2>
            <p className="text-sm text-gray-500 mt-1">
              Archivo: <span className="font-medium">{results.filename}</span> | 
              Idioma: <span className="font-medium">{results.idioma_detectado === 'es' ? 'Español' : 'English'}</span>
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Procesado
            </span>
          </div>
        </div>
      </div>

      {/* Resumen */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm p-6 border border-blue-100">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Resumen Automático</h3>
            <p className="text-gray-700 leading-relaxed">{results.resumen}</p>
          </div>
        </div>
      </div>

      {/* Grid de Entidades y Palabras Clave */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Entidades */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-2 mb-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900">Entidades Reconocidas</h3>
            <span className="text-sm text-gray-500">({results.entidades.length})</span>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {results.entidades.length > 0 ? (
              results.entidades.map((entidad, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100 hover:bg-purple-100 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-900">{entidad.texto}</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${
                    entidad.tipo === 'PER' || entidad.tipo === 'PERSON' ? 'bg-blue-100 text-blue-800' :
                    entidad.tipo === 'ORG' ? 'bg-green-100 text-green-800' :
                    entidad.tipo === 'LOC' || entidad.tipo === 'GPE' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {entidad.tipo}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">No se encontraron entidades</p>
            )}
          </div>
        </div>

        {/* Palabras Clave */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-2 mb-4">
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900">Palabras Clave</h3>
            <span className="text-sm text-gray-500">({results.palabras_clave.length})</span>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {results.palabras_clave.length > 0 ? (
              results.palabras_clave.map((palabra, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-100 hover:bg-orange-100 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-900">{palabra.keyword}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-600 h-2 rounded-full"
                        style={{ width: `${palabra.score * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-semibold text-gray-600 w-12 text-right">
                      {(palabra.score * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">No se encontraron palabras clave</p>
            )}
          </div>
        </div>
      </div>

      {/* Texto Extraído */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900">Texto Extraído</h3>
          </div>
          <span className="text-sm text-gray-500">
            {results.texto_completo_length.toLocaleString()} caracteres
          </span>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto border border-gray-200">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
            {results.texto_extraido}
          </pre>
          {results.texto_completo_length > results.texto_extraido.length && (
            <p className="text-xs text-gray-500 mt-4 italic text-center">
              ... texto truncado para visualización ...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResultsDisplay;