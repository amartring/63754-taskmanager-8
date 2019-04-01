export const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const randomNumber = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[randomNumber];
    array[randomNumber] = temp;
  }
  return array;
};

export const getRandomArrayElements = (values, amount) => {
  const arrayCopy = Array.from(values);
  const newArray = [];

  while (amount > 0) {
    newArray.push(arrayCopy[getRandomNumber(0, arrayCopy.length - 1)]);
    amount--;
  }
  return newArray;
};
