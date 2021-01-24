import {generateFilm} from "./mock/film";
import {FILM_QUANTITY} from "./util/const";
import {FilmList as FilmListPresenter} from "./presenter/filmList";
import {Films as FilmsModel} from "./model/films";
import {Filters as FiltersModel} from "./model/filters";
import {Menu as MenuPresenter} from "./presenter/menu";

const body = document.querySelector(`body`);
const main = body.querySelector(`.main`);

const filmsMocks = [];
for (let i = 0; i < FILM_QUANTITY; i++) {
  filmsMocks.push(generateFilm());
}

const filmsModel = new FilmsModel();
filmsModel.films = filmsMocks;
const filtersModel = new FiltersModel();

const menuPresenter = new MenuPresenter(main, filtersModel, filmsModel);
menuPresenter.init();
const filmListPresenter = new FilmListPresenter(body, filtersModel, filmsModel);
filmListPresenter.init();
