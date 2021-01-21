import {FilmCard as FilmCardView} from "../view/film-card";
import {render, RENDER_POSITION, replace} from "../util/view";
import {ButtonType} from "../util/const";

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
    this._filmCardView.toggleButton(ButtonType.WATCHLIST);
    const newFilm = Object.assign({}, this._film);
    newFilm.userDetails.watchlist = !this._film.userDetails.watchlist;
    this._handleChangeFilm(newFilm, false);
  }

  _handleClickWatched() {
    this._filmCardView.toggleButton(ButtonType.WATCHED);
    const newFilm = Object.assign({}, this._film);
    newFilm.userDetails.alreadyWatched = !this._film.userDetails.alreadyWatched;
    this._handleChangeFilm(newFilm, false);
  }

  _handleClickFavorite() {
    this._filmCardView.toggleButton(ButtonType.FAVORITE);
    const newFilm = Object.assign({}, this._film);
    newFilm.userDetails.favorite = !this._film.userDetails.favorite;
    this._handleChangeFilm(newFilm, false);
  }

  update(newFilm, isReload) {
    this._film = newFilm;
    if (isReload) {
      const oldCardView = this._filmCardView;
      this._filmCardView = new FilmCardView(newFilm);
      replace(oldCardView, this._filmCardView);
      oldCardView.destroy();
      this.setHandlers();
    }
  }
}

export {Film};
