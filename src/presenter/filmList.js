import {render, RENDER_POSITION} from "../util/view";
import {FilmsContainer as FilmsContainerView} from "../view/films-container";
import {DetailedInfoPopup as DetailedInfoPopupView} from "../view/detailed-info-popup";
import {FILM_QUANTITY_EXTRA, FILM_QUANTITY_PER_STEP} from "../util/const";
import {ShowMoreButton as ShowMoreButtonView} from "../view/show-more-button";
import {TopRated as TopRatedView} from "../view/top-rated";
import {sort, SortType} from "../util/sort";
import {MostCommented as MostCommentedView} from "../view/most-commented";
import {ListEmpty} from "../view/list-empty";
import {UserInfo as UserInfoView} from "../view/user-info";
import {Menu as MenuView} from "../view/menu";
import {generateFilters} from "../mock/filter";
import {Sort as SortView} from "../view/sort";
import {FilmsSection as FilmSectionView} from "../view/films-section";
import {FooterStats as FooterStatsView} from "../view/footer-stats";
import {Film as FilmPresenter} from "./film";

class FilmList {
  constructor(body) {
    this._body = body;
    this._header = body.querySelector(`.header`);
    this._main = body.querySelector(`.main`);
    this._footer = body.querySelector(`.footer`);
    this._footerStats = this._footer.querySelector(`.footer__statistics`);
    this._currentSortType = SortType.DEFAULT;

    this._closePopup = this._closePopup.bind(this);
    this._onEscKeydown = this._onEscKeydown.bind(this);
    this._clickShowMoreButtonHandler = this._clickShowMoreButtonHandler.bind(this);
    this._openPopup = this._openPopup.bind(this);

    this._filmPresenters = new Map();

    this._handleChangeFilm = this._handleChangeFilm.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType !== sortType) {
      this._sortFilms(sortType);
      this._clearFilmList();
      this._renderFilmList();
    }
  }

  _sortFilms(sortType) {
    this._currentSortType = sortType;
    if (this._currentSortType === SortType.DEFAULT) {
      this._films = this._sourcedFilms;
    } else {
      this._films = sort[sortType](this._films);
    }
  }

  _handleChangeFilm(updatedFilm, isReload) {
    this._filmPresenters.get(updatedFilm.id).update(updatedFilm, isReload);
    const index = this._films.findIndex((film) => film.id === updatedFilm.id);
    this._films[index] = updatedFilm;
  }

  init(films) {
    this._films = films.slice();
    this._sourcedFilms = films.slice();

    this.renderBoard();
  }

  renderBoard() {
    this._renderMenuView();
    this._renderFilmSection();
    this._detailedInfoPopupView = null;
    if (this._films.length === 0) {
      this._renderListEmpty();
    } else {
      this._renderUserInfo();
      this._renderSort();
      this._renderFilmList();
      this._renderTopRatedFilms();
      this._renderMostCommentedFilms();
    }
    this._renderFooterStats();
  }

  _renderFilmList() {
    this._shownFilmCardQuantity = FILM_QUANTITY_PER_STEP;
    this._renderFilmContainer();
    this._renderFilms(0, Math.min(this._films.length, FILM_QUANTITY_PER_STEP));
    this._renderShowMoreButton();
  }

  _clearFilmList() {
    this._filmPresenters.clear();
    this._filmContainerView.destroy();
    this._showMoreButtonView.destroy();
  }

  _renderMenuView() {
    this._menuView = new MenuView(generateFilters(this._films));
    render(this._main, this._menuView, RENDER_POSITION.AFTER_BEGIN);
  }

  _renderFilmSection() {
    this._filmSectionView = new FilmSectionView();
    render(this._main, this._filmSectionView, RENDER_POSITION.BEFORE_END);
    this._container = this._filmSectionView.element.querySelector(`.films-list`);
  }

  _renderListEmpty() {
    render(this._container, new ListEmpty(), RENDER_POSITION.BEFORE_END);
  }

  _renderUserInfo() {
    this._userInfoView = new UserInfoView(this._films);
    render(this._header, this._userInfoView, RENDER_POSITION.BEFORE_END);
  }

  _renderSort() {
    this._sortView = new SortView();
    render(this._menuView, this._sortView, RENDER_POSITION.AFTER_END);
    this._sortView.setClickSortHandler(this._handleSortTypeChange);
  }

  _renderFilmContainer() {
    this._filmContainerView = new FilmsContainerView();
    render(this._container, this._filmContainerView, RENDER_POSITION.AFTER_BEGIN);
  }

  _renderFilm(container, film) {
    const filmPresenter = new FilmPresenter(container, this._openPopup, this._handleChangeFilm);
    filmPresenter.init(film);
    this._filmPresenters.set(film.id, filmPresenter);
  }

  _renderFilms(from, to) {
    this._films.slice(from, to)
      .forEach((film) => this._renderFilm(this._filmContainerView, film));
  }

  _clickShowMoreButtonHandler() {
    this._renderFilms(this._shownFilmCardQuantity, this._shownFilmCardQuantity + FILM_QUANTITY_PER_STEP);
    this._shownFilmCardQuantity += FILM_QUANTITY_PER_STEP;
    if (this._shownFilmCardQuantity >= this._films.length) {
      this._showMoreButtonView.destroy();
    }
  }

  _renderShowMoreButton() {
    if (this._films.length > FILM_QUANTITY_PER_STEP) {
      this._showMoreButtonView = new ShowMoreButtonView();
      this._showMoreButtonView.setClickShowMoreHandler(this._clickShowMoreButtonHandler);
      render(this._container, this._showMoreButtonView, RENDER_POSITION.BEFORE_END);
    }
  }

  _renderTopRatedFilms() {
    const topRatedViewElement = new TopRatedView().element;
    render(this._filmSectionView, topRatedViewElement, RENDER_POSITION.BEFORE_END);
    const topRatedContainer = topRatedViewElement.querySelector(`.films-list__container`);
    const sortByRateFilms = sort[SortType.RATED](this._films);
    const rateQuantity = Math.min(FILM_QUANTITY_EXTRA, sortByRateFilms.length);
    for (let i = 0; i < rateQuantity; i++) {
      this._renderFilm(topRatedContainer, sortByRateFilms[i]);
    }
  }

  _renderMostCommentedFilms() {
    const mostCommentedViewElement = new MostCommentedView().element;
    render(this._filmSectionView, mostCommentedViewElement, RENDER_POSITION.BEFORE_END);
    const mostCommentedContainer = mostCommentedViewElement.querySelector(`.films-list__container`);
    const sortByCommentedFilms = sort[SortType.COMMENTED](this._films);
    const commentedQuantity = Math.min(FILM_QUANTITY_EXTRA, sortByCommentedFilms.length);
    for (let i = 0; i < commentedQuantity; i++) {
      this._renderFilm(mostCommentedContainer, sortByCommentedFilms[i]);
    }
  }

  _renderFooterStats() {
    this._footerStatsView = new FooterStatsView(this._films);
    render(this._footerStats, this._footerStatsView, RENDER_POSITION.AFTER_BEGIN);
  }

  _closePopup() {
    this._body.classList.remove(`hide-overflow`);
    if (this._detailedInfoPopupView) {
      this._detailedInfoPopupView.destroy();
      this._detailedInfoPopupView = null;
      this._openPopupFilmId = null;
    }
    document.removeEventListener(`keydown`, this._onEscKeydown);
  }

  _onEscKeydown(evt) {
    if (evt.key === `Escape`) {
      evt.preventDefault();
      this._closePopup();
    }
  }

  _openPopup(film) {
    this._body.classList.add(`hide-overflow`);
    if (this._detailedInfoPopupView) {
      this._detailedInfoPopupView.destroy();
    }
    this._openPopupFilmId = film.id;
    this._detailedInfoPopupView = new DetailedInfoPopupView(film, this._closePopup, this._handleChangeFilm);
    document.addEventListener(`keydown`, this._onEscKeydown);

    render(this._footer, this._detailedInfoPopupView, RENDER_POSITION.AFTER_END);
    this._detailedInfoPopupView.init();
  }
}

export {FilmList};
