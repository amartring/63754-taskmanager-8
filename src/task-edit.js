import Component from './component.js';
import {DateFormate} from './constants.js';
import flatpickr from 'flatpickr';
import moment from 'moment';

export default class TaskEdit extends Component {
  constructor(data) {
    super();
    this._id = data.id;
    this._title = data.title;
    this._dueDate = data.dueDate;
    this._tags = data.tags;
    this._picture = data.picture;
    this._color = data.color;
    this._repeatingDays = data.repeatingDays;

    this._time = moment(this._dueDate).format(`HH:mm`);

    this._isFavorite = data.isFavorite;
    this._isDone = data.isDone;

    this._onSaveClick = this._onSaveClick.bind(this);
    this._onChangeText = this._onChangeText.bind(this);
    this._onChangeDateState = this._onChangeDateState.bind(this);
    this._onChangeDate = this._onChangeDate.bind(this);
    this._onChangeTime = this._onChangeTime.bind(this);
    this._onChangeRepeated = this._onChangeRepeated.bind(this);
    this._onDeleteClick = this._onDeleteClick.bind(this);
    this._onEscPress = this._onEscPress.bind(this);
    // this._onFreePlaceClick = this._onFreePlaceClick.bind(this);

    this._onSubmit = null;
    this._onDelete = null;
    this._onClose = null;

    this._flatpickrDate = null;
    this._flatpickrTime = null;

    this._state.isDate = this._dueDate !== false;
    this._state.isRepeated = false;
  }

  _processForm(formData) {
    const entry = {
      title: ``,
      color: ``,
      tags: new Set(),
      dueDate: this._dueDate,
      time: ``,
      repeatingDays: {
        'mo': false,
        'tu': false,
        'we': false,
        'th': false,
        'fr': false,
        'sa': false,
        'su': false,
      },
    };

    const taskEditMapper = TaskEdit.createMapper(entry);

    for (const pair of formData.entries()) {
      const [property, value] = pair;
      if (taskEditMapper[property]) {
        taskEditMapper[property](value);
      }
    }

    return entry;
  }

  _isRepeated() {
    return Object.values(this._repeatingDays).some((item) => item === true);
  }

  _partialUpdate() {
    this._element.innerHTML = this.template;
  }

  _onChangeText() {
    this._title = this._element.querySelector(`.card__text`).value;
    this.unbind();
    this._partialUpdate();
    this.bind();
  }

  _onChangeDateState() {
    this._state.isDate = !this._state.isDate;
    this.unbind();
    this._partialUpdate();
    this.bind();
  }

  _onChangeDate() {
    this._dueDate = this._element.querySelector(`.card__date[name=date]`).value;
    this._dueDate = this._dueDate;
    this.unbind();
    this._partialUpdate();
    this.bind();
  }

  _onChangeTime() {
    this._time = this._element.querySelector(`.card__time[name=time]`).value;
    this.unbind();
    this._partialUpdate();
    this.bind();
  }

  _onChangeRepeated() {
    this._state.isRepeated = !this._state.isRepeated;
    this.unbind();
    this._partialUpdate();
    this.bind();
  }

  _onDeleteClick(evt) {
    evt.preventDefault();

    this.block();
    this._element.querySelector(`.card__delete`).textContent = `Deleting...`;

    this._flatpickrDate.destroy();
    this._flatpickrTime.destroy();

    return typeof this._onDelete === `function` && this._onDelete({id: this._id});
  }

  _onSaveClick(evt) {
    evt.preventDefault();
    const formData = new FormData(this._element.querySelector(`.card__form`));
    const newData = this._processForm(formData);

    this.block();
    this._element.querySelector(`.card__save`).textContent = `Saving...`;

    if (typeof this._onSubmit === `function`) {
      this._onSubmit(newData);
    }

    this.update(newData);
  }

  // _onFreePlaceClick(evt) {
  //   if (!this._element.contains(evt.target)) {
  //     if (typeof this._onClose === `function`) {
  //       this._onClose();
  //     }
  //   }
  // }

  _onEscPress(evt) {
    if (evt.keyCode === 27) {
      if (typeof this._onClose === `function`) {
        this._onClose();
      }
    }
  }

  set onClose(fn) {
    this._onClose = fn;
  }

