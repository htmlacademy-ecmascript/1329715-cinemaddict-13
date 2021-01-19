const sort = {
  default: (films) => films,
  rated: (films) => films.slice().sort((a, b) => b.filmInfo.rating - a.filmInfo.rating),
  commented: (films) => films.slice().sort((a, b) => b.comments.length - a.comments.length),
  date: (films) => films.slice().sort((a, b) => b.filmInfo.release.date - a.filmInfo.release.date),
};

export {sort};
