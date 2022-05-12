const noop = p => p;

export default class ColumnChart {
  chartHeight = 50;

  constructor({ data = [], label = "", value = 0, link, formatHeading = noop} = {}) {
    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;
    this.formatHeading = formatHeading;

    this.render();
  }

  getChartElement() {
    const chartElement = document.createElement("div");
    chartElement.style = `--chart-height: ${this.chartHeight}`;
    chartElement.classList.add("column-chart");

    if (!this.data || this.data.length === 0)
      chartElement.classList.add("column-chart_loading");

    chartElement.innerHTML = this.getTemplate();
    return chartElement;
  }

  getChartColumnsTemplate() {
    let maxValue = Math.max(...this.data);
    let chartColumns = [];

    for (let item of this.data) {
      let scale = this.chartHeight / maxValue;

      chartColumns.push(
        `<div style="--value: 
            ${Math.floor(item * scale)}"
        data-tooltip="${((item / maxValue) * 100).toFixed(0)}%"></div>`
      );
    }

    return chartColumns.join("");
  }

  getTemplate() {
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
    this.element = this.getChartElement();
  }

  update(data) {
    this.data = data ?? [];
    this.render();
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.data = null;
    this.label = null;
    this.value = null;
    this.link = null;
    this.formatHeading = null;

    this.remove();
  }
}
