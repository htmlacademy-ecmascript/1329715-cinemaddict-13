const UserRank = {
  NOTICE: `notice`,
  FAN: `fan`,
  MOVIE_BUFF: `movie buff`
};

const EMOTIONS = [`smile`, `sleeping`, `puke`, `angry`];

const FILM_QUANTITY_EXTRA = 2;
const FILM_QUANTITY = 12;
const FILM_QUANTITY_PER_STEP = 5;

const UpdateType = {
  COMMENT: `COMMENT`,
  USER_INFO: `USER_INFO`,
  FILTER: `FILTER`
};

const ButtonType = {
  WATCHLIST: `WATCHLIST`,
  WATCHED: `WATCHED`,
  FAVORITE: `FAVORITE`
};

const FilterType = {
  ALL: `all`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITE: `favorite`
};

export {UserRank, EMOTIONS, FILM_QUANTITY_EXTRA, FILM_QUANTITY, FILM_QUANTITY_PER_STEP, UpdateType, ButtonType, FilterType};
