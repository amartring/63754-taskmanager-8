import {getRandomNumber} from './util.js';

const moment = require(`moment`);

export default () => ({
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
  tags: new Set([
    `keks`,
    `brainstorm`,
    `lazydays`,
    `hardwork`,
  ]),
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
