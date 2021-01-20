import {render, RENDER_POSITION} from "../util/view";
import {FilmsContainer as FilmsContainerView} from "../view/films-container";
import {DetailedInfoPopup as DetailedInfoPopupView} from "../view/detailed-info-popup";
import {FilmCard as FilmCardView} from "../view/film-card";
import {FILM_QUANTITY_EXTRA, FILM_QUANTITY_PER_STEP} from "../util/const";
import {ShowMoreButton as ShowMoreButtonView} from "../view/show-more-button";
import {TopRated as TopRatedView} from "../view/top-rated";
import {sort} from "../util/sort";
import {MostCommented as MostCommentedView} from "../view/most-commented";
import {ListEmpty} from "../view/list-empty";
import {UserInfo as UserInfoView} from "../view/user-info";
import {Menu as MenuView} from "../view/menu";
import {generateFilters} from "../mock/filter";
import {Sort as SortView} from "../view/sort";
import {FilmsSection as FilmSectionView} from "../view/films-section";
import {FooterStats as FooterStatsView} from "../view/footer-stats";

class FilmList {
  constructor(body) {
    this._body = body;
    this._header = body.querySelector(`.header`);
    this._main = body.querySelector(`.main`);
    this._footer = body.querySelector(`.footer`);
    this._footerStats = this._footer.querySelector(`.footer__statistics`);

    this._closePopup = this._closePopup.bind(this);
    this._onEscKeydown = this._onEscKeydown.bind(this);
  }

  init(films) {
    this._films = films;
    this._shownFilmCardQuantity = FILM_QUANTITY_PER_STEP;

    this.renderBoard();
  }

  renderBoard() {
    this.renderMenuView();
    this.renderFilmSection();
    this._detailedInfoPopupView = null;
    if (this._films.length === 0) {
      this.renderListEmpty();
    } else {
      this.renderUserInfo();
      this.renderSort();
      this.renderFilmContainer();
      this.renderFilms(0, Math.min(this._films.length, FILM_QUANTITY_PER_STEP));
      this.renderShowMoreButton();
      this.renderTopRatedFilms();
      this.renderMostCommentedFilms();
    }
    this.renderFooterStats();
  }

  renderMenuView() {
    this._menuView = new MenuView(generateFilters(this._films));
    render(this._main, this._menuView, RENDER_POSITION.AFTER_BEGIN);
  }

  renderFilmSection() {
    this._filmSectionView = new FilmSectionView();
    render(this._main, this._filmSectionView, RENDER_POSITION.BEFORE_END);
    this._container = this._filmSectionView.element.querySelector(`.films-list`);
  }

  renderListEmpty() {
    render(this._container, new ListEmpty(), RENDER_POSITION.BEFORE_END);
  }

  renderUserInfo() {
    this._userInfoView = new UserInfoView(this._films);
    render(this._header, this._userInfoView, RENDER_POSITION.BEFORE_END);
  }

  renderSort() {
    this._sortView = new SortView();
    render(this._menuView, this._sortView, RENDER_POSITION.AFTER_END);
  }

  renderFilmContainer() {
    this._filmContainerView = new FilmsContainerView();
    render(this._container, this._filmContainerView, RENDER_POSITION.AFTER_BEGIN);
  }

  renderFilm(container, film) {
    const filmCardView = new FilmCardView(film);
    filmCardView.setOpenPopupHandler(() => this.renderPopup(film));
    render(container, filmCardView, RENDER_POSITION.BEFORE_END);
  }

  renderFilms(from, to) {
    this._films.slice(from, to)
      .forEach((film) => this.renderFilm(this._filmContainerView, film));
  }

  renderShowMoreButton() {
    if (this._films.length > FILM_QUANTITY_PER_STEP) {
      const showMoreButtonView = new ShowMoreButtonView();
      showMoreButtonView.setClickShowMoreHandler(() => {
        this._films.slice(this._shownFilmCardQuantity, this._shownFilmCardQuantity + FILM_QUANTITY_PER_STEP)
          .forEach((film) => {
            this.renderFilm(this._filmContainerView, film);
          });
        this._shownFilmCardQuantity += FILM_QUANTITY_PER_STEP;
        if (this._shownFilmCardQuantity >= this._films.length) {
          showMoreButtonView.destroy();
        }
      });
      render(this._container, showMoreButtonView, RENDER_POSITION.BEFORE_END);
    }
  }

  renderTopRatedFilms() {
    const topRatedViewElement = new TopRatedView().element;
    render(this._filmSectionView, topRatedViewElement, RENDER_POSITION.BEFORE_END);
    const topRatedContainer = topRatedViewElement.querySelector(`.films-list__container`);
    const sortByRateFilms = sort.rated(this._films);
    const rateQuantity = Math.min(FILM_QUANTITY_EXTRA, sortByRateFilms.length);
    for (let i = 0; i < rateQuantity; i++) {
      this.renderFilm(topRatedContainer, sortByRateFilms[i]);
    }
  }

  renderMostCommentedFilms() {
    const mostCommentedViewElement = new MostCommentedView().element;
    render(this._filmSectionView, mostCommentedViewElement, RENDER_POSITION.BEFORE_END);
    const mostCommentedContainer = mostCommentedViewElement.querySelector(`.films-list__container`);
    const sortByCommentedFilms = sort.commented(this._films);
    const commentedQuantity = Math.min(FILM_QUANTITY_EXTRA, sortByCommentedFilms.length);
    for (let i = 0; i < commentedQuantity; i++) {
      this.renderFilm(mostCommentedContainer, sortByCommentedFilms[i]);
    }
  }

  renderFooterStats() {
    this._footerStatsView = new FooterStatsView(this._films);
    render(this._footerStats, this._footerStatsView, RENDER_POSITION.AFTER_BEGIN);
  }

  _closePopup() {
    this._body.classList.remove(`hide-overflow`);
    if (this._detailedInfoPopupView) {
      this._detailedInfoPopupView.destroy();
      this._detailedInfoPopupView = null;
    }
    document.removeEventListener(`keydown`, this._onEscKeydown);
  }

  _onEscKeydown(evt) {
    evt.preventDefault();
    if (evt.key === `Escape`) {
      this._closePopup();
    }
  }

  renderPopup(film) {
    this._body.classList.add(`hide-overflow`);
    if (this._detailedInfoPopupView) {
      this._detailedInfoPopupView.destroy();
    }
    this._detailedInfoPopupView = new DetailedInfoPopupView(film);
    this._detailedInfoPopupView.setClickCloseButtonHandler(this._closePopup);
    document.addEventListener(`keydown`, this._onEscKeydown);
    render(this._footer, this._detailedInfoPopupView, RENDER_POSITION.AFTER_END);
  }
}

export {FilmList};
