import { CatApi } from "../services/catApi";
import { FavoritesStorage } from "../storage/favoriteStorage";
import { Gallery } from "../ui/gallery";
import { Favorite } from "../ui/favorites";
import { Notificacion } from "../ui/notifications";

export class App {
  constructor() {
    this.catApi = new CatApi();
    this.favoritesStorage = new FavoritesStorage();
    this.favorite = new Favorite(
      document.querySelector("#favorites"),
      this.favoritesStorage
    );
    this.notification = new Notificacion(document.querySelector(".load__more"));
    this.gallery = new Gallery(
      document.querySelector("#gallery"),
      this.catApi,
      this.favoritesStorage,
      this.favorite,
      this.notification
    );
  }

  async start() {
    await this.gallery.loadCats();
  }

  loadMoreCats() {
    const btn = document.querySelector("#loadMoreBtn");
    btn.addEventListener("click", async () => {
      await this.gallery.loadCats();
    });
  }
}
