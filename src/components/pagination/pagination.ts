import './index.scss';
import HtmlCreator from '@utils/html';

export class PaginationButtons {
  private prevButton: HTMLButtonElement;
  private nextButton: HTMLButtonElement;
  private paginationWrap: HTMLDivElement;
  constructor() {
    this.prevButton = HtmlCreator.create('button', undefined, 'button', 'prev-btn');
    this.prevButton.textContent = 'назад';
    this.prevButton.setAttribute('disabled', 'true');
    this.nextButton = HtmlCreator.create('button', undefined, 'button', 'next-btn');
    this.nextButton.textContent = 'вперед';
    this.nextButton.setAttribute('disabled', 'true');
    this.paginationWrap = HtmlCreator.create('div', undefined, 'pagination-wrapper');
    this.paginationWrap.append(this.prevButton, this.nextButton);
  }

  public getPagination(): HTMLDivElement {
    return this.paginationWrap;
  }

  public getPrevButton(): HTMLButtonElement {
    return this.prevButton;
  }

  public getNextButton(): HTMLButtonElement {
    return this.nextButton;
  }
}
