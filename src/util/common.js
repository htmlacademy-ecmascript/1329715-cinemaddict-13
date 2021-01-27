const capitalizeString = (str) => {
  return `${str.charAt(0).toUpperCase()}${str.substring(1)}`;
};

const deepCopyFilm = (sourceFilm) => {
  const newFilm = Object.assign({}, sourceFilm);
  newFilm.userDetails = Object.assign({}, sourceFilm.userDetails);
  newFilm.filmInfo = Object.assign({}, sourceFilm.filmInfo);
  return newFilm;
};

const isOnline = () => {
  return window.navigator.onLine;
};

export {capitalizeString, deepCopyFilm, isOnline};
