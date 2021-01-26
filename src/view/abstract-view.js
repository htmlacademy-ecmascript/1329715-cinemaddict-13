import {createElement} from "../util/view";

class AbstractView {
  constructor() {
    if (new.target === AbstractView) {
      throw new Error(`Abstract class can be created.`);
    }
    this._element = null;
    this._callback = {};
  }

  get element() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  destroy() {
    if (this._element) {
      this._element.remove();
      this.removeElement();
    }
  }

  getTemplate() {
    throw new Error(`This method must be implemented.`);
  }
}

export {AbstractView};
