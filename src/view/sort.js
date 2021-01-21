import {AbstractView} from "./abstract-view";
import {SortType} from "../util/sort";

const ACTIVE_SORT_CLASS = `sort__button--active`;

const createSortTemplate = () => {
  return `<ul class="sort">
            <li><a href="#" class="sort__button sort__button--active" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
            <li><a href="#" class="sort__button" data-sort-type="${SortType.RELEASE_DATE}">Sort by date</a></li>
            <li><a href="#" class="sort__button" data-sort-type="${SortType.RATED}">Sort by rating</a></li>
          </ul>`;
};

class Sort extends AbstractView {
  constructor() {
    super();

    this._clickSortHandler = this._clickSortHandler.bind(this);
  }

  _clickSortHandler(evt) {
    if (evt.target.tagName === `A`) {
      evt.preventDefault();
      const currentChosenSortElement = this.element.querySelector(`.${ACTIVE_SORT_CLASS}`);
      currentChosenSortElement.classList.toggle(ACTIVE_SORT_CLASS);
      evt.target.classList.toggle(ACTIVE_SORT_CLASS);
      this._callback.clickSortType(evt.target.dataset.sortType);
    }
  }

  setClickSortHandler(cb) {
    this._callback.clickSortType = cb;
    this.element.addEventListener(`click`, this._clickSortHandler);
  }

  getTemplate() {
    return createSortTemplate();
  }
}

export {Sort};
