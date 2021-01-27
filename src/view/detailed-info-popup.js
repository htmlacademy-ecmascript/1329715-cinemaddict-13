import dayjs from "dayjs";
import {humanizeFilmDuration} from "../util/view";
import {Smart as SmartView} from "./smart";
import {deepCopyFilm, isOnline} from "../util/common";
import {ActionType} from "../util/const";
import he from "he";
import {toast} from "../util/toast/toast";

const SHAKE_ANIMATION_TIMEOUT = 600;

const State = {
  SAVING: `SAVING`,
  DELETING: `DELETING`,
  ABORTING: `ABORTING`,
};

const createGenresTemplate = (genres) => {
  return genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join(` `);
};

const humanizeDate = (date) => {
  const diff = dayjs().diff(date, `minute`);
  let humanizedDate = ``;
  const MIN_MINUTES_FOR_A_FEW_MINUTES_AGO = 10;
  const MIN_IN_HOUR = 60;
  const HOUR_IN_DAY = 24;
  const DAY_IN_MONTH = 30;
  const MONTH_IN_YEAR = 30;

  if (diff <= MIN_MINUTES_FOR_A_FEW_MINUTES_AGO) {
    humanizedDate = `now`;
  } else if (diff > MIN_MINUTES_FOR_A_FEW_MINUTES_AGO && diff < MIN_IN_HOUR) {
    humanizedDate = `a few minutes ago`;
  } else if (diff < MIN_IN_HOUR * HOUR_IN_DAY) {
    humanizedDate = `a few hours ago`;
  } else if (diff < MIN_IN_HOUR * HOUR_IN_DAY * DAY_IN_MONTH) {
    humanizedDate = `a few days ago`;
  } else if (diff < MIN_IN_HOUR * HOUR_IN_DAY * DAY_IN_MONTH * MONTH_IN_YEAR) {
    humanizedDate = `a few months ago`;
  } else {
    humanizedDate = `a few years ago`;
  }

  return humanizedDate;
};

const createCommentsTemplate = (comments, isSaving, idDeleting) => {
  comments = comments[0] && comments[0].emotion ? comments : [];
  return comments.map(({emotion, comment, author, date, id}) => {
    const deleteText = id === idDeleting ? `Deleting` : `Delete`;
    const humanizedDate = humanizeDate(date);
    return `<li class="film-details__comment" data-id="${id}">
              <span class="film-details__comment-emoji">
                <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
              </span>
              <div>
                <p class="film-details__comment-text">${he.encode(comment)}</p>
                <p class="film-details__comment-info">
                  <span class="film-details__comment-author">${author}</span>
                  <span class="film-details__comment-day">${humanizedDate}</span>
                  <button class="film-details__comment-delete" ${isSaving ? `disabled` : ``}>${deleteText}</button>
                </p>
              </div>
            </li>`;
  }).join(``);
};

