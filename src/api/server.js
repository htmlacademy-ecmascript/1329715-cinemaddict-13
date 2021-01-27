import {Films as FilmsModel} from "../model/films";

const Method = {
  GET: `GET`,
  PUT: `PUT`,
  DELETE: `DELETE`,
  POST: `POST`
};

class Server {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getFilms() {
    return this._sendRequest({url: `movies`})
      .then(this._toJSON)
      .then((films) => {
        return films.map(FilmsModel.adaptToClient);
      });
  }

  getComments(filmId) {
    return this._sendRequest({url: `comments/${filmId}`})
      .then(this._toJSON);
  }

  addComment(filmId, newComment) {
    const requestMetaData = {
      url: `comments/${filmId}`,
      method: Method.POST,
      body: JSON.stringify(newComment),
      headers: new Headers({"Content-Type": `application/json`})
    };

    return this._sendRequest(requestMetaData)
      .then(this._toJSON);
  }

  removeComment(commentId) {
    const requestMetaData = {
      url: `comments/${commentId}`,
      method: Method.DELETE
    };

    return this._sendRequest(requestMetaData);
  }

  updateFilm(film) {
    const adaptedToServer = FilmsModel.adaptToServer(film);
    const requestMetaData = {
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(adaptedToServer),
      headers: new Headers({"Content-Type": `application/json`})
    };
    return this._sendRequest(requestMetaData)
      .then(this._toJSON)
      .then(FilmsModel.adaptToClient);
  }

  _sendRequest({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(this._checkSuccessful)
      .catch(this._catchError);
  }

  _checkSuccessful(response) {
    if (!response.ok) {
      throw new Error(`Network response was not ok - ${response.status}: ${response.statusText}`);
    }
    return response;
  }

  _catchError(err) {
    throw err;
  }

  _toJSON(response) {
    return response.json();
  }

  sync(films) {
    return this._sendRequest({
      url: `movies/sync`,
      method: Method.POST,
      body: JSON.stringify(films),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(this._toJSON);
  }
}

export {Server};
