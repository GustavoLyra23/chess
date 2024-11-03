const board = document.querySelector(".chessboard");

const initialBoard = [
  ["./icons/br.png", "./icons/bn.png", "./icons/bb.png", "./icons/bq.png", "./icons/bk.png", "./icons/bb.png", "./icons/bn.png", "./icons/br.png"],
  ["./icons/bp.png", "./icons/bp.png", "./icons/bp.png", "./icons/bp.png", "./icons/bp.png", "./icons/bp.png", "./icons/bp.png", "./icons/bp.png"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["./icons/wp.png", "./icons/wp.png", "./icons/wp.png", "./icons/wp.png", "./icons/wp.png", "./icons/wp.png", "./icons/wp.png", "./icons/wp.png"],
  ["./icons/wr.png", "./icons/wn.png", "./icons/wb.png", "./icons/wq.png", "./icons/wk.png", "./icons/wb.png", "./icons/wn.png", "./icons/wr.png"],
];

const copyBoard = initialBoard.map((row) => [...row]);
let currentPlayer = "white";

function createBoard() {
  board.innerHTML = ""; 
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
  const piece = e.target;
  const pieceColor = piece.src.includes("w") ? "white" : "black";
  if (pieceColor !== currentPlayer) return;

  clearHighlights();
  const moves = checkPieceToMove(piece);
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
    const targetSquare = e.target.closest(".square");
    if (targetSquare && targetSquare.classList.contains("highlight")) {
      targetSquare.appendChild(piece);
      const row = parseInt(piece.dataset.row);
      const col = parseInt(piece.dataset.col);
      const newRow = parseInt(targetSquare.dataset.row);
      const newCol = parseInt(targetSquare.dataset.col);
      copyBoard[newRow][newCol] = copyBoard[row][col];
      copyBoard[row][col] = "";
      piece.dataset.row = newRow;
      piece.dataset.col = newCol;
      piece.removeAttribute("data-selected");
      clearHighlights();
      document.querySelectorAll(".highlight").forEach((square) => {
        square.removeEventListener("click", squareClickHandler);
      });
      currentPlayer = currentPlayer === "white" ? "black" : "white";
      checkGameStatus();
    }
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
    if (row + 1 < 8 && column + 1 < 8 && copyBoard[row + 1][column + 1].startsWith("./icons/w")) {
      moves[row + 1][column + 1] = true;
    }
    if (row + 1 < 8 && column - 1 >= 0 && copyBoard[row + 1][column - 1].startsWith("./icons/w")) {
      moves[row + 1][column - 1] = true;
    }
  } else if (piece === "./icons/wp.png") {
    if (row - 1 >= 0 && copyBoard[row - 1][column] === "") {
      moves[row - 1][column] = true;
      if (row === 6 && copyBoard[row - 2][column] === "") {
        moves[row - 2][column] = true;
      }
    }
    if (row - 1 >= 0 && column + 1 < 8 && copyBoard[row - 1][column + 1].startsWith("./icons/b")) {
      moves[row - 1][column + 1] = true;
    }
    if (row - 1 >= 0 && column - 1 >= 0 && copyBoard[row - 1][column - 1].startsWith("./icons/b")) {
      moves[row - 1][column - 1] = true;
    }
  }

  return moves;
}

function calculateRookMoves(row, column) {
  const moves = initializeMovesMatrix();
  const piece = copyBoard[row][column];
  const directions = [
    [1, 0], [-1, 0], [0, 1], [0, -1]
  ];

  directions.forEach(([dx, dy]) => {
    let x = row + dx;
    let y = column + dy;
    while (x >= 0 && x < 8 && y >= 0 && y < 8) {
      if (copyBoard[x][y] === "") {
        moves[x][y] = true;
      } else {
        if (piece.startsWith("./icons/w") && copyBoard[x][y].startsWith("./icons/b")) {
          moves[x][y] = true;
        } else if (piece.startsWith("./icons/b") && copyBoard[x][y].startsWith("./icons/w")) {
          moves[x][y] = true;
        }
        break;
      }
      x += dx;
      y += dy;
    }
  });

  return moves;
}

