export default class ButtonBackCreator {
  public button: HTMLAnchorElement;
  constructor(text: string, classNames: string[], id?: string, href?: string) {
    this.button = document.createElement('a');
    this.button.textContent = text;
    this.button.classList.add(...classNames);
    this.button.classList.add('button-back');

    if (id) {
      this.button.id = id;
    }

    if (href) {
      this.button.setAttribute('href', href);
    }

    this.button.addEventListener('click', (event) => {
      const target = event.target;

      if (target instanceof HTMLAnchorElement) {
        event.preventDefault();
        globalThis.history.back();
      }
    });
  }

  public render(): HTMLAnchorElement {
    return this.button;
  }
}
