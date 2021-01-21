const SortType = {
  DEFAULT: `default`,
  RATED: `rated`,
  COMMENTED: `commented`,
  RELEASE_DATE: `date`
};

const sort = {};
sort[SortType.DEFAULT] = (films) => films;
sort[SortType.RATED] = (films) => films.slice().sort((a, b) => b.filmInfo.rating - a.filmInfo.rating);
sort[SortType.COMMENTED] = (films) => films.slice().sort((a, b) => b.comments.length - a.comments.length);
sort[SortType.RELEASE_DATE] = (films) => films.slice().sort((a, b) => b.filmInfo.release.date - a.filmInfo.release.date);

export {sort, SortType};
