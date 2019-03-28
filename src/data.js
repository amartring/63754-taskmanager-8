import {getRandomNumber, shuffleArray} from './util.js';
import moment from 'moment';

const getTags = () => {
  const tags = new Set([
    `homework`,
    `theory`,
    `practice`,
    `intensive`,
    `keks`,
    `brainstorm`,
    `htmlacademy`,
    `lazydays`,
    `hardwork`,
  ]);
  return shuffleArray([...tags]).splice(Math.floor(Math.random() * 5), Math.floor(Math.random() * 4));
};

const task = () => ({
  title: [
    `Изучить теорию`,
    `Сделать домашку`,
    `Пройти интенсив на соточку`,
  ][Math.floor(Math.random() * 3)],
  dueDate: [
    moment().add(getRandomNumber(0, 7), `d`).format(`D MMMM YYYY`),
    moment().subtract(getRandomNumber(0, 7), `d`).format(`D MMMM YYYY`),
  ][Math.floor(Math.random() * 2)],
  dueTime: ``,
  tags: getTags(),
  picture: `http://picsum.photos/100/100?r=${Math.random()}`,
  color: [
    `black`,
    `yellow`,
    `blue`,
    `green`,
    `pink`,
  ][Math.floor(Math.random() * 5)],
  repeatingDays: {
    'mo': false,
    'tu': false,
    'we': false,
    'th': false,
    'fr': false,
    'sa': false,
    'su': false,
  },
  isFavorite: [true, false][Math.floor(Math.random() * 2)],
  isDone: [true, false][Math.floor(Math.random() * 2)],
});

const filters = [
  {
    name: `all`,
    isDisabled: false,
    isChecked: true,
  },
  {
    name: `overdue`,
    isDisabled: false,
    isChecked: false,
  },
  {
    name: `today`,
    isDisabled: false,
    isChecked: false,
  },
  {
    name: `favorites`,
    isDisabled: true,
    isChecked: false,
  },
  {
    name: `repeating`,
    isDisabled: false,
    isChecked: false,
  },
  {
    name: `tags`,
    isDisabled: false,
    isChecked: false,
  },
  {
    name: `archive`,
    isDisabled: true,
    isChecked: false,
  }
];

export {task, filters};
