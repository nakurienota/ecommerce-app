import { LocalStorageKeys } from '@core/enum/local-storage-keys';
import type { ResponseCustomerById } from '@core/model/dto';
import { Resthandler } from '@service/rest/resthandler';
import HtmlCreator from '@utils/html';
import { userLoggedIn } from '@utils/security';

export type Address = {
  apartment: string;
  building: string;
  city: string;
  country: string;
  id: string;
  postalCode: string;
  region: string;
  streetName: string;
  streetNumber: string;
};

export type ResponceResult = {
  billingAddress: Address[];
  defaultBillingAddress: Address | null;
  defaultShippingAddress: Address | null;
  shippingAddresses: Address[];
};

function findAddressById(addresses: Address[], id: string | null): Address | null {
  if (!id) return null;

  return addresses.find((address) => address.id === id) || null;
}

function findAddressesByIds(addresses: Address[], ids: string[] | null): Address[] {
  if (!ids || ids.length === 0) return [];
  return ids.map((id) => findAddressById(addresses, id)).filter((address): address is Address => address !== null);
}

const baseAddresses = (addressValue: Address, title: string): HTMLDivElement => {
  const addressItem = HtmlCreator.create('div', undefined, 'profile__address-item');
  const addressItems = [
    { itemLabel: 'Страна', subClass: 'country', itemValue: addressValue.country },
    { itemLabel: 'Город', subClass: 'city', itemValue: addressValue.city },
    { itemLabel: 'Улица', subClass: 'street', itemValue: addressValue.streetName },
    { itemLabel: 'Почтовый индекс', subClass: 'postal', itemValue: addressValue.postalCode },
  ];
  const itemTitle = HtmlCreator.create('div', undefined, 'profile__address-title');
  itemTitle.textContent = title;

  addressItems.forEach(({ itemLabel, subClass, itemValue }) => {
    const itemWrapper = HtmlCreator.create(
      'div',
      undefined,
      'profile__address-wrapper',
      `profile__address-${subClass}-wrapper`
    );
    const label = HtmlCreator.create('label', undefined, 'profile__address-label');
    label.textContent = itemLabel;
    const value = HtmlCreator.create('p', undefined, 'profile__address-value');
    value.textContent = itemValue;
    addressItem.append(itemTitle, itemWrapper);
    itemWrapper.append(label, value);
  });

  return addressItem;
};

export default class ProfileAddress {
  public container: HTMLDivElement;
  private readonly restHandler: Resthandler = Resthandler.getInstance();

  constructor() {
    this.container = HtmlCreator.create('div', undefined, 'profile__address');
  }

  public getHTML(): HTMLDivElement {
    const customerID = localStorage.getItem(LocalStorageKeys.USER_ID_LOGGED_IN);

    if (customerID && userLoggedIn()) {
      this.restHandler.getCustomer(customerID).then((response: ResponseCustomerById) => {
        function mapResponseToResult(response: ResponseCustomerById): ResponceResult {
          return {
            billingAddress: findAddressesByIds(response.addresses, response.billingAddressIds),
            defaultBillingAddress: findAddressById(response.addresses, response.defaultBillingAddressId),
            shippingAddresses: findAddressesByIds(response.addresses, response.shippingAddressIds),
            defaultShippingAddress: findAddressById(response.addresses, response.defaultShippingAddressId),
          };
        }

        const result: ResponceResult = mapResponseToResult(response);

        Object.entries(result).forEach(([key, value]) => {
          switch (key) {
            case 'billingAddress': {
              if (Array.isArray(value)) {
                value.forEach((address) => {
                  this.container.append(baseAddresses(address, 'Адрес доставки'));
                });
              } else {
                if (value) this.container.append(baseAddresses(value, 'Адрес доставки'));
              }

              break;
            }
            case 'defaultBillingAddress': {
              if (Array.isArray(value)) {
                value.forEach((address) => {
                  this.container.append(baseAddresses(address, 'Адрес доставки по умолчанию'));
                });
              } else {
                if (value) this.container.append(baseAddresses(value, 'Адрес доставки по умолчанию'));
              }

              break;
            }
            case 'shippingAddresses': {
              if (Array.isArray(value)) {
                value.forEach((address) => {
                  this.container.append(baseAddresses(address, 'Адрес оплаты'));
                });
              } else {
                if (value) this.container.append(baseAddresses(value, 'Адрес оплаты'));
              }

              break;
            }
            case 'defaultShippingAddress': {
              if (Array.isArray(value)) {
                value.forEach((address) => {
                  this.container.append(baseAddresses(address, 'Адрес оплаты по умолчанию'));
                });
              } else {
                if (value) this.container.append(baseAddresses(value, 'Адрес оплаты по умолчанию'));
              }

              break;
            }
          }
        });
      });
    }

    return this.container;
  }
}
