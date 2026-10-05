import type { ServiceResult, ServiceStatus } from '@/lib/services/types';

interface AnalysisResults {
  fileName: string;
  fileSize: string;
  hashes: { md5: string; sha1: string; sha256: string };
  services: ServiceResult[];
}

interface ResultsDisplayProps {
  results: AnalysisResults | { error: string };
}

const STATUS_STYLES: Record<ServiceStatus, { card: string; badge: string; label: string }> = {
  malicious: {
    card: 'border-red-500 bg-red-50 dark:bg-red-900/20',
    badge: 'bg-red-500 text-white',
    label: '🚨 Detectado',
  },
  clean: {
    card: 'border-green-500 bg-green-50 dark:bg-green-900/20',
    badge: 'bg-green-500 text-white',
    label: '✅ Sin detecciones',
  },
  unknown: {
    card: 'border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700/40',
    badge: 'bg-gray-400 text-white',
    label: '❓ Sin datos',
  },
  error: {
    card: 'border-amber-400 bg-amber-50 dark:bg-amber-900/20',
    badge: 'bg-amber-500 text-white',
    label: '⚠️ No disponible',
  },
};

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  if (!results) return null;

  if ('error' in results) {
    return (
      <div className="mt-8 bg-red-100 dark:bg-red-900/30 border-2 border-red-500 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-2">❌ Error</h2>
        <p className="text-red-600 dark:text-red-300">{results.error}</p>
      </div>
    );
  }

  const { services } = results;
  const maliciousCount = services.filter((s) => s.status === 'malicious').length;
  const cleanCount = services.filter((s) => s.status === 'clean').length;
  const total = services.length;

  const summary =
    maliciousCount > 0
      ? {
          container: 'border-red-500 bg-red-100 dark:bg-red-900/30',
          title: 'text-red-700 dark:text-red-400',
          detail: 'text-red-600 dark:text-red-300',
          text: '🚨 Malware Detectado',
          description: `${maliciousCount} de ${total} fuentes marcan este archivo como malicioso`,
        }
      : cleanCount > 0
      ? {
          container: 'border-green-500 bg-green-100 dark:bg-green-900/30',
          title: 'text-green-700 dark:text-green-400',
          detail: 'text-green-600 dark:text-green-300',
          text: '✅ Sin detecciones',
          description: `${cleanCount} de ${total} fuentes analizaron el archivo sin encontrar amenazas`,
        }
      : {
          container: 'border-gray-400 bg-gray-100 dark:bg-gray-800 dark:border-gray-600',
          title: 'text-gray-800 dark:text-gray-200',
          detail: 'text-gray-600 dark:text-gray-400',
          text: '❓ Sin datos suficientes',
          description: 'Ninguna fuente reconoce este hash; no se puede confirmar que sea seguro',
        };

  return (
    <div className="mt-8 space-y-6">
      {/* Hash Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Información del Archivo
        </h2>
        <div className="space-y-3">
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Nombre:</span>
            <p className="text-lg font-mono text-gray-900 dark:text-white">{results.fileName}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Tamaño:</span>
            <p className="text-lg font-mono text-gray-900 dark:text-white">{results.fileSize}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">MD5:</span>
            <p className="text-sm font-mono text-gray-900 dark:text-white break-all">
              {results.hashes.md5}
            </p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">SHA-1:</span>
            <p className="text-sm font-mono text-gray-900 dark:text-white break-all">
              {results.hashes.sha1}
            </p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">SHA-256:</span>
            <p className="text-sm font-mono text-gray-900 dark:text-white break-all">
              {results.hashes.sha256}
            </p>
          </div>
        </div>
      </div>

      {/* Threat Level */}
      <div className={`border-2 rounded-lg p-6 ${summary.container}`}>
        <h2 className={`text-3xl font-bold mb-2 ${summary.title}`}>{summary.text}</h2>
        <p className={summary.detail}>{summary.description}</p>
      </div>

      {/* Service Results */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Resultados de Servicios
        </h2>
        <div className="space-y-4">
          {services.map((service, index) => {
            const styles = STATUS_STYLES[service.status] ?? STATUS_STYLES.unknown;
            return (
              <div key={index} className={`border-2 rounded-lg p-4 ${styles.card}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {service.name}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${styles.badge}`}>
                    {styles.label}
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
            );
          })}
        </div>
      </div>
    </div>
  );
}