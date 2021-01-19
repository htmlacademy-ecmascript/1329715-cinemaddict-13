import {getIdGenerator, getRandomArrayElement, getRandomIntegerNumber} from "../util/common";
import dayjs from "dayjs";

const generateId = getIdGenerator();

const generateDate = () => {
  const maxSecondsGapYear = 31556952;
  const secondsGap = getRandomIntegerNumber(0, maxSecondsGapYear);
  return dayjs().subtract(secondsGap, `second`).toDate();
};

const generateEmotion = () => {
  const emotions = [`smile`, `sleeping`, `puke`, `angry`];
  return getRandomArrayElement(emotions);
};

const generateComment = () => {
  return {
    "id": generateId(),
    "author": `author-${getRandomIntegerNumber(0, 10)}`,
    "comment": `comment-${getRandomIntegerNumber(0, 50)}`,
    "date": generateDate(),
    "emotion": generateEmotion()
  };
};

export {generateComment};
