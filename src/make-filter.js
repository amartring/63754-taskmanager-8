import {getRandomNumber} from './util.js';

const FilterAmount = {
  MIN: 0,
  MAX: 250
};

export default (name, isDisabled, isChecked = false) => {
  const amount = getRandomNumber(FilterAmount.MIN, FilterAmount.MAX);
  return `
  <input
    type="radio"
    id="filter__${name.toLowerCase()}"
    class="filter__input visually-hidden"
    name="filter"
    ${isChecked ? ` checked` : ``}
    ${isDisabled ? ` disabled` : ``}
  >
  <label
    for="filter__${name.toLowerCase()}"
    class="filter__label">${name.toUpperCase()}
  <span
    class="filter__${name.toLowerCase()}-count">
      ${amount}
  </span>
  </label>
  `;
};
