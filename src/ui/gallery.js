import { Modal } from "./modal";

export class Gallery {
  constructor(root, catApi, favoritesStorage, favorite, Notification) {
    this.root = root;
    this.catApi = catApi;
    this.favoritesStorage = favoritesStorage;
    this.favorite = favorite;
    this.notification = Notification;
    this.page = 0;
    this.favorite.root.addEventListener('click',()=>{
      this.updateFavoriteButtons();
    })
    this.modal=new Modal()
  }

  async loadCats() {
    try {
      this.notification.show("Cargando gatos...", "info");
      const cats = await this.catApi.fetchCats({ page: this.page, limit: 9 });
      this.renderCats(cats);
      this.page++;
    } catch (error) {
      this.notification.show("Error al cargar los gatos.", "error");
    } finally {
      setTimeout(() => {
        this.notification.clear();
      }, 500);
    }
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
        this.checkFavorite(cat.id, btn);
      });
      card.addEventListener("mouseenter", () => this.modal.show(cat, card));
      card.addEventListener("mouseleave", () => this.modal.hide());
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
  checkFavorite(catid, btn) {
    if (this.favoritesStorage.isFavorite(catid)) {
      btn.textContent = "❤️";
      this.favorite.renderFavorites();
    } else {
      btn.textContent = "🤍";
      this.favorite.renderFavorites();
    }
  }
  updateFavoriteButtons() {
    const favorites = this.favoritesStorage.getAll();
    const allBtns = this.root.querySelectorAll(".fav-btn");
    allBtns.forEach((btn) => {
      const id = btn.dataset.id;
      btn.textContent = favorites.some((cat) => cat.id === id) ? "❤️" : "🤍";
    });
  }
}
