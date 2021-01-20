import {FilmCard as FilmCardView} from "../view/film-card";
import {render, RENDER_POSITION, replace} from "../util/view";

class Film {
  constructor(container, openPopupHandler, handleChangeFilm) {
    this._container = container;
    this._openPopupHandler = openPopupHandler;

    this._handleChangeFilm = handleChangeFilm;

    this._handleClickWatchlist = this._handleClickWatchlist.bind(this);
  }

  init(film) {
    this._film = film;

    this._filmCardView = new FilmCardView(this._film);
    this.setHandlers();
    // this._filmCardView.setClickWatchedHandler();
    // this._filmCardView.setClickFavoriteHandler();

    render(this._container, this._filmCardView, RENDER_POSITION.BEFORE_END);
  }

  setHandlers() {
    this._filmCardView.setOpenPopupHandler(this._openPopupHandler);
    this._filmCardView.setClickWatchlistHandler(this._handleClickWatchlist);
  }

  _handleClickWatchlist() {
    // this._filmCardView.element.querySelector(`.film-card__controls-item--add-to-watchlist`).classList.toggle(`film-card__controls-item--active`);
    // TODO Add toggleWatchlist() to cardView.
    const newFilm = Object.assign({}, this._film);
    newFilm.userDetails.watchlist = !this._film.userDetails.watchlist;
    this._handleChangeFilm(newFilm);
  }

  update(newFilm) {
    this._film = newFilm;
  }
}

export {Film};
