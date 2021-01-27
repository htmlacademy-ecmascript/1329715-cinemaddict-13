import {Observable} from "./observable";
import {ActionType} from "../util/const";

class Films extends Observable {
  constructor() {
    super();
    this._films = [];
  }

  get films() {
    return this._films;
  }

  set films(films) {
    this._films = films;

    this.notify(ActionType.INIT);
  }

  update(updateType, updatedFilm, comments) {
    const index = this._films.findIndex((film) => film.id === updatedFilm.id);
    this._films[index] = updatedFilm;

    this.notify(updateType, updatedFilm, comments);
  }

  static adaptToClient(film) {
    const adaptedFilm = Object.assign({}, film);

    delete adaptedFilm[`film_info`];
    delete adaptedFilm[`user_details`];
    adaptedFilm.filmInfo = Object.assign({}, film[`film_info`]);
    adaptedFilm.userDetails = Object.assign({}, film[`user_details`]);
    adaptedFilm.filmInfo.release = Object.assign({}, film[`film_info`].release);

    delete adaptedFilm.filmInfo[`age_rating`];
    delete adaptedFilm.filmInfo[`alternative_title`];
    delete adaptedFilm.filmInfo[`total_rating`];
    adaptedFilm.filmInfo.ageRating = film[`film_info`][`age_rating`];
    adaptedFilm.filmInfo.alternativeTitle = film[`film_info`][`alternative_title`];
    adaptedFilm.filmInfo.rating = film[`film_info`][`total_rating`];

    delete adaptedFilm.filmInfo.release[`release_country`];
    adaptedFilm.filmInfo.release.releaseCountry = film[`film_info`].release[`release_country`];

    delete adaptedFilm.userDetails[`already_watched`];
    delete adaptedFilm.userDetails[`watching_date`];
    adaptedFilm.userDetails.alreadyWatched = film[`user_details`][`already_watched`];
    adaptedFilm.userDetails.watchingDate = film[`user_details`][`watching_date`];

    return adaptedFilm;
  }

  static adaptToServer(film) {
    const adaptedFilm = Object.assign({}, film);

    delete adaptedFilm.filmInfo;
    delete adaptedFilm.userDetails;
    adaptedFilm[`film_info`] = Object.assign({}, film.filmInfo);
    adaptedFilm[`user_details`] = Object.assign({}, film.userDetails);
    adaptedFilm[`film_info`].release = Object.assign({}, film.filmInfo.release);

    delete adaptedFilm[`film_info`].alternativeTitle;
    delete adaptedFilm[`film_info`].rating;
    delete adaptedFilm[`film_info`].ageRating;
    adaptedFilm[`film_info`][`alternative_title`] = film.filmInfo.alternativeTitle;
    adaptedFilm[`film_info`][`total_rating`] = film.filmInfo.rating;
    adaptedFilm[`film_info`][`age_rating`] = film.filmInfo.ageRating;

    delete adaptedFilm[`film_info`].release.releaseCountry;
    adaptedFilm[`film_info`].release[`release_country`] = film.filmInfo.release.releaseCountry;

    delete adaptedFilm[`user_details`].alreadyWatched;
    delete adaptedFilm[`user_details`].watchingDate;
    adaptedFilm[`user_details`][`already_watched`] = film.userDetails.alreadyWatched;
    adaptedFilm[`user_details`][`watching_date`] = film.userDetails.watchingDate;

    return adaptedFilm;
  }
}

export {Films};
