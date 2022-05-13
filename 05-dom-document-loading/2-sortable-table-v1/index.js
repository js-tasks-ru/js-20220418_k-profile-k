export default class SortableTable {
  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.currentFieldSort = '';
    this.currentOrderSort = '';

    this.render();
  }

  render() {
    const headers = [];
    const rows = [];

    for (const header of this.headerConfig) {
      headers.push(
        this.getHeaderItemTemplate(
          header,
          header.id === this.currentFieldSort ? this.currentOrderSort : ''
        )
      );
    }

    for (const row of this.data) {
      rows.push(this.getRowItemTemplate(row));
    }

    const tableTemplate = this.getTableTemplate(headers, rows);

    if (this.element) {
      this.element.innerHTML = tableTemplate;
    } else {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = tableTemplate;
      this.element = wrapper.firstElementChild;
    }

    this.populateSubElements();
  }

  sort(field, order) {
    this.currentFieldSort = field;
    this.currentOrderSort = order;

    if (order !== 'asc' && order !== 'desc') {
      throw new SyntaxError(
        `Wrong parameter: "${order}". Method only allows "asc" and "desc".`
      );
    }

    let sortFunction = null;
    let sortType = this.headerConfig.find(({ id }) => id === field).sortType;

    switch (sortType) {
      case 'number':
        sortFunction = this.sortNumber;
        break;
      case 'string':
        sortFunction = this.sortText;
        break;
      default:
        sortFunction = null;
    }

    if (!sortFunction) {
      throw new SyntaxError(`Field "${field}" doesn't support sorting".`);
    }

    this.data.sort((item1, item2) =>
      sortFunction(item1[field], item2[field], order)
    );

    this.render(field, order);
  }

  sortText(item1, item2, order) {
    return (
      (order === 'asc' ? 1 : -1) *
      item1.localeCompare(item2, ['ru', 'en'], { caseFirst: 'upper' })
    );
  }

  sortNumber(item1, item2, order) {
    return (order === 'asc' ? 1 : -1) * (item1 - item2);
  }

  getTableTemplate(headers, rows) {
    return `
      <div data-element="productsContainer" class="products-list__container">
      <div class="sortable-table">
    
        <div data-element="header" class="sortable-table__header sortable-table__row">
          ${headers.join("")}
        </div>
    
        <div data-element="body" class="sortable-table__body">
          ${rows.join("")}  
        </div>
    
        <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
    
        <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
          <div>
            <p>No products satisfies your filter criteria</p>
            <button type="button" class="button-primary-outline">Reset all filters</button>
          </div>
        </div>
    
      </div>
    </div>`;
  }

  getHeaderItemTemplate(header, order = '') {
    return `
      <div class="sortable-table__cell" data-id="${header.id}" data-sortable="${header.sortable}" data-order="${order}">
        <span>${header.title}</span>
      </div>`;
  }

  getRowItemTemplate(row) {
    const cells = [];

    for (const header of this.headerConfig) {
      if (header.template) 
        cells.push(header.template(row.images));
      else
        cells.push(`<div class="sortable-table__cell">${row[header.id]}</div>`);
    }

    return `<a href="/products/${row.id}" class="sortable-table__row">${cells.join("")}</a>`;
  }

  populateSubElements() {
    this.subElements = {};
    const dataElements = this.element.querySelectorAll('[data-element]');

    for (const dataElement of dataElements) {
      this.subElements[dataElement.dataset.element] = dataElement;
    }
  }

  remove() {
    this.element?.remove();
    this.element = null;
  }

  destroy() {
    this.headerConfig = null;
    this.data = null;
    this.subElements = null;
    this.remove();
  }
}
