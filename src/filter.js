import Component from './component.js';

export default class Filter extends Component {
  constructor(data) {
    super();
    this._name = data.name;
    this._isChecked = data.isChecked;
    this._isDisabled = data.isDisabled;

    this._onFilterClick = this._onFilterClick.bind(this);

    this._element = null;
    this._onFilter = null;
  }

  _onFilterClick(evt) {
    evt.preventDefault();
    this._isChecked = !this._isChecked;

    if (typeof this._onFilter === `function`) {
      this._onFilter();
    }
  }

  set onFilter(fn) {
    this._onFilter = fn;
  }

  get template() {
    return `
    <div>
      <input type="radio" class="filter__input visually-hidden" name="filter"
        id="filter__${this._name.toLowerCase()}"
        ${this._isChecked && ` checked`}
        ${this._isDisabled && ` disabled`}
      >
      <label
        for="filter__${this._name.toLowerCase()}"
        class="filter__label">${this._name.toUpperCase()}
          <span
            class="filter__${this._name.toLowerCase()}-count">

          </span>
      </label>
    </div>`.trim();
  }

  bind() {
    this._element.querySelector(`.filter__input`)
        .addEventListener(`click`, this._onFilterClick);
  }

  unbind() {
    this._element.querySelector(`.filter__input`)
        .removeEventListener(`click`, this._onFilterClick);
  }
}
