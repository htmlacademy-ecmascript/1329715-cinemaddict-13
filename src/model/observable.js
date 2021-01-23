class Observable {
  constructor() {
    this._observerCallbacks = new Set();
  }

  addObserver(observerCb) {
    this._observerCallbacks.add(observerCb);
  }

  removeObserver(observerCb) {
    this._observerCallbacks.delete(observerCb);
  }

  notify(event, payload) {
    this._observerCallbacks.forEach((cb) => cb());
  }
}

export {Observable};
