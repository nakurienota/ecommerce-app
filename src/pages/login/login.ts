import HtmlCreator from '@utils/html';
import { AppRoutes } from '@utils/router';

import ButtonBackCreator from '../../components/button/button-back';

export default class LogingPage {
  public container: HTMLElement;

  constructor() {
    this.container = HtmlCreator.create('div', undefined, 'container');
  }

  public getHTML(): HTMLElement {
    const loginWrapper = HtmlCreator.create('div', undefined, 'login', 'login__wrapper');
    // const loginText = HtmlCreator.create('p', undefined, 'login__txt');
    // loginText.textContent = 'ТУТ БУДЕТ СТРАНИЦА ВХОДА';
    const form = HtmlCreator.create('form', 'form-login', 'login__form');
    const formFieldset = HtmlCreator.create('fieldset', undefined, 'login__form-fieldset');
    const formTitle = HtmlCreator.create('h3', undefined, 'login__form-title');
    formTitle.textContent = 'Войти';
    const formLoginWrapper = HtmlCreator.create('div', undefined, 'login__form-wrapper');
    const loginInput = HtmlCreator.create('input', 'login', 'login__form-input');
    const loginLabel = HtmlCreator.create('label', undefined, 'login__form-label');
    loginLabel.textContent = 'Email адрес';
    loginLabel.setAttribute('for', 'login');
    loginInput.setAttribute('required', '');

    const formPasswordWrapper = HtmlCreator.create('div', undefined, 'login__form-wrapper');
    const passwordLabel = HtmlCreator.create('label', undefined, 'login__form-label');
    passwordLabel.textContent = 'Пароль';
    const passwordInput = HtmlCreator.create('input', undefined, 'login__form-input');
    passwordInput.setAttribute('required', '');

    const buttonLogin = HtmlCreator.create('input', undefined, 'login__form-btn');
    buttonLogin.setAttribute('form', 'form-login');
    buttonLogin.setAttribute('value', 'Войти');
    buttonLogin.setAttribute('type', 'submit');
    // buttonLogin.setAttribute('disabled', '');

    const buttonBack = new ButtonBackCreator('НАЗАД', ['login__form-btn'], undefined, AppRoutes.MAIN).render();

    this.container.append(loginWrapper);
    loginWrapper.append(form, buttonBack);
    form.append(formFieldset);
    formFieldset.append(formTitle, formLoginWrapper, formPasswordWrapper, buttonLogin, buttonBack);
    formLoginWrapper.append(loginInput, loginLabel);
    formPasswordWrapper.append(passwordInput, passwordLabel);

    return this.container;
  }
}
