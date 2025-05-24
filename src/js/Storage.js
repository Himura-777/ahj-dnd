export default class Storage {
	static getCards(columnId) {
		const board = JSON.parse(localStorage.getItem('trello-board')) || {
			todo: [],
			'in-progress': [],
			done: []
		};
		return board[columnId];
	}

	static saveBoard(board) {
		localStorage.setItem('trello-board', JSON.stringify(board));
	}

	static addCard(columnId, card) {
		const board = JSON.parse(localStorage.getItem('trello-board')) || {
			todo: [],
			'in-progress': [],
			done: []
		};

		board[columnId].push({ id: card.id, text: card.text });
		this.saveBoard(board);
	}

	static deleteCard(cardId) {
		const board = JSON.parse(localStorage.getItem('trello-board')) || {
			todo: [],
			'in-progress': [],
			done: []
		};

		for (const column in board) {
			board[column] = board[column].filter(card => card.id !== cardId);
		}

		this.saveBoard(board);
	}

	static moveCard(cardId, toColumnId) {
		const board = JSON.parse(localStorage.getItem('trello-board')) || {
			todo: [],
			'in-progress': [],
			done: []
		};

		let card = null;

		// Find and remove card from current column
		for (const column in board) {
			const index = board[column].findIndex(c => c.id === cardId);
			if (index !== -1) {
				card = board[column][index];
				board[column].splice(index, 1);
				break;
			}
		}

		// Add card to new column
		if (card) {
			board[toColumnId].push(card);
			this.saveBoard(board);
		}
	}
}