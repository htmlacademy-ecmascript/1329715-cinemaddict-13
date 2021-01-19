import {AbstractView} from "./abstract-view";

const createListEmptyTemplate = () => {
  return `<h2 class="films-list__title">There are no movies in our database</h2>`;
};

class ListEmpty extends AbstractView {
  getTemplate() {
    return createListEmptyTemplate();
  }
}

export {ListEmpty};
