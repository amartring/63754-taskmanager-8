import {filters, newTask} from './data.js';
import Task from './task.js';
import TaskEdit from './task-edit.js';
import Filter from './filter.js';
import Statistic from './statistic.js';
import API from './api.js';
import {filterTasks, filterByTag} from './filter-tasks.js';
import {HIDDEN_CLASS, VISIBLE_TASKS_NUMBER, Message} from './constants.js';

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
const END_POINT = `https://es8-demo-srv.appspot.com/task-manager`;

const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

const filterContainer = document.querySelector(`.filter`);
const board = document.querySelector(`.board`);
const tasksContainer = board.querySelector(`.board__tasks`);
const tasksLoader = board.querySelector(`.load-more`);
const statsContainer = document.querySelector(`.statistic`);
const statsLink = document.querySelector(`#control__statistic`);
const tasksLink = document.querySelector(`#control__task`);
const loadingContainer = document.querySelector(`.board__no-tasks`);
// const newTaskButton = document.querySelector(`#control__new-task`);
const result = document.querySelector(`.result`);
const resultContainer = result.querySelector(`.result__cards`);
const resultBackLink = result.querySelector(`.result__back`);

const setupTasksLoader = function () {
  const invisibleTasks = tasksContainer.querySelectorAll(`.card.${HIDDEN_CLASS}`);
  return invisibleTasks.length === 0
    ? tasksLoader.classList.add(HIDDEN_CLASS)
    : tasksLoader.classList.remove(HIDDEN_CLASS);
};

const hideExtraTasks = () => {
  const tasks = tasksContainer.querySelectorAll(`.card`);
  tasks.forEach((task, index) => {
    return index >= VISIBLE_TASKS_NUMBER && task.classList.add(HIDDEN_CLASS);
  });
};

const onLoaderClick = () => {
  const invisibleTasks = tasksContainer.querySelectorAll(`.card.${HIDDEN_CLASS}`);
  for (let i = 0; i < invisibleTasks.length && i < VISIBLE_TASKS_NUMBER; i++) {
    invisibleTasks[i].classList.remove(HIDDEN_CLASS);
  }
  setupTasksLoader();
};

// const onNewTaskButtonClick = () => {
// const task = renderTasks(newTask);
// api.createTask({newTask});
// return task;
// };

const renderTasks = (data, container) => {
  // tasksContainer.innerHTML = ``;
  data.forEach((item) => {
    const taskComponent = new Task(item);
    const editTaskComponent = new TaskEdit(item);

    taskComponent.onEdit = () => {
      editTaskComponent.onSubmit = (newObject) => {
        item = Object.assign(item, newObject);

        api.updateTask({id: item.id, data: item.toRAW()})
        .then((updatedTask) => {
          editTaskComponent.unblock();
          taskComponent.update(updatedTask);
          taskComponent.render();
          container.replaceChild(taskComponent.element, editTaskComponent.element);
          editTaskComponent.update(updatedTask);
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
            tasksContainer.innerHTML = ``;
            renderTasks(cards, tasksContainer);
            renderStatistic(cards);
          })
          .catch(() => {
            editTaskComponent.shake();
            editTaskComponent.unblock();
          });
      };

      editTaskComponent.onClose = () => {
        taskComponent.render();
        container.replaceChild(taskComponent.element, editTaskComponent.element);
        editTaskComponent.unrender();
      };

      editTaskComponent.render();
      container.replaceChild(editTaskComponent.element, taskComponent.element);
      taskComponent.unrender();
    };

    taskComponent.onTag = (tag) => {
      resultContainer.innerHTML = ``;
      const filteredTasks = filterByTag(data, tag);
      renderTasks(filteredTasks, resultContainer);
      filteredTasks.length > 0 && result.querySelector(`.result__empty`).classList.add(HIDDEN_CLASS);
      result.querySelector(`.result__title`).textContent = `#${tag.toUpperCase()}`;
      board.classList.add(HIDDEN_CLASS);
      result.classList.remove(HIDDEN_CLASS);
    };

    container.appendChild(taskComponent.render());
  });
};

const renderFilters = (filtersData, tasksData) => {
  filtersData.forEach((item) => {
    const filterComponent = new Filter(item);

    filterComponent.onFilter = () => {
      const filteredTasks = filterTasks(tasksData, filterComponent._name);
      tasksContainer.innerHTML = ``;
      renderTasks(filteredTasks, tasksContainer);
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
  statsContainer.classList.add(HIDDEN_CLASS);
  result.classList.add(HIDDEN_CLASS);
  board.classList.remove(HIDDEN_CLASS);
};

const onResultBackClick = () => {
  result.classList.add(HIDDEN_CLASS);
  board.classList.remove(HIDDEN_CLASS);
};

const showLoadingMessage = (text) => {
  loadingContainer.classList.remove(HIDDEN_CLASS);
  loadingContainer.textContent = text;
};

const hideLoadingMessage = () => {
  loadingContainer.classList.add(HIDDEN_CLASS);
};

showLoadingMessage(Message.LOADING);

api.getTasks()
  .then((cards) => {
    hideLoadingMessage();
    renderTasks(cards, tasksContainer);
    hideExtraTasks();
    setupTasksLoader();
    renderFilters(filters, cards);
    renderStatistic(cards);
  })
  .catch(() => {
    showLoadingMessage(Message.ERROR);
  });

statsLink.addEventListener(`click`, onStatisticClick);
tasksLink.addEventListener(`click`, onTasksClick);
resultBackLink.addEventListener(`click`, onResultBackClick);
tasksLoader.addEventListener(`click`, onLoaderClick);
// newTaskButton.addEventListener(`click`, onNewTaskButtonClick);

// console.log(api.getTasks());
