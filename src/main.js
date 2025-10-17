// Importación de estilos principales del proyecto
import "../sass/style.scss";
import { App } from "./app/app";

// URL de la API de The Cat API para obtener imágenes de gatos
// La consulta está configurada para devolver 9 imágenes
const key = {
  "x-api-key":
    "live_S1P0w7XlhXs5AQeZ1ST2rLbWjtvNeHBX8rGaL7pqmZdNxbXGlxKyxk7XQEUYsxgH",
};

import { fetchClient } from "./lib/fetchClient.js";

export class CatApi {
  constructor(baseUrl = "https://api.thecatapi.com/v1/images/search") {
    this.baseUrl = baseUrl;
  }

  async fetchCats({
    page = 0,
    limit = 9,
    api_key = process.env.CAT_API_KEY,
    breed_ids,
    mime_types,
    has_breeds = true,
    category_ids,
  } = {}) {
    const params = new URLSearchParams({ limit, page, api_key });
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

const cat = new CatApi();

export class FavoritesStorage {
  constructor(key = "favorites") {
    this.key = key;
  }

  getAll() {
    try {
      return JSON.parse(localStorage.getItem(this.key)) || [];
    } catch {
      return [];
    }
  }

  save(list) {
    localStorage.setItem(this.key, JSON.stringify(list));
  }

  add(cat) {
    const list = this.getAll();
    if (!list.some((item) => item.id === cat.id)) {
      list.unshift(cat);
      this.save(list);
    }
  }

  remove(id) {
    const list = this.getAll().filter((item) => item.id !== id);
    this.save(list);
  }

  isFavorite(id) {
    return this.getAll().some((item) => item.id === id);
  }
}

const favorites = new FavoritesStorage();

export class Gallery {
  constructor(root, catApi, favoritesStorage) {
    this.root = root;
    this.catApi = catApi;
    this.favoritesStorage = favoritesStorage;
    this.page = 0;
  }

  async loadCats() {
    const cats = await this.catApi.fetchCats({ page: this.page, limit: 9 });
    this.renderCats(cats);
    this.page++;
  }

  renderCats(cats) {
    cats.forEach((cat) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${cat.url}" alt="Cat" />
        <button class="fav-btn" data-id="${cat.id}">
          🤍
        </button>
      `;
      card.querySelector(".fav-btn").addEventListener("click", (event) => {
        const btn = event.target;
        this.toggleFavorite(cat);
        this.favoritesStorage.isFavorite(cat.id)
          ? (btn.textContent = "❤️")
          : (btn.textContent = "🤍");
      });
      this.root.appendChild(card);
    });
  }

  toggleFavorite(cat) {
    if (this.favoritesStorage.isFavorite(cat.id)) {
      this.favoritesStorage.remove(cat.id);
    } else {
      this.favoritesStorage.add(cat);
    }
  }
}
const container = document.getElementById("gallery");
const gallery = new Gallery(container, cat, favorites);

await gallery.loadCats();
