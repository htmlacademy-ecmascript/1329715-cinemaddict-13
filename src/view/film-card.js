import dayjs from "dayjs";

const createFilmCard = (film) => {
  const {filmInfo: {poster, title, rating, release: {date}, runtime}, comments} = film;
  const commentsQuantity = comments.length;
  const genre = film.filmInfo.genre[0];
  let description = film.filmInfo.description;
  const lengthForShortDescription = 140;
  if (description.length > lengthForShortDescription) {
    description = `${description.slice(lengthForShortDescription - 1)}...`;
  }

  let runtimeFormat = `${runtime}m`;
  const minInHour = 60;
  if (runtime >= minInHour) {
    runtimeFormat = `${Math.floor(runtime / minInHour)}h ${runtime % minInHour}m`;
  }

  return `<article class="film-card">
          <h3 class="film-card__title">${title}</h3>
          <p class="film-card__rating">${rating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${dayjs(date).get(`year`)}</span>
            <span class="film-card__duration">${runtimeFormat}</span>
            <span class="film-card__genre">${genre}</span>
          </p>
          <img src="./images/posters/${poster}" alt="" class="film-card__poster">
          <p class="film-card__description">${description}</p>
          <a class="film-card__comments">${commentsQuantity} comment${commentsQuantity > 1 ? `s` : ``}</a>
          <div class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite" type="button">Mark as favorite</button>
          </div>
        </article>`;
};

export {createFilmCard};
