// Un caché simple en memoria para guardar errores de peticiones GET.
const errorCache = new Map<string, { error: Error; timestamp: number }>();
const CACHE_TTL_MS = 300000; // Los errores se cachean por 5 minutos.

const isCacheValid = (timestamp: number) => {
  return (Date.now() - timestamp) < CACHE_TTL_MS;
};

// Esta función se encarga de manejar la respuesta de TODAS las peticiones.
async function handleResponse(response: Response) {
  // Si la respuesta NO es OK (ej: 404, 500, etc.)
  if (!response.ok) {
    const errorText = await response.text();
    // Aquí lanzamos un nuevo error, pero esta vez con el mensaje ya limpio.
    // La función `getHumanReadableError` que creamos antes debería estar aquí,
    // pero para simplificar, la integramos en el hook/componente que llama.
    throw new Error(errorText);
  }

  // Si la respuesta es OK, limpiamos cualquier error que pudiera estar cacheado para esa URL.
  if (errorCache.has(response.url)) {
    errorCache.delete(response.url);
  }

  // Si la respuesta es "204 No Content", no hay JSON para parsear.
  if (response.status === 204) {
    return;
  }
  
  return response.json();
}

// Objeto que exportamos con los métodos para hacer peticiones.
export const apiClient = {
  // Método GET con caché de errores
  async get<T>(url: string, options?: RequestInit): Promise<T> {
    const cacheEntry = errorCache.get(url);
    if (cacheEntry && isCacheValid(cacheEntry.timestamp)) {
      console.log(`[Cache] Devolviendo error cacheado para: ${url}`);
      throw cacheEntry.error; // Lanza el error cacheado.
    }

    try {
      const response = await fetch(url, options);
      return await handleResponse(response);
    } catch (error) {
      // Si una petición GET falla, la guardamos en el caché.
      console.log(`[Cache] Guardando error para: ${url}`);
      errorCache.set(url, { error: error as Error, timestamp: Date.now() });
      throw error; // Volvemos a lanzar el error.
    }
  },

  // Para POST, PUT, etc., no usamos caché. Siempre intentamos la operación.
  async post<T>(url: string, data: any, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      ...options,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async put<T>(url: string, data: any, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      ...options,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  
  // Tu lógica de "baja" usa PUT sin body, así que creamos un método para ello.
  async baja(url: string, options?: RequestInit): Promise<void> {
    const response = await fetch(url, { ...options, method: 'PUT' });
    await handleResponse(response);
  },
};