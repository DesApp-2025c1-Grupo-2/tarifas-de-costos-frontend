// Un caché simple en memoria para guardar errores de peticiones GET.
// const errorCache = new Map<string, { error: Error; timestamp: number }>(); // <-- ELIMINADO
// const CACHE_TTL_MS = 300000; // 5 minutos // <-- ELIMINADO

// const isCacheValid = (timestamp: number) => (Date.now() - timestamp) < CACHE_TTL_MS; // <-- ELIMINADO

// BASE: en dev usamos proxy (ruta relativa); en prod pegamos a Render
const ORIGIN = (import.meta as any).env.VITE_API_BASE_URL?.replace(/\/+$/,'') || '';
const BASE   = (import.meta as any).env.DEV ? '' : ORIGIN;

// Une partes de URL sin duplicar barras
function joinUrl(...parts: string[]) {
  return parts
    .map((p, i) => (i === 0 ? p.replace(/\/+$/,'') : p.replace(/^\/+|\/+$/g,'')))
    .filter(Boolean)
    .join('/');
}

// Manejo estándar de respuestas
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(text || `HTTP ${response.status}`);
  }
  if (response.status === 204) return undefined as unknown as T;
  return response.json() as Promise<T>;
}

export const apiClient = {
  async get<T>(path: string, options?: RequestInit): Promise<T> {
    // path esperado: '/api/...'
    const url = joinUrl(BASE, path);

    // --- INICIO DE LA MODIFICACIÓN ---
    // Se elimina toda la lógica de revisión de caché de errores
    // const cacheEntry = errorCache.get(url);
    // if (cacheEntry && isCacheValid(cacheEntry.timestamp)) {
    //   console.log(`[Cache] Devolviendo error cacheado para: ${url}`);
    //   throw cacheEntry.error;
    // }
    // --- FIN DE LA MODIFICACIÓN ---

    try {
      const res = await fetch(url, {
        method: 'GET',
        credentials: 'omit', // usa 'include' solo si realmente manejás cookies
        headers: { 'Accept': 'application/json', ...(options?.headers || {}) },
        ...options,
      });
      const data = await handleResponse<T>(res);
      // if (errorCache.has(url)) errorCache.delete(url); // <-- ELIMINADO
      return data;
    } catch (err) {
      // --- INICIO DE LA MODIFICACIÓN ---
      // Se elimina el guardado en caché del error
      // console.log(`[Cache] Guardando error para: ${url}`);
      // errorCache.set(url, { error: err as Error, timestamp: Date.now() });
      // --- FIN DE LA MODIFICACIÓN ---
      throw err;
    }
  },

  // (El resto del archivo post, put, baja... sigue igual)
  // ...
  async post<T>(path: string, data: unknown, options?: RequestInit): Promise<T> {
    const url = joinUrl(BASE, path);
    // Se elimina la verificación del caché de errores para las peticiones POST
    const res = await fetch(url, {
      method: 'POST',
      credentials: 'omit',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', ...(options?.headers || {}) },
      body: JSON.stringify(data),
      ...options,
    });
    // Si la petición es exitosa, se limpia cualquier error cacheado para esa URL
    // if (res.ok && errorCache.has(url)) { // <-- ELIMINADO
    //   errorCache.delete(url); // <-- ELIMINADO
    // } // <-- ELIMINADO
    return handleResponse<T>(res);
  },

  async put<T>(path: string, data: unknown, options?: RequestInit): Promise<T> {
    const url = joinUrl(BASE, path);
    const res = await fetch(url, {
      method: 'PUT',
      credentials: 'omit',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', ...(options?.headers || {}) },
      body: data === undefined ? null : JSON.stringify(data),
      ...options,
    });
    return handleResponse<T>(res);
  },

  async baja(path: string, options?: RequestInit): Promise<void> {
    const url = joinUrl(BASE, path);
    const res = await fetch(url, { method: 'PUT', credentials: 'omit', ...(options || {}) });
    await handleResponse<void>(res);
  },
};