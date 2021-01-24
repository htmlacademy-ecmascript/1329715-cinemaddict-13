import {Menu as MenuView} from "../view/menu";
import {generateFilters} from "../mock/filter";
import {render, RENDER_POSITION} from "../util/view";
import {UpdateType} from "../util/const";

class Menu {
  constructor(container, filterModel, filmsModel) {
    this._container = container;
    this._filtersModel = filterModel;
    this._filmsModel = filmsModel;

    this._activeFilter = null;
    this._menuView = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterChange = this._handleFilterChange.bind(this);

    this._filtersModel.addObserver(this._handleModelEvent);
    this._filmsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._activeFilter = this._filtersModel.activeFilter;
    if (this._menuView) {
      this._menuView.destroy();
    }
    this._menuView = new MenuView(generateFilters(this._filmsModel.films), this._activeFilter);
    this._menuView.setFilterChangeHandler(this._handleFilterChange);
    render(this._container, this._menuView, RENDER_POSITION.AFTER_BEGIN);
  }

  _handleModelEvent(updateType) {
    switch (updateType) {
      case UpdateType.FILTER:
      case UpdateType.USER_INFO:
        this.init();
        break;
    }
  }

  _handleFilterChange(filterType) {
    if (this._activeFilter !== filterType) {
      this._filtersModel.activeFilter = filterType;
    }
  }
}

export {Menu};
