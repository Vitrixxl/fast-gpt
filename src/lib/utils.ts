import { clientDb } from '@/lib/dexie-db';
import pako from 'pako';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function zodUuid() {
  return z.string().regex(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  );
}

export const dumpDb = async () => {
  const tables: Record<string, any[]> = {};
  for (const table of clientDb.tables) {
    tables[table.name] = await table.toArray();
  }
  console.log(tables['messages']);
  return JSON.stringify(tables);
};

export const base64Compress = (data: string) => {
  // Convertir la chaîne en Uint8Array
  const uint8array = new TextEncoder().encode(data);

  // Compresser avec pako
  const compressed = pako.deflate(uint8array);

  // Convertir le résultat compressé en base64
  const base64 = btoa(String.fromCharCode(...compressed));

  return base64;
};

export const base64Decompress = (data: string) => {
  // Convertir la base64 en Uint8Array
  const binary = atob(data);
  const compressed = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    compressed[i] = binary.charCodeAt(i);
  }

  // Décompresser avec pako
  const decompressed = pako.inflate(compressed);

  // Convertir le Uint8Array en string
  const text = new TextDecoder().decode(decompressed);

  return text;
};
