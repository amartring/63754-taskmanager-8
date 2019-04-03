import Component from './component.js';
import {DateFormate} from './constants.js';
import moment from 'moment';

export default class Task extends Component {
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

    this._onEditButtonClick = this._onEditButtonClick.bind(this);
    this._onFavoriteClick = this._onFavoriteClick.bind(this);
    this._onTextareaClick = this._onTextareaClick.bind(this);
    this._onTagClick = this._onTagClick.bind(this);

    this._onEdit = null;
    this._onTag = null;
  }

  _isRepeated() {
    return Object.values(this._repeatingDays).some((item) => item === true);
  }

  _partialUpdate() {
    this._element.innerHTML = this.template;
  }

  _onFavoriteClick() {
    this._isFavorite = !this._isFavorite;
    this.unbind();
    this._partialUpdate();
    this.bind();
  }

  _onTagClick(evt) {
    const target = evt.target;
    if (target.type === `button`) {
      const tag = target.value;
      return typeof this._onTag === `function` && this._onTag(tag);
    }
  }

  _onTextareaClick(evt) {
    evt.preventDefault();
    return typeof this._onEdit === `function` && this._onEdit();
  }

  _onEditButtonClick(evt) {
    evt.preventDefault();
    return typeof this._onEdit === `function` && this._onEdit();
  }

  set onTag(fn) {
    this._onTag = fn;
  }

  set onEdit(fn) {
    this._onEdit = fn;
  }

  get template() {
    return `
  <article
    class="card
          card--${this._color}
          ${this._isRepeated() && ` card--repeat`}
          ${moment(this._dueDate).isBefore(moment().subtract(1, `day`)) && ` card--deadline`}">
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
            <fieldset class="card__date-deadline">
              <label class="card__input-deadline-wrap">
                <input
                  class="card__date"
                  type="text"
                  placeholder="23 September"
                  value="${moment(this._dueDate).format(DateFormate.TASK)}"
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
                  <button type="button" class="card__hashtag-name" value="${tag}">#${tag}</button>
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
      </div>
    </div>
  </article>`.trim();
  }

  bind() {
    this._element.querySelector(`.card__btn--edit`)
        .addEventListener(`click`, this._onEditButtonClick);
    this._element.querySelector(`.card__btn--favorites`)
        .addEventListener(`click`, this._onFavoriteClick);
    this._element.querySelector(`.card__text`)
        .addEventListener(`click`, this._onTextareaClick);
    this._element.querySelector(`.card__hashtag-list`)
        .addEventListener(`click`, this._onTagClick);
  }

  unbind() {
    this._element.querySelector(`.card__btn--edit`)
        .removeEventListener(`click`, this._onEditButtonClick);
    this._element.querySelector(`.card__btn--favorites`)
        .removeEventListener(`click`, this._onFavoriteClick);
    this._element.querySelector(`.card__text`)
        .removeEventListener(`click`, this._onTextareaClick);
    this._element.querySelector(`.card__hashtag-list`)
        .removeEventListener(`click`, this._onTagClick);
  }

  update(data) {
    this._title = data.title;
    this._tags = data.tags;
    this._color = data.color;
    this._repeatingDays = data.repeatingDays;
    this._dueDate = data.dueDate;
    this._time = data.time;
    this._isFavorite = data.isFavorite;
  }
}
