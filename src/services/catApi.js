import { fetchClient } from "../lib/fetchClient.js";

export class CatApi {
  constructor(baseUrl = "https://api.thecatapi.com/v1/images/search") {
    this.baseUrl = baseUrl;
  }

  async fetchCats({
    page = 0,
    limit = 9,
    api_key ='live_S1P0w7XlhXs5AQeZ1ST2rLbWjtvNeHBX8rGaL7pqmZdNxbXGlxKyxk7XQEUYsxgH',
    breed_ids,
    mime_types,
    has_breeds=true,
    category_ids,
  } = {}) {
    const params = new URLSearchParams({ limit, page,api_key});
    if (breed_ids) params.set("breed_ids", breed_ids);
    if (mime_types) params.set("mime_types", mime_types);
    if (has_breeds !== undefined) params.set("has_breeds", has_breeds ? 1 : 0);
    if (category_ids) params.set("category_ids", category_ids);

    try {
      const data = await fetchClient(`${this.baseUrl}?${params.toString()}`);
      return data;
    } catch (err) {
      console.error("Error fetching cats:", err.message);
      throw err;
    }
  }
}