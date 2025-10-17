

export class Gallery {
  constructor(root, catApi, favoritesStorage) {
    this.root = root;
    this.catApi = catApi;
    this.favoritesStorage = favoritesStorage;
    this.page = 0;
  }

  async loadCats() {
    const cats = await this.catApi.fetchCats({ page: this.page, limit: 9 ,});
    this.renderCats(cats);
    this.page++;
  }

  renderCats(cats) {
    cats.forEach(cat => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${cat.url}" alt="Cat" />
        <button class="fav-btn" data-id="${cat.id}">
          ${this.favoritesStorage.isFavorite(cat.id) ? '❤️' : '🤍'}
        </button>
      `;
      card.querySelector('.fav-btn').addEventListener('click', () => {
        this.toggleFavorite(cat);
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
