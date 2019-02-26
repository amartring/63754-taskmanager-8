import {getRandomNumber} from './util.js';
import makeFilter from './make-filter.js';
import makeTask from './make-task.js';
import getTask from './data.js';

const FILTERS = [
  {
    name: `all`,
    isDisabled: false,
    isChecked: true
  },
  {
    name: `overdue`,
    isDisabled: true
  },
  {
    name: `today`,
    isDisabled: true
  },
  {
    name: `favorites`,
    isDisabled: false
  },
  {
    name: `repeating`,
    isDisabled: false
  },
  {
    name: `tags`,
    isDisabled: false
  },
  {
    name: `archive`,
    isDisabled: false
  }
];

const TasksCount = {
  MIN: 7,
  MAX: 20
};

const filterContainer = document.querySelector(`.filter`);
const tasksContainer = document.querySelector(`.board__tasks`);

const onFiltersClick = () => {
  const randomCount = getRandomNumber(TasksCount.MIN, TasksCount.MAX);
  tasksContainer.innerHTML = ``;
  createTasks(tasksContainer, randomCount);
};

const updateTasks = () => {
  const filters = filterContainer.querySelectorAll(`.filter__input`);
  filters.forEach((item) => {
    item.addEventListener(`click`, onFiltersClick);
  });
};

const createTasks = (container, count) => {
  container.insertAdjacentHTML(`beforeend`, new Array(count)
    .fill(``)
    .map(() => makeTask(getTask()))
    .join(``));
};

FILTERS.forEach((item) => {
  filterContainer.insertAdjacentHTML(`beforeend`, makeFilter(item.name, item.isDisabled, item.isChecked));
});

createTasks(tasksContainer, TasksCount.MIN);

updateTasks();
