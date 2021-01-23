import {generateFilm} from "./mock/film";
import {FILM_QUANTITY} from "./util/const";
import {FilmList as FilmListPresenter} from "./presenter/filmList";
import {Films as FilmsModel} from "./model/films";

const body = document.querySelector(`body`);

const filmsMocks = [];
for (let i = 0; i < FILM_QUANTITY; i++) {
  filmsMocks.push(generateFilm());
}

const filmsModel = new FilmsModel();
filmsModel.films = filmsMocks;

const filmListPresenter = new FilmListPresenter(body, filmsModel);
filmListPresenter.init();
