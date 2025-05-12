import HtmlCreator from '@utils/html';

export default class ContactsPage {
  public container: HTMLElement;

  constructor() {
    this.container = HtmlCreator.create('div', undefined, 'container');
  }

  public getHTML(): HTMLElement {
    const mainWrapper = HtmlCreator.create('div', undefined, 'contacts__wrapper');
    const TEXT = HtmlCreator.create('p', undefined, 'contacts__txt');
    TEXT.textContent = 'ТУТ БУДУТ КОНТАКТЫ';
    const link = HtmlCreator.create('a', undefined, 'contacts__link');
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
