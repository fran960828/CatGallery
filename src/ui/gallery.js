/**
 * Componente Gallery
 * - Renderiza tarjetas de imágenes de gatos
 * - Gestiona el paginado (page)
 * - Maneja favoritos (delegando en FavoritesStorage) y actualiza los botones
 * - Muestra modal con información de la raza al pasar el ratón por una tarjeta
 *
 * Constructor:
 *  new Gallery(rootElement, catApi, favoritesStorage, favoriteComponent, notification)
 */
import { Modal } from "./modal";

export class Gallery {
  constructor(root, catApi, favoritesStorage, favorite, Notification) {
    this.root = root; // nodo contenedor de la galería
    this.catApi = catApi; // servicio para obtener datos
    this.favoritesStorage = favoritesStorage; // almacenamiento local de favoritos
    this.favorite = favorite; // componente de favoritos para refrescarlo
    this.notification = Notification; // componente de notificaciones
    this.page = 0; // página de paginado actual

    // Inicializar comportamiento
    this.clearFavorites(); // engancha el botón de limpiar favoritos
    // Escucha global para actualizar el estado de los botones de favorito
    document.body.addEventListener("click", () => {
      this.updateFavoriteButtons();
    });

    // Modal para mostrar info de raza
    this.modal = new Modal();
  }

  /**
   * Carga imágenes desde la API y las renderiza.
   * @param {string|null} breedId - id de raza para filtrar (opcional)
   */
  async loadCats(breedId = null) {
    try {
      this.notification.show("Cargando gatos...", "info");
      const cats = await this.catApi.fetchCats({
        page: this.page,
        limit: 9,
        has_breeds: 1,
        breed_ids: breedId || null,
      });
      this.renderCats(cats);
      this.page++;
    } catch (error) {
      // Mostrar error al usuario
      this.notification.show("Error al cargar los gatos.", "error");
    } finally {
      // Limpiar notificación después de un pequeño delay
      setTimeout(() => {
        this.notification.clear();
      }, 500);
    }
  }

  /**
   * Renderiza una lista de gatos como tarjetas dentro del root.
   * Cada tarjeta contiene la imagen y el botón para marcar/desmarcar favorito.
   * @param {Array} cats
   */
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

      // Evento del botón favorito: alterna el estado y actualiza la UI
      card.querySelector(".fav-btn").addEventListener("click", (event) => {
        const btn = event.target;
        this.toggleFavorite(cat);
        this.checkFavorite(cat.id, btn);
      });

      // Mostrar modal con info de raza al entrar el ratón en la card
      card.addEventListener("mouseenter", () => this.modal.show(cat, card));
      card.addEventListener("mouseleave", () => this.modal.hide());

      this.root.appendChild(card);
    });
  }

  /**
   * Añade o elimina un gato de los favoritos usando FavoritesStorage.
   * @param {Object} cat
   */
  toggleFavorite(cat) {
    if (this.favoritesStorage.isFavorite(cat.id)) {
      this.favoritesStorage.remove(cat.id);
    } else {
      this.favoritesStorage.add(cat);
    }
  }

  /**
   * Actualiza el contenido del botón pasado según si el gato está en favoritos.
   * También solicita render de la lista de favoritos.
   * @param {string} catid
   * @param {HTMLElement} btn
   */
  checkFavorite(catid, btn) {
    if (this.favoritesStorage.isFavorite(catid)) {
      btn.textContent = "❤️";
      this.favorite.renderFavorites();
    } else {
      btn.textContent = "🤍";
      this.favorite.renderFavorites();
    }
  }

  /**
   * Recorre los botones presentes en la galería y ajusta su estado (❤️ / 🤍)
   * según el almacenamiento de favoritos.
   * Esto sirve cuando se modifica el storage desde otra vista.
   */
  updateFavoriteButtons() {
    const favorites = this.favoritesStorage.getAll();
    const allBtns = this.root.querySelectorAll(".fav-btn");
    allBtns.forEach((btn) => {
      const id = btn.dataset.id;
      btn.textContent = favorites.some((cat) => cat.id === id) ? "❤️" : "🤍";
    });
  }

  /**
   * Engancha el botón #clearFavoritesBtn para vaciar los favoritos.
   * Actualiza la UI de favoritos y los botones de la galería.
   */
  clearFavorites() {
    const btnClear = document.querySelector("#clearFavoritesBtn");
    btnClear.addEventListener("click", () => {
      this.favoritesStorage.removeAll();
      this.favorite.renderFavorites();
      this.updateFavoriteButtons();
    });
  }

  /**
   * Limpia el root de la galería y reinicia el paginado.
   */
  resetGallery() {
    this.root.innerHTML = "";
    this.page = 0;
  }
}
