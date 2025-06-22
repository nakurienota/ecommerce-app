import HtmlCreator from '@utils/html';

export function showSuccessPopup(message: string = 'Регистрация успешно завершена'): void {
  const overlay: HTMLDivElement = HtmlCreator.create('div', 'popup-overlay', 'popup-overlay');
  const popup: HTMLDivElement = HtmlCreator.create('div', 'popup-window', 'popup-window');
  const closeIcon: HTMLButtonElement = HtmlCreator.create('button', undefined, 'popup-window__close-icon');
  closeIcon.textContent = '×';

  const content: HTMLDivElement = HtmlCreator.create('div', undefined, 'popup-window__content');
  content.textContent = message;

  const closeButton: HTMLButtonElement = HtmlCreator.create('button', undefined, 'default-submit-button');
  closeButton.textContent = 'Закрыть';

  function closePopup(): void {
    overlay.remove();
  }

  closeIcon.addEventListener('click', closePopup);
  closeButton.addEventListener('click', closePopup);

  popup.append(closeIcon, content, closeButton);
  overlay.append(popup);
  document.body.append(overlay);
}
