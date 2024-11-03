const board = document.querySelector(".chessboard");

const initialBoard = [
  [
    "./icons/br.png",
    "./icons/bn.png",
    "./icons/bb.png",
    "./icons/bq.png",
    "./icons/bk.png",
    "./icons/bb.png",
    "./icons/bn.png",
    "./icons/br.png",
  ],
  [
    "./icons/bp.png",
    "./icons/bp.png",
    "./icons/bp.png",
    "./icons/bp.png",
    "./icons/bp.png",
    "./icons/bp.png",
    "./icons/bp.png",
    "./icons/bp.png",
  ],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  [
    "./icons/wp.png",
    "./icons/wp.png",
    "./icons/wp.png",
    "./icons/wp.png",
    "./icons/wp.png",
    "./icons/wp.png",
    "./icons/wp.png",
    "./icons/wp.png",
  ],
  [
    "./icons/wr.png",
    "./icons/wn.png",
    "./icons/wb.png",
    "./icons/wq.png",
    "./icons/wk.png",
    "./icons/wb.png",
    "./icons/wn.png",
    "./icons/wr.png",
  ],
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
  square.dataset.row = row;
  square.dataset.col = col;
  if ((row + col) % 2 === 0) {
    square.classList.add("light");
  } else {
    square.classList.add("dark");
  }
  return square;
}

function createPieceElement(piece, row, col) {
  const pieceElement = document.createElement("img");
  pieceElement.src = piece;
  pieceElement.classList.add("chess-piece");
  pieceElement.dataset.row = row;
  pieceElement.dataset.col = col;
  return pieceElement;
}

document.addEventListener("keypress", () => {
  document.querySelector("h2").innerText = "Game started!";
  document.querySelectorAll(".chess-piece").forEach((piece) => {
    piece.addEventListener("click", pieceClickHandler);
  });
});

function pieceClickHandler(e) {
  clearHighlights();
  const moves = checkPieceToMove(e.target);
  highlightMoves(moves);
  console.log(moves);
  console.log(e.target.classList);
  console.log("You clicked on a chess piece!");

  document.querySelectorAll(".highlight").forEach((square) => {
    square.addEventListener("click", squareClickHandler);
  });
}

function squareClickHandler(e) {
  const piece = document.querySelector(".chess-piece[data-selected='true']");
  if (piece) {
    e.target.appendChild(piece);
    const row = parseInt(piece.dataset.row);
    const col = parseInt(piece.dataset.col);
    const newRow = parseInt(e.target.dataset.row);
    const newCol = parseInt(e.target.dataset.col);
    copyBoard[newRow][newCol] = copyBoard[row][col];
    copyBoard[row][col] = "";
    piece.dataset.row = newRow;
    piece.dataset.col = newCol;
    piece.removeAttribute("data-selected");
    clearHighlights();
    document.querySelectorAll(".highlight").forEach((square) => {
      square.removeEventListener("click", squareClickHandler);
    });
  }
}

function calculatePawnMoves(row, column) {
  const moves = initializeMovesMatrix();
  const piece = copyBoard[row][column];

  if (piece === "./icons/bp.png") {
    if (row + 1 < 8 && copyBoard[row + 1][column] === "") {
      moves[row + 1][column] = true;
      if (row === 1 && copyBoard[row + 2][column] === "") {
        moves[row + 2][column] = true;
      }
    }
    if (
      row + 1 < 8 &&
      column + 1 < 8 &&
      copyBoard[row + 1][column + 1].startsWith("./icons/w")
    ) {
      moves[row + 1][column + 1] = true;
    }
    if (
      row + 1 < 8 &&
      column - 1 >= 0 &&
      copyBoard[row + 1][column - 1].startsWith("./icons/w")
    ) {
      moves[row + 1][column - 1] = true;
    }
  } else if (piece === "./icons/wp.png") {
    if (row - 1 >= 0 && copyBoard[row - 1][column] === "") {
      moves[row - 1][column] = true;
      if (row === 6 && copyBoard[row - 2][column] === "") {
        moves[row - 2][column] = true;
      }
    }
    if (
      row - 1 >= 0 &&
      column + 1 < 8 &&
      copyBoard[row - 1][column + 1].startsWith("./icons/b")
    ) {
      moves[row - 1][column + 1] = true;
    }
    if (
      row - 1 >= 0 &&
      column - 1 >= 0 &&
      copyBoard[row - 1][column - 1].startsWith("./icons/b")
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
  const row = parseInt(piece.dataset.row);
  const column = parseInt(piece.dataset.col);
  const pieceSrc = piece.src.split("/").pop();
  console.log(pieceSrc);
  switch (pieceSrc) {
    case "bp.png":
    case "wp.png":
      piece.setAttribute("data-selected", "true");
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
          `.square[data-row='${i}'][data-col='${j}']`
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