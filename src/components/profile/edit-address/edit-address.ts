import { LocalStorageKeys } from '@core/enum/local-storage-keys';
import { registrationInputsEnum } from '@core/enum/registration-inputs';
import type { ResponseCustomerById } from '@core/model/dto';
import { Resthandler } from '@service/rest/resthandler';
import HtmlCreator from '@utils/html';

import { adressValidate, postalValidate } from '../../../pages/registration/registration';
import type { EditInputs } from '../edit-profile/edit-profile';
import type { ResponseResult } from '../profile-address/profile-address';
import { findAddressById, findAddressesByIds, type Address } from '../profile-address/profile-address';

export default class ProfileAddressEdit {
  public container: HTMLDivElement;
  private readonly restHandler: Resthandler = Resthandler.getInstance();
  private editValues: EditInputs = {};

  constructor() {
    this.container = HtmlCreator.create('div', undefined, 'profile__address-edit');
  }

  public getHTML(): HTMLDivElement {
    const addressEditWrapper = HtmlCreator.create('div', undefined, 'profile__address-edit-wrapper');
    const customerID = localStorage.getItem(LocalStorageKeys.USER_ID_LOGGED_IN);

    if (customerID) {
      this.restHandler.getCustomer(customerID).then((response) => {
        function mapResponseToResult(response: ResponseCustomerById): ResponseResult {
          return {
            billingAddress: findAddressesByIds(response.addresses, response.billingAddressIds),
            defaultBillingAddress: findAddressById(response.addresses, response.defaultBillingAddressId),
            shippingAddresses: findAddressesByIds(response.addresses, response.shippingAddressIds),
            defaultShippingAddress: findAddressById(response.addresses, response.defaultShippingAddressId),
          };
        }

        const result: ResponseResult = mapResponseToResult(response);

        Object.entries(result).forEach(([key, value]) => {
          switch (key) {
            case 'billingAddress': {
              if (Array.isArray(value)) {
                value.forEach((address) => {
                  addressEditWrapper.append(createBaseAddress(address, 'Адрес доставки'));
                });
              } else {
                if (value) addressEditWrapper.append(createBaseAddress(value, 'Адрес доставки'));
              }

              break;
            }
            case 'defaultBillingAddress': {
              if (Array.isArray(value)) {
                value.forEach((address) => {
                  addressEditWrapper.append(createBaseAddress(address, 'Адрес доставки по умолчанию'));
                });
              } else {
                if (value) addressEditWrapper.append(createBaseAddress(value, 'Адрес доставки по умолчанию'));
              }

              break;
            }
            case 'shippingAddresses': {
              if (Array.isArray(value)) {
                value.forEach((address) => {
                  addressEditWrapper.append(createBaseAddress(address, 'Адрес оплаты'));
                });
              } else {
                if (value) addressEditWrapper.append(createBaseAddress(value, 'Адрес оплаты'));
              }

              break;
            }
            case 'defaultShippingAddress': {
              if (Array.isArray(value)) {
                value.forEach((address) => {
                  addressEditWrapper.append(createBaseAddress(address, 'Адрес оплаты по умолчанию'));
                });
              } else {
                if (value) addressEditWrapper.append(createBaseAddress(value, 'Адрес оплаты по умолчанию'));
              }

              break;
            }
          }
        });

        const buttonSave = HtmlCreator.create(
          'button',
          undefined,
          'default-submit-button',
          'profile__account-edit-btn-save'
        );
        buttonSave.textContent = 'Сохранить';

        const buttonAddAddress = HtmlCreator.create(
          'button',
          undefined,
          'default-submit-button',
          'profile__account-edit-btn-add'
        );
        buttonAddAddress.textContent = 'Добавить адрес';
        this.container.append(addressEditWrapper, buttonSave, buttonAddAddress);

        // buttonSave.addEventListener('click', () => {
        //   this.restHandler
        //     .updateCustomer(
        //       this.editValues.email,
        //       this.editValues.firstname,
        //       this.editValues.lastname,
        //       this.editValues.date,
        //       customerID
        //     )
        //     .then(() => {
        //       showSuccessPopup('Данные успешно обновлены');
        //     })
        //     .catch(() => {
        //       showSuccessPopup('Ошибка обновления данных');
        //     });
        // });
      });
    }

    return this.container;
  }
}

export const createBaseAddress = (addressValue: Address, title: string): HTMLElement => {
  const addressItem = HtmlCreator.create('div', undefined, 'profile__address-edit-item');

  const addressItems = [
    {
      textLabel: 'Улица',
      subClass: registrationInputsEnum.STREET,
      validate: adressValidate,
      required: false,
      value: addressValue.streetName ?? 'Не указан',
    },
    {
      textLabel: 'Город',
      subClass: registrationInputsEnum.CITY,
      validate: adressValidate,
      required: false,
      value: addressValue.city ?? 'Не указан',
    },
    {
      textLabel: 'Почтовый индекс',
      subClass: registrationInputsEnum.POSTAL,
      validate: postalValidate,
      required: false,
      value: addressValue.postalCode ?? 'Не указан',
    },
  ];

  const addressTitle = HtmlCreator.create('h3', undefined, 'profile__address-edit-title');
  addressTitle.textContent = title;
  const addressItemWrapper = HtmlCreator.create('div', undefined, 'profile__address-edit-item-wrapper');

  const countrySelect: HTMLSelectElement = HtmlCreator.create('select', undefined, 'profile__address-edit-select');

  const optionSelect = [
    { textOption: 'Россия', valueOption: 'RU' },
    { textOption: 'США', valueOption: 'US' },
    { textOption: 'Германия', valueOption: 'DE' },
  ];

  optionSelect.forEach(({ textOption, valueOption }) => {
    const optionSelect: HTMLOptionElement = HtmlCreator.create('option', undefined, 'profile__address-edit-option');
    optionSelect.textContent = textOption;
    optionSelect.value = valueOption;

    countrySelect.append(optionSelect);
  });

  addressItems.forEach(({ textLabel, subClass, validate, value }) => {
    const inputLabel: HTMLLabelElement = HtmlCreator.create('label', undefined, 'profile__address-edit-label');
    inputLabel.textContent = textLabel;

    const input: HTMLInputElement = HtmlCreator.create(
      'input',
      undefined,
      'profile__address-edit-input-field',
      `profile__address-edit-input-${subClass}`
    );
    input.type = 'text';
    input.autocomplete = 'off';
    input.value = value;

    const inputError: HTMLSpanElement = HtmlCreator.create(
      'span',
      undefined,
      'profile__address-edit-error',
      `profile__address-edit-error-${subClass}`
    );

    inputError.textContent = '';

    input.addEventListener('input', () => {
      const inputValue = input.value;

      if (validate) {
        const textError = validate(inputValue);
        inputError.textContent = textError ?? '';
        // this.editValues[subClass] = inputValue;
      }

      if (inputValue.length === 0) inputError.textContent = '';
    });

    input.addEventListener('blur', () => {
      if (input.value.length === 0) inputError.textContent = '';
    });

    inputLabel.append(input);
    addressItem.append(addressTitle, addressItemWrapper);
    addressItemWrapper.append(inputLabel, inputError, countrySelect);
  });

  return addressItem;
};
