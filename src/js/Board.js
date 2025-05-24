import Column from './Column.js'
import Storage from './Storage.js'
import Card from './Card.js'

export default class Board {
  constructor() {
    this.columns = [
      new Column('TODO', 'todo', Storage.getCards('todo')),
      new Column('IN PROGRESS', 'in-progress', Storage.getCards('in-progress')),
      new Column('DONE', 'done', Storage.getCards('done'))
    ];
  }

  render() {
    const board = document.createElement('div');
    board.className = 'board';

    this.columns.forEach(column => {
      board.append(column.createElement());
    });

    document.getElementById('app').append(board);
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('card-delete')) {
        this.deleteCard(e.target.closest('.card'));
      } else if (e.target.classList.contains('add-card-btn')) {
        this.showAddCardForm(e.target);
      } else if (e.target.classList.contains('submit-card-btn')) {
        this.addCard(e.target.closest('.column'));
      } else if (e.target.classList.contains('cancel-card-btn')) {
        this.hideAddCardForm(e.target.closest('.column'));
      }
    });

    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('card-delete')) {
        this.deleteCard(e.target.closest('.card'));
      } else if (e.target.classList.contains('add-card-btn')) {
        this.addCard(e.target.closest('.column'));
      }
    });

    document.addEventListener('dragstart', (e) => {
      if (e.target.classList.contains('card')) {
        e.target.classList.add('dragging');
        e.dataTransfer.setData('text/plain', e.target.dataset.id);
        e.target.style.transform = 'rotate(3deg)';
      }
    });

    document.addEventListener('dragend', (e) => {
      if (e.target.classList.contains('card')) {
        e.target.classList.remove('dragging');
        e.target.style.transform = '';
      }
    });

    document.addEventListener('dragover', (e) => {
      if (e.target.classList.contains('column') || e.target.classList.contains('card')) {
        e.preventDefault();
        const afterElement = this.getDragAfterElement(e.target.closest('.column'), e.clientY);
        const draggable = document.querySelector('.dragging');

        if (afterElement == null) {
          e.target.closest('.column').querySelector('.cards-container').append(draggable);
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

  showAddCardForm(button) {
    const column = button.closest('.column');
    button.style.display = 'none';
    column.querySelector('.add-card-form').style.display = 'block';
    column.querySelector('.new-card-text').focus();
  }

  hideAddCardForm(column) {
    column.querySelector('.add-card-btn').style.display = 'block';
    column.querySelector('.add-card-form').style.display = 'none';
    column.querySelector('.new-card-text').value = '';
  }

  addCard(columnElement) {
    const textarea = columnElement.querySelector('.new-card-text');
    const text = textarea.value.trim();

    if (text) {
      const columnId = columnElement.dataset.id;
      const card = new Card(text);

      Storage.addCard(columnId, card);
      columnElement.querySelector('.cards-container').append(card.createElement());
      this.hideAddCardForm(columnElement);
    }
  }

  getDragAfterElement(column, y) {
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

  deleteCard(cardElement) {
    const cardId = cardElement.dataset.id;
    Storage.deleteCard(cardId);
    cardElement.remove();
  }

  addCard(columnElement) {
    const textarea = columnElement.querySelector('.new-card-text');
    const text = textarea.value.trim();

    if (text) {
      const columnId = columnElement.dataset.id;
      const card = new Card(text);

      Storage.addCard(columnId, card);
      columnElement.querySelector('.cards-container').append(card.createElement());
      textarea.value = '';
    }
  }
}