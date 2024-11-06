/*
INSANE CHESS...
*/
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

let eatenWhitePieces = [];
let eatenBlackPieces = [];
let running = false;

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
  pieceElement.addEventListener("click", pieceClickHandler); // Assegure-se de adicionar o event listener aqui
  return pieceElement;
}

function startGame() {
  createBoard(); // Assegure-se de criar o tabuleiro inicialmente
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

    const movingPiece = copyBoard[sourceRow][sourceCol];
    const originalTargetPiece = copyBoard[targetRow][targetCol];

    // Simular o movimento no tabuleiro
    copyBoard[sourceRow][sourceCol] = "";
    copyBoard[targetRow][targetCol] = movingPiece;

    // Atualizar posição da peça selecionada temporariamente
    selectedPiece.dataset.row = targetRow;
    selectedPiece.dataset.col = targetCol;

    // Verificar se o rei do jogador atual está em xeque após o movimento
    if (isKingInCheck(currentPlayer)) {
      // Desfazer o movimento no tabuleiro
      copyBoard[sourceRow][sourceCol] = movingPiece;
      copyBoard[targetRow][targetCol] = originalTargetPiece;

      // Reverter posição da peça selecionada
      selectedPiece.dataset.row = sourceRow;
      selectedPiece.dataset.col = sourceCol;

      clearHighlights();
      alert("You can't do this move while your king on check.");
      return;
    }

    // Remover a peça capturada, se houver
    const targetPieceElement = targetSquare.querySelector(".chess-piece");
    if (targetPieceElement && targetPieceElement !== selectedPiece) {
      targetPieceElement.remove();

      // Adicionar a peça capturada aos arrays apropriados
      const capturedPieceSrc = originalTargetPiece;
      if (capturedPieceSrc.includes("/w")) {
        eatenWhitePieces.push(capturedPieceSrc);
      } else if (capturedPieceSrc.includes("/b")) {
        eatenBlackPieces.push(capturedPieceSrc);
      }
    }

    // Mover a peça no DOM
    targetSquare.appendChild(selectedPiece);

    // Verificar se a peça movida é um peão que alcançou a borda
    if (movingPiece.includes("p.png")) {
      isPawnOnEdge(selectedPiece);
    }

    // Limpar seleção e destaques
    selectedPiece = null;
    clearHighlights();

    // Verificar o estado do jogo (xeque, xeque-mate)
    checkGameStatus();

    // Alternar o jogador atual
    currentPlayer = currentPlayer === "white" ? "black" : "white";
    document.querySelector("h2").innerText = `${capitalize(
      currentPlayer
    )}'s turn`;

    // Remover event listeners dos destaques
    document.querySelectorAll(".highlight").forEach((square) => {
      square.removeEventListener("click", squareClickHandler);
    });
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
  if (isCheckMate()) {
    // O jogo foi resetado em isCheckMate()
    return;
  }

  const opponent = currentPlayer === "white" ? "black" : "white";
  if (isKingInCheck(opponent)) {
    alert(`${capitalize(opponent)} is in check.`);
  }
}
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function isKingInCheck(player) {
  const kingColor = player === "white" ? "w" : "b";
  const opponentColor = player === "white" ? "b" : "w";
  const kingPosition = findTheKingOnBoard(kingColor);

  if (!kingPosition) {
    // Rei não encontrado (não deveria acontecer)
    return false;
  }

  const opponentPieces = document.querySelectorAll(
    `.chess-piece[src*='/${opponentColor}']`
  );

  for (const piece of opponentPieces) {
    const moves = checkPieceToMove(piece);
    if (moves[kingPosition.row][kingPosition.col]) {
      return true; // Rei está em xeque
    }
  }
  return false; // Rei não está em xeque
}

function findTheKingOnBoard(kingColor) {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = copyBoard[i][j];
      if (piece && piece.includes(`/${kingColor}k.png`)) {
        return { row: i, col: j };
      }
    }
  }
  return null; // Rei não encontrado
}

