import { CatApi } from '../services/catApi';
import { FavoritesStorage } from '../storage/favoriteStorage';
import { Gallery } from '../ui/gallery';

export class App {
  constructor() {
    this.catApi = new CatApi();
    this.favoritesStorage = new FavoritesStorage();
    this.gallery = new Gallery(
      document.querySelector('#gallery-root'),
      this.catApi,
      this.favoritesStorage
    );
  }

  async start() {
    await this.gallery.loadCats();
  }
}

