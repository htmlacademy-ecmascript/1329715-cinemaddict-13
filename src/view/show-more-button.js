import {AbstractView} from "./abstract-view";

const createShowMoreButtonTemplate = () => {
  return `<button class="films-list__show-more">Show more</button>`;
};

class ShowMoreButton extends AbstractView {
  constructor() {
    super();
    this._clickShowMoreHandler = this._clickShowMoreHandler.bind(this);
  }

  getTemplate() {
    return createShowMoreButtonTemplate();
  }

  _clickShowMoreHandler(evt) {
    evt.preventDefault();
    this._callback.clickShowMoreHadler();
  }

  setClickShowMoreHandler(cb) {
    this._callback.clickShowMoreHadler = cb;
    this.element.addEventListener(`click`, this._clickShowMoreHandler);
  }
}

export {ShowMoreButton};
