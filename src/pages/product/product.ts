import HtmlCreator from '@utils/html';
import { AppRoutes, router } from '@utils/router';

import { Resthandler } from '@service/rest/resthandler';
import { Attribute, Price, Product, ProductData, ProductWrapperData, Variant } from '@core/model/product';

export default class ProductPage {
  private readonly restHandler: Resthandler = Resthandler.getInstance();
  public container: HTMLElement;

  constructor() {
    this.container = HtmlCreator.create('div', undefined, 'container');
  }

  public getHTML(id: string): HTMLElement {
    const productWrapper: HTMLDivElement = HtmlCreator.create('div', undefined, 'product');
    productWrapper.textContent = 'Загрузка продукта... ';
    const locale: string = navigator.language || 'ru';
    const lang: string = locale.split('-')[0];

    this.restHandler
      .getProductById(id)
      .then((response: Product) => {
        productWrapper.textContent = '';
        console.log(response);
        const currentProduct: ProductData = response.masterData.current;
        console.log(currentProduct);

        const productText: HTMLParagraphElement = HtmlCreator.create('p', undefined, 'product__txt');
        productText.textContent = `Главная / Каталог товаров / Книги / Фэнтези / ${currentProduct.name[lang]}`;

        const productCard: HTMLDivElement = HtmlCreator.create('div', undefined, 'product__card');

        const productImage: HTMLDivElement = HtmlCreator.create('div', undefined, 'product__image-wrapper');
        const productMainImg: HTMLImageElement = HtmlCreator.create('img', undefined, 'product__image');
        productMainImg.src = currentProduct.masterVariant.images[0].url;
        productImage.append(productMainImg);

        const productVariants: HTMLDivElement = HtmlCreator.create('div', undefined, 'product__variants');
        const productVariantsName: HTMLParagraphElement = HtmlCreator.create('p', undefined, 'product__variants-name');
        productVariantsName.textContent = `${currentProduct.name[lang]}`;
        const productVariantsSelector: HTMLDivElement = HtmlCreator.create(
          'div',
          undefined,
          'product__variants-selector'
        );
        const productVariantsSelectorName: HTMLParagraphElement = HtmlCreator.create(
          'p',
          undefined,
          'product__variants-selector-name'
        );
        productVariantsSelectorName.textContent = 'Выберите форму';
        const productVariant1: HTMLDivElement = HtmlCreator.create('div', undefined, 'product__variant', 'option');
        productVariant1.textContent = 'Твердый переплет';
        const productVariant2: HTMLDivElement = HtmlCreator.create('div', undefined, 'product__variant', 'option');
        productVariant2.textContent = 'Мягкий переплет';
        const productVariant3: HTMLDivElement = HtmlCreator.create('div', undefined, 'product__variant', 'option');
        productVariant3.textContent = 'Первое издание';
        const productVariant4: HTMLDivElement = HtmlCreator.create('div', undefined, 'product__variant', 'option');
        productVariant4.textContent = 'C автографом автора';
        productVariantsSelector.append(productVariant1, productVariant2, productVariant3, productVariant4);

        const variants: HTMLDivElement[] = [productVariant1, productVariant2, productVariant3, productVariant4];

        variants.forEach((variant: HTMLDivElement): void => {
          variant.addEventListener('click', (): void => {
            variants.forEach((v: HTMLDivElement): void => v.classList.remove('selected'));
            variant.classList.add('selected');
          });
        });

        const productVariantsPriceCart: HTMLDivElement = HtmlCreator.create(
          'div',
          undefined,
          'product__variants-price-cart'
        );
        const productVariantsPrice: HTMLParagraphElement = HtmlCreator.create('p', undefined, 'product__price');
        productVariantsPrice.textContent = this.formatCentAmount(currentProduct.masterVariant.prices[0]);
        const productVariantsCartButton: HTMLButtonElement = HtmlCreator.create(
          'button',
          undefined,
          'product__cart-button',
          'default-submit-button'
        );
        productVariantsCartButton.textContent = 'Добавить в корзину   >';
        productVariantsPriceCart.append(productVariantsPrice, productVariantsCartButton);
        productVariants.append(
          productVariantsName,
          productVariantsSelectorName,
          productVariantsSelector,
          productVariantsPriceCart
        );
        productCard.append(productImage, productVariants);

        const productDescription: HTMLDivElement = HtmlCreator.create('div', undefined, 'product__description');
        const productDescSelector: HTMLDivElement = HtmlCreator.create(
          'div',
          undefined,
          'product__description-selector'
        );
        const detailsSelector: HTMLDivElement = HtmlCreator.create(
          'div',
          undefined,
          'product__description-variant',
          'desc-selected',
          'details-selector'
        );
        detailsSelector.textContent = 'Детали';
        const deliverySelector: HTMLDivElement = HtmlCreator.create(
          'div',
          undefined,
          'product__description-variant',
          'delivery-selector'
        );
        deliverySelector.textContent = 'Доставка';
        const paymentSelector: HTMLDivElement = HtmlCreator.create(
          'div',
          undefined,
          'product__description-variant',
          'payment-selector'
        );
        paymentSelector.textContent = 'Оплата';
        const faqSelector: HTMLDivElement = HtmlCreator.create(
          'div',
          undefined,
          'product__description-variant',
          'faq-selector'
        );
        faqSelector.textContent = 'FAQ';

        const detailsOptionsWrapper: HTMLDivElement = HtmlCreator.create(
          'div',
          undefined,
          'product__description-text-wrapper'
        );
        productDescSelector.append(detailsSelector, deliverySelector, paymentSelector, faqSelector);
        this.appendDescDetails(detailsOptionsWrapper, currentProduct.masterVariant.attributes);

        const descVariants: HTMLDivElement[] = [detailsSelector, deliverySelector, paymentSelector, faqSelector];
        descVariants.forEach((element: HTMLDivElement): void => {
          element.addEventListener('click', (): void => {
            descVariants.forEach((v: HTMLDivElement): void => v.classList.remove('desc-selected'));
            element.classList.add('desc-selected');
            if (element.classList.contains('details-selector')) {
              this.appendDescDetails(detailsOptionsWrapper, currentProduct.masterVariant.attributes);
            } else if (element.classList.contains('delivery-selector')) {
              detailsOptionsWrapper.innerHTML = '';
              detailsOptionsWrapper.textContent =
                'Доступна доставка через партнерские пункты выдачи, постаматы, курьером, почтой РФ, экспресс-доставкой.';
            } else if (element.classList.contains('payment-selector')) {
              detailsOptionsWrapper.innerHTML = '';
              detailsOptionsWrapper.textContent =
                'Доступна оплата на сайте. Принимаем карты МИР, Мастер-кард и Виза. \n' +
                'Также доступна оплата при получении В магазинах сети — наличными или картами МИР, Мастер-кард и Виза.\n' +
                'При оформлении заказа покажем доступные способы оплаты для выбранной службы. Счета за интернет-заказы юридические лица\n ' +
                'получают на электронную почту, указанную при оформлении. Счёт придёт после передачи заказа в доставку. Вместе с заказом\n ' +
                'будут предоставлены документы: счёт, товарная накладная ТОРГ-12, счёт-фактура.';
            } else if (element.classList.contains('faq-selector')) {
              detailsOptionsWrapper.innerHTML = '';
              detailsOptionsWrapper.textContent =
                'Заказы, сделанные на сайте ecommerce, отправляются с московского склада. Заказы, ' +
                'оформленные с доставкой в магазины сети, тоже едут со склада. Поэтому сроки доставки напрямую зависят от ' +
                'расстояния между Москвой и пунктом назначения. ';
            }
          });
        });

        const descSelectorLineTop: HTMLDivElement = HtmlCreator.create(
          'div',
          undefined,
          'product__description-selector-line-top'
        );
        const descSelectorLineBottom: HTMLDivElement = HtmlCreator.create(
          'div',
          undefined,
          'product__description-selector-line-bottom'
        );
        productDescription.append(
          descSelectorLineTop,
          productDescSelector,
          descSelectorLineBottom,
          detailsOptionsWrapper
        );
        this.container.append(productWrapper);
        productWrapper.append(productText, productCard, productDescription);
      })
      .catch((error) => {
        console.log(error);
        router.navigate(AppRoutes.NOT_FOUND);
      });
    return this.container;
  }

  private appendDescDetails(wrapper: HTMLDivElement, attributes: Attribute[]) {
    wrapper.innerHTML = '';
    attributes.forEach((a: Attribute) => {
      const option: HTMLDivElement = HtmlCreator.create('div', undefined, 'product__description-text-variant');
      const optionKey: HTMLDivElement = HtmlCreator.create('div', undefined, 'product__description-text');
      optionKey.textContent = a.name;
      const optionValue: HTMLDivElement = HtmlCreator.create('div', undefined, 'product__description-text');
      optionValue.textContent = a.value?.toString();
      option.append(optionKey, optionValue);
      wrapper.append(option);
    });
  }

  private formatCentAmount(price: Price): string {
    return (price.value.centAmount / 10 ** price.value.fractionDigits).toFixed(price.value.fractionDigits);
  }
}
