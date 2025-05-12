import HtmlCreator from '@utils/html';

export default class CatalogPage {
  public container: HTMLElement;

  constructor() {
    this.container = HtmlCreator.create('div', undefined, 'container');
  }

  public getHTML(): HTMLElement {
    const mainWrapper = HtmlCreator.create('div', undefined, 'catalog__wrapper');
    const TEXT = HtmlCreator.create('p', undefined, 'catalog__txt');
    TEXT.textContent = 'ТУТ БУДЕТ КАТАЛОГ';
    const link = HtmlCreator.create('a', undefined, 'catalog__link');
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
