interface ResultsDisplayProps {
  results: any;
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  if (!results) return null;

  if (results.error) {
    return (
      <div className="mt-8 bg-red-100 dark:bg-red-900/30 border-2 border-red-500 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-2">
          ❌ Error
        </h2>
        <p className="text-red-600 dark:text-red-300">{results.error}</p>
      </div>
    );
  }

  const getThreatLevel = () => {
    const detections = results.services.filter((s: any) => s.detected).length;
    if (detections === 0) return { level: 'safe', color: 'green', text: '✅ Limpio' };
    if (detections <= 2) return { level: 'suspicious', color: 'yellow', text: '⚠️ Sospechoso' };
    return { level: 'malware', color: 'red', text: '🚨 Malware Detectado' };
  };

  const threat = getThreatLevel();

  return (
    <div className="mt-8 space-y-6">
      {/* Hash Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Información del Archivo
        </h2>
        <div className="space-y-3">
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Nombre:
            </span>
            <p className="text-lg font-mono text-gray-900 dark:text-white">
              {results.fileName}
            </p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Tamaño:
            </span>
            <p className="text-lg font-mono text-gray-900 dark:text-white">
              {results.fileSize}
            </p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              MD5:
            </span>
            <p className="text-sm font-mono text-gray-900 dark:text-white break-all">
              {results.hashes.md5}
            </p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              SHA-1:
            </span>
            <p className="text-sm font-mono text-gray-900 dark:text-white break-all">
              {results.hashes.sha1}
            </p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              SHA-256:
            </span>
            <p className="text-sm font-mono text-gray-900 dark:text-white break-all">
              {results.hashes.sha256}
            </p>
          </div>
        </div>
      </div>

      {/* Threat Level */}
      <div
        className={`bg-${threat.color}-100 dark:bg-${threat.color}-900/30 border-2 border-${threat.color}-500 rounded-lg p-6`}
      >
        <h2 className={`text-3xl font-bold text-${threat.color}-700 dark:text-${threat.color}-400 mb-2`}>
          {threat.text}
        </h2>
        <p className={`text-${threat.color}-600 dark:text-${threat.color}-300`}>
          {results.services.filter((s: any) => s.detected).length} de{' '}
          {results.services.length} servicios detectaron amenazas
        </p>
      </div>

      {/* Service Results */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Resultados de Servicios
        </h2>
        <div className="space-y-4">
          {results.services.map((service: any, index: number) => (
            <div
              key={index}
              className={`border-2 rounded-lg p-4 ${
                service.detected
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : service.error
                  ? 'border-gray-400 bg-gray-50 dark:bg-gray-700'
                  : 'border-green-500 bg-green-50 dark:bg-green-900/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {service.name}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold ${
                    service.detected
                      ? 'bg-red-500 text-white'
                      : service.error
                      ? 'bg-gray-500 text-white'
                      : 'bg-green-500 text-white'
                  }`}
                >
                  {service.detected ? '🚨 Detectado' : service.error ? '⚠️ Error' : '✅ Limpio'}
                </span>
              </div>
              {service.info && (
                <p className="text-gray-700 dark:text-gray-300 mb-2">{service.info}</p>
              )}
              {service.error && (
                <p className="text-gray-600 dark:text-gray-400 text-sm">{service.error}</p>
              )}
              {service.url && (
                <a
                  href={service.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm underline"
                >
                  Ver más detalles →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