  set onDelete(fn) {
    this._onDelete = fn;
  }

  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  get template() {
    return `
  <article class="card card--edit card--${this._color} ${this._state.isRepeated && ` card--repeat`}">
    <form class="card__form" method="get">
      <div class="card__inner">
        <div class="card__control">
          <button type="button" class="card__btn card__btn--edit">
            edit
          </button>
          <button type="button" class="card__btn card__btn--archive">
            archive
          </button>
          <button type="button" class="card__btn card__btn--favorites">
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
            <textarea class="card__text" placeholder="Start typing your text here..." name="text">${this._title}
            </textarea>
          </label>
        </div>

        <div class="card__settings">
          <div class="card__details">
            <div class="card__dates">
              <button class="card__date-deadline-toggle" type="button">
                date: <span class="card__date-status">${this._state.isDate ? `YES` : `NO`}</span>
              </button>

              <fieldset class="card__date-deadline" ${!this._state.isDate && `disabled`}>
                <label class="card__input-deadline-wrap">
                  <input
                    class="card__date"
                    type="text"
                    placeholder="23 September"
                    value="${this._dueDate && moment(this._dueDate).format(DateFormate.TASK)}"
                    name="date">
                </label>
                <label class="card__input-deadline-wrap">
                  <input
                    class="card__time"
                    type="text"
                    placeholder="11:15"
                    value="${this._time && this._time}"
                    name="time">
                </label>
              </fieldset>

              <button class="card__repeat-toggle" type="button">
                repeat:
                <span class="card__repeat-status">${this._state.isRepeated ? `YES` : `NO`}</span>
              </button>

              <fieldset class="card__repeat-days" ${!this._state.isRepeated && `disabled`}>
                <div class="card__repeat-days-inner">
                  <input class="visually-hidden card__repeat-day-input" type="checkbox" id="repeat-mo-2"
                        name="repeat" value="mo" ${this._repeatingDays.mo ? ` checked` : ``}>
                  <label class="card__repeat-day" for="repeat-mo-2">mo</label>
                  <input class="visually-hidden card__repeat-day-input" type="checkbox" id="repeat-tu-2"
                        name="repeat" value="tu" ${this._repeatingDays.tu && ` checked`}>
                  <label class="card__repeat-day" for="repeat-tu-2">tu</label>
                  <input class="visually-hidden card__repeat-day-input" type="checkbox" id="repeat-we-2"
                        name="repeat" value="we" ${this._repeatingDays.we && ` checked`}>
                  <label class="card__repeat-day" for="repeat-we-2">we</label>
                  <input class="visually-hidden card__repeat-day-input" type="checkbox" id="repeat-th-2"
                        name="repeat" value="th" ${this._repeatingDays.th && ` checked`}>
                  <label class="card__repeat-day" for="repeat-th-2">th</label>
                  <input class="visually-hidden card__repeat-day-input" type="checkbox" id="repeat-fr-2"
                        name="repeat" value="fr" ${this._repeatingDays.fr && ` checked`}>
                  <label class="card__repeat-day" for="repeat-fr-2">fr</label>
                  <input class="visually-hidden card__repeat-day-input" type="checkbox" id="repeat-sa-2"
                        name="repeat" value="sa" ${this._repeatingDays.sa && ` checked`}>
                  <label class="card__repeat-day" for="repeat-sa-2">sa</label>
                  <input class="visually-hidden card__repeat-day-input" type="checkbox" id="repeat-su-2"
                        name="repeat" value="su" ${this._repeatingDays.su && ` checked`}>
                  <label class="card__repeat-day" for="repeat-su-2">su</label>
                </div>
              </fieldset>
            </div>

            <div class="card__hashtag">
              <div class="card__hashtag-list">
                ${Array.from(this._tags).map((tag) => `
                    <span class="card__hashtag-inner">
                      <input
                        type="hidden"
                        name="hashtag"
                        value="${tag}"
                        class="card__hashtag-hidden-input"
                      />
                      <button type="button" class="card__hashtag-name">
                        #${tag}
                      </button>
                      <button type="button" class="card__hashtag-delete">
                        delete
                      </button>
                    </span>`)
                  .join(``)}
                <label>
                  <input type="text" class="card__hashtag-input" name="hashtag-input" placeholder="Type new hashtag here">
                </label>
              </div>
            </div>
          </div>

          <label class="card__img-wrap">
            <input type="file" class="card__img-input visually-hidden" name="img">
            <img src="${this._picture}" alt="task picture" class="card__img">
          </label>

          <div class="card__colors-inner">
            <h3 class="card__colors-title">Color</h3>
            <div class="card__colors-wrap">
              <input type="radio" id="color-black-2" class="card__color-input card__color-input--black visually-hidden"
                      name="color" value="black" ${this._color === `black` && ` checked`}>
              <label for="color-black-2" class="card__color card__color--black">black</label>
              <input type="radio" id="color-yellow-2" class="card__color-input card__color-input--yellow visually-hidden"
                      name="color" value="yellow" ${this._color === `yellow` && ` checked`}>
              <label for="color-yellow-2" class="card__color card__color--yellow">yellow</label>
              <input type="radio" id="color-blue-2" class="card__color-input card__color-input--blue visually-hidden"
                      name="color" value="blue" ${this._color === `blue` && ` checked`}>
              <label for="color-blue-2" class="card__color card__color--blue">blue</label>
              <input type="radio" id="color-green-2" class="card__color-input card__color-input--green visually-hidden"
                      name="color" value="green" ${this._color === `green` && ` checked`}>
              <label for="color-green-2" class="card__color card__color--green">green</label>
              <input type="radio" id="color-pink-2" class="card__color-input card__color-input--pink visually-hidden"
                      name="color" value="pink" ${this._color === `pink` && ` checked`}>
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
  </article>`.trim();
  }

