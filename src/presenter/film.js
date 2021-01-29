import {FilmCard as FilmCardView} from "../view/film-card";
import {render, RENDER_POSITION} from "../util/view";
import {deepCopyFilm} from "../util/common";
import {ButtonType, ActionType} from "../util/const";

class Film {
  constructor(container, openPopupHandler, viewActionHandler) {
    this._container = container;
    this._openPopupHandler = openPopupHandler;
    this._viewActionHandler = viewActionHandler;

    this._clickWatchlistHandler = this._clickWatchlistHandler.bind(this);
    this._clickWatchedHandler = this._clickWatchedHandler.bind(this);
    this._clickFavoriteHandler = this._clickFavoriteHandler.bind(this);
  }

  init(film) {
    this._film = film;
    this._filmCardView = new FilmCardView(this._film);
    this.setHandlers();
    render(this._container, this._filmCardView, RENDER_POSITION.BEFORE_END);
  }

  setHandlers() {
    this._filmCardView.setOpenPopupHandler(this._openPopupHandler);
    this._filmCardView.setClickWatchlistHandler(this._clickWatchlistHandler);
    this._filmCardView.setClickWatchedHandler(this._clickWatchedHandler);
    this._filmCardView.setClickFavoriteHandler(this._clickFavoriteHandler);
  }

  _clickWatchlistHandler() {
    const newFilm = deepCopyFilm(this._film);
    newFilm.userDetails.watchlist = !this._film.userDetails.watchlist;
    this._viewActionHandler(ActionType.USER_INFO, newFilm);
  }

  _clickWatchedHandler() {
    const newFilm = deepCopyFilm(this._film);
    newFilm.userDetails.alreadyWatched = !this._film.userDetails.alreadyWatched;
    this._viewActionHandler(ActionType.USER_INFO, newFilm);
  }

  _clickFavoriteHandler() {
    const newFilm = deepCopyFilm(this._film);
    newFilm.userDetails.favorite = !this._film.userDetails.favorite;
    this._viewActionHandler(ActionType.USER_INFO, newFilm);
  }

  update(newFilm, isReload) {
    if (!isReload) {
      const isWatchlistChanged = this._film.userDetails.watchlist !== newFilm.userDetails.watchlist;
      const isWatchedChanged = this._film.userDetails.alreadyWatched !== newFilm.userDetails.alreadyWatched;
      const isFavoriteChanged = this._film.userDetails.favorite !== newFilm.userDetails.favorite;
      if (isWatchlistChanged) {
        this._filmCardView.toggleButton(ButtonType.WATCHLIST);
      } else if (isWatchedChanged) {
        this._filmCardView.toggleButton(ButtonType.WATCHED);
      } else if (isFavoriteChanged) {
        this._filmCardView.toggleButton(ButtonType.FAVORITE);
      }
    }
    this._film = newFilm;
    this._filmCardView.updateState(newFilm, isReload);
  }
}

export {Film};
