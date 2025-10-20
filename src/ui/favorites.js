export class Favorite {
  constructor(root, favoritesStorage) {
    this.root = root;
    this.favoritesStorage = favoritesStorage;
  }
  renderFavorites() {
    this.root.innerHTML = "";
    const favorites = this.favoritesStorage.getAll();
    favorites.forEach((cat) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${cat.url}" alt="Cat" />
        <button class="remove-fav-btn" data-id="${cat.id}">
          ❌
      `;
      card
        .querySelector(".remove-fav-btn")
        .addEventListener("click", (event) => {
          const btn = event.target;
          this.favoritesStorage.remove(cat.id);
          this.renderFavorites();
        });
      this.root.appendChild(card);
    });
  }
}
