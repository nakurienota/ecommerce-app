import { LocalStorageKeys } from '@core/enum/local-storage-keys';
import { registrationInputsEnum } from '@core/enum/registration-inputs';
import { Resthandler } from '@service/rest/resthandler';
import HtmlCreator from '@utils/html';

import { showSuccessPopup } from '../../pages/popup/popup';
import { birthDateValidate, firsnameValidate, lastnameValidate } from '../../pages/registration/registration';

export type EditInputs = {
  [key: string]: string;
};

export default class ProfileAccountEdit {
  public container: HTMLDivElement;
  private editValues: EditInputs = {};
  private readonly restHandler: Resthandler = Resthandler.getInstance();

  constructor() {
    this.container = HtmlCreator.create('div', undefined, 'profile__account-edit');
  }

  public getHTML(): HTMLElement {
    const customerID = localStorage.getItem(LocalStorageKeys.USER_ID_LOGGED_IN);

    if (customerID) {
      this.restHandler.getCustomer(customerID).then((response) => {
        const editInputs = [
          {
            textLabel: 'Имя',
            subClass: registrationInputsEnum.FIRSTNAME,
            typeInput: 'text',
            validate: firsnameValidate,
            required: true,
            value: response.firstName ?? 'Не указано',
          },
          {
            textLabel: 'Фамилия',
            subClass: registrationInputsEnum.LASTNAME,
            typeInput: 'text',
            validate: lastnameValidate,
            required: true,
            value: response.lastName ?? 'Не указана',
          },
          {
            textLabel: 'Дата рождения',
            subClass: registrationInputsEnum.BIRTHDATE,
            typeInput: 'date',
            validate: birthDateValidate,
            required: false,
            value: response.dateOfBirth,
          },
        ];

        editInputs.forEach(({ textLabel, subClass, typeInput, validate, value }) => {
          const inputWrapper: HTMLDivElement = HtmlCreator.create(
            'div',
            undefined,
            'profile__account-edit-input-wrapper'
          );
          const inputLabel: HTMLLabelElement = HtmlCreator.create('label', undefined, 'profile__account-edit-label');
          inputLabel.textContent = textLabel;

          const input: HTMLInputElement = HtmlCreator.create(
            'input',
            undefined,
            'profile__account-edit-input-field',
            `profile__account-edit-input-${subClass}`
          );
          input.type = typeInput;
          input.autocomplete = 'off';
          input.value = value;
          this.editValues[subClass] = value;

          const inputError: HTMLSpanElement = HtmlCreator.create(
            'span',
            undefined,
            'profile__account-edit-error',
            `profile__account-edit-error-${subClass}`
          );

          inputError.textContent = '';

          input.addEventListener('input', () => {
            const inputValue = input.value;

            if (validate) {
              const textError = validate(inputValue);
              inputError.textContent = textError ?? '';
              this.editValues[subClass] = inputValue;
            }

            if (inputValue.length === 0) inputError.textContent = '';
          });

          input.addEventListener('blur', () => {
            if (input.value.length === 0) inputError.textContent = '';
          });

          this.container.append(inputWrapper);
          inputLabel.append(input);
          inputWrapper.append(inputLabel, inputError);
        });
        const buttonSave = HtmlCreator.create(
          'button',
          undefined,
          'default-submit-button',
          'profile__account-edit-btn'
        );
        buttonSave.textContent = 'Сохранить';
        this.container.append(buttonSave);

        buttonSave.addEventListener('click', () => {
          this.restHandler
            .updateCustomer(this.editValues.firstname, this.editValues.lastname, this.editValues.date, customerID)
            .then(() => {
              showSuccessPopup('Данные успешно обновлены');
            })
            .catch(() => {
              showSuccessPopup('Ошибка обновления данных');
            });
        });
      });
    }
    return this.container;
  }
}
