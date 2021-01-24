import {AbstractView} from "./abstract-view";

class Smart extends AbstractView {
  constructor(state) {
    super();

    this._state = state;
  }

  updateState(newState, isReload) {
    this._state = newState;
    if (isReload) {
      this.updateElement();
    }
  }

  updateElement() {
    const oldElement = this.element;
    const parent = oldElement.parentElement;
    this.removeElement();
    const newElement = this.element;
    parent.replaceChild(newElement, oldElement);
    this.restoreHandlers();
  }

  restoreHandlers() {
    throw new Error(`Must be implemented`);
  }
}

export {Smart};
