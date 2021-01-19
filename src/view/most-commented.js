import {AbstractView} from "./abstract-view";

const createMostCommentedTemplate = () => {
  return `<section class="films-list films-list--extra">
            <h2 class="films-list__title">Most commented</h2>

            <div class="films-list__container">
            </div>
          </section>`;
};

class MostCommented extends AbstractView {
  getTemplate() {
    return createMostCommentedTemplate();
  }
}

export {MostCommented};
