const UserRank = {
  NOVICE: `novice`,
  FAN: `fan`,
  MOVIE_BUFF: `movie buff`
};

const FILM_QUANTITY_EXTRA = 2;
const FILM_QUANTITY_PER_STEP = 5;

const ActionType = {
  COMMENT_ADD: `COMMENT_ADD`,
  COMMENT_DELETE: `COMMENT_DELETE`,
  USER_INFO: `USER_INFO`,
  FILTER: `FILTER`,
  STATS: `STATS`,
  INIT: `INIT`
};

const ButtonType = {
  WATCHLIST: `WATCHLIST`,
  WATCHED: `WATCHED`,
  FAVORITE: `FAVORITE`
};

const MenuType = {
  ALL: `all`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITE: `favorite`,
  STATS: `stats`
};

const Filter = {
  [MenuType.ALL]: (films) => films,
  [MenuType.WATCHLIST]: (films) => films.filter((film)=>film.userDetails.watchlist),
  [MenuType.HISTORY]: (films) => films.filter((film)=>film.userDetails.alreadyWatched),
  [MenuType.FAVORITE]: (films) => films.filter((film)=>film.userDetails.favorite),
};

export {
  UserRank,
  FILM_QUANTITY_EXTRA,
  FILM_QUANTITY_PER_STEP,
  ActionType,
  ButtonType,
  MenuType,
  Filter
};
