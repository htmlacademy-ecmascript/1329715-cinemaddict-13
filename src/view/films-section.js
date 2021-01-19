import {AbstractView} from "./abstract-view";

const createFilmsSection = () => {
  return `<section class="films">
            <section class="films-list">
            </section>
          </section>`;
};

class FilmsSection extends AbstractView {
  getTemplate() {
    return createFilmsSection();
  }
}

export {FilmsSection};
