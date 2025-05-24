export default class Card {
	constructor(text, id) {
		this.text = text;
		this.id = id || Date.now().toString();
	}

	createElement() {
		const card = document.createElement('div');
		card.className = 'card';
		card.dataset.id = this.id;
		card.draggable = true;

		const deleteBtn = document.createElement('img');
		deleteBtn.className = 'card-delete';
		deleteBtn.src = './assets/icons/close.svg';
		deleteBtn.alt = 'Delete';

		card.innerHTML = this.text;
		card.appendChild(deleteBtn);

		return card;
	}
}