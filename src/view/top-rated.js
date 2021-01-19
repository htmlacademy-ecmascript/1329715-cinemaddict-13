import {createFilmCardsForExtra} from "./film-card";
import {sort} from "../util/sort";

const createTopRatedTemplate = (films) => {
  films = sort.rated(films);
  return `<section class="films-list films-list--extra">
            <h2 class="films-list__title">Top rated</h2>

            <div class="films-list__container">
            ${createFilmCardsForExtra(films)}
            </div>
          </section>`;
};

export {createTopRatedTemplate};
