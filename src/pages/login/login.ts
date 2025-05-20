import { Resthandler } from '@service/rest/resthandler';
import HtmlCreator from '@utils/html';
import { AppRoutes, router } from '@utils/router';
import { userLoggedIn } from '@utils/security';

const MIN_LENGTH_PASSWORD = 8;

export default class LoginPage {
  private readonly restHandler: Resthandler = Resthandler.getInstance();
  private readonly container: HTMLElement;

  constructor() {
    this.container = HtmlCreator.create('div', undefined, 'container');
  }

  public getHTML(): HTMLElement {
    const loginWrapper: HTMLDivElement = HtmlCreator.create('div', undefined, 'login', 'login__wrapper');
    const form: HTMLFormElement = HtmlCreator.create('form', undefined, 'login__form');
    form.noValidate = true;
    const title: HTMLHeadingElement = HtmlCreator.create('h1', undefined, 'login__title');
    title.textContent = 'Войти';

    const emailWrapper: HTMLDivElement = HtmlCreator.create('div', undefined, 'login__input-wrapper');
    const emailLabel: HTMLLabelElement = HtmlCreator.create('label', undefined, 'login__label');
    emailLabel.textContent = 'Email адрес';
    const emailInput: HTMLInputElement = HtmlCreator.create(
      'input',
      undefined,
      'login__input-field',
      'login__input-email'
    );
    emailInput.type = 'email';
    emailInput.autocomplete = 'off';
    const emailError: HTMLSpanElement = HtmlCreator.create('span', undefined, 'login__error-email');

    emailInput.addEventListener('input', () => {
      const loginValue = emailInput.value;
      const loginError = loginValidate(loginValue);

      emailError.textContent = loginError ?? '';

      if (loginValue.length === 0) emailError.textContent = '';
    });

    emailInput.addEventListener('blur', () => {
      if (emailInput.value.length === 0) emailError.textContent = '';
    });

    const passwordWrapper: HTMLDivElement = HtmlCreator.create('div', undefined, 'login__input-wrapper');
    const passwordLabel: HTMLLabelElement = HtmlCreator.create('label', undefined, 'login__label');
    passwordLabel.textContent = 'Пароль';
    passwordLabel.htmlFor = 'password';
    const passwordInput: HTMLInputElement = HtmlCreator.create(
      'input',
      undefined,
      'login__input-field',
      'login__input-password'
    );
    passwordInput.type = 'password';
    passwordInput.autocomplete = 'off';
    const passwordError: HTMLSpanElement = HtmlCreator.create('span', undefined, 'login__error-password');
    const buttonShowPassword: HTMLButtonElement = HtmlCreator.create('button', undefined, 'login__btn-show');
    const buttonShowPasswordImage = HtmlCreator.create('img', undefined, 'login__btn-img');
    buttonShowPasswordImage.src = '../../assets/icons/show_password.svg';

    passwordInput.addEventListener('input', () => {
      const passwordValue = passwordInput.value;
      const loginError = passwordValidate(passwordValue);

      passwordError.textContent = loginError ?? '';

      if (passwordValue.length === 0) passwordError.textContent = '';
    });

    passwordInput.addEventListener('blur', () => {
      if (passwordInput.value.length === 0) passwordError.textContent = '';
    });

    buttonShowPassword.addEventListener('click', (event) => {
      event.preventDefault();

      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        buttonShowPasswordImage.src = '../../assets/icons/hide_password.svg';
      } else {
        passwordInput.type = 'password';
        buttonShowPasswordImage.src = '../../assets/icons/show_password.svg';
      }
    });

    emailWrapper.append(emailLabel, emailInput, emailError);
    passwordWrapper.append(passwordLabel, passwordInput, passwordError, buttonShowPassword);
    buttonShowPassword.append(buttonShowPasswordImage);
    form.append(emailWrapper, passwordWrapper);

    const errorMessage: HTMLParagraphElement = HtmlCreator.create('p', undefined, 'login__error');

    const buttonLogin: HTMLButtonElement = HtmlCreator.create('button', 'submit', 'login__submit-btn');
    buttonLogin.textContent = 'Войти';

    form.addEventListener(
      'submit',
      (event: SubmitEvent): Promise<void> => this.handleLogin(event, emailInput.value, passwordInput.value)
    );

    this.container.append(loginWrapper);
    loginWrapper.append(title, form, errorMessage);
    form.append(buttonLogin);

    return this.container;
  }

  private async handleLogin(event: Event, login: string, password: string): Promise<void> {
    event.preventDefault();

    try {
      const result: boolean = await this.restHandler.login(login, password);
      if (result) {
        updateLoginButtonText();
        router.navigate(AppRoutes.MAIN);
      }
    } catch {
      const errorMessage: Element | null = document.querySelector('.login__error');

      if (errorMessage)
        errorMessage.textContent = 'Не удалось войти в систему. Пожалуйста, проверьте свои учетные данные';
    }
  }
}

function updateLoginButtonText(): void {
  const button: Element | null = document.querySelector('[data-role="auth"]');
  if (button) button.textContent = userLoggedIn() ? 'Выход' : 'Вход';
}

export function loginValidate(login: string): string | null {
  const loginTrim = login.trim();

  if (!loginTrim.includes('@')) {
    return 'Email должен содержать символ "@"';
  }

  const [localPart, domain] = loginTrim.split('@');

  if (!localPart) {
    return 'Email должен содержать локальную часть';
  }

  if (!domain) {
    return 'Email должен содержать доменное имя';
  }

  return null;
}

export function passwordValidate(password: string): string | null {
  const passwordTrim = password.trim();

  if (passwordTrim.length < MIN_LENGTH_PASSWORD) {
    return `Пароль должен содержать не менее ${MIN_LENGTH_PASSWORD} символов`;
  }

  if (!/[A-Z]/.test(passwordTrim)) {
    return 'Пароль должен содержать хотя бы одну заглавную букву A-Z';
  }

  if (!/[a-z]/.test(passwordTrim)) {
    return 'Пароль должен содержать хотя бы одну строчную букву a-z';
  }

  if (!/[0-9]/.test(passwordTrim)) {
    return 'Пароль должен содержать хотя бы одну цифру 0-9';
  }

  return null;
}
