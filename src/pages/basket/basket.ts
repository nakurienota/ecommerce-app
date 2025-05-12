import HtmlCreator from '@utils/html';

export default class BasketPage {
  public container: HTMLElement;

  constructor() {
    this.container = HtmlCreator.create('div', undefined, 'container');
  }

  public getHTML(): HTMLElement {
    const mainWrapper = HtmlCreator.create('div', undefined, 'basket__wrapper');
    const TEXT = HtmlCreator.create('p', undefined, 'basket__txt');
    TEXT.textContent = 'ТУТ БУДЕТ КОРЗИНА';
    const link = HtmlCreator.create('a', undefined, 'basket__link');
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
