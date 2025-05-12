import HtmlCreator from '@utils/html';

export default class SalesPage {
  public container: HTMLElement;

  constructor() {
    this.container = HtmlCreator.create('div', undefined, 'container');
  }

  public getHTML(): HTMLElement {
    const mainWrapper = HtmlCreator.create('div', undefined, 'sales__wrapper');
    const TEXT = HtmlCreator.create('p', undefined, 'sales__txt');
    TEXT.textContent = 'ТУТ БУДЕТ СТРАНИЦА СО СКИДКАМИ';
    const link = HtmlCreator.create('a', undefined, 'sales__link');
    link.setAttribute('href', '/login');
    link.textContent = 'НАЗАД';

    link.addEventListener('click', (event) => {
      const target = event.target;
      if (target instanceof HTMLAnchorElement) {
        event.preventDefault();
        globalThis.history.back();
      }
    });

    this.container.append(mainWrapper);
    mainWrapper.append(TEXT, link);

    return this.container;
  }
}
