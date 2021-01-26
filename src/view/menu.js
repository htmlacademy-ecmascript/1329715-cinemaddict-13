import {capitalizeString} from "../util/common";
import {AbstractView} from "./abstract-view";
import {MenuType} from "../util/const";

const createFilterTemplate = (filters, activeMenuItem) => {
  const menuItems = Object.values(MenuType);
  let filterTemplate = `<a href="#all" class="main-navigation__item ${activeMenuItem === MenuType.ALL ? `main-navigation__item--active` : ``}" data-menu-item="${menuItems[0]}">All movies</a>`;
  for (let i = 1; i < filters.length; i++) {
    const {name, quantity} = filters[i];
    filterTemplate += `<a href="#${name}" class="main-navigation__item ${activeMenuItem === menuItems[i] ? `main-navigation__item--active` : ``}" data-menu-item="${menuItems[i]}">${capitalizeString(name)} <span class="main-navigation__item-count">${quantity}</span></a>`;
  }
  return filterTemplate;
};

const createMenuTemplate = (filters, activeMenuItem) => {
  return `<nav class="main-navigation">
            <div class="main-navigation__items">
              ${createFilterTemplate(filters, activeMenuItem)}
            </div>
            <a href="#stats" class="main-navigation__additional ${activeMenuItem === MenuType.STATS ? `main-navigation__item--active` : ``}" data-menu-item="${MenuType.STATS}">Stats</a>
          </nav>`;
};

class Menu extends AbstractView {
  constructor(filters, activeMenuItem) {
    super();
    this._filters = filters;
    this._activeMenuItem = activeMenuItem;

    this._filterChangeHandler = this._filterChangeHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate(this._filters, this._activeMenuItem);
  }

  _filterChangeHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName === `A`) {
      this._callback.clickFilter(evt.target.dataset.menuItem);
    }
  }

  setFilterChangeHandler(cb) {
    this._callback.clickFilter = cb;
    this.element.addEventListener(`click`, this._filterChangeHandler);
  }
}

export {Menu};
