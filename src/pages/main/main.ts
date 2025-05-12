import HtmlCreator from '@utils/html';
import { router } from '@utils/router';
// import './main-page';

export default class MainPage {
  public container: HTMLElement;

  constructor() {
    this.container = HtmlCreator.create('div', undefined, 'container');
  }

  public getHTML(): HTMLElement {
    // const containerMain = HtmlCreator.create('div', 'container');
    const mainWrapper = HtmlCreator.create('div', undefined, 'main__wrapper');
    const link = HtmlCreator.create('a', undefined, 'main__link');
    link.setAttribute('href', '/login');
    link.textContent = 'LOGIN';

    link.addEventListener('click', (event) => {
      const target = event.target;
      if (target instanceof HTMLAnchorElement) {
        event.preventDefault();
        router.navigate(target.href);
      }
    });

    this.container.append(mainWrapper);
    mainWrapper.append(link);

    return this.container;
  }
}
