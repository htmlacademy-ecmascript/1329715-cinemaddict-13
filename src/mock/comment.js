import {getIdGenerator, getRandomArrayElement, getRandomIntegerNumber} from "../util/common";
import dayjs from "dayjs";
import {EMOTIONS} from "../util/const";

const generateId = getIdGenerator();

const generateDate = () => {
  const maxSecondsGapYear = 31556952;
  const secondsGap = getRandomIntegerNumber(0, maxSecondsGapYear);
  return dayjs().subtract(secondsGap, `second`).toDate();
};

const generateEmotion = () => {
  return getRandomArrayElement(EMOTIONS);
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
