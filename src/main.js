import {Menu as MenuView} from "./view/menu";
import {FilmsSection as FilmSectionView} from "./view/films-section";
import {FilmsContainer as FilmsContainerView} from "./view/films-container";
import {FilmCard as FilmCardView} from "./view/film-card";
import {UserInfo as UserInfoView} from "./view/user-info";
import {Sort as SortView} from "./view/sort";
import {ShowMoreButton as ShowMoreButtonView} from "./view/show-more-button";
import {DetailedInfoPopup as DetailedInfoPopupView} from "./view/detailed-info-popup";
import {FooterStats as FooterStatsView} from "./view/footer-stats";
import {TopRated as TopRatedView} from "./view/top-rated";
import {MostCommented as MostCommentedView} from "./view/most-commented";
import {generateFilm} from "./mock/film";
import {RENDER_POSITION, render} from "./util/view";
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

render(header, new UserInfoView(filmsMocks).getElement(), RENDER_POSITION.BEFORE_END);

render(main, new MenuView(generateFilters(filmsMocks)).getElement(), RENDER_POSITION.AFTER_BEGIN);
render(main, new SortView().getElement(), RENDER_POSITION.BEFORE_END);

const filmSectionElement = new FilmSectionView().getElement();
render(main, filmSectionElement, RENDER_POSITION.BEFORE_END);

const filmsList = filmSectionElement.querySelector(`.films-list`);
const filmListContainerElement = new FilmsContainerView().getElement();
render(filmsList, filmListContainerElement, RENDER_POSITION.AFTER_BEGIN);
let detailedInfoPopupView = null;

const renderPopup = (film) => {
  if (detailedInfoPopupView) {
    detailedInfoPopupView.destroy();
  }
  detailedInfoPopupView = new DetailedInfoPopupView(film);
  const detailedInfoPopupElement = detailedInfoPopupView.getElement();
  detailedInfoPopupElement.querySelector(`.film-details__close-btn`)
    .addEventListener(`click`, (evt) => {
      evt.preventDefault();
      closePopup();
    });
  render(footer, detailedInfoPopupElement, RENDER_POSITION.AFTER_END);
};

const closePopup = () => {
  if (detailedInfoPopupView) {
    detailedInfoPopupView.destroy();
    detailedInfoPopupView = null;
  }
};

const renderFilm = (container, film) => {
  const filmCardView = new FilmCardView(film);
  const filmCardElement = filmCardView.getElement();
  render(filmListContainerElement, filmCardElement, RENDER_POSITION.BEFORE_END);

  filmCardElement.querySelector(`.film-card__poster`).addEventListener(`click`, () => {
    renderPopup(film);
  });

  filmCardElement.querySelector(`.film-card__title`).addEventListener(`click`, () => {
    renderPopup(film);
  });

  filmCardElement.querySelector(`.film-card__comments`).addEventListener(`click`, (evt) => {
    evt.preventDefault();
    renderPopup(film);
  });
};

for (let i = 0; i < Math.min(FILM_QUANTITY_PER_STEP, filmsMocks.length); i++) {
  renderFilm(filmListContainerElement, filmsMocks[i]);
}

if (filmsMocks.length > FILM_QUANTITY_PER_STEP) {
  let shownFilmCardQuantity = FILM_QUANTITY_PER_STEP;
  const showMoreButtonView = new ShowMoreButtonView();
  const showMoreButtonElement = showMoreButtonView.getElement();
  render(filmsList, showMoreButtonElement, RENDER_POSITION.BEFORE_END);
  showMoreButtonElement.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    filmsMocks.slice(shownFilmCardQuantity, shownFilmCardQuantity + FILM_QUANTITY_PER_STEP)
      .forEach((film) => {
        renderFilm(filmListContainerElement, film);
      });

    shownFilmCardQuantity += FILM_QUANTITY_PER_STEP;
    if (shownFilmCardQuantity >= filmsMocks.length) {
      showMoreButtonView.destroy();
    }
  });
}
render(filmSectionElement, new TopRatedView(filmsMocks).getElement(), RENDER_POSITION.BEFORE_END);
render(filmSectionElement, new MostCommentedView(filmsMocks).getElement(), RENDER_POSITION.BEFORE_END);

render(footerStats, new FooterStatsView(filmsMocks).getElement(), RENDER_POSITION.AFTER_BEGIN);
