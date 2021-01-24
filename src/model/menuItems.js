import {Observable} from "./observable";
import {MenuType, ActionType} from "../util/const";

class MenuItems extends Observable {
  constructor() {
    super();
    this._menuItem = MenuType.ALL;
  }

  set activeMenuItem(menuItem) {
    this._menuItem = menuItem;
    let updateType = ActionType.FILTER;
    if (menuItem === MenuType.STATS) {
      updateType = ActionType.STATS;
    }
    this.notify(updateType, menuItem);
  }

  get activeMenuItem() {
    return this._menuItem;
  }
}

export {MenuItems};