function isCheckMate() {
  const opponent = currentPlayer === "white" ? "black" : "white";

  if (!isKingInCheck(opponent)) {
    return false;
  }

  const kingColor = opponent === "white" ? "w" : "b";
  const kingPosition = findTheKingOnBoard(kingColor);
  const kingPiece = document.querySelector(
    `.chess-piece[data-row='${kingPosition.row}'][data-col='${kingPosition.col}']`
  );

  const kingMoves = checkPieceToMove(kingPiece);

  // Verificar se o rei tem movimentos legais
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (kingMoves[i][j]) {
        // Simular o movimento do rei
        const originalPiece = copyBoard[i][j];
        copyBoard[kingPosition.row][kingPosition.col] = "";
        copyBoard[i][j] = kingPiece.src;

        const inCheck = isKingInCheck(opponent);

        // Reverter o movimento
        copyBoard[kingPosition.row][kingPosition.col] = kingPiece.src;
        copyBoard[i][j] = originalPiece;

        if (!inCheck) {
          return false;
        }
      }
    }
  }

  // Verificar se outras peças podem prevenir o xeque-mate
  const playerPieces = document.querySelectorAll(
    `.chess-piece[src*='/${kingColor}']`
  );

  for (const piece of playerPieces) {
    const pieceType = piece.src.split("/").pop();
    if (pieceType.includes("k.png")) continue; // Ignorar o rei

    const pieceRow = parseInt(piece.dataset.row);
    const pieceCol = parseInt(piece.dataset.col);
    const moves = checkPieceToMove(piece);

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (moves[i][j]) {
          // Simular o movimento da peça
          const originalPiece = copyBoard[i][j];
          copyBoard[pieceRow][pieceCol] = "";
          copyBoard[i][j] = piece.src;

          const inCheck = isKingInCheck(opponent);

          // Reverter o movimento
          copyBoard[pieceRow][pieceCol] = piece.src;
          copyBoard[i][j] = originalPiece;

          if (!inCheck) {
            return false;
          }
        }
      }
    }
  }

  alert(`${capitalize(opponent)} is in checkmate! Game over.`);
  resetGame();
  return true;
}

function isPawnOnEdge(pawn) {
  const row = parseInt(pawn.dataset.row);
  const col = parseInt(pawn.dataset.col);

  // Verificar se o peão chegou ao final do tabuleiro
  if (
    (pawn.src.includes("/w") && row === 0) ||
    (pawn.src.includes("/b") && row === 7)
  ) {
    const pieceColor = pawn.src.includes("/w") ? "w" : "b";
    const eatenPieces =
      pieceColor === "w" ? eatenBlackPieces : eatenWhitePieces;

    let newPieceType = "q"; // Default para rainha

    if (eatenPieces.length > 0) {
      // Filtrar tipos de peças disponíveis nos arrays de peças capturadas
      const availablePieces = eatenPieces
        .filter((src) => src.includes(`/${pieceColor}`))
        .map((src) => src.split("/").pop().replace(".png", ""))
        .filter((type) => ["q", "r", "b", "n"].includes(type));

      if (availablePieces.length > 0) {
        // Criar string de opções únicas
        const uniqueOptions = [...new Set(availablePieces)];

        // Mostrar prompt para escolher a peça de promoção
        newPieceType = prompt(
          `Promover peão para (${uniqueOptions.join(", ")}, q)`,
          "q"
        );
        newPieceType = newPieceType ? newPieceType.toLowerCase() : "q";

        // Validar a escolha
        if (!["q", "r", "b", "n"].includes(newPieceType)) {
          newPieceType = "q";
        }

        // Verificar se a peça escolhida está disponível nos eatenPieces
        if (uniqueOptions.includes(newPieceType)) {
          // Remover a peça escolhida do array de peças capturadas
          const pieceIndex = eatenPieces.indexOf(
            `./icons/${pieceColor}${newPieceType}.png`
          );
          if (pieceIndex !== -1) {
            eatenPieces.splice(pieceIndex, 1);
          }
        } else {
          // Se a escolha não estiver disponível, default para rainha
          newPieceType = "q";
        }
      }
    }

    // Atualizar o tabuleiro e o DOM com a nova peça promovida
    const newSrc = `./icons/${pieceColor}${newPieceType}.png`;
    copyBoard[row][col] = newSrc;
    pawn.src = newSrc;

    alert(`Peão promovido para ${getFullPieceName(newPieceType, pieceColor)}!`);
  }
}

// Função auxiliar para obter o nome completo da peça
function getFullPieceName(type, color) {
  const pieceNames = {
    q: "Rainha",
    r: "Torre",
    b: "Bispo",
    n: "Cavalo",
  };
  const colorName = color === "w" ? "Branca" : "Preta";
  return `${colorName} ${pieceNames[type]}`;
}
function resetGame() {
  copyBoard = initialBoard.map((row) => [...row]);
  currentPlayer = "white";
  selectedPiece = null;
  eatenWhitePieces = [];
  eatenBlackPieces = [];
  createBoard();
  document.querySelector("h2").innerText = `Press any key to start the game`;
  document.addEventListener("keypress", startGame);
}

createBoard();
document.addEventListener("keypress", startGame);