function calculateKnightMoves(row, column) {
  const moves = initializeMovesMatrix();
  const piece = copyBoard[row][column];
  const knightMoves = [
    [2, 1], [2, -1], [-2, 1], [-2, -1],
    [1, 2], [1, -2], [-1, 2], [-1, -2]
  ];

  knightMoves.forEach(([dx, dy]) => {
    const x = row + dx;
    const y = column + dy;
    if (x >= 0 && x < 8 && y >= 0 && y < 8) {
      if (copyBoard[x][y] === "" || (piece.startsWith("./icons/w") && copyBoard[x][y].startsWith("./icons/b")) || (piece.startsWith("./icons/b") && copyBoard[x][y].startsWith("./icons/w"))) {
        moves[x][y] = true;
      }
    }
  });

  return moves;
}

function calculateBishopMoves(row, column) {
  const moves = initializeMovesMatrix();
  const piece = copyBoard[row][column];
  const directions = [
    [1, 1], [1, -1], [-1, 1], [-1, -1]
  ];

  directions.forEach(([dx, dy]) => {
    let x = row + dx;
    let y = column + dy;
    while (x >= 0 && x < 8 && y >= 0 && y < 8) {
      if (copyBoard[x][y] === "") {
        moves[x][y] = true;
      } else {
        if (piece.startsWith("./icons/w") && copyBoard[x][y].startsWith("./icons/b")) {
          moves[x][y] = true;
        } else if (piece.startsWith("./icons/b") && copyBoard[x][y].startsWith("./icons/w")) {
          moves[x][y] = true;
        }
        break;
      }
      x += dx;
      y += dy;
    }
  });

  return moves;
}

function calculateQueenMoves(row, column) {
  const rookMoves = calculateRookMoves(row, column);
  const bishopMoves = calculateBishopMoves(row, column);
  return rookMoves.map((row, i) => row.map((cell, j) => cell || bishopMoves[i][j]));
}

function calculateKingMoves(row, column) {
  const moves = initializeMovesMatrix();
  const piece = copyBoard[row][column];
  const kingMoves = [
    [1, 0], [-1, 0], [0, 1], [0, -1],
    [1, 1], [1, -1], [-1, 1], [-1, -1]
  ];

  kingMoves.forEach(([dx, dy]) => {
    const x = row + dx;
    const y = column + dy;
    if (x >= 0 && x < 8 && y >= 0 && y < 8) {
      if (copyBoard[x][y] === "" || (piece.startsWith("./icons/w") && copyBoard[x][y].startsWith("./icons/b")) || (piece.startsWith("./icons/b") && copyBoard[x][y].startsWith("./icons/w"))) {
        moves[x][y] = true;
      }
    }
  });

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
  piece.setAttribute("data-selected", "true");
  switch (pieceSrc) {
    case "bp.png":
    case "wp.png":
      return calculatePawnMoves(row, column);
    case "br.png":
    case "wr.png":
      return calculateRookMoves(row, column);
    case "bn.png":
    case "wn.png":
      return calculateKnightMoves(row, column);
    case "bb.png":
    case "wb.png":
      return calculateBishopMoves(row, column);
    case "bq.png":
    case "wq.png":
      return calculateQueenMoves(row, column);
    case "bk.png":
    case "wk.png":
      return calculateKingMoves(row, column);
    default:
      return initializeMovesMatrix();
  }
}

function highlightMoves(moves) {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (moves[i][j]) {
        const square = document.querySelector(`.square[data-row='${i}'][data-col='${j}']`);
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

function checkGameStatus() {
  // Basic checkmate or tie checker
  const whiteKing = document.querySelector("img[src='./icons/wk.png']");
  const blackKing = document.querySelector("img[src='./icons/bk.png']");
  if (!whiteKing) {
    alert("Black wins!");
  } else if (!blackKing) {
    alert("White wins!");
  } else if (isTie()) {
    alert("It's a tie!");
  }
}

function isTie() {
  // Basic tie checker (no legal moves for both players)
  const whitePieces = document.querySelectorAll("img[src*='./icons/w']");
  const blackPieces = document.querySelectorAll("img[src*='./icons/b']");
  return whitePieces.length === 1 && blackPieces.length === 1;
}

createBoard();