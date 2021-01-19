import {userRank} from "../util/const";

const getUserRank = (watchedQuantity) => {
  const minNumberForNotice = 1;
  const maxNumberForNotice = 10;
  const minNumberForFan = 11;
  const maxNumberForFan = 20;
  const minNumberForMovieBuff = 21;
  let rank = ``;
  if (watchedQuantity > minNumberForNotice && watchedQuantity <= maxNumberForNotice) {
    rank = userRank.NOTICE;
  } else if (watchedQuantity >= minNumberForFan && watchedQuantity <= maxNumberForFan) {
    rank = userRank.FAN;
  } else if (watchedQuantity >= minNumberForMovieBuff) {
    rank = userRank.MOVIE_BUFF;
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

export {createUserInfoTemplate};
