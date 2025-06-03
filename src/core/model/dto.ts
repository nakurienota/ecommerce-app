import type { registrationInputsEnum } from '@core/enum/registration-inputs';
import type { Product } from '@core/model/product';

export type ProductResponse = {
  limit: number;
  offset: number;
  count: number;
  total: number;
  results: Product[];
};

export type TokenResponse = {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  scope: string;
  refresh_token: string;
};

export type CustomersResponse = {
  customer: Customer;
};

export type Customer = {
  addresses: [];
  email: string;
  firstName: string;
  id: string;
  isEmailVerified: boolean;
  lastName: string;
  password: string;
  version: number;
  createdAt: string;
  lastModifiedAt: string;
  authenticationMode: string;
  stores: [];
};

export type RegistrationInput = {
  textLabel: string;
  subClass: registrationInputsEnum;
  typeInput: string;
  validate?: (value: string) => string | null;
  required: boolean;
};

export type AccountInputs = {
  textLabel: string;
  subClass: registrationInputsEnum;
  typeInput: string;
  validate?: (value: string) => string | null;
  required: boolean;
};

export type ResponseCustomerById = {
  id: string;
  version: number;
  versionModifiedAt: string;
  lastMessageSequenceNumber: number;
  createdAt: string;
  lastModifiedAt: string;
  lastModifiedBy: {
    isPlatformClient: boolean;
    user: {
      typeId: string;
      id: string;
    };
  };
  createdBy: {
    isPlatformClient: boolean;
    user: {
      typeId: string;
      id: string;
    };
  };
  customerNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName: string;
  title: string;
  locale: string;
  salutation: string;
  dateOfBirth: string;
  defaultBillingAddressId: string;
  defaultShippingAddressId: string;
  password: string;
  addresses: [];
  shippingAddressIds: string[];
  billingAddressIds: string[];
  isEmailVerified: boolean;
  customerGroupAssignments: string;
  externalId: string;
  key: string;
  stores: [];
  authenticationMode: string;
};
