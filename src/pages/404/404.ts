import HtmlCreator from '@utils/html';

export default class ErrorPage {
  public container: HTMLElement;

  constructor() {
    this.container = HtmlCreator.create('div', undefined, 'container');
  }

  public getHTML(): HTMLElement {
    const mainWrapper = HtmlCreator.create('div', undefined, 'error__wrapper');
    const TEXT = HtmlCreator.create('p', undefined, 'error__txt');
    TEXT.textContent = 'Извините, по Вашему запросу ничего не найдено...';
    const link = HtmlCreator.create('a', undefined, 'error__link');
    link.setAttribute('href', '/main');
    link.textContent = 'НА ГЛАВНУЮ';

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
