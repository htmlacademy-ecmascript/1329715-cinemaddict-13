import {capitalizeString} from "../util/common";
import {AbstractView} from "./abstract-view";

const createFilterTemplate = (filters) => {
  let filterTemplate = `<a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>`;
  for (let i = 1; i < filters.length; i++) {
    const {name, quantity} = filters[i];
    filterTemplate += `<a href="#${name}watchlist" class="main-navigation__item">${capitalizeString(name)} <span class="main-navigation__item-count">${quantity}</span></a>`;
  }
  return filterTemplate;
};

const createMenuTemplate = (filters) => {
  return `<nav class="main-navigation">
            <div class="main-navigation__items">
              <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
              ${createFilterTemplate(filters)}
            </div>
            <a href="#stats" class="main-navigation__additional">Stats</a>
          </nav>`;
};

class Menu extends AbstractView {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createMenuTemplate(this._filters);
  }
}

export {Menu};
