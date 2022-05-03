export default class ColumnChart {
  chartHeight = 50;

  constructor(obj) {
    this.data = obj?.data ?? [];
    this.label = obj?.label ?? "";
    this.value = obj?.value ?? 0;
    this.link = obj?.link;
    this.formatHeading = obj?.formatHeading;

    this.render();
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
    
    const chartLoadingStyle = !this.data || this.data.length === 0
      ? `column-chart_loading`
      : ``;

    return `
        <div class="dashboard__chart_${this.label}">
            <div class="column-chart ${chartLoadingStyle}" style="--chart-height: 
            ${this.chartHeight}">
                <div class="column-chart__title">
                Total ${this.label}
                ${viewAllLink}
                </div>
                <div class="column-chart__container">
                <div data-element="header" class="column-chart__header">
                ${formattedValue}</div>
                <div data-element="body" class="column-chart__chart">
                    ${this.getChartColumnsTemplate()}
                </div>
                </div>
            </div>
        </div>`;
  }

  render() {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = this.getTemplate();
    this.element = wrapper;
  }

  update(data) {
    this.data = data ?? [];
    this.render();
  }

  remove() {
    this.data = [];
    this.render();
  }

  destroy() {
    this.data = null;
    this.label = null;
    this.value = null;
    this.link = null;
    this.formatHeading = null;
  }
}
