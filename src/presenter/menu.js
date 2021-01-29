import {Menu as MenuView} from "../view/menu";
import {generateFilters} from "../util/filter";
import {render, RENDER_POSITION} from "../util/view";
import {ActionType} from "../util/const";

class Menu {
  constructor(container, menuItemsModel, filmsModel) {
    this._container = container;
    this._menuItemsModel = menuItemsModel;
    this._filmsModel = filmsModel;

    this._activeMenuItem = null;
    this._menuView = null;

    this._modelEventHandler = this._modelEventHandler.bind(this);
    this._filterChangeHandler = this._filterChangeHandler.bind(this);

    this._menuItemsModel.addObserver(this._modelEventHandler);
    this._filmsModel.addObserver(this._modelEventHandler);
  }

  init() {
    this._activeMenuItem = this._menuItemsModel.activeMenuItem;
    if (this._menuView) {
      this._menuView.destroy();
    }
    this._menuView = new MenuView(generateFilters(this._filmsModel.films), this._activeMenuItem);
    this._menuView.setFilterChangeHandler(this._filterChangeHandler);
    render(this._container, this._menuView, RENDER_POSITION.AFTER_BEGIN);
  }

  _modelEventHandler(updateType) {
    switch (updateType) {
      case ActionType.FILTER:
      case ActionType.USER_INFO:
      case ActionType.STATS:
      case ActionType.INIT:
        this.init();
        break;
    }
  }

  _filterChangeHandler(filterType) {
    if (this._activeMenuItem !== filterType) {
      this._menuItemsModel.activeMenuItem = filterType;
    }
  }
}

export {Menu};
