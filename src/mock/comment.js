import {getIdGenerator, getMockArray, getRandomArrayElement, getRandomIntegerNumber} from "../util/util";
import dayjs from "dayjs";

const generateId = getIdGenerator();

const generateAuthor = () => {
  const authors = getMockArray(`author`, 100);
  return getRandomArrayElement(authors);
};

const generateFilmComment = () => {
  const comments = getMockArray(`comment`, 100);
  return getRandomArrayElement(comments);
};

const generateDate = () => {
  const yearInSeconds = 31556952;
  return dayjs().subtract(getRandomIntegerNumber(0, yearInSeconds), `second`).toDate();
};

const generateEmotion = () => {
  const emotions = [`smile`, `sleeping`, `puke`, `angry`];
  return getRandomArrayElement(emotions);
};

const generateComment = () => {
  return {
    "id": generateId(),
    "author": generateAuthor(),
    "comment": generateFilmComment(),
    "date": generateDate(),
    "emotion": generateEmotion()
  };
};

export {generateComment};
