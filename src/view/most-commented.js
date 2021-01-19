import {createFilmCardsForExtra} from "./film-card";
import {sort} from "../util/sort";

const createMostCommentedTemplate = (films) => {
  films = sort.commented(films);
  return `<section class="films-list films-list--extra">
            <h2 class="films-list__title">Most commented</h2>

            <div class="films-list__container">
            ${createFilmCardsForExtra(films)}
            </div>
          </section>`;
};

export {createMostCommentedTemplate};
