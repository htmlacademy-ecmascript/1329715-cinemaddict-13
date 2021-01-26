import {AbstractView} from "./abstract-view";

const createFilmsContainer = () => {
  return `<div class="films-list__container">
          </div>`;
};

class FilmsContainer extends AbstractView {
  getTemplate() {
    return createFilmsContainer();
  }
}

export {FilmsContainer};