const createDetailedInfoPopupTemplate = (film, comments, isSaving, idDeleting, newComment) => {
  const isDisabled = isSaving || idDeleting;
  const {
    filmInfo: {
      poster, title, alternativeTitle, rating, director, writers, actors, release: {date, releaseCountry},
      runtime, genre, description, ageRating,
    },
    userDetails: {watchlist, alreadyWatched, favorite},
  } = film;
  const commentsQuantity = comments.length;
  const genreQuantity = genre.length;
  const duration = humanizeFilmDuration(runtime);
  let emotionIcon = ``;
  let commentText = ``;
  if (newComment && newComment.emotion) {
    emotionIcon = `<img src="./images/emoji/${newComment.emotion}.png" width="55" height="55" alt="emoji-${newComment.emotion}">`;
  }
  if (newComment && newComment.comment) {
    commentText = newComment.comment;
  }

  return `<section class="film-details">
            <form class="film-details__inner" action="" method="get">
              <div class="film-details__top-container">
                <div class="film-details__close">
                  <button class="film-details__close-btn" type="button" ${isDisabled ? `disabled` : ``}>close</button>
                </div>
                <div class="film-details__info-wrap">
                  <div class="film-details__poster">
                    <img class="film-details__poster-img" src="${poster}" alt="">

                    <p class="film-details__age">${ageRating}+</p>
                  </div>

                  <div class="film-details__info">
                    <div class="film-details__info-head">
                      <div class="film-details__title-wrap">
                        <h3 class="film-details__title">${title}</h3>
                        <p class="film-details__title-original">${alternativeTitle}</p>
                      </div>

                      <div class="film-details__rating">
                        <p class="film-details__total-rating">${rating}</p>
                      </div>
                    </div>

                    <table class="film-details__table">
                      <tbody><tr class="film-details__row">
                        <td class="film-details__term">Director</td>
                        <td class="film-details__cell">${director}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Writers</td>
                        <td class="film-details__cell">${writers.join(`, `)}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Actors</td>
                        <td class="film-details__cell">${actors.join(`, `)}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Release Date</td>
                        <td class="film-details__cell">${dayjs(date).format(`D MMMM YYYY`)}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Runtime</td>
                        <td class="film-details__cell">${duration}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Country</td>
                        <td class="film-details__cell">${releaseCountry}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Genre${genreQuantity > 1 ? `s` : ``}</td>
                        <td class="film-details__cell">
                            ${createGenresTemplate(genre)}
                        </td>
                      </tr>
                      </tbody>
                    </table>

                    <p class="film-details__state-description">
                        ${description}
                    </p>
                  </div>
                </div>

                <section class="film-details__controls">
                  <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${watchlist ? `checked` : ``}>
                  <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

                  <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${alreadyWatched ? `checked` : ``}>
                  <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

                  <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${favorite ? `checked` : ``}>
                  <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
                </section>
              </div>

              <div class="film-details__bottom-container">
                <section class="film-details__comments-wrap">
                  <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsQuantity}</span></h3>

                  <ul class="film-details__comments-list">
                    ${createCommentsTemplate(comments, isSaving, idDeleting)}
                  </ul>

                  <div class="film-details__new-comment">
                    <div class="film-details__add-emoji-label">
                        ${emotionIcon}
                    </div>

                    <label class="film-details__comment-label">
                      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${isDisabled ? `disabled` : ``}>${commentText}</textarea>
                    </label>

                    <div class="film-details__emoji-list">
                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${isDisabled ? `disabled` : ``}>
                      <label class="film-details__emoji-label" for="emoji-smile">
                        <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                      </label>

                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${isDisabled ? `disabled` : ``}>
                      <label class="film-details__emoji-label" for="emoji-sleeping">
                        <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                      </label>

                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${isDisabled ? `disabled` : ``}>
                      <label class="film-details__emoji-label" for="emoji-puke">
                        <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                      </label>

                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${isDisabled ? `disabled` : ``}>
                      <label class="film-details__emoji-label" for="emoji-angry">
                        <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                      </label>
                    </div>
                  </div>
                </section>
              </div>
            </form>
          </section>`;
};

const EMPTY_COMMENT = {
  id: null,
  author: `some-cool-author`,
  comment: null,
  date: null,
  emotion: null,
};

class DetailedInfoPopup extends SmartView {
  constructor(film, comments, closePopup, handleViewAction) {
    super(film);
    this._comments = comments;

    this._closePopup = closePopup;
    this._handleViewAction = handleViewAction;

    this._clickCloseButtonHandler = this._clickCloseButtonHandler.bind(this);
    this._handleClickWatchlist = this._handleClickWatchlist.bind(this);
    this._handleClickWatched = this._handleClickWatched.bind(this);
    this._handleClickFavorite = this._handleClickFavorite.bind(this);
    this._clickEmojiHandler = this._clickEmojiHandler.bind(this);
    this._clickDeleteButtonHandler = this._clickDeleteButtonHandler.bind(this);
    this._submitCommentHandler = this._submitCommentHandler.bind(this);
  }

  init() {
    this._newComment = Object.assign({}, EMPTY_COMMENT);
    this.setHandlers();
  }

  _clickCloseButtonHandler(evt) {
    evt.preventDefault();
    this._callback.clickCloseButton();
  }

  _setClickCloseButtonHandler(cb) {
    this._callback.clickCloseButton = cb;
    this.element.querySelector(`.film-details__close-btn`).addEventListener(`click`, this._clickCloseButtonHandler);
  }

  _handleClickWatchlist() {
    const newFilm = deepCopyFilm(this._state);
    newFilm.userDetails.watchlist = !this._state.userDetails.watchlist;
    this._handleViewAction(ActionType.USER_INFO, newFilm);
  }

