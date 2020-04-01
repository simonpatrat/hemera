class Dropdown {
  constructor(element, options) {
    const defaults = {
      initialVisible: false
    };
    this.settings = {
      ...defaults,
      options
    };
    this.el = element;
    this.triggerElement = this.el.querySelector(".dropdown__button");
    this.panel = this.el.querySelector(".dropdown__panel");

    if (!this.triggerElement) {
      console.error(
        "Error in Dorpdown component. Your dropdown element must contain a .dropdown__button element."
      );
    }

    if (!this.panel) {
      console.error(
        "Error in Dorpdown component. Your dropdown element must contain a .dropdown__panel element."
      );
    }

    this.isVisible = this.settings.initialVisible;
  }

  init = () => {
    this.triggerElement.addEventListener("click", this.toggle);
    this.el.addEventListener("transitionend", this.addTransitonendClass);
    document.body.addEventListener("click", this.hide);
  };

  toggle = event => {
    event && event.stopPropagation();
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  };

  show = () => {
    this.removeTransitonendClass();
    this.el.classList.add("with-panel-visible");
    this.isVisible = true;
  };

  hide = () => {
    this.removeTransitonendClass();
    this.el.classList.remove("with-panel-visible");
    this.el.addEventListener("transitionend", this.addTransitonendClass);
    this.isVisible = false;
  };

  addTransitonendClass = () => {
    this.el.classList.add("transition-ended");
  };
  removeTransitonendClass = () => {
    this.el.classList.remove("transition-ended");
  };
}

export default Dropdown;
