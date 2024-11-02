const board = document.querySelector(".chessboard");

const initialBoard = [
  ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
  ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
  ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
];

const copyBoard = initialBoard.map((row) => [...row]);

function createBoard() {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const square = createSquare(i, j);
      const piece = initialBoard[i][j];
      if (piece) {
        const pieceElement = createPieceElement(piece, i, j);
        square.appendChild(pieceElement);
      }
      board.appendChild(square);
    }
  }
}

function createSquare(row, col) {
  const square = document.createElement("div");
  square.classList.add("square");
  if ((row + col) % 2 === 0) {
    square.classList.add("light");
  } else {
    square.classList.add("dark");
  }
  return square;
}

function createPieceElement(piece, row, col) {
  const pieceElement = document.createElement("span");
  pieceElement.textContent = piece;
  pieceElement.classList.add("chess-piece", `${row}${col}`);
  if (piece.charCodeAt(0) >= 9812 && piece.charCodeAt(0) <= 9817) {
    pieceElement.classList.add("white-piece");
  } else {
    pieceElement.classList.add("black-piece");
  }
  return pieceElement;
}

document.addEventListener("keypress", () => {
  document.querySelector("h2").innerText = "Game started!";
  document.querySelectorAll(".chess-piece").forEach((piece) => {
    piece.addEventListener("click", (e) => {
      clearHighlights();
      const moves = checkPieceToMove(e.target);
      highlightMoves(moves);
      console.log(moves);
      console.log(e.target.classList);
      console.log("You clicked on a chess piece!");
    });
  });
});

function calculatePawnMoves(row, column) {
  const moves = initializeMovesMatrix();
  const piece = copyBoard[row][column];

  if (piece === "♟") {
    if (row + 1 < 8 && copyBoard[row + 1][column] === "") {
      moves[row + 1][column] = true;
      if (row === 1 && copyBoard[row + 2][column] === "") {
        moves[row + 2][column] = true;
      }
    }
    if (
      row + 1 < 8 &&
      column + 1 < 8 &&
      copyBoard[row + 1][column + 1].charCodeAt(0) >= 9812 &&
      copyBoard[row + 1][column + 1].charCodeAt(0) <= 9817
    ) {
      moves[row + 1][column + 1] = true;
    }
    if (
      row + 1 < 8 &&
      column - 1 >= 0 &&
      copyBoard[row + 1][column - 1].charCodeAt(0) >= 9812 &&
      copyBoard[row + 1][column - 1].charCodeAt(0) <= 9817
    ) {
      moves[row + 1][column - 1] = true;
    }
  } else if (piece === "♙") {
    if (row - 1 >= 0 && copyBoard[row - 1][column] === "") {
      moves[row - 1][column] = true;
      if (row === 6 && copyBoard[row - 2][column] === "") {
        moves[row - 2][column] = true;
      }
    }
    if (
      row - 1 >= 0 &&
      column + 1 < 8 &&
      copyBoard[row - 1][column + 1].charCodeAt(0) >= 9818 &&
      copyBoard[row - 1][column + 1].charCodeAt(0) <= 9823
    ) {
      moves[row - 1][column + 1] = true;
    }
    if (
      row - 1 >= 0 &&
      column - 1 >= 0 &&
      copyBoard[row - 1][column - 1].charCodeAt(0) >= 9818 &&
      copyBoard[row - 1][column - 1].charCodeAt(0) <= 9823
    ) {
      moves[row - 1][column - 1] = true;
    }
  }

  return moves;
}

function initializeMovesMatrix() {
  return Array.from({ length: 8 }, () => Array(8).fill(false));
}

function checkPieceToMove(piece) {
  const row = parseInt(piece.classList[1][0]);
  const column = parseInt(piece.classList[1][1]);
  const pieceText = piece.innerText;
  console.log(pieceText);
  switch (pieceText) {
    case "♟":
    case "♙":
      return calculatePawnMoves(row, column);
    default:
      return initializeMovesMatrix();
  }
}

function highlightMoves(moves) {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (moves[i][j]) {
        const square = document.querySelector(
          `.square:nth-child(${i * 8 + j + 1})`
        );
        square.classList.add("highlight");
      }
    }
  }
}

function clearHighlights() {
  document.querySelectorAll(".highlight").forEach((square) => {
    square.classList.remove("highlight");
  });
}

createBoard();
