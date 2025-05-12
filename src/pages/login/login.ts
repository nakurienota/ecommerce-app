import HtmlCreator from '@utils/html';
import { router } from '@utils/router';
// import './main-page';

export default class LoginPage {
  public container: HTMLElement;

  constructor() {
    this.container = HtmlCreator.create('div', undefined, 'container');
  }

  public getHTML(): HTMLElement {
    const mainWrapper = HtmlCreator.create('div', undefined, 'login__wrapper');
    const link = HtmlCreator.create('a', undefined, 'login__link');
    link.setAttribute('href', '/main');
    link.textContent = 'MAIN';

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
