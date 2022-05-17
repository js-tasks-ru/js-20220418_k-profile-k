export default class SortableTable {
  constructor(headerConfig, { data = [], sorted = {} } = {}, isSortLocally = true) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.sorted = sorted;
    this.currentFieldSort = sorted?.id;
    this.currentOrderSort = sorted?.order;
    this.isSortLocally = isSortLocally;

    if (this.currentFieldSort && this.currentOrderSort) {
      this.sort(this.currentFieldSort, this.currentOrderSort);
    } else {
      this.render();
    }
  }

  render() {
    const headers = [];
    const rows = [];

    for (const header of this.headerConfig) {
      headers.push(
        this.getHeaderItemTemplate(
          header,
          header.id === this.currentFieldSort ? this.currentOrderSort : ""
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
      const wrapper = document.createElement("div");
      wrapper.innerHTML = tableTemplate;
      this.element = wrapper.firstElementChild;
    }

    this.populateSubElements();
  }

  sort(field, order) {
    if (this.isSortLocally) {
      this.sortOnClient(field, order);
    } else {
      this.sortOnServer(field, order);
    }
  }

  sortOnServer(field, order) {}

  sortOnClient(field, order) {
    if (order !== "asc" && order !== "desc") {
      throw new SyntaxError(
        `Wrong parameter: "${order}". Method only allows "asc" and "desc".`
      );
    }

    let sortFunction = null;
    let sortType = this.headerConfig.find(({ id }) => id === field).sortType;

    switch (sortType) {
      case "number":
        sortFunction = this.sortNumber;
        break;
      case "string":
        sortFunction = this.sortText;
        break;
      default:
        sortFunction = null;
    }

    if (!sortFunction) {
      throw new SyntaxError(`Field "${field}" doesn't support sorting.`);
    }

    this.currentFieldSort = field;
    this.currentOrderSort = order;

    this.data.sort((item1, item2) =>
      sortFunction(item1[field], item2[field], order)
    );

    if (this.subElements) {
      this.renderSubElements();
    }
    else {
      this.render();
    }
  }

  renderSubElements() {
    const headerElements = this.subElements["header"].children;

    for (let i = 0; i < this.headerConfig.length; i++) {
      const header = this.headerConfig[i];
      const headerElement = headerElements[i];

      headerElement.attributes["data-order"].nodeValue =
        header.id === this.currentFieldSort ? this.currentOrderSort : "";
    }

    const bodyElements = this.subElements["body"].children;

    for (let i = 0; i < bodyElements.length; i++) {
      const bodyElement = bodyElements[i];

      for (let j = 0; j < this.headerConfig.length; j++) {
        const header = this.headerConfig[j];
        const column = bodyElement.children[j];

        bodyElement.href = `/products/${this.data[i].id}`;

        if (header.template) {
          column.outerHTML = header.template(this.data[i][header.id]);
        } else {
          column.textContent = this.data[i][header.id];
        }
      }
    }

    this.populateSubElements();
  }

  sortText(item1, item2, order) {
    return (
      (order === "asc" ? 1 : -1) *
      item1.localeCompare(item2, ["ru", "en"], { caseFirst: "upper" })
    );
  }

  sortNumber(item1, item2, order) {
    return (order === "asc" ? 1 : -1) * (item1 - item2);
  }

  getTableTemplate(headers, rows) {
    return `
      <div data-element="productsContainer" class="products-list__container">
      <div class="sortable-table">
    
        <div id="test1" data-element="header" class="sortable-table__header sortable-table__row">
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

  getHeaderItemTemplate(header, order = "") {
    return `
      <div class="sortable-table__cell" data-id="${header.id}" data-sortable="${header.sortable}" data-order="${order}">
        <span>${header.title}</span>
        <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>
      </div>`;
  }

  getRowItemTemplate(row) {
    const cells = [];

    for (const header of this.headerConfig) {
      if (header.template) cells.push(header.template(row.images));
      else
        cells.push(`<div class="sortable-table__cell">${row[header.id]}</div>`);
    }

    return `<a href="/products/${
      row.id
    }" class="sortable-table__row">${cells.join("")}</a>`;
  }

  populateSubElements() {
    this.subElements = {};
    const dataElements = this.element.querySelectorAll("[data-element]");

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
