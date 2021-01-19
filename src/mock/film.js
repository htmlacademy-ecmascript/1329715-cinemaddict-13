import {
  getIdGenerator,
  getMockArray,
  getRandomArrayElement,
  getRandomDoubleNumber,
  getRandomIntegerNumber
} from "../util/common";
import {generateComment} from "./comment";
import dayjs from "dayjs";

const generateId = getIdGenerator();

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

const generateRelease = () => {
  const maxGapInYears = 50;
  const maxDaysGap = 365 * maxGapInYears;
  const gapInDays = getRandomIntegerNumber(0, maxDaysGap);
  return {
    date: dayjs().subtract(gapInDays, `day`).toDate(),
    releaseCountry: `country-${getRandomIntegerNumber(0, 300)}`
  };
};

const generateFilmInfo = () => {
  return {
    title: `title-${getRandomIntegerNumber(0, 100)}`,
    alternativeTitle: `alternativeTitle-${getRandomIntegerNumber(0, 100)}`,
    rating: getRandomDoubleNumber(0, 10).toFixed(1),
    poster: generatePoster(),
    ageRating: getRandomIntegerNumber(0, 18),
    director: `director-${getRandomIntegerNumber(0, 100)}`,
    writers: generateWriters(),
    actors: generateActors(),
    release: generateRelease(),
    runtime: getRandomIntegerNumber(5, 150),
    genre: generateGenres(),
    description: generateDescription(),
  };
};

const generateUserDetails = () => {
  return {
    watchlist: Boolean(getRandomIntegerNumber()),
    alreadyWatched: Boolean(getRandomIntegerNumber()),
    favorite: Boolean(getRandomIntegerNumber())
  };
};

const generateFilm = () => {
  return {
    id: generateId(),
    comments: generateComments(),
    filmInfo: generateFilmInfo(),
    userDetails: generateUserDetails()
  };
};

export {generateFilm};
