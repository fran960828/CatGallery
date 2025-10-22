import { CatApi } from "../services/catApi";
import { FavoritesStorage } from "../storage/favoriteStorage";
import { Gallery } from "../ui/gallery";
import { Favorite } from "../ui/favorites";
import { Notificacion } from "../ui/notifications";
import { Filter } from "../ui/filter";

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
    this.filter = new Filter(
      document.querySelector("#filter-container"),
      this.catApi,
      (breedId) => this.onFilterChange(breedId)
    );

    this.currentBreed = null;
  }

  async start() {
    await this.filter.init();
    await this.gallery.loadCats(this.currentBreed);
  }

  loadMoreCats() {
    const btn = document.querySelector("#loadMoreBtn");
    btn.addEventListener("click", async () => {
      await this.gallery.loadCats(this.currentBreed);
    });
  }
  async onFilterChange(breedId) {
    this.currentBreed = breedId;
    this.gallery.resetGallery(); // limpiar imágenes
    await this.gallery.loadCats(breedId); // recargar con la raza
  }
}
