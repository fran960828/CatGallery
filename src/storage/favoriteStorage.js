export class FavoritesStorage {
  constructor(key = "favorites") {
    this.key = key;
  }

  getAll() {
    try {
      return JSON.parse(localStorage.getItem(this.key)) || [];
    } catch {
      return [];
    }
  }

  save(list) {
    localStorage.setItem(this.key, JSON.stringify(list));
  }

  add(cat) {
    const list = this.getAll();
    if (!list.some((item) => item.id === cat.id)) {
      list.unshift(cat);
      this.save(list);
    }
  }

  remove(id) {
    const list = this.getAll().filter((item) => item.id !== id);
    this.save(list);
  }
  removeAll() {
    localStorage.removeItem(this.key);
  }

  isFavorite(id) {
    return this.getAll().some((item) => item.id === id);
  }
}
