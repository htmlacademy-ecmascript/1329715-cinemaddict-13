import {Films as FilmsModel} from "../model/films";
import {isOnline} from "../util/common";

const getSyncedFilms = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.film);
};

class Provider {
  constructor(server, store) {
    this._server = server;
    this._store = store;
  }

  getFilms() {
    if (isOnline()) {
      return this._server.getFilms()
        .then((films) => {
          this._store.setItems(`films`, films.map(FilmsModel.adaptToServer));
          return films;
        });
    } else {
      const storeFilms = this._store.getItems(`films`);
      return Promise.resolve(storeFilms.map(FilmsModel.adaptToClient));
    }
  }

  updateFilm(film) {
    if (isOnline()) {
      return this._server.updateFilm(film)
        .then((updatedFilm) => {
          this._store.setItem(`films`, updatedFilm.id, FilmsModel.adaptToServer(updatedFilm));
          return updatedFilm;
        });
    } else {
      this._store.setItem(`films`, film.id, FilmsModel.adaptToServer(film));
      return Promise.resolve(film);
    }
  }

  getComments(filmId) {
    return isOnline() ? this._server.getComments(filmId) : Promise.reject(new Error(`Can't get comments offline`));
  }

  addComment(filmId, newComment) {
    return isOnline ? this._server.addComment(filmId, newComment) : Promise.reject(new Error(`Can't add comments offline`));
  }

  removeComment(commentId) {
    return isOnline() ? this._server.removeComment(commentId) : Promise.reject(new Error(`Can't remove comments offline`));
  }

  sync() {
    if (isOnline()) {
      const storeFilms = Object.values(this._store.getItems(`films`));

      return this._server.sync(storeFilms)
        .then((response) => {
          // Забираем из ответа синхронизированные задачи
          const updatedFilms = getSyncedFilms(response.updated);

          // Добавляем синхронизированные задачи в хранилище.
          // Хранилище должно быть актуальным в любой момент.
          // const items = createStoreStructure([...updatedFilms]);

          this._store.setItems(...updatedFilms);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}

export {Provider};
