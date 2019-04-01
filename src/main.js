import moment from 'moment';
import {filters} from './data.js';
import Task from './task.js';
import TaskEdit from './task-edit.js';
import Filter from './filter.js';
import Statistic from './statistic.js';
import API from './api.js';

// const TASKS_COUNT = 7;
const HIDDEN_CLASS = `visually-hidden`;
const LOADING_MESSAGE = `Loading tasks...`;
const ERROR_MESSAGE = `Something went wrong while loading your tasks. Check your connection or try again later`;
const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
const END_POINT = `https://es8-demo-srv.appspot.com/task-manager`;

const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

const filterContainer = document.querySelector(`.filter`);
const board = document.querySelector(`.board`);
const tasksContainer = board.querySelector(`.board__tasks`);
const statsContainer = document.querySelector(`.statistic`);
const statsLink = document.querySelector(`#control__statistic`);
const tasksLink = document.querySelector(`#control__task`);
const loadingContainer = document.querySelector(`.board__no-tasks`);

// const createTasks = (count, data) => {
//   return new Array(count)
//   .fill(``)
//   .map(() => data());
// };

// const tasks = createTasks(TASKS_COUNT, task);

const renderCards = (data) => {
  tasksContainer.innerHTML = ``;
  data.forEach((item) => {
    const taskComponent = new Task(item);
    const editTaskComponent = new TaskEdit(item);

    taskComponent.onEdit = () => {
      editTaskComponent.onSubmit = (newObject) => {
        item = Object.assign(item, newObject);

        api.updateTask({id: item.id, data: item.toRAW()})
        .then((newTask) => {
          editTaskComponent.unblock();
          taskComponent.update(newTask);
          taskComponent.render();
          tasksContainer.replaceChild(taskComponent.element, editTaskComponent.element);
          editTaskComponent.update(newTask);
          editTaskComponent.unrender();
          renderStatistic(data);
        })
        .catch(() => {
          editTaskComponent.shake();
          editTaskComponent.unblock();
        });
      };

      editTaskComponent.onDelete = () => {
        api.deleteTask({id: item.id})
          .then(() => api.getTasks())
          .then((cards) => {
            renderCards(cards);
            renderStatistic(cards);
          })
          .catch(() => {
            editTaskComponent.shake();
            editTaskComponent.unblock();
          });
      };

      editTaskComponent.onClose = () => {
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
};

const filterTasks = (data, filterName) => {
  let filteredTasks = data;

  switch (filterName) {
    case `all`:
      filteredTasks = data;
      break;

    case `overdue`:
      filteredTasks = data.filter((it) => moment(it.dueDate).isBefore(moment().subtract(1, `day`)));
      break;

    case `today`:
      filteredTasks = data.filter((it) => moment(it.dueDate).format(`D MMMM YYYY`) === moment().format(`D MMMM YYYY`));
      break;

    case `repeating`:
      filteredTasks = data.filter((it) => [...Object.entries(it.repeatingDays)]
          .some((rec) => rec[1]));
      break;

    case `tags`:
      filteredTasks = data.filter((it) => [...it.tags].length);
      break;
  }
  return filteredTasks;
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

const renderStatistic = (data) => {
  statsContainer.innerHTML = ``;
  const statsComponent = new Statistic(data);
  statsContainer.appendChild(statsComponent.render());
  statsComponent.update();
};

const onStatisticClick = () => {
  board.classList.add(HIDDEN_CLASS);
  statsContainer.classList.remove(HIDDEN_CLASS);
};

const onTasksClick = () => {
  board.classList.remove(HIDDEN_CLASS);
  statsContainer.classList.add(HIDDEN_CLASS);
};

const showLoadingMessage = (text) => {
  loadingContainer.classList.remove(HIDDEN_CLASS);
  loadingContainer.textContent = text;
};

const hideLoadingMessage = () => {
  loadingContainer.classList.add(HIDDEN_CLASS);
};

showLoadingMessage(LOADING_MESSAGE);

api.getTasks()
  .then((cards) => {
    hideLoadingMessage();
    renderCards(cards);
    renderFilters(filters, cards);
    renderStatistic(cards);
  })
  .catch(() => {
    showLoadingMessage(ERROR_MESSAGE);
  });

statsLink.addEventListener(`click`, onStatisticClick);
tasksLink.addEventListener(`click`, onTasksClick);

console.log(api.getTasks());
