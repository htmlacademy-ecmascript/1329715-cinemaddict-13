import {AbstractView} from "./abstract-view";

const createTopRatedTemplate = () => {
  return `<section class="films-list films-list--extra">
            <h2 class="films-list__title">Top rated</h2>

            <div class="films-list__container">
            </div>
          </section>`;
};

class TopRated extends AbstractView {
  getTemplate() {
    return createTopRatedTemplate();
  }
}

export {TopRated};
