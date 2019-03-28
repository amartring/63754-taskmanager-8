import moment from 'moment';
import {task, filters} from './data.js';
import Task from './task.js';
import TaskEdit from './task-edit.js';
import Filter from './filter.js';
import Statistic from './statistic.js';

const TASKS_COUNT = 7;

const filterContainer = document.querySelector(`.filter`);
const board = document.querySelector(`.board`);
const tasksContainer = board.querySelector(`.board__tasks`);
const statsContainer = document.querySelector(`.statistic`);
const statsLink = document.querySelector(`#control__statistic`);
const tasksLink = document.querySelector(`#control__task`);

const createTasks = (count, data) => {
  return new Array(count)
  .fill(``)
  .map(() => data());
};

const tasks = createTasks(TASKS_COUNT, task);

const renderCards = (data) => {
  data.forEach((item) => {
    const taskComponent = new Task(item);
    const editTaskComponent = new TaskEdit(item);

    taskComponent.onEdit = () => {
      editTaskComponent.onSubmit = (newObject) => {
        taskComponent.update(Object.assign(item, newObject));
        taskComponent.render();
        tasksContainer.replaceChild(taskComponent.element, editTaskComponent.element);
        editTaskComponent.update(item);
        editTaskComponent.unrender();
      };

      editTaskComponent.onDelete = () => {
        editTaskComponent.unrender();
      };

      editTaskComponent.render();
      tasksContainer.replaceChild(editTaskComponent.element, taskComponent.element);
      taskComponent.unrender();
    };

    tasksContainer.appendChild(taskComponent.render());
  });
};

// eslint-disable-next-line consistent-return
const filterTasks = (data, filterName) => {
  switch (filterName) {
    case `all`:
      return data;

    case `overdue`:
      return data.filter((it) => moment(it.dueDate).format(`x`) < moment().subtract(1, `days`).format(`x`));

    case `today`:
      return data.filter((it) => it.dueDate === moment().format(`D MMMM YYYY`));

    case `repeating`:
      return data.filter((it) => [...Object.entries(it.repeatingDays)]
          .some((rec) => rec[1]));

    case `tags`:
      return data.filter((it) => it.tags.length);
  }
};

const renderFilters = (filtersData, tasksData) => {
  filtersData.forEach((item) => {
    const filterComponent = new Filter(item);

    filterComponent.onFilter = () => {
      const filteredTasks = filterTasks(tasksData, filterComponent._name);
      tasksContainer.innerHTML = ``;
      renderCards(filteredTasks);
    };

    filterContainer.appendChild(filterComponent.render());
  });
};

const showStatistic = () => {
  statsContainer.innerHTML = ``;
  const statsComponent = new Statistic(tasks);
  statsContainer.appendChild(statsComponent.render());
  board.classList.add(`visually-hidden`);
  statsContainer.classList.remove(`visually-hidden`);
};

const showTasks = () => {
  board.classList.remove(`visually-hidden`);
  statsContainer.classList.add(`visually-hidden`);
};

statsLink.addEventListener(`click`, showStatistic);
tasksLink.addEventListener(`click`, showTasks);

renderCards(tasks);
renderFilters(filters, tasks);
