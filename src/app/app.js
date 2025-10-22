/**
 * Entrada principal de la aplicación.
 * Inicializa las dependencias (API, almacenamiento, UI) y coordina la interacción
 * entre la galería y la vista de favoritos.
 *
 * Uso:
 *  const app = new App();
 *  await app.start();
 */
import { CatApi } from "../services/catApi";
import { FavoritesStorage } from "../storage/favoriteStorage";
import { Gallery } from "../ui/gallery";
import { Favorite } from "../ui/favorites";
import { Notificacion } from "../ui/notifications";
import { Filter } from "../ui/filter";

export class App {
  constructor() {
    // Servicios y almacenes
    this.catApi = new CatApi();
    this.favoritesStorage = new FavoritesStorage();

    // Componentes UI principales
    this.favorite = new Favorite(
      document.querySelector("#favorites"),
      this.favoritesStorage
    );
    // Notificación reutilizable (se muestra en el botón "Cargar más")
    this.notification = new Notificacion(document.querySelector(".load__more"));

    // Galería principal
    this.gallery = new Gallery(
      document.querySelector("#gallery"),
      this.catApi,
      this.favoritesStorage,
      this.favorite,
      this.notification
    );

    // Filtro de razas
    this.filter = new Filter(
      document.querySelector("#filter-container"),
      this.catApi,
      (breedId) => this.onFilterChange(breedId)
    );

    // Estado actual de filtro de raza
    this.currentBreed = null;
  }

  /**
   * Inicializa la app: carga filtros y las primeras imágenes.
   */
  async start() {
    await this.filter.init();
    await this.gallery.loadCats(this.currentBreed);
    this.changeView();
  }

  /**
   * Registra el evento del botón "Cargar más".
   * Nota: el método crea el listener en el botón con id #loadMoreBtn.
   */
  loadMoreCats() {
    const btn = document.querySelector("#loadMoreBtn");
    btn.addEventListener("click", async () => {
      await this.gallery.loadCats(this.currentBreed);
    });
  }

  /**
   * Handler llamado cuando cambia el filtro de raza.
   * Resetear la galería y pedir imágenes de la raza seleccionada.
   * @param {string|null} breedId
   */
  async onFilterChange(breedId) {
    this.currentBreed = breedId;
    this.gallery.resetGallery(); // limpiar imágenes anteriores
    await this.gallery.loadCats(breedId); // recargar con la raza seleccionada
  }

  /**
   * Alterna la vista entre galería y favoritos al hacer click en #changeView.
   * - Cuando se muestran favoritos el contenedor #favoritesSection se muestra en grid
   * - Cuando se muestra galería el contenedor #gallery se muestra en grid
   */
  changeView() {
    const btn = document.getElementById("changeView");
    const favorites = document.getElementById("favoritesSection");
    btn.addEventListener("click", (event) => {
      const change = event.currentTarget;

      if (change.textContent === "Ver favoritos") {
        // Mostrar favoritos, ocultar galería
        this.gallery.root.style.display = "none";
        favorites.style.display = "grid";
        btn.textContent = "Ver galería";
      } else {
        // Mostrar galería, ocultar favoritos
        this.gallery.root.style.display = "grid";
        favorites.style.display = "none";
        btn.textContent = "Ver favoritos";
      }
    });
  }
}
