import dayjs from "dayjs";
import {humanizeFilmDuration} from "../util/view";
import {Smart as SmartView} from "./smart";
import {ButtonType} from "../util/const";

const SHORT_DESCRIPTION_LENGTH = 140;

const createFilmCard = (film) => {
  const {
    comments,
    filmInfo: {poster, title, rating, release: {date}, runtime},
    userDetails: {watchlist, alreadyWatched, favorite}
  } = film;
  const commentsQuantity = comments.length;
  const genre = film.filmInfo.genre[0];
  let description = film.filmInfo.description;
  if (description.length > SHORT_DESCRIPTION_LENGTH) {
    description = `${description.slice(SHORT_DESCRIPTION_LENGTH - 1)}...`;
  }
  const duration = humanizeFilmDuration(runtime);
  const activeButtonClass = `film-card__controls-item--active`;
  return `<article class="film-card">
          <h3 class="film-card__title">${title}</h3>
          <p class="film-card__rating">${rating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${dayjs(date).get(`year`)}</span>
            <span class="film-card__duration">${duration}</span>
            <span class="film-card__genre">${genre}</span>
          </p>
          <img src="${poster}" alt="" class="film-card__poster">
          <p class="film-card__description">${description}</p>
          <a class="film-card__comments">${commentsQuantity} comment${commentsQuantity > 1 ? `s` : ``}</a>
          <div class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${watchlist ? activeButtonClass : ``}" type="button">Add to watchlist</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${alreadyWatched ? activeButtonClass : ``}" type="button">Mark as watched</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite ${favorite ? activeButtonClass : ``}" type="button">Mark as favorite</button>
          </div>
        </article>`;
};

class FilmCard extends SmartView {
  constructor(film) {
    super(film);
    this._openPopupHandler = this._openPopupHandler.bind(this);
    this._clickWatchlistHandler = this._clickWatchlistHandler.bind(this);
    this._clickWatchedHandler = this._clickWatchedHandler.bind(this);
    this._clickFavoriteHandler = this._clickFavoriteHandler.bind(this);
  }

  getTemplate() {
    return createFilmCard(this._state);
  }

  _openPopupHandler(evt) {
    evt.preventDefault();
    this._callback.openPopupHandler(this._state);
  }

  setOpenPopupHandler(cb) {
    this._callback.openPopupHandler = cb;
    this.element.querySelector(`.film-card__poster`).addEventListener(`click`, this._openPopupHandler);
    this.element.querySelector(`.film-card__title`).addEventListener(`click`, this._openPopupHandler);
    this.element.querySelector(`.film-card__comments`).addEventListener(`click`, this._openPopupHandler);
  }

  _clickWatchlistHandler(evt) {
    evt.preventDefault();
    this._callback.clickWatchlist();
  }

  setClickWatchlistHandler(cb) {
    this._callback.clickWatchlist = cb;
    this.element.querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, this._clickWatchlistHandler);
  }

  _clickWatchedHandler(evt) {
    evt.preventDefault();
    this._callback.clickWatched();
  }

  setClickWatchedHandler(cb) {
    this._callback.clickWatched = cb;
    this.element.querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, this._clickWatchedHandler);
  }

  _clickFavoriteHandler(evt) {
    evt.preventDefault();
    this._callback.clickFavorite();
  }

  setClickFavoriteHandler(cb) {
    this._callback.clickFavorite = cb;
    this.element.querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, this._clickFavoriteHandler);
  }

  restoreHandlers() {
    this.element.querySelector(`.film-card__poster`).addEventListener(`click`, this._openPopupHandler);
    this.element.querySelector(`.film-card__title`).addEventListener(`click`, this._openPopupHandler);
    this.element.querySelector(`.film-card__comments`).addEventListener(`click`, this._openPopupHandler);
    this.element.querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, this._clickWatchlistHandler);
    this.element.querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, this._clickWatchedHandler);
    this.element.querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, this._clickFavoriteHandler);
  }

  toggleButton(buttonType) {
    let selector = ``;
    switch (buttonType) {
      case ButtonType.WATCHLIST:
        selector = `film-card__controls-item--add-to-watchlist`;
        break;
      case ButtonType.WATCHED:
        selector = `film-card__controls-item--mark-as-watched`;
        break;
      case ButtonType.FAVORITE:
        selector = `film-card__controls-item--favorite`;
        break;
    }
    this.element.querySelector(`.${selector}`).classList.toggle(`film-card__controls-item--active`);
  }
}

export {FilmCard};
