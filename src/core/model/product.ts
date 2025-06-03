type Product = {
  id: string;
  version: number;
  versionModifiedAt: string;
  lastMessageSequenceNumber: number;
  createdAt: string;
  lastModifiedAt: string;
  createdBy: CreatedBy;
  lastModifiedBy: CreatedBy;
  productType: Reference;
  masterData: ProductWrapperData;
  key: string;
  taxCategory: Reference;
  priceMode: string;
  lastVariantId: number;
};

type CreatedBy = {
  isPlatformClient: boolean;
  user: Reference;
};

type Reference = {
  typeId: string;
  id: string;
};

type ProductWrapperData = {
  current: ProductData;
  staged: ProductData;
  published: boolean;
  hasStagedChanges: boolean;
};

type ProductData = {
  name: LocalizedString;
  description: LocalizedString;
  categories: Reference[];
  categoryOrderHints: Record<string, string>;
  slug: LocalizedString;
  metaTitle?: LocalizedString;
  metaDescription?: LocalizedString;
  masterVariant: Variant;
  variants: Variant[];
  searchKeywords: Record<string, string>;
  attributes: Attribute[];
};

type LocalizedString = {
  [locale: string]: string;
};

type Attribute = {
  name: string;
  value: string | number | boolean | object;
};

type Variant = {
  id: number;
  sku?: string;
  key?: string;
  prices: Price[];
  images: Image[];
  attributes: Attribute[];
  assets: string[];
};

type Price = {
  id: string;
  value: {
    type: string;
    currencyCode: string;
    centAmount: number;
    fractionDigits: number;
  };
  country?: string;
};

type Image = {
  url: string;
  label?: string;
  dimensions: {
    width: number;
    height: number;
  };
};

export {
  Product,
  CreatedBy,
  Reference,
  ProductWrapperData,
  ProductData,
  LocalizedString,
  Attribute,
  Variant,
  Price,
  Image,
};
