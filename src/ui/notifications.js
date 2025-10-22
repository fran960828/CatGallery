/**
 * Componente simple de notificaciones que renderiza mensajes dentro de un contenedor.
 * - show(message, type): añade el mensaje (info|error)
 * - clear(): elimina la notificación actual
 *
 * Se utiliza para informar al usuario de estados de carga / error.
 */
export class Notificacion {
  constructor(container) {
    this.container = container; // nodo donde se insertan las notificaciones
    this.messageEl = null; // referencia al elemento de notificación actual
  }

  /**
   * Muestra una notificación. Si ya existe una, la limpia antes.
   * @param {string} message
   * @param {string} [type='info'] - formato de la notificación (naming: notificacion--info | notificacion--error)
   */
  show(message, type = "info") {
    this.clear(); // Limpia si ya existe otra notificación

    this.messageEl = document.createElement("div");
    this.messageEl.className = `notificacion notificacion--${type}`;
    this.messageEl.textContent = message;

    // Prepend para mostrar la notificación en la parte superior del contenedor
    this.container.prepend(this.messageEl);
  }

  /**
   * Elimina la notificación actual si existe.
   */
  clear() {
    if (this.messageEl && this.container.contains(this.messageEl)) {
      this.container.removeChild(this.messageEl);
      this.messageEl = null;
    }
  }
}
