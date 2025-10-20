export class Modal {
  constructor() {
    // Creamos el contenedor que servirá de overlay
    this.modal = document.createElement("div");
    this.modal.classList.add("cat-modal");
    document.body.appendChild(this.modal);

    this.currentCard = null;
  }

  show(cat, card) {
    if (!cat.breeds || cat.breeds.length === 0) return;

    const breed = cat.breeds[0];
    this.currentCard = card;

    // Creamos el contenido dinámicamente
    this.modal.innerHTML = `
      <div class="cat-modal-content">
        <h4>${breed.name || "Desconocido"}</h4>
        <p><strong>Origen:</strong> ${breed.origin || "?"}</p>
        <p><strong>Temperamento:</strong> ${breed.temperament || "No disponible"}</p>
      </div>
    `;

    // Posicionamos el modal sobre la card
    const rect = card.getBoundingClientRect();
    this.modal.style.top = `${rect.bottom - rect.height / 3}px`;
    this.modal.style.left = `${rect.left}px`;
    this.modal.style.width = `${rect.width}px`;
    this.modal.style.height = `${rect.height / 3}px`;
    this.modal.classList.add("visible");
  }

  hide() {
    this.modal.classList.remove("visible");
    this.currentCard = null;
  }
}
