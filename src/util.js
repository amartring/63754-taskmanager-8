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

export const hexColor = {
  yellow: `#ffe125`,
  pink: `#ff3cb9`,
  blue: `#0c5cdd`,
  green: `#31b55c`,
  black: `#000000`,
  orange: `#ffa500`,
  purple: `#800080`,
  teal: `#008080`,
  skyblue: `#87ceeb`,
};
