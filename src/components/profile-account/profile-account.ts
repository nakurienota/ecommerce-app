import { LocalStorageKeys } from '@core/enum/local-storage-keys';
import type { ResponseCustomerById } from '@core/model/dto';
import { Resthandler } from '@service/rest/resthandler';
import HtmlCreator from '@utils/html';
import { userLoggedIn } from '@utils/security';

export default class ProfileAccount {
  public container: HTMLDivElement;
  private readonly restHandler: Resthandler = Resthandler.getInstance();

  constructor() {
    this.container = HtmlCreator.create('div', undefined, 'profile__account');
  }

  public getHTML(): HTMLDivElement {
    const customerID = localStorage.getItem(LocalStorageKeys.USER_ID_LOGGED_IN);

    if (customerID && userLoggedIn()) {
      this.restHandler.getCustomer(customerID).then((response: ResponseCustomerById) => {
        const items = [
          { textLabel: 'Имя', textValue: response.firstName ?? 'Не указано', subClass: 'firstname' },
          { textLabel: 'Фамилия', textValue: response.lastName ?? 'Не указана', subClass: 'lastname' },
          { textLabel: 'Дата рождения', textValue: response.dateOfBirth ?? 'Не указана', subClass: 'birthday' },
        ];

        items.forEach(({ textLabel, textValue, subClass }) => {
          const itemWrapper = HtmlCreator.create(
            'div',
            undefined,
            'profile__account-wrapper',
            `profile__account-${subClass}-wrapper`
          );
          const itemLabel = HtmlCreator.create(
            'label',
            undefined,
            'profile__account-label',
            `profile__account-${subClass}-label`
          );
          itemLabel.textContent = textLabel;
          const itemValue = HtmlCreator.create(
            'p',
            undefined,
            'profile__account-value',
            `profile__account-${subClass}-value`
          );

          itemValue.textContent = textValue;

          this.container.append(itemWrapper);
          itemWrapper.append(itemLabel, itemValue);
        });
      });
    }

    return this.container;
  }
}
