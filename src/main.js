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
import {render, RENDER_POSITION} from "./util/view";
import {generateFilters} from "./mock/filter";
import {FILM_QUANTITY, FILM_QUANTITY_EXTRA, FILM_QUANTITY_PER_STEP} from "./util/const";
import {sort} from "./util/sort";
import {ListEmpty} from "./view/list-empty";

const body = document.querySelector(`body`);
const header = body.querySelector(`.header`);
const main = body.querySelector(`.main`);
const footer = body.querySelector(`.footer`);
const footerStats = footer.querySelector(`.footer__statistics`);

const filmsMocks = [];
for (let i = 0; i < FILM_QUANTITY; i++) {
  filmsMocks.push(generateFilm());
}

render(header, new UserInfoView(filmsMocks), RENDER_POSITION.BEFORE_END);

render(main, new MenuView(generateFilters(filmsMocks)), RENDER_POSITION.AFTER_BEGIN);
render(main, new SortView(), RENDER_POSITION.BEFORE_END);

const filmSectionElement = new FilmSectionView();
render(main, filmSectionElement, RENDER_POSITION.BEFORE_END);

const filmsList = filmSectionElement.element.querySelector(`.films-list`);

const renderBoard = () => {
  const filmListContainerView = new FilmsContainerView();
  render(filmsList, filmListContainerView, RENDER_POSITION.AFTER_BEGIN);
  let detailedInfoPopupView = null;

  const closePopup = () => {
    body.classList.remove(`hide-overflow`);
    if (detailedInfoPopupView) {
      detailedInfoPopupView.destroy();
      detailedInfoPopupView = null;
    }
    document.removeEventListener(`keydown`, onEscKeydown);
  };

  const onEscKeydown = (evt) => {
    evt.preventDefault();
    if (evt.key === `Escape`) {
      closePopup();
    }
  };

  const renderPopup = (film) => {
    body.classList.add(`hide-overflow`);
    if (detailedInfoPopupView) {
      detailedInfoPopupView.destroy();
    }
    detailedInfoPopupView = new DetailedInfoPopupView(film);
    detailedInfoPopupView.setClickCloseButtonHandler(() => closePopup());
    document.addEventListener(`keydown`, onEscKeydown);
    render(footer, detailedInfoPopupView, RENDER_POSITION.AFTER_END);
  };

  const renderFilm = (container, film) => {
    const filmCardView = new FilmCardView(film);
    filmCardView.setOpenPopupHandler(() => renderPopup(film));
    render(container, filmCardView, RENDER_POSITION.BEFORE_END);
  };

  for (let i = 0; i < Math.min(FILM_QUANTITY_PER_STEP, filmsMocks.length); i++) {
    renderFilm(filmListContainerView, filmsMocks[i]);
  }

  // SHOW MORE BUTTON
  if (filmsMocks.length > FILM_QUANTITY_PER_STEP) {
    let shownFilmCardQuantity = FILM_QUANTITY_PER_STEP;
    const showMoreButtonView = new ShowMoreButtonView();
    showMoreButtonView.setClickShowMoreHandler(() => {
      filmsMocks.slice(shownFilmCardQuantity, shownFilmCardQuantity + FILM_QUANTITY_PER_STEP)
        .forEach((film) => {
          renderFilm(filmListContainerView, film);
        });
      shownFilmCardQuantity += FILM_QUANTITY_PER_STEP;
      if (shownFilmCardQuantity >= filmsMocks.length) {
        showMoreButtonView.destroy();
      }
    });
    render(filmsList, showMoreButtonView, RENDER_POSITION.BEFORE_END);
  }

  // TOP RATED
  const topRatedViewElement = new TopRatedView().element;
  render(filmSectionElement, topRatedViewElement, RENDER_POSITION.BEFORE_END);
  const topRatedContainer = topRatedViewElement.querySelector(`.films-list__container`);
  const sortByRateFilms = sort.rated(filmsMocks);
  const rateQuantity = Math.min(FILM_QUANTITY_EXTRA, sortByRateFilms.length);
  for (let i = 0; i < rateQuantity; i++) {
    renderFilm(topRatedContainer, sortByRateFilms[i]);
  }

  // MOST COMMENTED
  const mostCommentedViewElement = new MostCommentedView().element;
  render(filmSectionElement, mostCommentedViewElement, RENDER_POSITION.BEFORE_END);
  const mostCommentedContainer = mostCommentedViewElement.querySelector(`.films-list__container`);
  const sortByCommentedFilms = sort.commented(filmsMocks);
  const commentedQuantity = Math.min(FILM_QUANTITY_EXTRA, sortByCommentedFilms.length);
  for (let i = 0; i < commentedQuantity; i++) {
    renderFilm(mostCommentedContainer, sortByCommentedFilms[i]);
  }
};

if (filmsMocks.length === 0) {
  render(filmsList, new ListEmpty(), RENDER_POSITION.BEFORE_END);
} else {
  renderBoard();
}

render(footerStats, new FooterStatsView(filmsMocks), RENDER_POSITION.AFTER_BEGIN);
