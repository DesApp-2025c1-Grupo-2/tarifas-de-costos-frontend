/**
 * Extrae un mensaje de error legible de un objeto de error del backend.
 * Busca en la traza de Java o en otras propiedades comunes.
 * @param error El objeto de error capturado.
 * @returns El mensaje de error limpio y legible para el usuario.
 */
export const getHumanReadableError = (error: any): string => {
  const defaultMessage = "Ocurrió un error inesperado. Por favor, intente de nuevo.";

  if (!error) {
    return defaultMessage;
  }

  // La lógica de los servicios actuales envuelve el error del backend.
  // Buscamos el mensaje original.
  const errorMessage = error.message || "";

  // Intenta encontrar un objeto JSON dentro del string de error.
  const jsonStartIndex = errorMessage.indexOf('{');
  if (jsonStartIndex !== -1) {
    try {
      const jsonString = errorMessage.substring(jsonStartIndex);
      const errorData = JSON.parse(jsonString);

      // Si el JSON tiene una propiedad "trace" (como en tu ejemplo de error de Java).
      if (errorData.trace) {
        const firstLine = errorData.trace.split('\n')[0]; // Ej: "java.lang.IllegalArgumentException: Ya existe..."
        const traceParts = firstLine.split(': ');
        if (traceParts.length > 1) {
          // Devuelve solo el mensaje, ej: "Ya existe un adicional con ese nombre"
          return traceParts.slice(1).join(': ').trim();
        }
        return firstLine.trim();
      }
      
      // Si el backend envía un mensaje más directo.
      if (errorData.message) {
        return errorData.message;
      }
      if(errorData.error) {
        return errorData.error;
      }

    } catch (e) {
      // Si el parseo de JSON falla, no hay problema, continuamos con el siguiente método.
    }
  }

  // Si no hay JSON, intenta dividir el string por ':' y toma la última parte.
  const basicParts = errorMessage.split(': ');
  if (basicParts.length > 1) {
    return basicParts[basicParts.length - 1].trim();
  }

  // Si nada funciona, devuelve el mensaje de error o el mensaje por defecto.
  return errorMessage || defaultMessage;
};