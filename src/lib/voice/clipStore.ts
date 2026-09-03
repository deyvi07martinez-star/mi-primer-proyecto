/**
 * Almacen de clips de voz en IndexedDB: las palabras que graba la persona
 * sobreviven a recargas de la pagina y nunca salen del navegador.
 */

const DB_NAME = "noirsel-voz";
const DB_VERSION = 1;
const STORE = "clips";

export type VoiceClip = {
  id: string;
  /** Palabra o frase tal como la escribio la persona. */
  word: string;
  /** Clave normalizada usada para buscar coincidencias en el texto. */
  key: string;
  blob: Blob;
  createdAt: number;
};

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function withStore<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await openDb();
  try {
    return await new Promise<T>((resolve, reject) => {
      const tx = db.transaction(STORE, mode);
      const request = run(tx.objectStore(STORE));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } finally {
    db.close();
  }
}

export async function listClips(): Promise<VoiceClip[]> {
  const clips = await withStore<VoiceClip[]>("readonly", (store) =>
    store.getAll() as IDBRequest<VoiceClip[]>,
  );
  return clips.sort((a, b) => a.createdAt - b.createdAt);
}

export async function saveClip(clip: VoiceClip): Promise<void> {
  await withStore("readwrite", (store) => store.put(clip));
}

export async function deleteClip(id: string): Promise<void> {
  await withStore("readwrite", (store) => store.delete(id));
}

export async function clearClips(): Promise<void> {
  await withStore("readwrite", (store) => store.clear());
}
