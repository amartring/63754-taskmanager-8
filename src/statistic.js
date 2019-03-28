import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
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

  _getChartData() {
    const [colorsLabels, colorsDatas, colorsBackgrounds] = this._filterByColors();
    const [tagsLabels, tagsDatas, tagsBackgrounds] = this._filterByTags();

    this._colorsChart = new Chart(this._element.querySelector(`.statistic__colors`), this._getChart(`COLORS`));
    this._tagsChart = new Chart(this._element.querySelector(`.statistic__tags`), this._getChart(`TAGS`));

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

    this._colorsChart.update();
    this._tagsChart.update();
  }

  _getChart(name) {
    return {
      plugins: [ChartDataLabels],
      type: `pie`,
      options: {
        plugins: {
          datalabels: {
            display: false
          }
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              const allData = data.datasets[tooltipItem.datasetIndex].data;
              const tooltipData = allData[tooltipItem.index];
              const total = allData.reduce((acc, it) => acc + parseFloat(it));
              const tooltipPercentage = Math.round((tooltipData / total) * 100);
              return `${tooltipData} TASKS — ${tooltipPercentage}%`;
            }
          },
          displayColors: false,
          backgroundColor: `#ffffff`,
          bodyFontColor: `#000000`,
          borderColor: `#000000`,
          borderWidth: 1,
          cornerRadius: 0,
          xPadding: 15,
          yPadding: 15
        },
        title: {
          display: true,
          text: `DONE BY: ${name}`,
          fontSize: 16,
          fontColor: `#000000`
        },
        legend: {
          position: `left`,
          labels: {
            boxWidth: 15,
            padding: 25,
            fontStyle: 500,
            fontColor: `#000000`,
            fontSize: 13
          }
        }
      }
    };
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
        <div class="statistic__line-graphic visually-hidden">
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
    const period = this._element.querySelector(`.statistic__period-input`).value.split(` - `);
    this._periodBegin = moment(period[0], `DD MMM`).startOf(`day`);
    this._periodEnd = period.length > 1 ? moment(period[1], `DD MMM`).endOf(`day`) : moment(period[0], `DD MMM`).endOf(`day`);

    this._colorsChart.destroy();
    this._tagsChart.destroy();
    this._getChartData();
    this._filteredData = this._getFilteredTasks();
    this._partialUpdate();
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

  render() {
    this._element = createElement(this.template);
    this.bind();
    this._getChartData();
    return this._element;
  }
}