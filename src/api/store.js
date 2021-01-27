class Store {
  constructor() {
    this._storage = window.localStorage;
  }

  getItems(key) {
    try {
      return JSON.parse(this._storage.getItem(key)) || [];
    } catch (err) {
      return [];
    }
  }

  setItems(key, items) {
    this._storage.setItem(key, JSON.stringify(items));
  }

  setItem(key, id, value) {
    const store = this.getItems(key);

    for (let i = 0; i < store.length; i++) {
      if (store[i].id === id) {
        store[i] = value;
        break;
      }
    }

    this.setItems(key, store);
  }
}

export {Store};
