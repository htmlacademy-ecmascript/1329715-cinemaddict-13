class Observable {
  constructor() {
    this._observerCallbacks = new Set();
  }

  addObserver(observerCb) {
    this._observerCallbacks.add(observerCb);
  }

  notify(event, payload, extraPayload) {
    this._observerCallbacks.forEach((cb) => cb(event, payload, extraPayload));
  }
}

export {Observable};
