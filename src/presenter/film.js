import {FilmCard as FilmCardView} from "../view/film-card";
import {render, RENDER_POSITION} from "../util/view";
import {deepCopyFilm} from "../util/common";

class Film {
  constructor(container, openPopupHandler, handleChangeFilm) {
    this._container = container;
    this._openPopupHandler = openPopupHandler;

    this._handleChangeFilm = handleChangeFilm;

    this._handleClickWatchlist = this._handleClickWatchlist.bind(this);
    this._handleClickWatched = this._handleClickWatched.bind(this);
    this._handleClickFavorite = this._handleClickFavorite.bind(this);
  }

  init(film) {
    this._film = film;

    this._filmCardView = new FilmCardView(this._film);
    this.setHandlers();

    render(this._container, this._filmCardView, RENDER_POSITION.BEFORE_END);
  }

  setHandlers() {
    this._filmCardView.setOpenPopupHandler(this._openPopupHandler);
    this._filmCardView.setClickWatchlistHandler(this._handleClickWatchlist);
    this._filmCardView.setClickWatchedHandler(this._handleClickWatched);
    this._filmCardView.setClickFavoriteHandler(this._handleClickFavorite);
  }

  _handleClickWatchlist() {
    const newFilm = deepCopyFilm(this._film);
    newFilm.userDetails.watchlist = !this._film.userDetails.watchlist;
    this._handleChangeFilm(newFilm);
  }

  _handleClickWatched() {
    const newFilm = deepCopyFilm(this._film);
    newFilm.userDetails.alreadyWatched = !this._film.userDetails.alreadyWatched;
    this._handleChangeFilm(newFilm);
  }

  _handleClickFavorite() {
    const newFilm = deepCopyFilm(this._film);
    newFilm.userDetails.favorite = !this._film.userDetails.favorite;
    this._handleChangeFilm(newFilm);
  }

  update(newFilm, isReload) {
    this._film = newFilm;
    this._filmCardView.updateState(newFilm, isReload);
  }
}

export {Film};
