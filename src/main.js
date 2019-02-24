import {getRandomNumber} from './util.js';
import getFilterElement from './make-filter.js';
import getCardElement from './make-task.js';

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

const TASK = {
  color: `yellow`,
  classList: [`card--repeat`],
  text: `New task № `,
  isDate: true,
  date: `20 February`,
  time: `13:22 PM`,
  isRepeat: false
};

const TasksCount = {
  MIN: 7,
  MAX: 20
};

const filterContainer = document.querySelector(`.filter`);
const tasksContainer = document.querySelector(`.board__tasks`);

const onFiltersClick = () => {
  const taskCount = getRandomNumber(TasksCount.MIN, TasksCount.MAX);
  tasksContainer.innerHTML = ``;
  createTasks(taskCount, TASK);
};

const updateTasks = () => {
  const filters = filterContainer.querySelectorAll(`.filter__input`);
  filters.forEach((item) => {
    item.addEventListener(`click`, onFiltersClick);
  });
};

const createTasks = (count, task) => {
  for (let i = 0; i < count; i++) {
    tasksContainer.insertAdjacentHTML(`beforeend`,
        getCardElement(task.color, task.classList, task.text + `${i + 1}`, task.isDate, task.date, task.time, task.isRepeat));
  }
};

FILTERS.forEach((item) => {
  filterContainer.insertAdjacentHTML(`beforeend`, getFilterElement(item.name, item.isDisabled, item.isChecked));
});

createTasks(TasksCount.MIN, TASK);

updateTasks();
