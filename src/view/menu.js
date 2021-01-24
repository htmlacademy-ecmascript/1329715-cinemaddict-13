import {capitalizeString} from "../util/common";
import {AbstractView} from "./abstract-view";
import {FilterType} from "../util/const";

const createFilterTemplate = (filters, activeFilter) => {
  const filterTypes = Object.values(FilterType);
  let filterTemplate = `<a href="#all" class="main-navigation__item ${activeFilter === FilterType.ALL ? `main-navigation__item--active` : ``}" data-filter-type="${filterTypes[0]}">All movies</a>`;
  for (let i = 1; i < filters.length; i++) {
    const {name, quantity} = filters[i];
    filterTemplate += `<a href="#${name}watchlist" class="main-navigation__item ${activeFilter === filterTypes[i] ? `main-navigation__item--active` : ``}" data-filter-type="${filterTypes[i]}">${capitalizeString(name)} <span class="main-navigation__item-count">${quantity}</span></a>`;
  }
  return filterTemplate;
};

const createMenuTemplate = (filters, activeFilter) => {
  return `<nav class="main-navigation">
            <div class="main-navigation__items">
              ${createFilterTemplate(filters, activeFilter)}
            </div>
            <a href="#stats" class="main-navigation__additional">Stats</a>
          </nav>`;
};

class Menu extends AbstractView {
  constructor(filters, activeFilter) {
    super();
    this._filters = filters;
    this._activeFilter = activeFilter;

    this._filterChangeHandler = this._filterChangeHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate(this._filters, this._activeFilter);
  }

  _filterChangeHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName === `A`) {
      this._callback.clickFilter(evt.target.dataset.filterType);
    }
  }

  setFilterChangeHandler(cb) {
    this._callback.clickFilter = cb;
    this.element.querySelector(`.main-navigation__items`).addEventListener(`click`, this._filterChangeHandler);
  }
}

export {Menu};
