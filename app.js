
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

let copyBoard = initialBoard.map((row) => [...row]);
let currentPlayer = "white";
let selectedPiece = null;

function createBoard() {
  board.innerHTML = "";
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const square = createSquare(i, j);
      const piece = copyBoard[i][j];
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

document.addEventListener("keypress", startGame);

function startGame() {
  document.querySelector("h2").innerText = `${capitalize(
    currentPlayer
  )}'s turn`;
  document.querySelectorAll(".chess-piece").forEach((piece) => {
    piece.addEventListener("click", pieceClickHandler);
  });
  document.removeEventListener("keypress", startGame);
}

function pieceClickHandler(e) {
  const piece = e.target;
  const pieceColor = piece.src.includes("/w") ? "white" : "black";
  if (pieceColor !== currentPlayer) return;

  clearHighlights();

  selectedPiece = piece;
  const moves = checkPieceToMove(piece);
  highlightMoves(moves);

  document.querySelectorAll(".highlight").forEach((square) => {
    square.addEventListener("click", squareClickHandler);
  });
}

function squareClickHandler(e) {
  if (!selectedPiece) return;

  const targetSquare = e.target.closest(".square");
  if (targetSquare && targetSquare.classList.contains("highlight")) {
    const targetRow = parseInt(targetSquare.dataset.row);
    const targetCol = parseInt(targetSquare.dataset.col);

    const sourceRow = parseInt(selectedPiece.dataset.row);
    const sourceCol = parseInt(selectedPiece.dataset.col);

    copyBoard[targetRow][targetCol] = copyBoard[sourceRow][sourceCol];
    copyBoard[sourceRow][sourceCol] = "";

    const targetPiece = targetSquare.querySelector(".chess-piece");
    if (targetPiece && targetPiece !== selectedPiece) {
      targetPiece.remove();
    }

    selectedPiece.dataset.row = targetRow;
    selectedPiece.dataset.col = targetCol;
    targetSquare.appendChild(selectedPiece);

    selectedPiece = null;
    clearHighlights();

    document.querySelectorAll(".highlight").forEach((square) => {
      square.removeEventListener("click", squareClickHandler);
    });
    currentPlayer = currentPlayer === "white" ? "black" : "white";
    document.querySelector("h2").innerText = `${capitalize(
      currentPlayer
    )}'s turn`;

    checkGameStatus();
  }
}

function clearHighlights() {
  document.querySelectorAll(".highlight").forEach((square) => {
    square.classList.remove("highlight");
    square.removeEventListener("click", squareClickHandler);
  });
}

function checkPieceToMove(piece) {
  const row = parseInt(piece.dataset.row);
  const col = parseInt(piece.dataset.col);
  const pieceSrc = piece.src.split("/").pop();

  switch (pieceSrc) {
    case "wp.png":
    case "bp.png":
      return calculatePawnMoves(row, col);
    case "wr.png":
    case "br.png":
      return calculateRookMoves(row, col);
    case "wn.png":
    case "bn.png":
      return calculateKnightMoves(row, col);
    case "wb.png":
    case "bb.png":
      return calculateBishopMoves(row, col);
    case "wq.png":
    case "bq.png":
      return calculateQueenMoves(row, col);
    case "wk.png":
    case "bk.png":
      return calculateKingMoves(row, col);
    default:
      return initializeMovesMatrix();
  }
}

function initializeMovesMatrix() {
  return Array.from({ length: 8 }, () => Array(8).fill(false));
}

function highlightMoves(moves) {
  for (let i = 0; i < moves.length; i++) {
    for (let j = 0; j < moves[i].length; j++) {
      if (moves[i][j]) {
        const square = document.querySelector(
          `.square[data-row='${i}'][data-col='${j}']`
        );
        square.classList.add("highlight");
      }
    }
  }
}

function calculatePawnMoves(row, col) {
  const moves = initializeMovesMatrix();
  const piece = copyBoard[row][col];
  const isWhite = piece.includes("/w");
  const direction = isWhite ? -1 : 1;
  const startRow = isWhite ? 6 : 1;


  if (copyBoard[row + direction] && copyBoard[row + direction][col] === "") {
    moves[row + direction][col] = true;

    if (row === startRow && copyBoard[row + 2 * direction][col] === "") {
      moves[row + 2 * direction][col] = true;
    }
  }
  for (let dx of [-1, 1]) {
    const newRow = row + direction;
    const newCol = col + dx;
    if (newCol >= 0 && newCol < 8 && copyBoard[newRow]) {
      const targetPiece = copyBoard[newRow][newCol];
      if (targetPiece && targetPiece.includes(isWhite ? "/b" : "/w")) {
        moves[newRow][newCol] = true;
      }
    }
  }

  return moves;
}

function calculateRookMoves(row, col) {
  const moves = initializeMovesMatrix();
  const piece = copyBoard[row][col];
  const isWhite = piece.includes("/w");

  const directions = [
    { dr: -1, dc: 0 }, 
    { dr: 1, dc: 0 }, 
    { dr: 0, dc: -1 }, 
    { dr: 0, dc: 1 }, 
  ];

  for (const { dr, dc } of directions) {
    let r = row + dr;
    let c = col + dc;
    while (r >= 0 && r < 8 && c >= 0 && c < 8) {
      const targetPiece = copyBoard[r][c];
      if (targetPiece === "") {
        moves[r][c] = true;
      } else {
        if (targetPiece.includes(isWhite ? "/b" : "/w")) {
          moves[r][c] = true;
        }
        break;
      }
      r += dr;
      c += dc;
    }
  }

  return moves;
}

function calculateKnightMoves(row, col) {
  const moves = initializeMovesMatrix();
  const piece = copyBoard[row][col];
  const isWhite = piece.includes("/w");

  const knightMoves = [
    { dr: -2, dc: -1 },
    { dr: -2, dc: 1 },
    { dr: -1, dc: -2 },
    { dr: -1, dc: 2 },
    { dr: 1, dc: -2 },
    { dr: 1, dc: 2 },
    { dr: 2, dc: -1 },
    { dr: 2, dc: 1 },
  ];

  for (const { dr, dc } of knightMoves) {
    const r = row + dr;
    const c = col + dc;
    if (r >= 0 && r < 8 && c >= 0 && c < 8) {
      const targetPiece = copyBoard[r][c];
      if (targetPiece === "" || targetPiece.includes(isWhite ? "/b" : "/w")) {
        moves[r][c] = true;
      }
    }
  }

  return moves;
}

function calculateBishopMoves(row, col) {
  const moves = initializeMovesMatrix();
  const piece = copyBoard[row][col];
  const isWhite = piece.includes("/w");

  const directions = [
    { dr: -1, dc: -1 },
    { dr: -1, dc: 1 },
    { dr: 1, dc: -1 },
    { dr: 1, dc: 1 },
  ];

  for (const { dr, dc } of directions) {
    let r = row + dr;
    let c = col + dc;
    while (r >= 0 && r < 8 && c >= 0 && c < 8) {
      const targetPiece = copyBoard[r][c];
      if (targetPiece === "") {
        moves[r][c] = true;
      } else {
        if (targetPiece.includes(isWhite ? "/b" : "/w")) {
          moves[r][c] = true;
        }
        break;
      }
      r += dr;
      c += dc;
    }
  }

  return moves;
}

function calculateQueenMoves(row, col) {
  const rookMoves = calculateRookMoves(row, col);
  const bishopMoves = calculateBishopMoves(row, col);
  const moves = initializeMovesMatrix();

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      moves[i][j] = rookMoves[i][j] || bishopMoves[i][j];
    }
  }

  return moves;
}

function calculateKingMoves(row, col) {
  const moves = initializeMovesMatrix();
  const piece = copyBoard[row][col];
  const isWhite = piece.includes("/w");

  const kingMoves = [
    { dr: -1, dc: -1 },
    { dr: -1, dc: 0 },
    { dr: -1, dc: 1 },
    { dr: 0, dc: -1 },
    { dr: 0, dc: 1 },
    { dr: 1, dc: -1 },
    { dr: 1, dc: 0 },
    { dr: 1, dc: 1 },
  ];

  for (const { dr, dc } of kingMoves) {
    const r = row + dr;
    const c = col + dc;
    if (r >= 0 && r < 8 && c >= 0 && c < 8) {
      const targetPiece = copyBoard[r][c];
      if (targetPiece === "" || targetPiece.includes(isWhite ? "/b" : "/w")) {
        moves[r][c] = true;
      }
    }
  }

  return moves;
}

function checkGameStatus() {
  const whiteKingExists = document.querySelector("img[src='./icons/wk.png']");
  const blackKingExists = document.querySelector("img[src='./icons/bk.png']");
  if (!whiteKingExists) {
    alert("Black wins!");
  } else if (!blackKingExists) {
    alert("White wins!");
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

createBoard();
