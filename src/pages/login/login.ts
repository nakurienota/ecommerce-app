import { Resthandler } from '@service/rest/resthandler';
import HtmlCreator from '@utils/html';
import { router } from '@utils/router';

import ButtonBackCreator from '../../components/button/button-back';

export default class LoginPage {
  private readonly restHandler: Resthandler = Resthandler.getInstance();
  private readonly container: HTMLElement;

  constructor() {
    this.container = HtmlCreator.create('div', undefined, 'container');
  }

  public getHTML(): HTMLElement {
    const loginWrapper: HTMLDivElement = HtmlCreator.create('div', undefined, 'login', 'login__wrapper');
    const form: HTMLFormElement = HtmlCreator.create('form', undefined, 'login__form');
    const title: HTMLHeadingElement = HtmlCreator.create('h1', undefined, 'login__title');
    title.textContent = 'Login';
    const emailLabel: HTMLLabelElement = HtmlCreator.create('label');
    emailLabel.textContent = 'Email';
    emailLabel.htmlFor = 'email';
    const emailInput: HTMLInputElement = HtmlCreator.create('input', undefined, 'login-input-field');
    emailInput.type = 'string';
    const passwordLabel: HTMLLabelElement = document.createElement('label');
    passwordLabel.textContent = 'Password';
    passwordLabel.htmlFor = 'password';
    const passwordInput: HTMLInputElement = HtmlCreator.create('input', undefined, 'login-input-field');
    passwordInput.type = 'password';
    form.append(emailLabel, emailInput, passwordLabel, passwordInput);
    const errorMessage: HTMLParagraphElement = HtmlCreator.create('p', undefined, 'login__error');

    const buttonLogin: HTMLButtonElement = HtmlCreator.create('button', 'submit', 'login__submit-btn');
    buttonLogin.textContent = 'LOGIN';

    const buttonBack: HTMLAnchorElement = new ButtonBackCreator('BACK', ['login__btn'], undefined, '/main').render();
    form.addEventListener(
      'submit',
      (event: SubmitEvent): Promise<void> => this.handleLogin(event, emailInput.value, passwordInput.value)
    );

    this.container.append(loginWrapper);
    loginWrapper.append(title, form, errorMessage, buttonBack);
    form.append(buttonLogin);

    return this.container;
  }

  private async handleLogin(event: Event, login: string, password: string): Promise<void> {
    event.preventDefault();

    try {
      const token: string = await this.restHandler.getToken(login, password);
      localStorage.setItem('auth_token', token);
      router.navigate('/main');
    } catch {
      const errorMessage: Element | null = document.querySelector('.login__error');
      if (errorMessage) errorMessage.textContent = 'Failed to login. Please check your credentials.';
    }
  }
}
