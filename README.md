# INSANE CHESS

![Chess Animation](https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExb2xkMzVieTYxbjZ4bDB3MmFmd205NWxteTJ4MmFjdXdwNXVkZGJ4MCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/aAKPTkQJMUjNYdjX4Z/giphy.gif)

Welcome to **Insane Chess**, a chess project built with JavaScript, HTML, and CSS. This game offers a fully interactive chessboard for players to enjoy right in the browser.

## Project Features
- **Dynamic Interface**: Graphical representation of the board and pieces.
- **Full Mechanics**: All standard chess moves are supported (pawns, rooks, knights, bishops, queens, and kings).
- **Check and Checkmate Detection**: Automatically checks for check and checkmate situations.
- **Pawn Promotion**: Pawns that reach the opposite side can be promoted, allowing players to select their preferred piece.
- **Captured Pieces History**: Keeps track of captured pieces for both players.
- **Turn Indicator**: Visual indication of the current player's turn.
- **Game Reset**: Allows the game to be reset at any time.

## How to Use

1. Clone this repository to your machine:
    ```bash
    git clone https://github.com/your_username/your_repository.git
    ```
2. Open the `index.html` file in your browser.

## Code Structure

- `initialBoard`: Sets the initial positions of the chess pieces.
- `createBoard()`: Renders the chessboard and pieces in the DOM.
- `calculateMoves()`: Calculates possible moves for each piece according to chess rules.
- `checkGameStatus()`: Checks the game status, including check and checkmate.
- `resetGame()`: Resets the game and board to the starting state.

## Requirements

- A modern browser with JavaScript ES6+ support.

**Enjoy playing INSANE CHESS!**
