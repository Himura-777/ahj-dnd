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
			cardsContainer.appendChild(card.createElement());
		});

		const addCard = document.createElement('div');
		addCard.className = 'add-card';
		addCard.textContent = '+ Add another card';

		column.appendChild(title);
		column.appendChild(cardsContainer);
		column.appendChild(addCard);

		return column;
	}
}