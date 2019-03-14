import {createElement} from './create-element.js';
import {shuffleArray} from './util.js';

class Task {
  constructor(data) {
    this._title = data.title;
    this._dueDate = data.dueDate;
    this._tags = data.tags;
    this._picture = data.picture;
    this._color = data.color;
    this._repeatingDays = data.repeatingDays;

    this._onEditButtonClick = this._onEditButtonClick.bind(this);

    this._element = null;
    this._onEdit = null;

    this._state = {
      isFavorite: data.isFavorite,
      isDone: data.isDone
    };
  }

  _isRepeated() {
    return Object.values(this._repeatingDays).some((item) => item === true);
  }

  _getTags() {
    const array = [...this._tags];
    return shuffleArray(array).splice(Math.floor(Math.random() * 7), Math.floor(Math.random() * 4)).map((item) => `
      <span class="card__hashtag-inner">
        <input
          type="hidden"
          name="hashtag"
          value="${item}"
          class="card__hashtag-hidden-input"
        />
        <button type="button" class="card__hashtag-name">
          #${item}
        </button>
        <button type="button" class="card__hashtag-delete">
          delete
        </button>
      </span>`)
      .join(``);
  }

  _onEditButtonClick(evt) {
    evt.preventDefault();
    return typeof this._onEdit === `function` && this._onEdit();
  }

  set onEdit(fn) {
    this._onEdit = fn;
  }

  get element() {
    return this._element;
  }

  get template() {
    return `
  <article class="card card--${this._color} ${this._isRepeated && ` card--repeat`}">
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
                  value="${this._dueDate}"
                  name="date">
              </label>
              <label class="card__input-deadline-wrap">
                <input
                  class="card__time"
                  type="text"
                  placeholder="11:15 PM"
                  value=""
                  name="time">
              </label>
            </fieldset>
          </div>

          <div class="card__hashtag">
            <div class="card__hashtag-list">
              ${this._getTags()}
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
  </article>
  `;
  }

  bind() {
    this._element.querySelector(`.card__btn--edit`)
        .addEventListener(`click`, this._onEditButtonClick);
  }

  unbind() {
    this._element.querySelector(`.card__btn--edit`)
        .removeEventListener(`click`, this._onEditButtonClick);
  }

  render() {
    this._element = createElement(this.template);
    this.bind();
    return this._element;
  }

  unrender() {
    this.unbind();
    this._element = null;
  }
}

export {Task};
