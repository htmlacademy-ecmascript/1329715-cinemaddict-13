import {FilmCard as FilmCardView} from "../view/film-card";
import {render, RENDER_POSITION} from "../util/view";

class Film {
  constructor(container, openPopupHandler) {
    this._container = container;
    this._openPopupHandler = openPopupHandler;
  }

  init(film) {
    this._film = film;

    this._filmCardView = new FilmCardView(this._film);
    this._filmCardView.setOpenPopupHandler(this._openPopupHandler);

    render(this._container, this._filmCardView, RENDER_POSITION.BEFORE_END);
  }
}

export {Film};
