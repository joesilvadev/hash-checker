import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { runAllServices } from '@/lib/services';
import type { ApiKeys, FileHashes } from '@/lib/services/types';

export const maxDuration = 60;

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

/** Lee las claves de API del entorno (nunca se registran ni se devuelven). */
function getApiKeys(): ApiKeys {
  return {
    abuseCh: process.env.ABUSECH_AUTH_KEY || null,
    virusTotal: process.env.VIRUSTOTAL_API_KEY || null,
    hybridAnalysis: process.env.HYBRID_ANALYSIS_API_KEY || null,
    otx: process.env.OTX_API_KEY || null,
  };
}

function calculateHashes(buffer: Buffer): FileHashes {
  return {
    md5: crypto.createHash('md5').update(buffer).digest('hex'),
    sha1: crypto.createHash('sha1').update(buffer).digest('hex'),
    sha256: crypto.createHash('sha256').update(buffer).digest('hex'),
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No se proporcionó archivo' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'El archivo excede el tamaño máximo de 50MB' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const hashes = calculateHashes(buffer);
    const services = await runAllServices(hashes, getApiKeys());

    return NextResponse.json({
      fileName: file.name,
      fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      hashes,
      services,
    });
  } catch (error) {
    console.error('Error al procesar el archivo:', error);
    return NextResponse.json({ error: 'Error al procesar el archivo' }, { status: 500 });
  }
}