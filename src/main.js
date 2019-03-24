import {getRandomNumber} from './util.js';
import task from './data.js';
import Task from './task.js';
import TaskEdit from './task-edit.js';

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

FILTERS.forEach((item) => {
  filterContainer.insertAdjacentHTML(`beforeend`, makeFilter(item.name, item.isDisabled, item.isChecked));
});

const onFiltersClick = () => {
  const randomCount = getRandomNumber(TasksCount.MIN, TasksCount.MAX);
  tasksContainer.innerHTML = ``;
  renderCards(createTasks(randomCount, task));
};

const updateTasks = () => {
  const filters = filterContainer.querySelectorAll(`.filter__input`);
  filters.forEach((item) => {
    item.addEventListener(`click`, onFiltersClick);
  });
};

const createTasks = (count, data) => {
  return new Array(count)
  .fill(``)
  .map(() => data());
};

const renderCards = (data) => {
  // const fragment = document.createDocumentFragment();

  data.forEach((item) => {
    const taskComponent = new Task(item);

    taskComponent.onEdit = () => {
      const editTaskComponent = new TaskEdit(item);

      editTaskComponent.onSubmit = (newObject) => {
        taskComponent.update(Object.assign(item, newObject));
        taskComponent.render();
        tasksContainer.replaceChild(taskComponent.element, editTaskComponent.element);
        editTaskComponent.unrender();
      };

      editTaskComponent.render();
      tasksContainer.replaceChild(editTaskComponent.element, taskComponent.element);
      taskComponent.unrender();
    };

    tasksContainer.appendChild(taskComponent.render());
  });

  // tasksContainer.appendChild(fragment);
};

renderCards(createTasks(TasksCount.MIN, task));
updateTasks();
