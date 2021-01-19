const filter = {
  all: (films) => films.length,
  watchlist: (films) => films.filter((film) => film.userDetails.watchlist).length,
  history: (films) => films.filter((film) => film.userDetails.alreadyWatched).length,
  favorites: (films) => films.filter((film) => film.userDetails.favorite).length
};

const generateFilters = (films) => {
  return Object.entries(filter)
    .map(([filterName, quantityFunction]) => {
      return {name: filterName, quantity: quantityFunction(films)};
    });
};

export {generateFilters};
