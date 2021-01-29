import {render, RENDER_POSITION} from "../util/view";
import {FilmsContainer as FilmsContainerView} from "../view/films-container";
import {DetailedInfoPopup as DetailedInfoPopupView, State} from "../view/detailed-info-popup";
import {ActionType, FILM_QUANTITY_EXTRA, FILM_QUANTITY_PER_STEP, Filter, MenuType} from "../util/const";
import {ShowMoreButton as ShowMoreButtonView} from "../view/show-more-button";
import {TopRated as TopRatedView} from "../view/top-rated";
import {sort, SortType} from "../util/sort";
import {MostCommented as MostCommentedView} from "../view/most-commented";
import {ListEmpty} from "../view/list-empty";
import {UserInfo as UserInfoView} from "../view/user-info";
import {Sort as SortView} from "../view/sort";
import {FilmsSection as FilmSectionView} from "../view/films-section";
import {FooterStats as FooterStatsView} from "../view/footer-stats";
import {Film as FilmPresenter} from "./film";
import {Loading as LoadingView} from "../view/loading";
import {Films} from "../model/films";

class FilmList {
  constructor(body, menuItemsModel, filmsModel, statsView, server) {
    this._body = body;
    this._header = body.querySelector(`.header`);
    this._main = body.querySelector(`.main`);
    this._footer = body.querySelector(`.footer`);
    this._footerStats = this._footer.querySelector(`.footer__statistics`);
    this._currentSortType = SortType.DEFAULT;

    this._filmsModel = filmsModel;
    this._menuItemsModel = menuItemsModel;
    this._server = server;

    this._closePopup = this._closePopup.bind(this);
    this._escKeydownHandler = this._escKeydownHandler.bind(this);
    this._clickShowMoreButtonHandler = this._clickShowMoreButtonHandler.bind(this);
    this._openPopup = this._openPopup.bind(this);

    this._filmPresenters = new Map();

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._modelEventHandler = this._modelEventHandler.bind(this);
    this._viewActionHandler = this._viewActionHandler.bind(this);

    this._filmsModel.addObserver(this._modelEventHandler);
    this._menuItemsModel.addObserver(this._modelEventHandler);

    this._statsView = statsView;
    this._isLoading = true;
  }

  init() {
    this._renderUserInfo();
    this.renderBoard();
  }

  _getFilms() {
    const activeFilter = this._menuItemsModel.activeMenuItem;
    const films = this._filmsModel.films;
    const filteredFilms = Filter[activeFilter](films);

    return sort[this._currentSortType](filteredFilms);
  }

  _sortTypeChangeHandler(sortType) {
    this._currentSortType = sortType;
    this._clearFilmList();
    this._renderFilmList();
  }

  _viewActionHandler(updateType, updatedData) {
    switch (updateType) {
      case ActionType.USER_INFO:
        this._server.updateFilm(updatedData)
          .then((response) => this._filmsModel.update(updateType, response));
        break;
      case ActionType.COMMENT_ADD:
        this._detailedInfoPopupView.setState(State.SAVING);
        this._server.addComment(updatedData.filmId, updatedData.comment)
          .then((response) => {
            const adaptToClient = Films.adaptToClient(response.movie);
            this._filmsModel.update(updateType, adaptToClient, response.comments);
          }).then(() => this._detailedInfoPopupView.resetNewComment())
          .catch(() => {
            this._detailedInfoPopupView.setState(State.ABORTING);
          });
        break;
      case ActionType.COMMENT_DELETE:
        this._detailedInfoPopupView.setState(State.DELETING, updatedData.commentId);
        this._server.removeComment(updatedData.commentId)
          .then(() => {
            this._filmsModel.update(updateType, updatedData.film);
          }).catch(() => {
            this._detailedInfoPopupView.setState(State.ABORTING, updatedData.commentId);
          });
        break;
    }
  }

