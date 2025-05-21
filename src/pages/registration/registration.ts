import { registrationInputsEnum } from '@core/enum/registration-inputs';
import type { RegistrationInput } from '@core/model/dto';
import { Resthandler } from '@service/rest/resthandler';
import HtmlCreator from '@utils/html';
import { AppRoutes, router } from '@utils/router';

import { loginValidate, passwordValidate } from '../login/login';

const MIN_LENGHT_INPUT = 4;
const MIN_AGE_REGISTRATION = 18;

export default class RegistrationPage {
  public container: HTMLElement;
  public buttonSend: HTMLButtonElement = HtmlCreator.create(
    'button',
    'submit',
    'registration__submit-btn',
    'default-submit-button'
  );
  private readonly restHandler: Resthandler = Resthandler.getInstance();
  private errorServerMessage: HTMLParagraphElement | undefined;
  private registrationInputsMap = new Map<registrationInputsEnum, HTMLInputElement>();
  private registrationInputs: RegistrationInput[] | undefined;

  constructor() {
    this.container = HtmlCreator.create('div', undefined, 'container');
  }

  public getHTML(): HTMLElement {
    const registrationWrapper = HtmlCreator.create('div', undefined, 'registration', 'registration__wrapper');
    const buttonsWrapper: HTMLDivElement = HtmlCreator.create('div', undefined, 'registration__buttons-wrapper');
    const title: HTMLHeadingElement = HtmlCreator.create('h1', undefined, 'registration__title');
    title.textContent = 'Регистрация';
    const form: HTMLFormElement = HtmlCreator.create('form', undefined, 'registration__form');
    form.noValidate = true;

    this.registrationInputs = [
      {
        textLabel: 'Email адрес*',
        subClass: registrationInputsEnum.EMAIL,
        typeInput: 'email',
        validate: loginValidate,
        required: true,
      },
      {
        textLabel: 'Пароль*',
        subClass: registrationInputsEnum.PASSWORD,
        typeInput: 'text',
        validate: passwordValidate,
        required: true,
      },
      {
        textLabel: 'Имя*',
        subClass: registrationInputsEnum.FIRSTNAME,
        typeInput: 'text',
        validate: firsnameValidate,
        required: true,
      },
      {
        textLabel: 'Фамилия*',
        subClass: registrationInputsEnum.LASTNAME,
        typeInput: 'text',
        validate: lastnameValidate,
        required: true,
      },
      {
        textLabel: 'Дата рождения',
        subClass: registrationInputsEnum.BIRTHDATE,
        typeInput: 'date',
        validate: birthDateValidate,
        required: false,
      },
      {
        textLabel: 'Улица',
        subClass: registrationInputsEnum.STREET,
        typeInput: 'text',
        validate: adressValidate,
        required: false,
      },
      {
        textLabel: 'Город',
        subClass: registrationInputsEnum.CITY,
        typeInput: 'text',
        validate: adressValidate,
        required: false,
      },
      {
        textLabel: 'Почтовый индекс',
        subClass: registrationInputsEnum.POSTAL,
        typeInput: 'text',
        validate: postalValidate,
        required: false,
      },
    ];

    this.registrationInputs.forEach(({ textLabel, subClass, typeInput, validate }) => {
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
      const inputError: HTMLSpanElement = HtmlCreator.create(
        'span',
        undefined,
        'registration__error',
        `registration__error-${subClass}`
      );
      inputError.textContent = '';

      input.addEventListener('input', () => {
        const inputValue = input.value;

        if (validate) {
          const textError = validate(inputValue);
          inputError.textContent = textError ?? '';
        }

        if (inputValue.length === 0) inputError.textContent = '';

        this.updateButtonSend();
      });

      input.addEventListener('blur', () => {
        if (input.value.length === 0) inputError.textContent = '';
      });

      form.append(inputWrapper);
      inputWrapper.append(inputLabel, input, inputError);

      this.registrationInputsMap.set(subClass, input);
    });

    const countrySelect: HTMLSelectElement = HtmlCreator.create('select', undefined, 'registration__select');

    const optionSelect = [
      { textOption: 'Россия', valueOption: 'RU' },
      { textOption: 'США', valueOption: 'US' },
      { textOption: 'Германия', valueOption: 'DE' },
    ];

    optionSelect.forEach(({ textOption, valueOption }) => {
      const optionSelect: HTMLOptionElement = HtmlCreator.create('option', undefined, 'registration__option');
      optionSelect.textContent = textOption;
      optionSelect.value = valueOption;

      countrySelect.append(optionSelect);
    });

    this.buttonSend.textContent = 'Зарегистрировать';
    this.buttonSend.disabled = true;

    form.addEventListener(
      'submit',
      (event: SubmitEvent): Promise<void> =>
        this.handleRegistrtion(
          event,
          this.registrationInputsMap.get(registrationInputsEnum.EMAIL)!.value,
          this.registrationInputsMap.get(registrationInputsEnum.PASSWORD)!.value,
          this.registrationInputsMap.get(registrationInputsEnum.FIRSTNAME)!.value,
          this.registrationInputsMap.get(registrationInputsEnum.LASTNAME)!.value
        )
    );

    this.errorServerMessage = HtmlCreator.create('p', undefined, 'registration__error-server');

    const cluerequired: HTMLParagraphElement = HtmlCreator.create('p', undefined, 'registration__clue');
    cluerequired.textContent = 'Поля, помеченные * - обязательны для регистрации';

    const buttonLogin: HTMLButtonElement = HtmlCreator.create('button', undefined, 'default-submit-button');
    buttonLogin.textContent = 'Вход';
    buttonLogin.addEventListener('click', (): void => {
      router.navigate(AppRoutes.LOGIN);
    });
    this.container.append(registrationWrapper);
    buttonsWrapper.append(this.buttonSend, buttonLogin);
    registrationWrapper.append(title, form, this.errorServerMessage, cluerequired);
    form.append(countrySelect, buttonsWrapper);

    return this.container;
  }

