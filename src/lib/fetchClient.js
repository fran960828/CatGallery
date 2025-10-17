/**
 * Función fetchClient
 * Realiza una solicitud HTTP utilizando fetch con soporte para timeout y manejo de errores.
 *
 * @param {string} url - La URL a la que se realizará la solicitud.
 * @param {object} [options={}] - Opciones adicionales para la solicitud (headers, método, etc.).
 * @returns {Promise<object>} - Devuelve un objeto JSON con los datos de la respuesta si es exitosa.
 * @throws {Error} - Lanza un error si la solicitud falla o si ocurre un problema de red.
 */
export async function fetchClient(url, options = {}) {
  // Crear un controlador para manejar la cancelación de la solicitud
  const controller = new AbortController();

  // Configurar el tiempo máximo de espera (timeout) en milisegundos
  const timeout = options.timeout || 10000; // Por defecto, 10 segundos

  // Iniciar un temporizador para cancelar la solicitud si excede el tiempo límite
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    // Realizar la solicitud utilizando fetch, pasando el controlador de señal
    const resp = await fetch(url, { ...options, signal: controller.signal });

    // Limpiar el temporizador si la solicitud se completa antes del timeout
    clearTimeout(id);

    // Verificar si la respuesta es exitosa (código HTTP 200-299)
    if (!resp.ok) {
      // Leer el texto de la respuesta en caso de error
      const text = await resp.text();
      throw new Error(text || resp.statusText); // Lanzar un error con el mensaje correspondiente
    }

    // Devolver los datos de la respuesta en formato JSON
    return resp.json();
  } catch (err) {
    // Encapsular el error para mostrarlo en la interfaz de usuario
    throw new Error(err.message || "Network error");
  }
}
