import {Smart as SmartView} from "./smart";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getUserRank} from "./user-info";
import {Filter, MenuType} from "../util/const";
import dayjs from "dayjs";

const BAR_HEIGHT = 50;
const Period = {
  ALL_TIME: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`,
};

const FilterPeriod = {
  [Period.ALL_TIME]: (films) => films,
  [Period.TODAY]: (films) => films.filter((film) => {
    const today = dayjs();
    return today.diff(dayjs(film.userDetails.watchingDate), `day`) === 0;
  }),
  [Period.WEEK]: (films) => films.filter((film) => {
    const today = dayjs();
    const daysInAWeek = 7;
    return today.diff(dayjs(film.userDetails.watchingDate), `day`) <= daysInAWeek;
  }),
  [Period.MONTH]: (films) => films.filter((film) => {
    const today = dayjs();
    return today.diff(dayjs(film.userDetails.watchingDate), `month`) === 0;
  }),
  [Period.YEAR]: (films) => films.filter((film) => {
    const today = dayjs();
    return today.diff(dayjs(film.userDetails.watchingDate), `year`) === 0;
  }),
};

const renderChart = (statisticCtx, films) => {
  const filmQuantityMap = getFilmQuantityMap(films);
  statisticCtx.height = BAR_HEIGHT * Array.from(filmQuantityMap.keys()).length;
  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: Array.from(filmQuantityMap.keys()),
      datasets: [{
        data: Array.from(filmQuantityMap.values()),
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 24,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const getFilmQuantityMap = (films) => {
  films = Filter[MenuType.HISTORY](films);
  const map = new Map();
  films.forEach(({filmInfo: {genre: genres}}) => {
    genres.forEach((genre) => {
      const oldValue = +map.get(genre);
      const newValue = isNaN(oldValue) ? 1 : oldValue + 1;
      map.set(genre, newValue);
    });
  });
  return map;
};

const getTopGenre = (films) => {
  let maxQuantity = 0;
  let topGenre = ``;
  const filmQuantityMap = getFilmQuantityMap(films);
  filmQuantityMap.forEach((value, key) => {
    if (maxQuantity < value) {
      maxQuantity = value;
      topGenre = key;
    }
  });
  return topGenre;
};

const createStatsTemplate = (films, activePeriod) => {
  films = Filter[MenuType.HISTORY](films);
  let watchedQuantity = films.length;
  const userRank = getUserRank(watchedQuantity);
  films = FilterPeriod[activePeriod](films);
  watchedQuantity = films.length;
  const allRuntime = films.reduce((accumulator, curFilm) => accumulator + curFilm.filmInfo.runtime, 0);
  const minInHour = 60;
  const hours = Math.floor(allRuntime / minInHour);
  const minutes = allRuntime % minInHour;
  const topGenre = getTopGenre(films);

  return `<section class="statistic">
            <p class="statistic__rank">
              Your rank
              <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
              <span class="statistic__rank-label">${userRank}</span>
            </p>

            <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
              <p class="statistic__filters-description">Show stats:</p>

              <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${activePeriod === Period.ALL_TIME ? `checked` : ``}>
              <label for="statistic-all-time" class="statistic__filters-label">All time</label>

              <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${activePeriod === Period.TODAY ? `checked` : ``}>
              <label for="statistic-today" class="statistic__filters-label">Today</label>

              <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${activePeriod === Period.WEEK ? `checked` : ``}>
              <label for="statistic-week" class="statistic__filters-label">Week</label>

              <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${activePeriod === Period.MONTH ? `checked` : ``}>
              <label for="statistic-month" class="statistic__filters-label">Month</label>

              <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${activePeriod === Period.YEAR ? `checked` : ``}>
              <label for="statistic-year" class="statistic__filters-label">Year</label>
            </form>

            <ul class="statistic__text-list">
              <li class="statistic__text-item">
                <h4 class="statistic__item-title">You watched</h4>
                <p class="statistic__item-text">${watchedQuantity} <span class="statistic__item-description">movies</span></p>
              </li>
              <li class="statistic__text-item">
                <h4 class="statistic__item-title">Total duration</h4>
                <p class="statistic__item-text">${hours} <span class="statistic__item-description">h</span> ${minutes} <span class="statistic__item-description">m</span></p>
              </li>
              <li class="statistic__text-item">
                <h4 class="statistic__item-title">Top genre</h4>
                <p class="statistic__item-text">${topGenre}</p>
              </li>
            </ul>

            <div class="statistic__chart-wrap">
              <canvas class="statistic__chart" width="1000"></canvas>
            </div>

          </section>`;
};

class Stats extends SmartView {
  constructor(state) {
    super(state);
    this._sourceFilms = state;
    this._acvitePeriod = Period.ALL_TIME;
    this.setCharts();
    this._handlePeriodChange = this._handlePeriodChange.bind(this);
    this.setHandlePeriodChange();
  }

  getTemplate() {
    return createStatsTemplate(this._state, this._acvitePeriod);
  }

  hide() {
    this.element.classList.add(`hide`);
  }

  show() {
    this.element.classList.remove(`hide`);
  }

  _handlePeriodChange(evt) {
    this._acvitePeriod = evt.target.value;
    this.updateState(this._state, true);
  }

  setHandlePeriodChange() {
    this.element.querySelector(`.statistic__filters`).addEventListener(`change`, this._handlePeriodChange);
  }

  restoreHandlers() {
    this.setCharts();
    this.setHandlePeriodChange();
  }

  setCharts() {
    const statisticCtx = this.element.querySelector(`.statistic__chart`);
    renderChart(statisticCtx, FilterPeriod[this._acvitePeriod](this._state));
  }
}

export {Stats};
