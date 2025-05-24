import Column from './Column.js';
import Storage from './Storage.js';
import Card from './Card.js';

export default class Board {
  constructor () {
    this.columns = [
      new Column('TODO', 'todo', Storage.getCards('todo')),
      new Column('IN PROGRESS', 'in-progress', Storage.getCards('in-progress')),
      new Column('DONE', 'done', Storage.getCards('done'))
    ];
  }

  render () {
    const board = document.createElement('div');
    board.className = 'board';

    this.columns.forEach(column => {
      board.appendChild(column.createElement());
    });

    document.body.appendChild(board);
    this.setupEventListeners();
  }

  setupEventListeners () {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('card-delete')) {
        this.deleteCard(e.target.closest('.card'));
      } else if (e.target.classList.contains('add-card')) {
        this.addCardPrompt(e.target.closest('.column'));
      }
    });

    document.addEventListener('dragstart', (e) => {
      if (e.target.classList.contains('card')) {
        e.target.classList.add('dragging');
        e.dataTransfer.setData('text/plain', e.target.dataset.id);
      }
    });

    document.addEventListener('dragend', (e) => {
      if (e.target.classList.contains('card')) {
        e.target.classList.remove('dragging');
      }
    });

    document.addEventListener('dragover', (e) => {
      if (e.target.classList.contains('column') || e.target.classList.contains('card')) {
        e.preventDefault();
        const afterElement = this.getDragAfterElement(e.target.closest('.column'), e.clientY);
        const draggable = document.querySelector('.dragging');

        if (afterElement == null) {
          e.target.closest('.column').querySelector('.cards-container').appendChild(draggable);
        } else {
          e.target.closest('.column').querySelector('.cards-container').insertBefore(draggable, afterElement);
        }
      }
    });

    document.addEventListener('drop', (e) => {
      e.preventDefault();
      if (e.target.classList.contains('column') || e.target.classList.contains('card')) {
        const cardId = e.dataTransfer.getData('text/plain');
        const card = document.querySelector(`[data-id="${cardId}"]`);
        const columnId = e.target.closest('.column').dataset.id;

        Storage.moveCard(cardId, columnId);
      }
    });
  }

  getDragAfterElement (column, y) {
    const cards = [...column.querySelectorAll('.card:not(.dragging)')];

    return cards.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;

      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }

  deleteCard (cardElement) {
    const cardId = cardElement.dataset.id;
    Storage.deleteCard(cardId);
    cardElement.remove();
  }

  addCardPrompt (columnElement) {
    const text = prompt('Enter card text:');
    if (text) {
      const columnId = columnElement.dataset.id;
      const card = new Card(text);

      Storage.addCard(columnId, card);
      columnElement.querySelector('.cards-container').appendChild(card.createElement());
    }
  }
}
