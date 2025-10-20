export class Notificacion {
  constructor(container) {
    this.container = container;
    this.messageEl = null;
  }

  show(message, type = "info") {
    this.clear(); // Limpia si ya existe otra notificación

    this.messageEl = document.createElement("div");
    this.messageEl.className = `notificacion notificacion--${type}`;
    this.messageEl.textContent = message;

    this.container.prepend(this.messageEl);
  }

  clear() {
    if (this.messageEl && this.container.contains(this.messageEl)) {
      this.container.removeChild(this.messageEl);
      this.messageEl = null;
    }
  }
}