  _setClickWatchlistHandler() {
    this.element.querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, this._handleClickWatchlist);
  }

  _handleClickWatched() {
    const newFilm = deepCopyFilm(this._state);
    newFilm.userDetails.alreadyWatched = !this._state.userDetails.alreadyWatched;
    this._handleViewAction(ActionType.USER_INFO, newFilm);
  }

  _setClickWatchedHandler() {
    this.element.querySelector(`.film-details__control-label--watched`).addEventListener(`click`, this._handleClickWatched);
  }

  _handleClickFavorite() {
    const newFilm = deepCopyFilm(this._state);
    newFilm.userDetails.favorite = !this._state.userDetails.favorite;
    this._handleViewAction(ActionType.USER_INFO, newFilm);
  }

  _setClickFavoriteHandler() {
    this.element.querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, this._handleClickFavorite);
  }

  setHandlers() {
    this._setClickCloseButtonHandler(this._closePopup);
    this._setClickWatchlistHandler();
    this._setClickWatchedHandler();
    this._setClickFavoriteHandler();
    this._setClickEmojiHandler();
    this._setClickDeleteButtonHandler();
    this._setSubmitCommentHandler();
  }

  getTemplate() {
    return createDetailedInfoPopupTemplate(this._state, this._comments, this._isSaving, this._idDeleting, this._newComment);
  }

  restoreHandlers() {
    this.setHandlers();
  }

  _submitCommentHandler(evt) {
    const commentText = evt.target.value;
    const isCtrlOrCommandPressed = evt.ctrlKey || evt.metaKey;
    if (isCtrlOrCommandPressed && evt.key === `Enter` && commentText && this._newComment.emotion) {
      evt.preventDefault();

      if (!isOnline()) {
        toast(`You can't add comment offline`);
        const shakeElement = this.element.querySelector(`.film-details__new-comment`);
        this.shake(shakeElement);
        return;

      }

      this._newComment.comment = commentText;
      this._newComment.date = dayjs().toDate();
      this._handleViewAction(ActionType.COMMENT_ADD, {filmId: this._state.id, comment: this._newComment});
    }
  }

  _setSubmitCommentHandler() {
    this.element.querySelector(`.film-details__comment-input`).addEventListener(`keydown`, this._submitCommentHandler);
  }

  _clickEmojiHandler(evt) {
    let type = ``;
    if (evt.target.tagName === `INPUT`) {
      type = evt.target.value;
      this._newComment.emotion = type;
      this.element.querySelector(`.film-details__add-emoji-label`).innerHTML = `<img src="./images/emoji/${type}.png" width="55" height="55" alt="emoji-${type}">`;
      this.element.querySelector(`.film-details__comment-input`).focus();
    }
  }

  _setClickEmojiHandler() {
    this.element.querySelector(`.film-details__emoji-list`).addEventListener(`click`, this._clickEmojiHandler);
  }

  _clickDeleteButtonHandler(evt) {
    evt.preventDefault();

    if (evt.target.className === `film-details__comment-delete`) {
      const commentId = evt.target.closest(`li`).dataset.id;
      if (!isOnline()) {
        toast(`You can't delete comment offline`);
        const shakeElement = this.element.querySelector(`.film-details__comment[data-id = "${commentId}"]`);
        this.shake(shakeElement);
        return;
      }

      const newFilm = deepCopyFilm(this._state);
      const indexOfDeletedComment = newFilm.comments.findIndex((comment) => {
        return comment === commentId;
      });
      newFilm.comments.splice(indexOfDeletedComment, 1);
      this._handleViewAction(ActionType.COMMENT_DELETE, {film: newFilm, commentId});
    }
  }

  _setClickDeleteButtonHandler() {
    this.element.querySelector(`.film-details__comments-list`).addEventListener(`click`, this._clickDeleteButtonHandler);
  }

  setState(state, id) {
    let scrollY;
    switch (state) {
      case State.SAVING:
        this._isSaving = true;
        scrollY = this.element.scrollTop;
        this.updateElement();
        this.element.scrollTo(0, scrollY);
        this._isSaving = false;
        break;
      case State.DELETING:
        this._idDeleting = id;
        scrollY = this.element.scrollTop;
        this.updateElement();
        this.element.scrollTo(0, scrollY);
        this._idDeleting = null;
        break;
      case State.ABORTING:
        const shakeElement = id ? this.element.querySelector(`.film-details__comment[data-id = "${id}"]`) : this.element.querySelector(`.film-details__new-comment`);
        this.shake(shakeElement, this.updateElement);
        break;
    }
  }

  shake(shakeElement, cb) {
    shakeElement.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      shakeElement.style.animation = ``;
      const scrollY = this.element.scrollTop;
      if (cb) {
        cb();
      }
      this.element.scrollTo(0, scrollY);
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  resetNewComment() {
    this._newComment = Object.assign({}, EMPTY_COMMENT);
  }
}

export {DetailedInfoPopup, State};
