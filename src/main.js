// import {getRandomNumber} from './util.js';
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

const onFiltersClick = () => {
  const randomCount = getRandomNumber(TasksCount.MIN, TasksCount.MAX);
  tasksContainer.innerHTML = ``;
  createTasks(randomCount, Task);
};

// const updateTasks = () => {
//   const filters = filterContainer.querySelectorAll(`.filter__input`);
//   filters.forEach((item) => {
//     item.addEventListener(`click`, onFiltersClick);
//   });
// };

// const createTasks = (count, Obj) => {
//   const tasksArray = new Array(count)
//   .fill(``)
//   .map(() => new Obj(task()));
//   for (const item of tasksArray) {
//     tasksContainer.appendChild(item.render());
//   }
// };

FILTERS.forEach((item) => {
  filterContainer.insertAdjacentHTML(`beforeend`, makeFilter(item.name, item.isDisabled, item.isChecked));
});

// updateTasks();

const taskComponent = new Task(task());
const editTaskComponent = new TaskEdit(task());

tasksContainer.appendChild(taskComponent.render());

taskComponent.onEdit = () => {
  editTaskComponent.render();
  tasksContainer.replaceChild(editTaskComponent.element, taskComponent.element);
  taskComponent.unrender();
};

editTaskComponent.onSubmit = () => {
  taskComponent.render();
  tasksContainer.replaceChild(taskComponent.element, editTaskComponent.element);
  editTaskComponent.unrender();
};
