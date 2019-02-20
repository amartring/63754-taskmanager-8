'use strict';

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

const FilterAmount = {
  MIN: 0,
  MAX: 250
};

const filterContainer = document.querySelector(`.filter`);
const tasksContainer = document.querySelector(`.board__tasks`);

const getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getFilterElement = function (name, isDisabled, isChecked = false) {
  const amount = getRandomNumber(FilterAmount.MIN, FilterAmount.MAX);
  return `
  <input
    type="radio"
    id="filter__${name.toLowerCase()}"
    class="filter__input visually-hidden"
    name="filter"
    ${isChecked ? ` checked` : ``}
    ${isDisabled ? ` disabled` : ``}
  >
  <label
    for="filter__${name.toLowerCase()}"
    class="filter__label">${name.toUpperCase()}
  <span
    class="filter__${name.toLowerCase()}-count">
      ${amount}
  </span>
  </label>
  `;
};

const getCardElement = function (color, classList, text, isDate, date, time, isRepeat) {
  return `
  <article class="card card--${color} ${classList ? classList.join(` `) : ``}">
    <form class="card__form" method="get">
      <div class="card__inner">
        <div class="card__control">
          <button type="button" class="card__btn card__btn--edit">
            edit
          </button>
          <button type="button" class="card__btn card__btn--archive">
            archive
          </button>
          <button type="button" class="card__btn card__btn--favorites card__btn--disabled">
            favorites
          </button>
        </div>

        <div class="card__color-bar">
          <svg class="card__color-bar-wave" width="100%" height="10">
            <use xlink:href="#wave"></use>
          </svg>
        </div>

        <div class="card__textarea-wrap">
          <label>
            <textarea class="card__text" placeholder="Start typing your text here..." name="text">${text ? text : ``}</textarea>
          </label>
        </div>

        <div class="card__settings">
          <div class="card__details">
            <div class="card__dates">
              <button class="card__date-deadline-toggle" type="button">
                date: <span class="card__date-status">${isDate ? `yes` : `no`}</span>
              </button>

              <fieldset class="card__date-deadline" ${isDate ? `` : ` disabled`}>
                <label class="card__input-deadline-wrap">
                  <input
                    class="card__date"
                    type="text"
                    placeholder="23 September"
                    value="${isDate ? date : ``}"
                    name="date">
                </label>
                <label class="card__input-deadline-wrap">
                  <input
                    class="card__time"
                    type="text"
                    placeholder="11:15 PM"
                    value="${isDate ? time : ``}"
                    name="time">
                </label>
              </fieldset>

              <button class="card__repeat-toggle" type="button">
                repeat:<span class="card__repeat-status">${isRepeat ? `yes` : `no`}</span>
              </button>

              <fieldset class="card__repeat-days" ${isRepeat ? `` : ` disabled`}>
                <div class="card__repeat-days-inner">
                  <input class="visually-hidden card__repeat-day-input" type="checkbox" id="repeat-mo-2" name="repeat" value="mo">
                  <label class="card__repeat-day" for="repeat-mo-2">mo</label>
                  <input class="visually-hidden card__repeat-day-input" type="checkbox" id="repeat-tu-2" name="repeat" value="tu" checked="">
                  <label class="card__repeat-day" for="repeat-tu-2">tu</label>
                  <input class="visually-hidden card__repeat-day-input" type="checkbox" id="repeat-we-2" name="repeat" value="we">
                  <label class="card__repeat-day" for="repeat-we-2">we</label>
                  <input class="visually-hidden card__repeat-day-input" type="checkbox" id="repeat-th-2" name="repeat" value="th">
                  <label class="card__repeat-day" for="repeat-th-2">th</label>
                  <input class="visually-hidden card__repeat-day-input" type="checkbox" id="repeat-fr-2" name="repeat" value="fr" checked="">
                  <label class="card__repeat-day" for="repeat-fr-2">fr</label>
                  <input class="visually-hidden card__repeat-day-input" type="checkbox" name="repeat" value="sa" id="repeat-sa-2">
                  <label class="card__repeat-day" for="repeat-sa-2">sa</label>
                  <input class="visually-hidden card__repeat-day-input" type="checkbox" id="repeat-su-2" name="repeat" value="su" checked="">
                  <label class="card__repeat-day" for="repeat-su-2">su</label>
                </div>
              </fieldset>
            </div>

            <div class="card__hashtag">
              <div class="card__hashtag-list">
                <span class="card__hashtag-inner">
                  <input
                    type="hidden"
                    name="hashtag"
                    value="repeat"
                    class="card__hashtag-hidden-input"
                  />
                  <button type="button" class="card__hashtag-name">
                    #repeat
                  </button>
                  <button type="button" class="card__hashtag-delete">
                    delete
                  </button>
                </span>

                <span class="card__hashtag-inner">
                  <input
                    type="hidden"
                    name="hashtag"
                    value="repeat"
                    class="card__hashtag-hidden-input"
                  />
                  <button type="button" class="card__hashtag-name">
                    #cinema
                  </button>
                  <button type="button" class="card__hashtag-delete">
                    delete
                  </button>
                </span>

                <span class="card__hashtag-inner">
                  <input
                    type="hidden"
                    name="hashtag"
                    value="repeat"
                    class="card__hashtag-hidden-input"
                  />
                  <button type="button" class="card__hashtag-name">
                    #entertaiment
                  </button>
                  <button type="button" class="card__hashtag-delete">
                    delete
                  </button>
                </span>
              </div>

              <label>
                <input type="text" class="card__hashtag-input" name="hashtag-input" placeholder="Type new hashtag here">
              </label>
            </div>
          </div>

          <label class="card__img-wrap card__img-wrap--empty">
            <input type="file" class="card__img-input visually-hidden" name="img">
            <img src="img/add-photo.svg" alt="task picture" class="card__img">
          </label>

          <div class="card__colors-inner">
            <h3 class="card__colors-title">Color</h3>
            <div class="card__colors-wrap">
              <input type="radio" id="color-black-2" class="card__color-input card__color-input--black visually-hidden" name="color" value="black">
              <label for="color-black-2" class="card__color card__color--black">black</label>
              <input type="radio" id="color-yellow-2" class="card__color-input card__color-input--yellow visually-hidden" name="color" value="yellow">
              <label for="color-yellow-2" class="card__color card__color--yellow">yellow</label>
              <input type="radio" id="color-blue-2" class="card__color-input card__color-input--blue visually-hidden" name="color" value="blue">
              <label for="color-blue-2" class="card__color card__color--blue">blue</label>
              <input type="radio" id="color-green-2" class="card__color-input card__color-input--green visually-hidden" name="color" value="green">
              <label for="color-green-2" class="card__color card__color--green">green</label>
              <input type="radio" id="color-pink-2" class="card__color-input card__color-input--pink visually-hidden" name="color" value="pink">
              <label for="color-pink-2" class="card__color card__color--pink">pink</label>
            </div>
          </div>
        </div>

        <div class="card__status-btns">
          <button class="card__save" type="submit">save</button>
          <button class="card__delete" type="button">delete</button>
        </div>
      </div>
    </form>
  </article>
  `;
};

const onFiltersClick = () => {
  const taskCount = getRandomNumber(TasksCount.MIN, TasksCount.MAX);
  tasksContainer.innerHTML = ``;
  createTasks(taskCount, TASK);
};

const updateTasks = () => {
  const filters = filterContainer.querySelectorAll(`.filter__label`);
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
