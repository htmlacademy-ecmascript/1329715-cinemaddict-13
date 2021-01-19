import {Menu as MenuView} from "./view/menu";
import {FilmsSection as FilmSectionView} from "./view/films-section";
import {FilmsContainer as FilmsContainerView} from "./view/films-container";
import {FilmCard as FilmCardView} from "./view/film-card";
import {UserInfo as UserInfoView} from "./view/user-info";
import {Sort as SortView} from "./view/sort";
import {ShowMoreButton as ShowMoreButtonView} from "./view/show-more-button";
// import {DetailedInfoPopup as DetailedInfoPopupView} from "./view/detailed-info-popup";
import {FooterStats as FooterStatsView} from "./view/footer-stats";
import {TopRated as TopRatedView} from "./view/top-rated";
import {MostCommented as MostCommentedView} from "./view/most-commented";
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

render(header, new UserInfoView(filmsMocks).getElement(), PlaceType.BEFORE_END);

render(main, new MenuView(generateFilters(filmsMocks)).getElement(), PlaceType.AFTER_BEGIN);
render(main, new SortView().getElement(), PlaceType.BEFORE_END);

const filmSectionElement = new FilmSectionView().getElement();
render(main, filmSectionElement, PlaceType.BEFORE_END);

const filmsList = filmSectionElement.querySelector(`.films-list`);
const filmListContainerElement = new FilmsContainerView().getElement();
render(filmsList, filmListContainerElement, PlaceType.AFTER_BEGIN);

for (let i = 0; i < Math.min(FILM_QUANTITY_PER_STEP, filmsMocks.length); i++) {
  render(filmListContainerElement, new FilmCardView(filmsMocks[i]).getElement(), PlaceType.BEFORE_END);
}

if (filmsMocks.length > FILM_QUANTITY_PER_STEP) {
  let shownFilmCardQuantity = FILM_QUANTITY_PER_STEP;
  const showMoreButtonView = new ShowMoreButtonView();
  const showMoreButtonElement = showMoreButtonView.getElement();
  render(filmsList, showMoreButtonElement, PlaceType.BEFORE_END);
  showMoreButtonElement.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    filmsMocks.slice(shownFilmCardQuantity, shownFilmCardQuantity + FILM_QUANTITY_PER_STEP)
      .forEach((film) => render(filmListContainerElement, new FilmCardView(film).getElement(), PlaceType.BEFORE_END));

    shownFilmCardQuantity += FILM_QUANTITY_PER_STEP;
    if (shownFilmCardQuantity >= filmsMocks.length) {
      showMoreButtonView.destroy();
    }
  });
}
render(filmSectionElement, new TopRatedView(filmsMocks).getElement(), PlaceType.BEFORE_END);
render(filmSectionElement, new MostCommentedView(filmsMocks).getElement(), PlaceType.BEFORE_END);

// render(footer, new DetailedInfoPopupView(filmsMocks[0]).getElement(), PlaceType.AFTER_END);
render(footerStats, new FooterStatsView(filmsMocks).getElement(), PlaceType.AFTER_BEGIN);
