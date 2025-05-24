import Card from './Card.js'

export default class Column {
  constructor(title, id, cards = []) {
    this.title = title;
    this.id = id;
    this.cards = cards.map(card => new Card(card.text, card.id));
  }

  createElement() {
    const column = document.createElement('div');
    column.className = 'column';
    column.dataset.id = this.id;

    const title = document.createElement('h2');
    title.className = 'column-title';
    title.textContent = this.title;

    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'cards-container';

    this.cards.forEach(card => {
      cardsContainer.append(card.createElement());
    });

    // Добавляем кнопку "Add another card"
    const addCardBtn = document.createElement('button');
    addCardBtn.className = 'add-card-btn';
    addCardBtn.textContent = '+ Add another card';

    // Форма для добавления карточки (изначально скрыта)
    const addCardForm = document.createElement('div');
    addCardForm.className = 'add-card-form';
    addCardForm.style.display = 'none';
    addCardForm.innerHTML = `
      <textarea class="new-card-text" placeholder="Enter a title for this card..."></textarea>
      <div class="form-buttons">
        <button class="submit-card-btn">Add Card</button>
        <button class="cancel-card-btn">✕</button>
      </div>
    `;

    column.append(title, cardsContainer, addCardBtn, addCardForm);
    return column;
  }
}