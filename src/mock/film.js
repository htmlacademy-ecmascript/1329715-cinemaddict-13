import {
  getIdGenerator,
  getMockArray,
  getRandomArrayElement,
  getRandomDoubleNumber,
  getRandomIntegerNumber
} from "../util/util";
import {generateComment} from "./comment";
import dayjs from "dayjs";

const generateId = getIdGenerator();

const generateTitle = () => {
  const titles = getMockArray(`title`, 100);
  return getRandomArrayElement(titles);
};

const generatePoster = () => {
  const allPosters = [`made-for-each-other.png`, `popeye-meets-sinbad.png`, `sagebrush-trail.jpg`,
    `santa-claus-conquers-the-martians.jpg`, `the-dance-of-life.jpg`, `the-great-flamarion.jpg`,
    `the-man-with-the-golden-arm.jpg`];
  return getRandomArrayElement(allPosters);
};

const generateDescription = () => {
  const allDescriptionPhrases = [`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    `Cras aliquet varius magna, non porta ligula feugiat eget.`, `Fusce tristique felis at fermentum pharetra.`,
    `Aliquam id orci ut lectus varius viverra.`, `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
    `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
    `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
    `Sed sed nisi sed augue convallis suscipit in sed felis.`, `Aliquam erat volutpat.`,
    `Nunc fermentum tortor ac porta dapibus.`, `In rutrum ac purus sit amet tempus.`];
  const minDescriptionPhraseQuantity = 1;
  const maxDescriptionPhraseQuantity = 5;
  const descriptionPhraseQuantity = getRandomIntegerNumber(minDescriptionPhraseQuantity, maxDescriptionPhraseQuantity);
  const descriptions = new Set();
  while (descriptions.size < descriptionPhraseQuantity) {
    descriptions.add(getRandomArrayElement(allDescriptionPhrases));
  }
  return Array.from(descriptions).join(` `);
};

const generateComments = () => {
  const comments = [];
  const minCommentsQuantity = 0;
  const maxCommentsQuantity = 5;
  const commentsQuantity = getRandomIntegerNumber(minCommentsQuantity, maxCommentsQuantity);
  for (let i = 0; i < commentsQuantity; i++) {
    comments.push(generateComment());
  }
  return comments;
};

const generateGenres = () => {
  const genresMock = getMockArray(`genre`, 20);
  const genres = new Set();
  const genreQuantity = getRandomIntegerNumber(1, 5);
  while (genres.size < genreQuantity) {
    genres.add(getRandomArrayElement(genresMock));
  }
  return Array.from(genres);
};

const generateAlternativeTitle = () => {
  const alternativeTitles = getMockArray(`alternativeTitle`, 100);
  return getRandomArrayElement(alternativeTitles);
};

const generateDirector = () => {
  const directors = getMockArray(`alternativeTitle`, 100);
  return getRandomArrayElement(directors);
};

const generateWriters = () => {
  const writerMocks = getMockArray(`writer`, 20);
  const writers = new Set();
  const writerQuantity = getRandomIntegerNumber(1, 5);
  while (writers.size < writerQuantity) {
    writers.add(getRandomArrayElement(writerMocks));
  }
  return Array.from(writers);
};

const generateActors = () => {
  const actorMocks = getMockArray(`actor`, 20);
  const actors = new Set();
  const actorQuantity = getRandomIntegerNumber(1, 5);
  while (actors.size < actorQuantity) {
    actors.add(getRandomArrayElement(actorMocks));
  }
  return Array.from(actors);
};

const generateCountry = () => {
  const countries = getMockArray(`country`, 300);
  return getRandomArrayElement(countries);
};

const generateRelease = () => {
  const gapInYears = 50;
  const daysGap = 365 * gapInYears;

  return {
    date: dayjs().subtract(getRandomIntegerNumber(0, daysGap), `day`).toDate(),
    releaseCountry: generateCountry()
  };
};

const generateFilmInfo = () => {
  return {
    title: generateTitle(),
    alternativeTitle: generateAlternativeTitle(),
    rating: getRandomDoubleNumber(0, 10).toFixed(1),
    poster: generatePoster(),
    ageRating: getRandomIntegerNumber(0, 18),
    director: generateDirector(),
    writers: generateWriters(),
    actors: generateActors(),
    release: generateRelease(),
    runtime: getRandomIntegerNumber(5, 150),
    genre: generateGenres(),
    description: generateDescription(),
  };
};

const generateFilm = () => {
  return {
    id: generateId(),
    filmInfo: generateFilmInfo(),
    comments: generateComments(),
  };
};

export {generateFilm};
