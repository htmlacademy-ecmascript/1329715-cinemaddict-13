import {createElement} from "../util/view";

class AbstractView {
  constructor() {
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  destroy() {
    this._element.remove();
    this.removeElement();
  }

  getTemplate() {
    throw new Error(`This method must be implemented.`);
  }
}

export {AbstractView};
