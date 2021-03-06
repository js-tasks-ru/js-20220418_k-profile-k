class Tooltip {
  static instance;

  pointerOver = function (event) {
    const tooltipText = event.target.dataset.tooltip;
    if (!tooltipText) return;

    Tooltip.instance.render(tooltipText);
  }

  pointerOut = function (event) {
    if (!Tooltip.instance.active || !Tooltip.instance.element) return;

    const tooltipText = event.target.dataset.tooltip;
    if (!tooltipText) return;

    Tooltip.instance.hide();
  }

  pointerMove = function (event) {
    if (!Tooltip.instance.active || !Tooltip.instance.element) return;

    Tooltip.instance.element.style.left = event.clientX + 10 + "px";
    Tooltip.instance.element.style.top = event.clientY + 10 + "px";
  }

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }

    Tooltip.instance = this;

    this.createElement();
  }

  initialize() {
    document.addEventListener("pointerover", this.pointerOver);
    document.addEventListener("pointerout", this.pointerOut);
    document.addEventListener("pointermove", this.pointerMove);
  }

  render(text) {
    this.createElement();

    this.active = true;
    this.element.textContent = text;
    this.element.style.visibility = "visible";
  }

  hide() {
    this.active = false;

    if (this.element) {
      this.element.textContent = "";
      this.element.style.visibility = "hidden";
    }
  }

  remove() {
    this.active = false;
    this.element?.remove();
    this.element = null;
  }

  destroy() {
    document.removeEventListener("pointerover", this.pointerOver);
    document.removeEventListener("pointerout", this.pointerOut);
    document.removeEventListener("pointermove", this.pointerMove);
    this.remove();
    this.instance = null;
  }

  createElement() {
    if (this.element) return;

    const wrapper = document.createElement("div");
    wrapper.innerHTML = this.getTooltipTemplate();
    this.element = wrapper.firstElementChild;
    this.element.style.visibility = "hidden";
    document.body.append(this.element);
  }

  getTooltipTemplate() {
    return `<div class="tooltip" style="position:absolute"></div>`;
  }
}

export default Tooltip;
