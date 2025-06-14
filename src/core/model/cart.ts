type Cart = {
  type: 'Cart';
  id: string;
  version: number;
  key?: string;
  customerId?: string;
  customerEmail?: string;
  customerGroup?: Reference;
  businessUnit?: Reference;
  store?: Reference;
  anonymousId?: string;
  createdAt: string;
  lastModifiedAt: string;
  lastModifiedBy: {
    isPlatformClient: boolean;
  };
  createdBy: {
    isPlatformClient: boolean;
  };
  lineItems: LineItem[];
  cartState: 'Active' | 'Frozen' | 'Merged' | 'Ordered';
  totalLineItemQuantity?: number;
  totalPrice: TotalPrice;
  customLineItems: CustomLineItem[];
  discountCodes: DiscountCode[];
  directDiscounts: DirectDiscount[];
  inventoryMode: 'None' | 'TrackOnly' | 'ReserveOnOrder';
  taxMode: 'Platform' | 'External' | 'ExternalAmount';
  taxRoundingMode: 'HalfEven' | 'HalfUp' | 'HalfDown';
  taxCalculationMode: 'LineItemLevel' | 'UnitPriceLevel';
  taxedPrice?: TaxedPrice;
  taxedShippingPrice?: TaxedPrice;
  refusedGifts: Reference[];
  origin: 'Customer' | 'Merchant';
  itemShippingAddresses: ShippingAddress[];
  shippingMode: 'Single' | 'Multiple';
  shipping: Shipping[];
};

type Price = {
  currencyCode: string;
  centAmount: number;
  fractionDigits: number;
};

type TotalPrice = Price & {
  type: string;
};

type Prices = {
  value: TotalPrice;
  id: string;
};

type LineItem = {
  id: string;
  productId: string;
  name: LocalizedString;
  productType: {
    typeId: 'product-type';
    id: string;
    version: number;
  };
  productSlug: {
    en: string;
  };
  variant: ProductVariant;
  price: Prices;
  quantity: number;
  discountedPricePerQuantity: discountedPricePerQuantity[];
  state: ItemState[];
  priceMode: string;
  lineItemMode: string;
  totalPrice: TotalPrice;
  perMethodTaxRate: [];
  taxedPricePortions: [];
};

type LocalizedString = {
  [locale: string]: string;
};

type ProductVariant = {
  id: number;
  sku: string;
  prices: Prices[];
  images: Images[];
  attributes: Attribute[];
  assets: Asset[];
};

type Images = {
  url: string;
  label?: string;
  dimensions: {
    w: number;
    h: number;
  };
};

type Attribute = {
  name: string;
  value:
    | string
    | number
    | boolean
    | Price
    | Reference
    | AttributeEnumValue
    | AttributeLocalizedEnumValue
    | AttributeSet
    | AttributeNested;
};

type AttributeEnumValue = {
  key: string;
  label: string;
};

type AttributeLocalizedEnumValue = {
  key: string;
  label: LocalizedString;
};

type AttributeSet = {
  values: Attribute[];
};

type AttributeNested = {
  attributes: Attribute[];
};

type Asset = {
  id: string;
  key?: string;
  sources: AssetSource[];
  name: LocalizedString;
  description?: LocalizedString;
  tags?: string[];
  custom?: CustomFields;
};

type AssetSource = {
  uri: string;
  key?: string;
  dimensions?: {
    w: number;
    h: number;
  };
  contentType?: string;
};

type CustomFields = {
  type: Reference;
  fields: Record<string, CustomFieldValue>;
};

type CustomFieldValue =
  | string
  | number
  | boolean
  | Price
  | Reference
  | AttributeEnumValue
  | AttributeLocalizedEnumValue
  | AttributeSet
  | AttributeNested;

type ItemState = {
  quantity: number;
  state: Reference;
};

type CustomLineItem = {
  id: string;
  key?: string;
  name: LocalizedString;
  money: Price;
  quantity: number;
  totalPrice: Price;
  slug: string;
  taxCategory?: Reference;
  taxRate?: TaxRate;
  discountedPricePerQuantity?: DiscountedPrice[];
  taxedPrice?: TaxedPrice;
  shippingDetails: ItemShippingDetails;
  custom?: CustomFields;
};

type discountedPricePerQuantity = {
  quantity: number;
  discountedPrice: {
    value: TotalPrice;
    includedDiscounts: Discounts[];
  };
};

type Discounts = {
  discount: {
    id: string;
    typeId: Reference;
  };
  discountedAmount: TotalPrice;
};

type DiscountCode = {
  id: string;
  code: string;
  state: 'NotActive' | 'Active' | 'MaxApplicationReached';
  referencedDiscounts: Reference[];
  validFrom?: string;
  validUntil?: string;
};

type DirectDiscount = {
  id: string;
  value: DiscountValue;
};

type DiscountValue = {
  type: 'absolute' | 'relative';
  money?: Price[];
  permyriad?: number;
};

type DiscountedPrice = {
  value: Price;
  discount: Reference;
};

type Reference = {
  typeId: string;
  id: string;
};

type Shipping = {
  shippingMethod?: Reference;
  shippingRate?: ShippingRate;
  taxRate?: TaxRate;
  price?: Price;
  discountedPrice?: Price;
  shippingAddress?: ShippingAddress;
};

type ItemShippingDetails = {
  targets: ItemShippingTarget[];
  valid: boolean;
};

type ItemShippingTarget = {
  addressKey: string;
  quantity: number;
};

type TaxRate = {
  name: string;
  amount: number;
  includedInPrice: boolean;
  country: string;
  state?: string;
  subRates?: SubRate[];
};

type SubRate = {
  name: string;
  amount: number;
};

type ShippingRate = {
  price: Price;
  freeAbove?: Price;
  tiers?: ShippingRateTier[];
};

type ShippingRateTier = {
  type: 'CartValue' | 'CartClassification' | 'CartScore' | 'PriceFunction';
  minimumCentAmount?: number;
  priceFunction?: {
    function: string;
    currencyCode: string;
  };
};

type ShippingAddress = {
  firstName?: string;
  lastName?: string;
  streetName?: string;
  streetNumber?: string;
  city?: string;
  postalCode?: string;
  country: string;
  phone?: string;
  email?: string;
  additionalInfo?: string;
};

type TaxedPrice = {
  totalNet: Price;
  totalGross: Price;
  taxPortions: TaxPortion[];
};

type TaxPortion = {
  rate: number;
  amount: Price;
  name?: string;
};

export { Cart, LineItem };
