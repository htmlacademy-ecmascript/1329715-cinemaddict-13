import {FilmList as FilmListPresenter} from "./presenter/film-list";
import {Films as FilmsModel} from "./model/films";
import {MenuItems as MenuItemsModel} from "./model/menu-items";
import {Menu as MenuPresenter} from "./presenter/menu";
import {Stats as StatsView} from "./view/stats";
import {render, RENDER_POSITION} from "./util/view";
import {Server} from "./api/server";
import {Store} from "./api/store";
import {Provider} from "./api/provider";

const AUTHORIZATION = `Basic <:quA23L)JeP+FL{4`;
const END_POINT = `https://13.ecmascript.pages.academy/cinemaddict`;

const body = document.querySelector(`body`);
const main = body.querySelector(`.main`);

const filmsModel = new FilmsModel();
const menuItemsModel = new MenuItemsModel();

const statsView = new StatsView(filmsModel.films);
statsView.hide();
render(main, statsView, RENDER_POSITION.AFTER_BEGIN);

const server = new Server(END_POINT, AUTHORIZATION);

const store = new Store();
const provider = new Provider(server, store);

const menuPresenter = new MenuPresenter(main, menuItemsModel, filmsModel);
menuPresenter.init();
const filmListPresenter = new FilmListPresenter(body, menuItemsModel, filmsModel, statsView, provider);

filmListPresenter.init();
provider.getFilms()
  .then((films) => {
    filmsModel.films = films;
  })
  .catch(() => {
    filmsModel.films = [];
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  provider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
