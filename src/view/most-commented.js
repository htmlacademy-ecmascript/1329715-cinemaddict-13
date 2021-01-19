import {createFilmCardsForExtra} from "./film-card";
import {sort} from "../util/sort";
import {AbstractView} from "./abstract-view";

const createMostCommentedTemplate = (films) => {
  films = sort.commented(films);
  return `<section class="films-list films-list--extra">
            <h2 class="films-list__title">Most commented</h2>

            <div class="films-list__container">
            ${createFilmCardsForExtra(films)}
            </div>
          </section>`;
};

class MostCommented extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }
  getTemplate() {
    return createMostCommentedTemplate(this._films);
  }
}

export {MostCommented};
