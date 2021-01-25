import {Films as FilmsModel} from "../model/films";

const Method = {
  GET: `GET`,
  PUT: `PUT`
};

class Server {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getFilms() {
    return this._sendRequest({url: `movies`})
      .then(this._toJSON)
      .then((films) => films.map(FilmsModel.adaptToClient));
  }

  updateFilm(film) {
    const requestMetaData = {
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(FilmsModel.adaptToServer(film)),
      headers: new Headers({"Content-Type": `application/json`})
    };
    return this._sendRequest(requestMetaData)
      .then(this._toJSON);
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
}

export {Server};
