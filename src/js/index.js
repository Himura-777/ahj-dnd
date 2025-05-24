import '../css/style.css';
import Board from './Board.js';

document.addEventListener('DOMContentLoaded', () => {
  const board = new Board();
  board.render();
});
