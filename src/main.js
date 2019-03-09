import {getRandomNumber} from './util.js';
import task from './data.js';
import {Task} from './task.js';
import {TaskEdit} from './task-edit.js';

import makeFilter from './make-filter.js';

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

let datas = [];
let taskComponents = [];
let editTaskComponents = [];

FILTERS.forEach((item) => {
  filterContainer.insertAdjacentHTML(`beforeend`, makeFilter(item.name, item.isDisabled, item.isChecked));
});

const createTasks = (count, data) => {
  return new Array(count)
  .fill(``)
  .map(() => data());
};

const getTasksArray = (data, Constructor) => {
  let array = [];
  data.forEach((item) => {
    array.push(new Constructor(item));
  });
  return array;
};

const renderTasks = (array) => {
  for (const item of array) {
    tasksContainer.appendChild(item.render());
  }
};

const editChange = () => {
  taskComponents.forEach((item, i) => {
    item.onEdit = () => {
      editTaskComponents[i].render();
      tasksContainer.replaceChild(editTaskComponents[i].element, taskComponents[i].element);
      taskComponents[i].unrender();
    };
  });

  editTaskComponents.forEach((item, i) => {
    item.onSubmit = () => {
      taskComponents[i].render();
      tasksContainer.replaceChild(taskComponents[i].element, editTaskComponents[i].element);
      editTaskComponents[i].unrender();
    };
  });
};

const start = (count) => {
  datas = createTasks(count, task);
  taskComponents = getTasksArray(datas, Task);
  editTaskComponents = getTasksArray(datas, TaskEdit);

  renderTasks(taskComponents);
  editChange();
};

const onFiltersClick = () => {
  const randomCount = getRandomNumber(TasksCount.MIN, TasksCount.MAX);
  tasksContainer.innerHTML = ``;

  datas = createTasks(randomCount, task);
  taskComponents = getTasksArray(datas, Task);
  editTaskComponents = getTasksArray(datas, TaskEdit);
  renderTasks(taskComponents);
  editChange();
};

const updateTasks = () => {
  const filters = filterContainer.querySelectorAll(`.filter__input`);
  filters.forEach((item) => {
    item.addEventListener(`click`, onFiltersClick);
  });
};

start(TasksCount.MIN);
updateTasks();
