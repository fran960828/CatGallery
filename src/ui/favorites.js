/**
 * Componente que renderiza la lista de favoritos desde FavoritesStorage.
 * - renderFavorites(): vuelve a renderizar todo el contenedor con los favoritos actuales
 * - Cada tarjeta tiene un botón para eliminar el favorito y muestra el modal al hover.
 */
import { Modal } from "./modal";
export class Favorite {
  constructor(root, favoritesStorage) {
    this.root = root; // contenedor donde se insertan las tarjetas
    this.favoritesStorage = favoritesStorage; // acceso al almacenamiento de favoritos
    this.modal = new Modal();
  }

  /**
   * Renderiza las tarjetas de favoritos en el root.
   * Cada tarjeta incluye un botón ❌ para eliminar el favorito.
   */
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
      // Evento para eliminar el favorito específico
      card
        .querySelector(".remove-fav-btn")
        .addEventListener("click", (event) => {
          const btn = event.target;
          this.favoritesStorage.remove(cat.id);
          this.renderFavorites(); // refrescar la lista
          this.modal.hide(); // asegurar que el modal no quede visible
        });

      // Mostrar modal con información de la raza al entrar el ratón en la card
      card.addEventListener("mouseenter", () => this.modal.show(cat, card));
      card.addEventListener("mouseleave", () => this.modal.hide());

      this.root.appendChild(card);
    });
  }
  
}
