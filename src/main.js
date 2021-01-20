import {generateFilm} from "./mock/film";
import {FILM_QUANTITY} from "./util/const";
import {FilmList as FilmListPresenter} from "./presenter/filmList";

const body = document.querySelector(`body`);

const filmsMocks = [];
for (let i = 0; i < FILM_QUANTITY; i++) {
  filmsMocks.push(generateFilm());
}

const filmListPresenter = new FilmListPresenter(body);
filmListPresenter.init(filmsMocks);
