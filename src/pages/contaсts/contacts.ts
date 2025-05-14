import HtmlCreator from '@utils/html';
import { AppRoutes } from '@utils/router';

import ButtonBackCreator from '../../components/button/button-back';

export default class ContactsPage {
  public container: HTMLElement;

  constructor() {
    this.container = HtmlCreator.create('div', undefined, 'container');
  }

  public getHTML(): HTMLElement {
    const contactsWrapper = HtmlCreator.create('div', undefined, 'contacts', 'contacts__wrapper');
    const contactsText = HtmlCreator.create('p', undefined, 'contacts__txt');
    contactsText.textContent = 'ТУТ БУДУТ КОНТАКТЫ';

    const buttonBack = new ButtonBackCreator('НАЗАД', ['contacts__btn'], undefined, AppRoutes.MAIN).render();

    this.container.append(contactsWrapper);
    contactsWrapper.append(contactsText, buttonBack);

    return this.container;
  }
}
