import {AbstractView} from "./abstract-view";

const createFooterStats = (films) => {
  return `<p>${films.length} movies inside</p>`;
};

class FooterStats extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createFooterStats(this._films);
  }
}

export {FooterStats};
