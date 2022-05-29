import fetchJson from "./utils/fetch-json.js";

const BACKEND_URL = "https://course-js.javascript.ru";

const noop = (p) => p;
export default class ColumnChart {
  chartHeight = 50;

  constructor({
    url = "",
    range = { from: new Date(), to: new Date() },
    label = "",
    link,
    formatHeading = noop,
    value = 0,
  } = {}) {
    this.data = null;
    this.value = value;
    this.url = url;
    this.range = range;
    this.label = label;
    this.link = link;
    this.formatHeading = formatHeading;
    this.render();

    this.requestData();
  }

  requestData() {
    const url = new URL(this.url, BACKEND_URL);
    url.searchParams.append("from", this.range.from.toISOString());
    url.searchParams.append("to", this.range.to.toISOString());
    fetchJson(url).then((response) => {
      this.data = response;
      this.render();
    });

    return this.data;
  }

  getChartElement() {
    if (!this.element) {
      this.element = document.createElement("div");
      this.element.style = `--chart-height: ${this.chartHeight}`;
      this.element.classList.add("column-chart");
    }

    this.element.innerHTML = this.getTemplate();

    if (!this.data || this.data.length === 0) {
      this.element.classList.add("column-chart_loading");
    } else {
      this.element.classList.remove("column-chart_loading");
    }
  }

  getChartColumnsTemplate() {
    if (!this.data) return "";

    let maxValue = Math.max(...Object.values(this.data));
    this.value = Object.values(this.data).reduce((a, b) => a + b);
    let chartColumns = [];

    for (let item of Object.keys(this.data)) {
      let scale = this.chartHeight / maxValue;

      chartColumns.push(
        `<div style="--value: 
            ${Math.floor(this.data[item] * scale)}"
        data-tooltip="${((this.data[item] / maxValue) * 100).toFixed(
          0
        )}%"></div>`
      );
    }

    return chartColumns.join("");
  }

  getTemplate() {
    if (this.data) {
      this.value = Object.values(this.data).reduce((a, b) => a + b);
    }
    
    const formattedValue = this.formatHeading
      ? this.formatHeading(this.value.toLocaleString("en-US"))
      : this.value.toLocaleString("en-US");

    const viewAllLink = this.link
      ? `<a class="column-chart__link" href="${this.link}">View all</a>`
      : ``;

    return `
      <div class="column-chart__title">
        Total ${this.label}
        ${viewAllLink}
      </div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">
          ${formattedValue}
        </div>
        <div data-element="body" class="column-chart__chart">
          ${this.getChartColumnsTemplate()}
        </div>
      </div>`;
  }

  render() {
    this.getChartElement();
    this.populateSubElements();
  }

  populateSubElements() {
    this.subElements = {};
    const dataElements = this.element.querySelectorAll('[data-element]');

    for (const dataElement of dataElements) {
      this.subElements[dataElement.dataset.element] = dataElement;
    }
  }

  update(startDate, endDate) {
    this.range = { from: startDate, to: endDate};
    this.data = null;
    this.render();    
    return this.requestData();
  }

  remove() {
    this.element.remove();
    this.requestData();
  }

  destroy() {
    this.data = null;
    this.label = null;
    this.value = null;
    this.link = null;
    this.formatHeading = null;
    this.subElements = null;
    this.remove();
  }
}
