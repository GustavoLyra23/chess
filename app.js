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
      const square = document.createElement("div");
      square.classList.add("square");

      if ((i + j) % 2 === 0) {
        square.classList.add("light");
      } else {
        square.classList.add("dark");
      }

      if (initialBoard[i][j]) {
        const piece = document.createElement("span");
        square.appendChild(piece);
        piece.textContent = initialBoard[i][j];
        piece.classList.add("chess-piece");

        if (
          initialBoard[i][j].charCodeAt(0) >= 9812 &&
          initialBoard[i][j].charCodeAt(0) <= 9817
        ) {
          piece.classList.add("white-piece");
          piece.classList.add(`${i}${j}`);
        } else {
          piece.classList.add("black-piece");
          piece.classList.add(`${i}${j}`);
        }
      }
      board.appendChild(square);
    }
  }
}

document.addEventListener("keypress", (keypress) => {
  document.querySelector("h2").innerText = "Game started!";
  document.querySelectorAll(".chess-piece").forEach((piece) => {
    piece.addEventListener("click", (e) => {
        
      console.log(e.target.classList);
      console.log("You clicked on a chess piece!");
    });
  });
});

function calculatePawnMoves(row, column) {
  let moves = initializeMovesMatrix();
  let piece = copyBoard[row][column];

  //black pawn
  if (piece === "♟") {
    // Peão preto
    if (row + 1 < 8) {
      movesMatrix[row + 1][column] = true;
      if (row === 1 && copyBoard[row + 1][column] === "") {
        movesMatrix[row + 2][column] = true;
      }
    }
  } else if (piece === "♙") {
    // white pawn
    if (row - 1 >= 0) {
      movesMatrix[row - 1][column] = true;
      if (row === 6 && copyBoard[row - 1][column] === "") {
        movesMatrix[row - 2][column] = true;
      }
    }
  }

  return movesMatrix;
}

function initializeMovesMatrix() {
  const movesMatrix = [];
  for (let i = 0; i < 8; i++) {
    const row = [];
    for (let j = 0; j < 8; j++) {
      row.push(false);
    }
    movesMatrix.push(row);
  }
  return movesMatrix;
}

function checkPieceToMove(piece) {
  switch (piece) {
    case "♟" || "♙":
      return calculatePawnMoves();
  }
}

createBoard();
