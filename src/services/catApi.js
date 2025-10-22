import { fetchClient } from "../lib/fetchClient.js";

export class CatApi {
  constructor(baseUrl = "https://api.thecatapi.com/v1") {
    this.baseUrl = baseUrl;
    this.apiKey = import.meta.env.VITE_CAT_API_KEY;
  }

  /**
   * Obtiene imágenes de gatos con soporte para filtros (raza, tipo, categorías, etc.)
   * @param {Object} options
   * @param {number} [options.page=0] - Página a solicitar
   * @param {number} [options.limit=9] - Número de resultados por página
   * @param {string} [options.breed_ids] - Filtrar por id de raza (opcional)
   * @param {string} [options.mime_types] - Filtrar por tipo de imagen (jpg, png, gif)
   * @param {boolean} [options.has_breeds=true] - Solo imágenes con información de raza
   * @param {string} [options.category_ids] - Filtrar por categoría
   * @returns {Promise<Array>} Lista de gatos
   */
  async fetchCats({
    page = 0,
    limit = 9,
    breed_ids,
    mime_types,
    has_breeds = true,
    category_ids,
  } = {}) {
    const endpoint = `${this.baseUrl}/images/search`;
    const params = new URLSearchParams({
      limit,
      page,
      has_breeds: has_breeds ? 1 : 0,
    });

    // Añadir parámetros opcionales
    if (breed_ids) params.set("breed_ids", breed_ids);
    if (mime_types) params.set("mime_types", mime_types);
    if (category_ids) params.set("category_ids", category_ids);

    try {
      const data = await fetchClient(`${endpoint}?${params.toString()}`, {
        headers: { "x-api-key": this.apiKey },
      });
      return data;
    } catch (err) {
      console.error("❌ Error fetching cats:", err.message);
      throw err;
    }
  }

  /**
   * Obtiene el listado completo de razas de gatos.
   * @returns {Promise<Array>} Lista de razas
   */
  async fetchBreeds() {
    try {
      const data = await fetchClient(`${this.baseUrl}/breeds`, {
        headers: { "x-api-key": this.apiKey },
      });
      return data;
    } catch (err) {
      console.error("❌ Error fetching breeds:", err.message);
      throw err;
    }
  }
}
