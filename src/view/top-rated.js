import {createFilmCardsForExtra} from "./film-card";
import {sort} from "../util/sort";
import {AbstractView} from "./abstract-view";

const createTopRatedTemplate = (films) => {
  films = sort.rated(films);
  return `<section class="films-list films-list--extra">
            <h2 class="films-list__title">Top rated</h2>

            <div class="films-list__container">
            ${createFilmCardsForExtra(films)}
            </div>
          </section>`;
};

class TopRated extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }
  getTemplate() {
    return createTopRatedTemplate(this._films);
  }
}

export {TopRated};
