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

  update(updateType, updatedFilm) {
    const index = this._films.findIndex((film) => film.id === updatedFilm.id);
    this._films[index] = updatedFilm;

    this.notify(updateType, updatedFilm);
  }

  static adaptToClient(film) {
    const adaptedFilm = Object.assign({}, film);
    adaptedFilm.filmInfo = film.film_info;
    adaptedFilm.userDetails = film.user_details;

    adaptedFilm.filmInfo.alternativeTitle = film.film_info.alternative_title;
    adaptedFilm.filmInfo.rating = film.film_info.total_rating;
    adaptedFilm.filmInfo.ageRating = film.film_info.age_rating;
    adaptedFilm.filmInfo.release.releaseCountry = film.film_info.release.release_country;

    adaptedFilm.userDetails.alreadyWatched = film.user_details.already_watched;
    adaptedFilm.userDetails.watchingDate = film.user_details.watching_date;

    delete adaptedFilm.film_info;
    delete adaptedFilm.user_details;

    delete adaptedFilm.filmInfo.alternative_title;
    delete adaptedFilm.filmInfo.total_rating;
    delete adaptedFilm.filmInfo.age_rating;
    delete adaptedFilm.filmInfo.release.release_country;

    delete adaptedFilm.userDetails.already_watched;
    delete adaptedFilm.userDetails.watching_date;

    return adaptedFilm;
  }

  static adaptToServer(film) {
    const adaptedFilm = Object.assign({}, film);
    adaptedFilm[`film_info`] = film.filmInfo;
    adaptedFilm[`user_details`] = film.userDetails;

    adaptedFilm[`film_info`][`alternative_title`] = film.filmInfo.alternativeTitle;
    adaptedFilm[`film_info`][`total_rating`] = film.filmInfo.rating;
    adaptedFilm[`film_info`][`age_rating`] = film.filmInfo.ageRating;
    adaptedFilm[`film_info`].release[`release_country`] = film.filmInfo.release.releaseCountry;

    adaptedFilm[`user_details`][`already_watched`] = film.userDetails.alreadyWatched;
    adaptedFilm[`user_details`][`watching_date`] = film.userDetails.watchingDate;

    delete adaptedFilm.filmInfo;
    delete adaptedFilm.userDetails;

    delete adaptedFilm[`film_info`].alternativeTitle;
    delete adaptedFilm[`film_info`].rating;
    delete adaptedFilm[`film_info`].ageRating;
    delete adaptedFilm[`film_info`].release[`release_country`];

    delete adaptedFilm[`user_details`].alreadyWatched;
    delete adaptedFilm[`user_details`].watchingDate;

    return adaptedFilm;
  }
}

export {Films};
