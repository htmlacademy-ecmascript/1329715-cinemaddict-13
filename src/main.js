import {generateFilm} from "./mock/film";
import {FILM_QUANTITY} from "./util/const";
import {FilmList as FilmListPresenter} from "./presenter/filmList";
import {Films as FilmsModel} from "./model/films";
import {MenuItems as MenuItemsModel} from "./model/menuItems";
import {Menu as MenuPresenter} from "./presenter/menu";
import {Stats as StatsView} from "./view/stats";
import {render, RENDER_POSITION} from "./util/view";

const body = document.querySelector(`body`);
const main = body.querySelector(`.main`);

const filmsMocks = [];
for (let i = 0; i < FILM_QUANTITY; i++) {
  filmsMocks.push(generateFilm());
}

const filmsModel = new FilmsModel();
filmsModel.films = filmsMocks;
const menuItemsModel = new MenuItemsModel();

const statsView = new StatsView(filmsModel.films);
statsView.hide();
render(main, statsView, RENDER_POSITION.AFTER_BEGIN);

const menuPresenter = new MenuPresenter(main, menuItemsModel, filmsModel);
menuPresenter.init();
const filmListPresenter = new FilmListPresenter(body, menuItemsModel, filmsModel, statsView);
filmListPresenter.init();
