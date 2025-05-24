export default class Card {
  constructor(text, id) {
    this.text = text.trim();
    this.id = id || Date.now().toString();
  }

  createElement() {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = this.id;
    card.draggable = true;

    const deleteBtn = document.createElement('span');
    deleteBtn.className = 'card-delete';
    deleteBtn.innerHTML = '&times;';

    card.innerHTML = `<div class="card-content">${this.text}</div>`;
    card.append(deleteBtn);

    return card;
  }
}