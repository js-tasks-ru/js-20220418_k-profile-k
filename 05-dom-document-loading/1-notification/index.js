export default class NotificationMessage {
  constructor(message = "", { duration = 0, type = "success" } = {}) {
    this.message = message;
    this.duration = duration;
    this.type = type;
    this.createNotificationElement();
  }

  show(targetElement = document.body) {
    this.remove();

    targetElement.append(this.element);

    if (this.duration > 0)
      setTimeout(() => {this.remove();}, this.duration);
  }

  createNotificationElement() {
    this.element = document.createElement("div");
    this.element.classList.add("notification");
    this.element.classList.add(this.type);
    this.element.style = `--value:${this.duration / 1000}s`;
    this.element.innerHTML = this.getMessageTemplate();
  }

  remove() {
    this.element?.remove();
  }

  destroy() {
    this.message = null;
    this.duration = null;
    this.type = null;
    this.remove();
  }

  getMessageTemplate() {
    return `        
      <div class="timer"></div>
      <div class="inner-wrapper">
        <div class="notification-header">${this.type}</div>
        <div class="notification-body">
          ${this.message}
        </div>
      </div>`;
  }
}
