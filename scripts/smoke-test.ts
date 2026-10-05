#!/usr/bin/env -S npx tsx
/**
 * Prueba de humo de la capa de servicios.
 *
 * Llama directamente a `runAllServices` con hashes conocidos y comprueba que
 * cada fuente devuelve el veredicto esperado. No necesita el servidor Next.
 *
 * Uso:
 *   npm run smoke
 *
 * Requiere las claves en `.env.local` (se cargan automáticamente).
 */
import { existsSync } from 'node:fs';
import { runAllServices } from '../lib/services';
import type { ApiKeys, FileHashes, ServiceResult } from '../lib/services/types';

if (existsSync('.env.local')) {
  process.loadEnvFile('.env.local');
}

const keys: ApiKeys = {
  abuseCh: process.env.ABUSECH_AUTH_KEY || null,
  virusTotal: process.env.VIRUSTOTAL_API_KEY || null,
  hybridAnalysis: process.env.HYBRID_ANALYSIS_API_KEY || null,
  otx: process.env.OTX_API_KEY || null,
};

// Hash nunca visto (hex válido pero inexistente en cualquier base).
const UNKNOWN_SHA256 = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

const CASES = [
  {
    label: 'Malware conocido (WannaCry)',
    sha256: 'ed01ebfbc9eb5bbea545af4d01bf5f1071661840480439c6e5babe8e080e41aa',
    expectedMalicious: ['MalwareBazaar', 'VirusTotal', 'Hybrid Analysis'],
  },
  {
    label: 'Malware de prueba (EICAR)',
    sha256: '275a021bbfb6489e54d471899f7db9d1663fc695ec2fe2a2c4538aabf651fd0f',
    expectedMalicious: ['VirusTotal'],
  },
  {
    label: 'Desconocido (nunca visto)',
    sha256: UNKNOWN_SHA256,
    expectedMalicious: [],
  },
];

const ICON: Record<ServiceResult['status'], string> = {
  malicious: '🚨',
  clean: '✅',
  unknown: '❓',
  error: '⚠️',
};

function hashesOf(sha256: string): FileHashes {
  return { md5: '', sha1: '', sha256 };
}

async function main(): Promise<void> {
  const required: Array<[string, string | null]> = [
    ['ABUSECH_AUTH_KEY', keys.abuseCh],
    ['VIRUSTOTAL_API_KEY', keys.virusTotal],
    ['HYBRID_ANALYSIS_API_KEY', keys.hybridAnalysis],
  ];
  const missing = required.filter(([, value]) => !value).map(([name]) => name);
  if (missing.length > 0) {
    console.log(`⚠️  Sin configurar: ${missing.join(', ')} (esos servicios saldrán "No disponible")`);
  }

  let failures = 0;

  for (const testCase of CASES) {
    const results = await runAllServices(hashesOf(testCase.sha256), keys);
    const maliciousNames = results.filter((r) => r.status === 'malicious').map((r) => r.name);

    console.log(`\n=== ${testCase.label} ===`);
    console.log(`SHA-256: ${testCase.sha256}`);
    for (const service of results) {
      console.log(`  ${ICON[service.status]} [${service.status.padEnd(9)}] ${service.name}: ${service.info}`);
      if (service.error) console.log(`        error: ${service.error}`);
    }

    for (const expected of testCase.expectedMalicious) {
      if (!maliciousNames.includes(expected)) {
        console.log(`  ❌ Se esperaba que "${expected}" marcase este hash como malicioso.`);
        failures++;
      }
    }
    if (testCase.expectedMalicious.length === 0 && maliciousNames.length > 0) {
      console.log(`  ❌ Un hash desconocido no debería salir malicioso (${maliciousNames.join(', ')}).`);
      failures++;
    }
  }

  console.log('');
  if (failures === 0) {
    console.log('✅ Prueba de humo superada.');
  } else {
    console.log(`❌ ${failures} comprobación(es) fallida(s).`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error('❌ Error inesperado en la prueba:', error);
  process.exitCode = 1;
});