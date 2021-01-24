import {Smart as SmartView} from "./smart";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getUserRank} from "./user-info";
import {Filter, MenuType} from "../util/const";

// const BAR_HEIGHT = 50;
// const statisticCtx = document.querySelector(`.statistic__chart`);
// //
// // // Обязательно рассчитайте высоту canvas, она зависит от количества элементов диаграммы
// statisticCtx.height = BAR_HEIGHT * 5;
//
// const myChart = new Chart(statisticCtx, {
//   plugins: [ChartDataLabels],
//   type: `horizontalBar`,
//   data: {
//     labels: [`Sci-Fi`, `Animation`, `Fantasy`, `Comedy`, `TV Series`],
//     datasets: [{
//       data: [11, 8, 7, 4, 3],
//       backgroundColor: `#ffe800`,
//       hoverBackgroundColor: `#ffe800`,
//       anchor: `start`
//     }]
//   },
//   options: {
//     plugins: {
//       datalabels: {
//         font: {
//           size: 20
//         },
//         color: `#ffffff`,
//         anchor: 'start',
//         align: 'start',
//         offset: 40,
//       }
//     },
//     scales: {
//       yAxes: [{
//         ticks: {
//           fontColor: `#ffffff`,
//           padding: 100,
//           fontSize: 20
//         },
//         gridLines: {
//           display: false,
//           drawBorder: false
//         },
//         barThickness: 24
//       }],
//       xAxes: [{
//         ticks: {
//           display: false,
//           beginAtZero: true
//         },
//         gridLines: {
//           display: false,
//           drawBorder: false
//         },
//       }],
//     },
//     legend: {
//       display: false
//     },
//     tooltips: {
//       enabled: false
//     }
//   }
// });

const getTopGenre = (films) => {
  const map = new Map();
  let maxQuantity = 0;
  let topGenre = ``;
  films.forEach(({filmInfo: {genre: genres}}) => {
    genres.forEach((genre) => {
      const oldValue = +map.get(genre);
      const newValue = isNaN(oldValue) ? 0 : oldValue + 1;
      if (newValue > maxQuantity) {
        topGenre = genre;
      }
      map.set(genre, newValue);
    });
  });
  return topGenre;
};

const createStatsTemplate = (films) => {
  films = Filter[MenuType.HISTORY](films);
  const watchedQuantity = films.length;
  const userRank = getUserRank(watchedQuantity);
  const allRuntime = films.reduce((accumulator, curFilm) => accumulator + curFilm.filmInfo.runtime, 0);
  const minInHour = 60;
  const hours = Math.floor(allRuntime / minInHour);
  const minutes = allRuntime % minInHour;
  const topGenre = getTopGenre(films);

  return `<section class="statistic hide">
            <p class="statistic__rank">
              Your rank
              <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
              <span class="statistic__rank-label">${userRank}</span>
            </p>

            <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
              <p class="statistic__filters-description">Show stats:</p>

              <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
              <label for="statistic-all-time" class="statistic__filters-label">All time</label>

              <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
              <label for="statistic-today" class="statistic__filters-label">Today</label>

              <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
              <label for="statistic-week" class="statistic__filters-label">Week</label>

              <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
              <label for="statistic-month" class="statistic__filters-label">Month</label>

              <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
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
  }

  getTemplate() {
    return createStatsTemplate(this._state);
  }

  hide() {
    this.element.classList.add(`hide`);
  }

  show() {
    this.element.classList.remove(`hide`);
  }

  restoreHandlers() {
    // ADD restoring handlers
  }
}

export {Stats};
