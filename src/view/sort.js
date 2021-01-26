import {AbstractView} from "./abstract-view";
import {SortType} from "../util/sort";

const ACTIVE_SORT_CLASS = `sort__button--active`;

const createSortTemplate = (currentSortType) => {
  return `<ul class="sort">
            <li><a href="#" class="sort__button ${currentSortType === SortType.DEFAULT ? ` sort__button--active` : ``}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
            <li><a href="#" class="sort__button ${currentSortType === SortType.RELEASE_DATE ? ` sort__button--active` : ``}" data-sort-type="${SortType.RELEASE_DATE}">Sort by date</a></li>
            <li><a href="#" class="sort__button ${currentSortType === SortType.RATED ? ` sort__button--active` : ``}" data-sort-type="${SortType.RATED}">Sort by rating</a></li>
          </ul>`;
};

class Sort extends AbstractView {
  constructor(currentSortType) {
    super();

    this._currentSortType = currentSortType;
    this._clickSortHandler = this._clickSortHandler.bind(this);
  }

  _clickSortHandler(evt) {
    if (evt.target.tagName === `A`) {
      evt.preventDefault();
      const currentChosenSortElement = this.element.querySelector(`.${ACTIVE_SORT_CLASS}`);
      if (currentChosenSortElement !== evt.target) {
        currentChosenSortElement.classList.remove(ACTIVE_SORT_CLASS);
        evt.target.classList.add(ACTIVE_SORT_CLASS);
        this._callback.clickSortType(evt.target.dataset.sortType);
      }
    }
  }

  setClickSortHandler(cb) {
    this._callback.clickSortType = cb;
    this.element.addEventListener(`click`, this._clickSortHandler);
  }

  getTemplate() {
    return createSortTemplate(this._currentSortType);
  }
}

export {Sort};
