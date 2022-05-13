export default class NotificationMessage {
  static #element = null;
  static #timeoutId = null;

  constructor(message = "", { duration = 0, type = "success" } = {}) {
    this.message = message;
    this.duration = duration;
    this.type = type;
    this.element = this.createNotificationElement();
  }

  show(targetElement = document.body) {
    if (NotificationMessage.#timeoutId !== null) {
      this.remove();
    }

    NotificationMessage.#element = this.element;
    targetElement.append(NotificationMessage.#element);

    if (this.duration > 0)
      NotificationMessage.#timeoutId = setTimeout(() => this.remove(), this.duration - 10);
  }

  createNotificationElement() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getMessageTemplate();
    return wrapper.firstElementChild;
  }

  remove() {
    clearTimeout(NotificationMessage.#timeoutId);
    NotificationMessage.#element?.remove();
    NotificationMessage.#element = null;
  }

  destroy() {
    this.message = null;
    this.duration = null;
    this.type = null;
    this.element = null;
    this.remove();
  }

  getMessageTemplate() {
    return `        
      <div class="notification ${this.type}" style="--value:${this.duration / 1000}s"> 
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.type}</div>
          <div class="notification-body">${this.message}</div>
        </div>
      </div>`;
  }
}
