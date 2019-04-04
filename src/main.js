import {filters} from './data.js';
import Task from './task.js';
import TaskEdit from './task-edit.js';
import Filter from './filter.js';
import Statistic from './statistic.js';
import API from './api.js';
import {filterTasks, filterByTag, searchTasks} from './filter-tasks.js';
import {VISIBLE_TASKS_NUMBER, HiddenClass, Message} from './constants.js';

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
const searchLink = document.querySelector(`#control__search`);
const searchFild = document.querySelector(`#search__input`);

const setupTasksLoader = function () {
  const invisibleTasks = tasksContainer.querySelectorAll(`.card.${HiddenClass.REGULAR}`);
  return invisibleTasks.length === 0
    ? tasksLoader.classList.add(HiddenClass.REGULAR)
    : tasksLoader.classList.remove(HiddenClass.REGULAR);
};

const hideExtraTasks = () => {
  const tasks = tasksContainer.querySelectorAll(`.card`);
  tasks.forEach((task, index) => {
    return index >= VISIBLE_TASKS_NUMBER && task.classList.add(HiddenClass.REGULAR);
  });
};

const onLoaderClick = () => {
  const invisibleTasks = tasksContainer.querySelectorAll(`.card.${HiddenClass.REGULAR}`);
  for (let i = 0; i < invisibleTasks.length && i < VISIBLE_TASKS_NUMBER; i++) {
    invisibleTasks[i].classList.remove(HiddenClass.REGULAR);
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
      filteredTasks.length > 0 && result.querySelector(`.result__empty`).classList.add(HiddenClass.REGULAR);
      result.querySelector(`.result__title`).textContent = `#${tag.toUpperCase()}`;
      board.classList.add(HiddenClass.REGULAR);
      result.classList.remove(HiddenClass.REGULAR);
    };

    taskComponent.onChange = (newObject) => {
      item = Object.assign(item, newObject);
      api.updateTask({id: item.id, data: item.toRAW()})
        .then((updatedTask) => {
          taskComponent.update(updatedTask);
        });
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
      result.classList.add(HiddenClass.REGULAR);
      searchFild.classList.add(HiddenClass.SEARCH);
      board.classList.remove(HiddenClass.REGULAR);
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

const onTasksClick = () => {
  statsContainer.classList.add(HiddenClass.REGULAR);
  result.classList.add(HiddenClass.REGULAR);
  searchFild.classList.add(HiddenClass.SEARCH);
  board.classList.remove(HiddenClass.REGULAR);
};

const onStatisticClick = () => {
  board.classList.add(HiddenClass.REGULAR);
  result.classList.add(HiddenClass.REGULAR);
  searchFild.classList.add(HiddenClass.SEARCH);
  statsContainer.classList.remove(HiddenClass.REGULAR);
};

const onSearchClick = () => {
  statsContainer.classList.add(HiddenClass.REGULAR);
  board.classList.remove(HiddenClass.REGULAR);
  searchFild.classList.remove(HiddenClass.SEARCH);
  searchFild.value = ``;
};

const onResultBackClick = () => {
  result.classList.add(HiddenClass.REGULAR);
  board.classList.remove(HiddenClass.REGULAR);
  searchFild.value = ``;
};

const showLoadingMessage = (text) => {
  loadingContainer.classList.remove(HiddenClass.REGULAR);
  loadingContainer.textContent = text;
};

const hideLoadingMessage = () => {
  loadingContainer.classList.add(HiddenClass.REGULAR);
};

const getSearchData = (target) => {
  const array = target.value.split(``);
  let symbol = ``;
  let request = ``;
  switch (array[0]) {
    case `D`:
      symbol = `D`;
      request = array.splice(1, array.length).join(``);
      break;
    case `#`:
      symbol = `#`;
      request = array.splice(1, array.length).join(``);
      break;
    default:
      request = target.value;
      break;
  }
  return [symbol, request];
};

const onSearchInput = (evt) => {
  const target = evt.target;
  if (target.value.length >= 3) {
    resultContainer.innerHTML = ``;
    const [symbol, request] = getSearchData(target);

    api.getTasks()
      .then((cards) => {
        const filteredTasks = searchTasks(cards, symbol, request);
        renderTasks(filteredTasks, resultContainer);
        filteredTasks.length > 0
          ? result.querySelector(`.result__empty`).classList.add(HiddenClass.REGULAR)
          : result.querySelector(`.result__empty`).classList.remove(HiddenClass.REGULAR);
      });
    result.querySelector(`.result__title`).textContent = target.value;
    board.classList.add(HiddenClass.REGULAR);
    result.classList.remove(HiddenClass.REGULAR);
  } else {
    board.classList.remove(HiddenClass.REGULAR);
    result.classList.add(HiddenClass.REGULAR);
  }
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

tasksLink.addEventListener(`click`, onTasksClick);
statsLink.addEventListener(`click`, onStatisticClick);
searchLink.addEventListener(`click`, onSearchClick);
resultBackLink.addEventListener(`click`, onResultBackClick);
tasksLoader.addEventListener(`click`, onLoaderClick);
searchFild.addEventListener(`input`, onSearchInput);
// newTaskButton.addEventListener(`click`, onNewTaskButtonClick);

// console.log(api.getTasks());
