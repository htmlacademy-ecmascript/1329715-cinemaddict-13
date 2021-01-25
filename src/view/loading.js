import {AbstractView} from "./abstract-view";

const createLoadingTemplate = () => {
  return `<h2 class="films-list__title">There are no movies in our database</h2>`;
};

class Loading extends AbstractView {
  getTemplate() {
    return createLoadingTemplate();
  }
}

export {Loading};