  _modelEventHandler(updateType, updatedFilm, comments) {
    let scrollY;
    switch (updateType) {
      case ActionType.INIT:
        this._isLoading = false;
        this._renderUserInfo();
        this.renderBoard();
        this._statsView.updateState(this._filmsModel.films, true);
        this._statsView.hide();
        break;
      case ActionType.USER_INFO:
        this._renderUserInfo();
        const activeMenuItem = this._menuItemsModel.activeMenuItem;
        if (activeMenuItem !== MenuType.ALL && activeMenuItem !== MenuType.STATS) {
          this._clearFilmList();
          this._shownFilmCardQuantity--;
          this._renderFilmList(false);
        } else {
          this._filmPresenters.get(updatedFilm.id).forEach((filmPresenter) => filmPresenter.update(updatedFilm, false));
        }
        if (this._detailedInfoPopupView) {
          this._detailedInfoPopupView.updateState(updatedFilm, false);
        }
        this._statsView.updateState(this._filmsModel.films, true);
        this._statsView.hide();
        break;
      case ActionType.COMMENT_ADD:
        this._detailedInfoPopupView._comments = comments;
        scrollY = this._detailedInfoPopupView.element.scrollTop;
        this._detailedInfoPopupView.resetNewComment();
        this._detailedInfoPopupView.updateState(updatedFilm, true);
        this._detailedInfoPopupView.element.scroll(0, scrollY);
        this._filmPresenters.get(updatedFilm.id).forEach((filmPresenter) => filmPresenter.update(updatedFilm, true));
        this._renderMostCommentedFilms();
        break;
      case ActionType.COMMENT_DELETE:
        this._detailedInfoPopupView._comments = this._detailedInfoPopupView._comments.filter((comment) => {
          const indexOf = updatedFilm.comments.indexOf(comment.id);
          return indexOf !== -1;
        });
        scrollY = this._detailedInfoPopupView.element.scrollTop;
        this._detailedInfoPopupView.updateState(updatedFilm, true);
        this._detailedInfoPopupView.element.scroll(0, scrollY);
        this._filmPresenters.get(updatedFilm.id).forEach((filmPresenter) => filmPresenter.update(updatedFilm, true));
        this._renderMostCommentedFilms();
        break;
      case ActionType.FILTER:
        this._statsView.hide();
        this._currentSortType = SortType.DEFAULT;
        this.clearBoard();
        this.renderBoard();
        break;
      case ActionType.STATS:
        this.clearBoard();
        this._statsView.show();
        break;
    }
  }

  renderBoard() {
    this._renderFilmSection();
    if (this._isLoading) {
      this._renderLoading();
    } else {
      this._detailedInfoPopupView = null;

      if (this._filmsModel.films.length === 0) {
        this._renderListEmpty();
      } else {
        this._renderFilmList();
        this._renderTopRatedFilms();
        this._renderMostCommentedFilms();
      }
      this._renderFooterStats();
    }
  }

  clearBoard() {
    this._clearFilmList();
    this._filmSectionView.destroy();
  }

  _renderLoading() {
    this._loadingComponent = new LoadingView();
    render(this._container, this._loadingComponent, RENDER_POSITION.BEFORE_END);
  }

  _renderFilmList(resetShownFilms = true) {
    const films = this._getFilms();
    if (films.length) {
      this._renderSort();
      if (resetShownFilms) {
        this._shownFilmCardQuantity = Math.min(films.length, FILM_QUANTITY_PER_STEP);
      }
      this._renderFilmContainer();
      this._renderFilms(films.slice(0, this._shownFilmCardQuantity));
      this._renderShowMoreButton();
      this._renderTopRatedFilms();
      this._renderMostCommentedFilms();
    } else {
      this._renderListEmpty();
    }
  }

  _clearFilmList() {
    this._filmPresenters.clear();
    this._sortView.destroy();
    this._filmContainerView.destroy();
    this._showMoreButtonView.destroy();
  }

  _renderFilmSection() {
    if (this._filmSectionView) {
      this._filmSectionView.destroy();
    }
    this._filmSectionView = new FilmSectionView();
    render(this._main, this._filmSectionView, RENDER_POSITION.BEFORE_END);
    this._container = this._filmSectionView.element.querySelector(`.films-list`);
  }

  _renderListEmpty() {
    render(this._container, new ListEmpty(), RENDER_POSITION.BEFORE_END);
  }

  _renderUserInfo() {
    if (this._userInfoView) {
      this._userInfoView.destroy();
    }
    this._userInfoView = new UserInfoView(this._getFilms());
    render(this._header, this._userInfoView, RENDER_POSITION.BEFORE_END);
  }

  _renderSort() {
    if (this._sortView) {
      this._sortView.destroy();
    }
    this._sortView = new SortView(this._currentSortType);
    render(this._body.querySelector(`.main-navigation`), this._sortView, RENDER_POSITION.AFTER_END);
    this._sortView.setClickSortHandler(this._sortTypeChangeHandler);
  }

  _renderFilmContainer() {
    this._filmContainerView = new FilmsContainerView();
    render(this._container, this._filmContainerView, RENDER_POSITION.AFTER_BEGIN);
  }

