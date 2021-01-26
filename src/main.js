import {FilmList as FilmListPresenter} from "./presenter/film-list";
import {Films as FilmsModel} from "./model/films";
import {MenuItems as MenuItemsModel} from "./model/menu-items";
import {Menu as MenuPresenter} from "./presenter/menu";
import {Stats as StatsView} from "./view/stats";
import {render, RENDER_POSITION} from "./util/view";
import {Server} from "./api/server";

const AUTHORIZATION = `Basic <:quA23L)JeP+FL{1`;
const END_POINT = `https://13.ecmascript.pages.academy/cinemaddict`;

const body = document.querySelector(`body`);
const main = body.querySelector(`.main`);

const filmsModel = new FilmsModel();
const menuItemsModel = new MenuItemsModel();

const statsView = new StatsView(filmsModel.films);
statsView.hide();
render(main, statsView, RENDER_POSITION.AFTER_BEGIN);

const server = new Server(END_POINT, AUTHORIZATION);
const menuPresenter = new MenuPresenter(main, menuItemsModel, filmsModel);
menuPresenter.init();
const filmListPresenter = new FilmListPresenter(body, menuItemsModel, filmsModel, statsView, server);

filmListPresenter.init();
server.getFilms()
  .then((films) => {
    filmsModel.films = films;
  })
  .catch(()=>{
    filmsModel.films = [];
  });
