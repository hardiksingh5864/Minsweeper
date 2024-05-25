const boardSize = 10; // define the board size
const mineCount = 10; // define the number of mines
let board = []; // the minesweeper board to initilaize the place to play

function initBoard() {  // function to initialize game board
    board = createEmptyBoard(); // creating empty board 
    placeMines(); // board to place mines
    calculateAdjacencies();//adjacies to check wheren the blocks should open
    renderBoard();//the render function will create list of board and add them to an HTML element with the ID
}

function createEmptyBoard() { //calls out the funtion
    const newBoard = []; // intialize an empty array this will eventually hold the entire game board.
    for (let row = 0; row < boardSize; row++) { // loop to go through each row of the board
        const newRow = []; //this array will hold the cells for the current row.
        for (let col = 0; col < boardSize; col++) { // go through each column of the given row
            newRow.push({ revealed: false, mine: false, adjacentMines: 0 });//adding the cells for the game to be played
        }//revealed not true ---> not clicked yet , mine present or not in that column , the cell doesn't have adjacent mines as it starts from 0 
        newBoard.push(newRow);// now we push this in new row
    }
    return newBoard;// return the value
}

function placeMines() { // placing up the mines
    let minesPlaced = 0;// using loop to place mines for 10 times
    while (minesPlaced < mineCount) { // should be less than 10 as intialized above
        const row = Math.floor(Math.random() * boardSize);//randomly placing any where on any row
        const col = Math.floor(Math.random() * boardSize);//same for column
        if (!board[row][col].mine) { // to check whether the cell contains mine or not 
            board[row][col].mine = true; // places when not
            minesPlaced++;// increments for the loop
        }
    }
}

function calculateAdjacencies() { // using adjacencies to guide the user to let them know where the bomb is placed 
    const directions = [
        { dx: -1, dy: -1 }, { dx: -1, dy: 0 }, { dx: -1, dy: 1 }, // using this to find the 
        { dx: 0, dy: -1 }, { dx: 0, dy: 1 },
        { dx: 1, dy: -1 }, { dx: 1, dy: 0 }, { dx: 1, dy: 1 }
    ];

    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (board[row][col].mine) {
                directions.forEach(({ dx, dy }) => {
                    const newRow = row + dx;
                    const newCol = col + dy;
                    if (isInBounds(newRow, newCol) && !board[newRow][newCol].mine) {
                        board[newRow][newCol].adjacentMines++;
                    }
                });
            }
        }
    }
}

function isInBounds(row, col) {
    return row >= 0 && row < boardSize && col >= 0 && col < boardSize;
}

function renderBoard() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', handleCellClick);
            gameBoard.appendChild(cell);
        }
    }
}

function handleCellClick(event) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    revealCell(row, col);
}

function revealCell(row, col) {
    if (board[row][col].revealed) return;

    board[row][col].revealed = true;
    const cellElement = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    cellElement.classList.add('revealed');
    
    if (board[row][col].mine) {
        cellElement.classList.add('mine');
        cellElement.textContent = '💣';
        alert('Game Over! You hit a mine.');
        return;
    }

    if (board[row][col].adjacentMines > 0) {
        cellElement.textContent = board[row][col].adjacentMines;
    } else {
        cellElement.textContent = '';
        revealAdjacentCells(row, col);
    }
}

function revealAdjacentCells(row, col) {
    const directions = [
        { dx: -1, dy: -1 }, { dx: -1, dy: 0 }, { dx: -1, dy: 1 },
        { dx: 0, dy: -1 }, { dx: 0, dy: 1 },
        { dx: 1, dy: -1 }, { dx: 1, dy: 0 }, { dx: 1, dy: 1 }
    ];

    directions.forEach(({ dx, dy }) => {
        const newRow = row + dx;
        const newCol = col + dy;
        if (isInBounds(newRow, newCol)) {
            revealCell(newRow, newCol);
        }
    });
}

initBoard();
