const getIdGenerator = () => {
  let id = 0;
  return () => {
    return id++;
  };
};

const getRandomArrayElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const getMockArray = (str = `some-str`, size = 10) => {
  const mocks = [];
  for (let i = 0; i < size; i++) {
    mocks.push(`${str}-${i}`);
  }
  return mocks;
};

const getRandomIntegerNumber = (min = 0, max = 1) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomDoubleNumber = (min = 0, max = 1) => {
  return Math.random() * (max - min) + min;
};

export {getIdGenerator, getRandomArrayElement, getMockArray, getRandomIntegerNumber, getRandomDoubleNumber};
