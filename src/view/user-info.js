import {UserRank} from "../util/const";
import {AbstractView} from "./abstract-view";

const MIN_NOVICE_QUANTITY = 1;
const MIN_FAN_QUANTITY = 11;
const MIN_MOVIE_BUFF_QUANTITY = 21;

const getUserRank = (watchedQuantity) => {
  let rank = ``;
  if (watchedQuantity >= MIN_NOVICE_QUANTITY && watchedQuantity < MIN_FAN_QUANTITY) {
    rank = UserRank.NOTICE;
  } else if (watchedQuantity >= MIN_FAN_QUANTITY && watchedQuantity < MIN_MOVIE_BUFF_QUANTITY) {
    rank = UserRank.FAN;
  } else if (watchedQuantity >= MIN_MOVIE_BUFF_QUANTITY) {
    rank = UserRank.MOVIE_BUFF;
  }
  return rank;
};

const createUserInfoTemplate = (films) => {
  const watchedQuantity = films.reduce((accumulator, curFilm) => {
    return accumulator + +curFilm.userDetails.alreadyWatched;
  }, 0);
  const rank = getUserRank(watchedQuantity);

  return `<section class="header__profile profile">
            <p class="profile__rating">${rank}</p>
            <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
          </section>`;
};

class UserInfo extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createUserInfoTemplate(this._films);
  }
}

export {UserInfo, getUserRank};
