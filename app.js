const board = document.querySelector(".chessboard");

const initialBoard = [
  '♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜',
  '♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟',
  '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '',
  '♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙',
  '♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'
];

for (let i = 0; i < 64; i++) {
  const square = document.createElement("div");
  square.classList.add("square");

  if ((Math.floor(i / 8) + i) % 2 === 0) {
    square.classList.add("light");
  } else {
    square.classList.add("dark");
  }

  if (initialBoard[i]) {
    square.textContent = initialBoard[i];
    square.classList.add("chess-piece");
  }
  board.appendChild(square);
}