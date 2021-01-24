import {generateFilm} from "./mock/film";
import {FILM_QUANTITY} from "./util/const";
import {FilmList as FilmListPresenter} from "./presenter/filmList";
import {Films as FilmsModel} from "./model/films";
import {MenuItems as MenuItemsModel} from "./model/menuItems";
import {Menu as MenuPresenter} from "./presenter/menu";

const body = document.querySelector(`body`);
const main = body.querySelector(`.main`);

const filmsMocks = [];
for (let i = 0; i < FILM_QUANTITY; i++) {
  filmsMocks.push(generateFilm());
}

const filmsModel = new FilmsModel();
filmsModel.films = filmsMocks;
const menuItemsModel = new MenuItemsModel();

const menuPresenter = new MenuPresenter(main, menuItemsModel, filmsModel);
menuPresenter.init();
const filmListPresenter = new FilmListPresenter(body, menuItemsModel, filmsModel);
filmListPresenter.init();
