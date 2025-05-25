import HtmlCreator from '@utils/html';
import { AppRoutes } from '@utils/router';

import ButtonBackCreator from '../../components/button/button-back';

export default class AboutPage {
  public container: HTMLElement;

  constructor() {
    this.container = HtmlCreator.create('div', undefined, 'container');
  }

  public getHTML(): HTMLElement {
    const aboutWrapper = HtmlCreator.create('div', undefined, 'about', 'about__wrapper');
    const aboutText = HtmlCreator.create('p', undefined, 'about__txt');
    aboutText.textContent = 'ТУТ БУДЕТ О НАС';

    const buttonBack = new ButtonBackCreator('НАЗАД', ['about__btn'], undefined, AppRoutes.MAIN).render();

    this.container.append(aboutWrapper);
    aboutWrapper.append(aboutText, buttonBack);

    return this.container;
  }
}