  private async handleRegistrtion(
    event: SubmitEvent,
    email: string,
    password: string,
    firstname: string,
    lastname: string
  ): Promise<void> {
    event.preventDefault();

    try {
      const result: boolean = await this.restHandler.registration(email, password, firstname, lastname);

      if (result) {
        router.navigate(AppRoutes.MAIN);
      }
    } catch {
      if (this.errorServerMessage)
        this.errorServerMessage.textContent =
          'Не удалось зарегистрировать аккаунт. Пожалуйста, проверьте свои введенные данные';
    }
  }

  private updateButtonSend(): void {
    let isValid = true;

    for (const [key, input] of this.registrationInputsMap) {
      const mapInput = this.registrationInputs!.find((regInput) => regInput.subClass === key);

      if (mapInput && mapInput.required) {
        const validate = mapInput.validate;

        if (!input.value || (validate && validate(input.value) !== null)) {
          isValid = false;

          break;
        }
      }
    }

    this.buttonSend.disabled = !isValid;
  }
}

export function firsnameValidate(firstname: string): string | null {
  const firstnameTrim = firstname.trim();

  if (firstnameTrim.length < MIN_LENGHT_INPUT) {
    return `Имя должно содержать не менее ${MIN_LENGHT_INPUT} символов`;
  }

  if (!/^[a-zA-Zа-яА-я]+$/.test(firstnameTrim)) {
    return 'Имя должно содержать только буквы';
  }

  return null;
}

export function lastnameValidate(lastname: string): string | null {
  const lastnameTrim = lastname.trim();

  if (lastnameTrim.length < MIN_LENGHT_INPUT) {
    return `Фамилия должна содержать не менее ${MIN_LENGHT_INPUT} символов`;
  }

  if (!/^[a-zA-Zа-яА-я]+$/.test(lastnameTrim)) {
    return 'Фамилия должна содержать только буквы';
  }

  return null;
}

export function birthDateValidate(birthDateValue: string): string | null {
  const birthDate = new Date(birthDateValue);
  const today = new Date();

  const age = today.getFullYear() - birthDate.getFullYear();

  if (age <= MIN_AGE_REGISTRATION) {
    return `Минимальный возраст для регистрации должен быть ${MIN_AGE_REGISTRATION} лет`;
  }

  return null;
}

export function adressValidate(address: string): string | null {
  const addressTrim = address.trim();

  if (addressTrim.length < MIN_LENGHT_INPUT) {
    return `Адрес должен содержать не менее ${MIN_LENGHT_INPUT} символов`;
  }

  if (!/^[a-zA-Zа-яА-я]+$/.test(addressTrim)) {
    return 'Адрес должна содержать только буквы';
  }

  return null;
}

export function postalValidate(postal: string): string | null {
  const postalTrim = postal.trim();
  const countrySelect = document.querySelector('.registration__select');

  if (countrySelect instanceof HTMLSelectElement) {
    const countryCode = countrySelect.value;
    let postalRegex;

    switch (countryCode) {
      case 'RU': {
        postalRegex = /^\d{6}$/;
        break;
      }
      case 'US': {
        postalRegex = /^\d{5}(?:[-\s]\d{4})?$/;
        break;
      }
      case 'DE': {
        postalRegex = /^\d{5}$/;
        break;
      }
    }

    if (!postalRegex?.test(postalTrim)) {
      return 'Неверный формат почтового индекса для выбранной страны';
    }
  }

  return null;
}
