const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffleArray = function (array) {
  for (let i = array.length - 1; i > 0; i--) {
    let randomNumber = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[randomNumber];
    array[randomNumber] = temp;
  }
  return array;
};

export {getRandomNumber, shuffleArray};
