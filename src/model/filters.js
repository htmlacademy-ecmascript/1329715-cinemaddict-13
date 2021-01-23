import {Observable} from "./observable";
import {FilterType, UpdateType} from "../util/const";

class Filters extends Observable {
  constructor() {
    super();
    this._filter = FilterType.ALL;
  }

  set activeFilter(filter) {
    this._filter = filter;
    this.notify(UpdateType.FILTER, filter);
  }

  get activeFilter() {
    return this._filter;
  }
}

export {Filters};
