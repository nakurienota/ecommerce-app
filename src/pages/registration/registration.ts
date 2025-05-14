import HtmlCreator from '@utils/html';
import { AppRoutes } from '@utils/router';

import ButtonBackCreator from '../../components/button/button-back';

export default class RegistrationPage {
  public container: HTMLElement;

  constructor() {
    this.container = HtmlCreator.create('div', undefined, 'container');
  }

  public getHTML(): HTMLElement {
    const registrationWrapper = HtmlCreator.create('div', undefined, 'registration', 'registration__wrapper');
    const registrationText = HtmlCreator.create('p', undefined, 'registration__txt');
    registrationText.textContent = 'ТУТ БУДЕТ РЕГИСТРАЦИЯ';

    const buttonBack = new ButtonBackCreator('НАЗАД', ['registration__btn'], undefined, AppRoutes.MAIN).render();

    this.container.append(registrationWrapper);
    registrationWrapper.append(registrationText, buttonBack);

    return this.container;
  }
}
