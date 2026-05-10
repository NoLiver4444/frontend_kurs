export class BaseComponent {
  constructor(props = {}) {
    this.props = props;
    this.element = null;
    this.state = {};
  }

  render() {
    throw new Error('Метод render() должен быть переопределён');
  }

  appendTo(parent) {
    if (this.element) parent.appendChild(this.element);
  }

  updateState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }
}