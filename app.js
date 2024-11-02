const board = document.querySelector(".chessboard");
for (let i = 0; i < 64; i++) {
  const square = document.createElement("div");
  square.classList.add("square");
  // Optionally add alternating colors
  if ((Math.floor(i / 8) + i) % 2 === 0) {
    square.classList.add("light");
  } else {
    square.classList.add("dark");
  }
  board.appendChild(square);
}
