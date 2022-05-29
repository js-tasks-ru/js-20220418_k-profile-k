const noop = p => p;

export default class DoubleSlider {
  constructor({min = 0, max = 0, formatValue = noop, selected = {from: min, to: max}}) {
    this.min = min;
    this.max = max;
    this.formatValue = formatValue;
    this.selected = selected;
    this.render();
    this.initialize();
  }

  pointerDown = event => {
    if (event.target == this.subElements?.left || event.target == this.subElements?.right) {
      event.preventDefault();
      this.onHold = true;
      this.selectedSlider = event.target;
      this.shiftX = event.clientX - event.target.getBoundingClientRect().left;

      console.log('OnHold');
    }
  }

  pointerUp = event => {
    if (this.onHold) {
      this.onHold = false;     

      console.log('Released');
    }
  }

  pointerMove = event => {
    if (this.onHold) {
      this.newLeft = event.clientX - this.shiftX - this.subElements.progress.getBoundingClientRect().left;

      if (this.newLeft < 0) {
        this.newLeft = 0;
      }

      let rightEdge = this.subElements.progress.offsetWidth - this.selectedSlider.offsetWidth;
      
      if (this.newLeft > rightEdge) {
        this.newLeft = rightEdge;
      }

      this.selectedSlider.style.left = this.newLeft + 'px';

      console.log('Moving');
    }
  }

  initialize() {
    document.addEventListener('mousedown', this.pointerDown);
    document.addEventListener('mouseup', this.pointerUp);
    document.addEventListener('mousemove', this.pointerMove);
    document.addEventListener('mousemove', this.pointerMove);
    this.subElements?.left.addEventListener('dragstart', () => false);
    this.subElements?.right.addEventListener('dragstart', () => false);
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTemplate();
    this.element = wrapper.firstElementChild;

    this.populateSubElements();
  }

  remove() {
    this.element.removeEventListener('pointerover', this.pointerDown);
    this.element.removeEventListener('pointerout', this.pointerDown);
    this.element.removeEventListener('pointermove', this.pointerMove);
    this.element?.remove();
    this.element = null;
  }

  destroy() {
    this.remove();
  }

  populateSubElements() {
    this.subElements = {
      from: this.element.querySelector('span[data-element="from"]'),
      to: this.element.querySelector('span[data-element="to"]'),
      progress: this.element.querySelector('.range-slider__progress'),
      left: this.element.querySelector('.range-slider__thumb-left'),
      right: this.element.querySelector('.range-slider__thumb-right'),
    };    
  }

  setValue() {
    this.subElements.from.textContent = this.min;
    this.subElements.to.textContent = this.max;
    this.subElements.left.style.left = this.calculatePercent(this.selected.from) + '%';
    this.subElements.right.style.right = 100 - this.calculatePercent(this.selected.to) + '%';
    this.subElements.progress.style.left = this.calculatePercent(this.selected.from) + '%';
    this.subElements.progress.style.right = 100 - this.calculatePercent(this.selected.to) + '%';
  }

  getTemplate() {
    return `
      <div class="range-slider">
        <span data-element="from">${this.formatValue(this.min)}</span>
        <div class="range-slider__inner">
          <span class="range-slider__progress" style="left: ${this.calculatePercent(this.selected.from)}%; right: ${100 - this.calculatePercent(this.selected.to)}%"></span>
          <span class="range-slider__thumb-left" style="left: ${this.calculatePercent(this.selected.from)}%"></span>
          <span class="range-slider__thumb-right" style="right: ${100 - this.calculatePercent(this.selected.to)}%"></span>
        </div>
        <span data-element="to">${this.formatValue(this.max)}</span>
      </div>`;
  }

  calculatePercent(value) {
    return ((value - this.min) * 100) / (this.max - this.min);
  }
}
