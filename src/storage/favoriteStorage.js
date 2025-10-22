/**
 * Wrapper sencillo sobre localStorage para persistir favoritos.
 * - Guarda la lista como JSON bajo la key proporcionada (por defecto "favorites")
 * - Métodos: getAll, save, add, remove, removeAll, isFavorite
 *
 * Nota: los métodos gestionan errores de parseo/corrupto devolviendo lista vacía.
 */
export class FavoritesStorage {
  constructor(key = "favorites") {
    this.key = key;
  }

  /**
   * Obtiene el listado de favoritos desde localStorage.
   * Devuelve [] si no hay nada o si ocurre un error de parseo.
   */
  getAll() {
    try {
      return JSON.parse(localStorage.getItem(this.key)) || [];
    } catch {
      return [];
    }
  }

  /**
   * Guarda la lista pasada en localStorage.
   * @param {Array} list
   */
  save(list) {
    localStorage.setItem(this.key, JSON.stringify(list));
  }

  /**
   * Añade un gato al inicio de la lista si no existe aún.
   * @param {Object} cat
   */
  add(cat) {
    const list = this.getAll();
    if (!list.some((item) => item.id === cat.id)) {
      list.unshift(cat);
      this.save(list);
    }
  }

  /**
   * Elimina un favorito por id.
   * @param {string} id
   */
  remove(id) {
    const list = this.getAll().filter((item) => item.id !== id);
    this.save(list);
  }

  /**
   * Elimina completamente la entry del storage.
   */
  removeAll() {
    localStorage.removeItem(this.key);
  }

  /**
   * Comprueba si un id está en la lista de favoritos.
   * @param {string} id
   * @returns {boolean}
   */
  isFavorite(id) {
    return this.getAll().some((item) => item.id === id);
  }
}
