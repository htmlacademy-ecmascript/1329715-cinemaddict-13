import {createMenuTemplate} from "./view/menu";
import {createFilmsSection} from "./view/films-section";
import {createFilmsContainer} from "./view/films-container";
import {createFilmCard} from "./view/film-card";
import {createUserInfoTemplate} from "./view/user-info";
import {createSortTemplate} from "./view/sort";
import {createShowMoreButtonTemplate} from "./view/show-more-button";
// import {createDetailedInfoPopupTemplate} from "./view/detailed-info-popup";
import {createFooterStats} from "./view/footer-stats";
import {createTopRatedTemplate} from "./view/top-rated";
import {createMostCommentedTemplate} from "./view/most-commented";
import {generateFilm} from "./mock/film";
import {PlaceType, render} from "./util/view";
import {generateFilters} from "./mock/filter";
import {FILM_QUANTITY, FILM_QUANTITY_PER_STEP} from "./util/const";

const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
const footer = document.querySelector(`.footer`);
const footerStats = footer.querySelector(`.footer__statistics`);

const filmsMocks = [];
for (let i = 0; i < FILM_QUANTITY; i++) {
  filmsMocks.push(generateFilm());
}

render(header, createUserInfoTemplate(filmsMocks), PlaceType.BEFORE_END);

render(main, createMenuTemplate(generateFilters(filmsMocks)), PlaceType.AFTER_BEGIN);
render(main, createSortTemplate(), PlaceType.BEFORE_END);

render(main, createFilmsSection(), PlaceType.BEFORE_END);

const films = main.querySelector(`.films`);
const filmsList = films.querySelector(`.films-list`);
render(filmsList, createFilmsContainer(), PlaceType.AFTER_BEGIN);

const filmsContainer = main.querySelector(`.films-list__container`);
for (let i = 0; i < Math.min(FILM_QUANTITY_PER_STEP, filmsMocks.length); i++) {
  render(filmsContainer, createFilmCard(filmsMocks[i]), PlaceType.BEFORE_END);
}

if (filmsMocks.length > FILM_QUANTITY_PER_STEP) {
  let shownFilmCardQuantity = FILM_QUANTITY_PER_STEP;
  render(filmsContainer, createShowMoreButtonTemplate(), PlaceType.AFTER_END);
  const loadMoreButton = main.querySelector(`.films-list__show-more`);
  loadMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    filmsMocks.slice(shownFilmCardQuantity, shownFilmCardQuantity + FILM_QUANTITY_PER_STEP)
      .forEach((film) => render(filmsContainer, createFilmCard(film), PlaceType.BEFORE_END));

    shownFilmCardQuantity += FILM_QUANTITY_PER_STEP;
    if (shownFilmCardQuantity >= filmsMocks.length) {
      loadMoreButton.remove();
    }
  });
}
render(films, createTopRatedTemplate(filmsMocks), PlaceType.BEFORE_END);
render(films, createMostCommentedTemplate(filmsMocks), PlaceType.BEFORE_END);

// render(footer, createDetailedInfoPopupTemplate(filmsMocks[0]), PlaceType.AFTER_END);
render(footerStats, createFooterStats(filmsMocks), PlaceType.AFTER_BEGIN);
