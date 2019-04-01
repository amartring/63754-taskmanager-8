import Chart from 'chart.js';
import {getPieChart, getLineChart} from './chart.js';
import moment from 'moment';
import flatpickr from 'flatpickr';
import Component from './component.js';
import {getRandomArrayElements, hexColor} from './util.js';
import {createElement} from './create-element.js';

export default class Statistic extends Component {
  constructor(data) {
    super();

    this._data = data;
    this._periodBegin = moment().startOf(`isoWeek`);
    this._periodEnd = moment().endOf(`isoWeek`);

    this._filteredData = this._getFilteredTasks();

    this._onDateChange = this._onDateChange.bind(this);
  }

  _partialUpdate() {
    this._element.querySelector(`.statistic__task-found`).innerText = this._filteredData.length;
  }

  _getFilteredTasks() {
    return this._data.filter((it) =>
      moment(it.dueDate).isSameOrAfter(this._periodBegin) && moment(it.dueDate).isSameOrBefore(this._periodEnd));
  }

  _filterByDays() {
    const data = {};

    const filteredTasks = this._getFilteredTasks();
    const allDays = filteredTasks.map((it) => moment(it.dueDate).format(`DD MMMM`));
    const uniqueDays = new Set(allDays);
    uniqueDays.forEach((it) => {
      data[it] = allDays.filter((day) => day === it).length;
    });

    const compare = (firstDay, secondDay) => moment(firstDay[0]).format(`DD`) - moment(secondDay[0]).format(`DD`);
    const arrayOfDays = Object.keys(data).map((key) => [key, data[key]]);

    const datas = arrayOfDays.sort(compare);
    const days = datas.map((it) => it[0]);
    const daysCount = datas.map((it) => it[1]);

    return [days, daysCount];
  }

  _filterByColors() {
    const data = {};

    const filteredTasks = this._getFilteredTasks();
    const allColors = filteredTasks.map((it) => it.color);
    const uniqueColors = new Set(allColors);
    uniqueColors.forEach((it) => {
      data[it] = allColors.filter((color) => color === it).length;
    });

    const colors = [...uniqueColors];
    const colorsCount = Object.values(data);
    const colorsBackgrounds = colors.map((color) => hexColor[color]);

    return [colors, colorsCount, colorsBackgrounds];
  }

  _filterByTags() {
    const data = {};

    const filteredTasks = this._getFilteredTasks();
    const allTags = [];
    filteredTasks.map((it) => it.tags && it.tags.forEach((tag) => allTags.push(tag)));
    const uniqueTags = new Set(allTags);
    uniqueTags.forEach((it) => {
      data[it] = allTags.filter((tag) => tag === it).length;
    });

    const tags = [...uniqueTags];
    const tagsCount = Object.values(data);
    const tagsBackgrounds = getRandomArrayElements(Object.values(hexColor), tags.length);

    return [tags, tagsCount, tagsBackgrounds];
  }

  _createChart() {
    const daysCtx = this._element.querySelector(`.statistic__days`);
    const colorsCtx = this._element.querySelector(`.statistic__colors`);
    const tagsCtx = this._element.querySelector(`.statistic__tags`);

    const [daysLabels, daysDatas] = this._filterByDays();
    const [colorsLabels, colorsDatas, colorsBackgrounds] = this._filterByColors();
    const [tagsLabels, tagsDatas, tagsBackgrounds] = this._filterByTags();

    this._daysChart = new Chart(daysCtx, getLineChart());
    this._colorsChart = new Chart(colorsCtx, getPieChart(`COLORS`));
    this._tagsChart = new Chart(tagsCtx, getPieChart(`TAGS`));

    this._daysChart.data = {
      labels: daysLabels,
      datasets: [{
        data: daysDatas,
        backgroundColor: `transparent`,
        borderColor: `#000000`,
        borderWidth: 1,
        lineTension: 0,
        pointRadius: 8,
        pointHoverRadius: 8,
        pointBackgroundColor: `#000000`
      }]
    };

    this._colorsChart.data = {
      labels: colorsLabels,
      datasets: [{
        data: colorsDatas,
        backgroundColor: colorsBackgrounds
      }]
    };

    this._tagsChart.data = {
      labels: tagsLabels,
      datasets: [{
        data: tagsDatas,
        backgroundColor: tagsBackgrounds
      }]
    };

    this._daysChart.update();
    this._colorsChart.update();
    this._tagsChart.update();
  }

  get template() {
    return `
    <div>
      <div class="statistic__line">
        <div class="statistic__period">
          <h2 class="statistic__period-title">Task Activity DIAGRAM</h2>

          <div class="statistic-input-wrap">
            <input
              class="statistic__period-input"
              type="text"
              placeholder="${moment(this._periodBegin).format(`DD MMMM`)} - ${moment(this._periodEnd).format(`DD MMMM`)}"

            />
          </div>

          <p class="statistic__period-result">
            In total for the specified period
            <span class="statistic__task-found">${this._filteredData.length}</span> tasks were fulfilled.
          </p>
        </div>
        <div class="statistic__line-graphic">
          <canvas class="statistic__days" width="550" height="150"></canvas>
        </div>
      </div>

      <div class="statistic__circle">
        <div class="statistic__tags-wrap">
          <canvas class="statistic__tags" width="400" height="300"></canvas>
        </div>
        <div class="statistic__colors-wrap">
          <canvas class="statistic__colors" width="400" height="300"></canvas>
        </div>
      </div>
    </div>`.trim();
  }

  _onDateChange() {
    this.update();
  }

  bind() {
    flatpickr(this._element.querySelector(`.statistic__period-input`),
        {
          mode: `range`,
          altFormat: `j F`,
          altInput: true,
          dateFormat: `j F`,
          defaultDate: [
            moment(this._periodBegin).format(`DD MMMM`),
            moment(this._periodEnd).format(`DD MMMM`)
          ],
          locale: {
            rangeSeparator: ` - `,
            firstDayOfWeek: 1
          },
          onClose: this._onDateChange
        });
  }

  unbind() {}

  update() {
    const period = this._element.querySelector(`.statistic__period-input`).value.split(` - `);
    this._periodBegin = moment(period[0], `DD MMM`).startOf(`day`);
    this._periodEnd = period.length > 1 ? moment(period[1], `DD MMM`).endOf(`day`) : moment(period[0], `DD MMM`).endOf(`day`);

    this._daysChart.destroy();
    this._colorsChart.destroy();
    this._tagsChart.destroy();
    this._createChart();
    this._filteredData = this._getFilteredTasks();
    this._partialUpdate();
  }

  render() {
    this._element = createElement(this.template);
    this._createChart();
    this.bind();
    return this._element;
  }
}