  block() {
    this._element.querySelectorAll(`input, button, textarea`).forEach((input) => {
      input.disabled = true;
    });
  }

  unblock() {
    this._element.querySelectorAll(`input, button, textarea`).forEach((input) => {
      input.disabled = false;
    });
    this._element.querySelector(`.card__save`).textContent = `Save`;
    this._element.querySelector(`.card__delete`).textContent = `Delete`;
  }

  shake() {
    const ANIMATION_TIMEOUT = 600;
    this._element.querySelector(`.card__inner`.styke.border = `2px solid red`);
    this._element.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      this._element.style.animation = ``;
    }, ANIMATION_TIMEOUT);
  }

  bind() {
    this._element.querySelector(`.card__form`)
        .addEventListener(`submit`, this._onSaveClick);
    this._element.querySelector(`.card__text`)
        .addEventListener(`change`, this._onChangeText);
    this._element.querySelector(`.card__date-deadline-toggle`)
        .addEventListener(`click`, this._onChangeDateState);
    this._element.querySelector(`.card__date`)
        .addEventListener(`change`, this._onChangeDate);
    this._element.querySelector(`.card__time`)
        .addEventListener(`change`, this._onChangeTime);
    this._element.querySelector(`.card__repeat-toggle`)
        .addEventListener(`click`, this._onChangeRepeated);
    this._element.querySelector(`.card__delete`)
        .addEventListener(`click`, this._onDeleteClick);
    document.addEventListener(`keydown`, this._onEscPress);
    // document.addEventListener(`click`, this._onFreePlaceClick);

    if (this._state.isDate) {
      this._flatpickrDate = flatpickr(this._element.querySelector(`.card__date`),
          {
            altInput: true,
            altFormat: `j F Y`,
            dateFormat: `j F Y`,
          }
      );
      this._flatpickrTime = flatpickr(this._element.querySelector(`.card__time`),
          {
            enableTime: true,
            noCalendar: true,
            altInput: true,
            altFormat: `H:i`,
            dateFormat: `H:i`,
          }
      );
    }
  }

  unbind() {
    this._element.querySelector(`.card__form`)
        .removeEventListener(`submit`, this._onSaveClick);
    this._element.querySelector(`.card__text`)
        .removeEventListener(`change`, this._onChangeText);
    this._element.querySelector(`.card__date-deadline-toggle`)
        .removeEventListener(`click`, this._onChangeDateState);
    this._element.querySelector(`.card__date`)
        .removeEventListener(`change`, this._onChangeDate);
    this._element.querySelector(`.card__time`)
        .removeEventListener(`change`, this._onChangeTime);
    this._element.querySelector(`.card__repeat-toggle`)
        .removeEventListener(`click`, this._onChangeRepeated);
    this._element.querySelector(`.card__delete`)
        .removeEventListener(`click`, this._onDeleteClick);
    document.removeEventListener(`keydown`, this._onEscPress);
    // document.removeEventListener(`click`, this._onFreePlaceClick);

    this._flatpickrDate.destroy();
    this._flatpickrTime.destroy();
  }

  update(data) {
    this._title = data.title;
    this._dueDate = data.dueDate;
    this._time = data.time;
    this._tags = data.tags;
    this._color = data.color;
    this._repeatingDays = data.repeatingDays;
  }

  static createMapper(target) {
    return {
      hashtag: (value) => target.tags.add(value),
      text: (value) => {
        target.title = value;
      },
      color: (value) => {
        target.color = value;
      },
      repeat: (value) => {
        target.repeatingDays[value] = true;
      },
      date: (value) => {
        target.dueDate = moment(value, DateFormate.TASK);
      },
      time: (value) => {
        target.time = value;
      },
    };
  }
}