  _renderFilm(container, film) {
    const filmPresenter = new FilmPresenter(container, this._openPopup, this._viewActionHandler);
    filmPresenter.init(film);
    const filmPresenters = this._filmPresenters.get(film.id);
    if (filmPresenters) {
      filmPresenters.push(filmPresenter);
    } else {
      this._filmPresenters.set(film.id, [filmPresenter]);
    }
  }

  _renderFilms(films) {
    films.forEach((film) => this._renderFilm(this._filmContainerView, film));
  }

  _clickShowMoreButtonHandler() {
    const filmQuantity = this._getFilms().length;
    const newRenderedFilmQuantity = Math.min(filmQuantity, this._shownFilmCardQuantity + FILM_QUANTITY_PER_STEP);
    const films = this._getFilms().slice(this._shownFilmCardQuantity, newRenderedFilmQuantity);
    this._renderFilms(films);
    this._shownFilmCardQuantity = newRenderedFilmQuantity;
    if (this._shownFilmCardQuantity >= filmQuantity) {
      this._showMoreButtonView.destroy();
    }
  }

  _renderShowMoreButton() {
    if (this._getFilms().length > FILM_QUANTITY_PER_STEP) {
      this._showMoreButtonView = new ShowMoreButtonView();
      this._showMoreButtonView.setClickShowMoreHandler(this._clickShowMoreButtonHandler);
      render(this._container, this._showMoreButtonView, RENDER_POSITION.BEFORE_END);
    }
  }

  _renderTopRatedFilms() {
    if (this._topRatedView) {
      this._topRatedView.destroy();
    }
    const sortByRateFilms = sort[SortType.RATED](this._filmsModel.films);
    if (sortByRateFilms[0] && +sortByRateFilms[0].filmInfo.rating !== 0) {
      this._topRatedView = new TopRatedView();
      const topRatedViewElement = this._topRatedView.element;
      render(this._filmSectionView, topRatedViewElement, RENDER_POSITION.BEFORE_END);
      const topRatedContainer = topRatedViewElement.querySelector(`.films-list__container`);
      const rateQuantity = Math.min(FILM_QUANTITY_EXTRA, sortByRateFilms.length);
      for (let i = 0; i < rateQuantity; i++) {
        this._renderFilm(topRatedContainer, sortByRateFilms[i]);
      }
    }
  }

  _renderMostCommentedFilms() {
    if (this._mostCommentedView) {
      this._mostCommentedView.destroy();
    }
    const sortByCommentedFilms = sort[SortType.COMMENTED](this._filmsModel.films);
    if (sortByCommentedFilms[0] && sortByCommentedFilms[0].comments.length !== 0) {
      this._mostCommentedView = new MostCommentedView();
      const mostCommentedViewElement = this._mostCommentedView.element;
      render(this._filmSectionView, mostCommentedViewElement, RENDER_POSITION.BEFORE_END);
      const mostCommentedContainer = mostCommentedViewElement.querySelector(`.films-list__container`);
      const commentedQuantity = Math.min(FILM_QUANTITY_EXTRA, sortByCommentedFilms.length);
      for (let i = 0; i < commentedQuantity; i++) {
        this._renderFilm(mostCommentedContainer, sortByCommentedFilms[i]);
      }
    }
  }

  _renderFooterStats() {
    if (this._footerStatsView) {
      this._footerStatsView.destroy();
    }
    this._footerStatsView = new FooterStatsView(this._filmsModel.films);
    render(this._footerStats, this._footerStatsView, RENDER_POSITION.AFTER_BEGIN);
  }

  _closePopup() {
    this._body.classList.remove(`hide-overflow`);
    if (this._detailedInfoPopupView) {
      this._detailedInfoPopupView.destroy();
      this._detailedInfoPopupView = null;
      this._openPopupFilmId = null;
    }
    document.removeEventListener(`keydown`, this._escKeydownHandler);
  }

  _escKeydownHandler(evt) {
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

    let filmComments;
    this._server.getComments(film.id)
      .then((comments) => {
        filmComments = comments;
      })
      .catch(() => {
        filmComments = film.comments;
      })
      .then(() => {
        this._detailedInfoPopupView = new DetailedInfoPopupView(film, filmComments, this._closePopup, this._viewActionHandler);
        document.addEventListener(`keydown`, this._escKeydownHandler);

        render(this._footer, this._detailedInfoPopupView, RENDER_POSITION.AFTER_END);
        this._detailedInfoPopupView.init();
      });
  }
}

export {FilmList};
