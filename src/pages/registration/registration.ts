import HtmlCreator from '@utils/html';

export default class RegistrationPage {
  public container: HTMLElement;

  constructor() {
    this.container = HtmlCreator.create('div', undefined, 'container');
  }

  public getHTML(): HTMLElement {
    const registrationWrapper = HtmlCreator.create('div', undefined, 'registration', 'registration__wrapper');
    const form: HTMLFormElement = HtmlCreator.create('form', undefined, 'registration__form');
    form.noValidate = true;
    const title: HTMLHeadingElement = HtmlCreator.create('h1', undefined, 'registration__title');
    title.textContent = 'Регистрация';

    const registrationInputs = [
      { textLabel: 'Email адресс', subClass: 'email', typeInput: 'email' },
      { textLabel: 'Пароль', subClass: 'password', typeInput: 'password' },
      { textLabel: 'Имя', subClass: 'firstname', typeInput: 'text' },
      { textLabel: 'Фамилия', subClass: 'lastname', typeInput: 'text' },
      { textLabel: 'Дата рождения', subClass: 'date', typeInput: 'date' },
      { textLabel: 'Улица', subClass: 'street', typeInput: 'text' },
      { textLabel: 'Город', subClass: 'city', typeInput: 'text' },
      { textLabel: 'Почтовый индекс', subClass: 'postal', typeInput: 'text' },
      { textLabel: 'Страна', subClass: 'country', typeInput: 'text' },
    ];

    registrationInputs.forEach(({ textLabel, subClass, typeInput }) => {
      const inputWrapper: HTMLDivElement = HtmlCreator.create('div', undefined, 'registration__input-wrapper');
      const inputLabel: HTMLLabelElement = HtmlCreator.create('label', undefined, 'registration__label');
      inputLabel.textContent = textLabel;
      const input: HTMLInputElement = HtmlCreator.create(
        'input',
        undefined,
        'registration__input-field',
        `registration__input-${subClass}`
      );
      input.type = typeInput;
      input.autocomplete = 'off';
      const inputError: HTMLSpanElement = HtmlCreator.create('span', undefined, 'registration__error-email');
      inputError.textContent = 'Error';

      form.append(inputWrapper);
      inputWrapper.append(inputLabel, input, inputError);
    });

    const buttonSend: HTMLButtonElement = HtmlCreator.create('button', 'submit', 'registration__submit-btn');
    buttonSend.textContent = 'Зарегистрировать';

    this.container.append(registrationWrapper);
    registrationWrapper.append(title, form);
    form.append(buttonSend);

    return this.container;
  }
}
