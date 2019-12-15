import * as CONSTANTS from './constants';
import {action, observable} from "mobx";

export default class GameModel {

    @observable gameStatus = CONSTANTS.GAME_STATUS_ONGOING; 
    @observable openedMines = 0; //counter of mines
    @observable grid = {};
    @observable gameDifficulty = 1;
    @observable GRID_ROWS = 5;
    @observable GRID_COLS = 5;

    constructor() {
        this.buildGrid();
    }

    @action setGrid(grid) {
        this.grid = grid;
    }

    @action gameOver(won) {
        this.gameStatus = won ? CONSTANTS.GAME_STATUS_STOP_WON : CONSTANTS.GAME_STATUS_STOP_LOSE;
    }

    @action startGame() {
        this.gameStatus = CONSTANTS.GAME_STATUS_ONGOING;
        this.openedMines = 0;  
        this.buildGrid();
    }

    @action openCell(row, col) {
        let cell = this.grid[row][col];

        if (cell.opened) {
            return;
        }

        cell.opened = true;
        this.openedMines++;

        if (cell.isMine) {
            this.gameOver(false);
        }

        this.checkIfWin();

        if (this.getCellAdjacentMinesNumber(row, col) === 0) 
            this.openAdjacentCells(row, col); // if there are no adjacent mines => open adjacent cells
    }

    @action flaggedCell(row, col) {
        let cell = this.grid[row][col];

        cell.isFlagged = !cell.isFlagged;
    }

    @action increaseDifficulty() {
        (this.gameDifficulty < 4) ? this.gameDifficulty++ : false;

        this.buildGrid();
    }
    @action reduceDifficulty() {
        (this.gameDifficulty >= 2) ? this.gameDifficulty-- : false;

        this.buildGrid();
    }

    @action setGrid5x5() {
        this.GRID_ROWS = 5;
        this.GRID_COLS = 5;

        this.buildGrid();
    }
    @action setGrid10x10() {
        this.GRID_ROWS = 10;
        this.GRID_COLS = 10;

        this.buildGrid();
    }
    @action setGrid15x15() {
        this.GRID_ROWS = 15;
        this.GRID_COLS = 15;

        this.buildGrid();
    }

    checkIfWin() {
        let openedCells = 0;
        for (let r = 0; r < this.GRID_ROWS; r++) {
            for (let c = 0; c < this.GRID_COLS; c++) {
                if (this.grid[r][c].opened) openedCells++;
            }
        }
        // gameover when openCells = totalCells - mines
        if (openedCells == ((this.GRID_ROWS * this.GRID_COLS) - this.getMaxMines())) {
            this.gameOver(true);
        }
    }

    openAdjacentCells(row, col) { 
        // determine the range of adjacent rows
        let rowStart = (row == 0) ? 0 : row -1,                     // go one row above
            rowEnd = (row >= (this.GRID_ROWS - 1)) ? row : row + 1, // go one row below
        // determine the range of adjacent cols
            colStart = (col == 0) ? 0 : col -1,                     // go one row left
            colEnd = (col >= (this.GRID_COLS - 1)) ? col : col + 1; // go one row right 

        for (let r = rowStart; r <= rowEnd; r++) {
            for (let c = colStart; c <= colEnd; c++) {
                if (!this.grid[r][c].opened)
                    this.openCell(r, c);                            // open adjacent cells
            }
        }
    }

    getCellAdjacentMinesNumber(row, col) {
        let mines = 0,
            rowStart = (row == 0) ? 0 : row -1,
            rowEnd = (row >= (this.GRID_ROWS - 1)) ? row : row + 1,
            colStart = (col == 0) ? 0 : col -1,
            colEnd = (col >= (this.GRID_COLS - 1)) ? col : col + 1;
        // if there is at least one mine in adjacent cells mines != 0
        for (let r = rowStart; r <= rowEnd; r++) {
            for (let c = colStart; c <= colEnd; c++) {
                if (this.grid[r][c].isMine) {
                    mines++; 
                }
            }
        }
        return mines;
    }

    getMaxMines() {
        //count the number of mines
        return (this.GRID_ROWS * this.GRID_COLS) / 5 * (this.gameDifficulty);
    }

    buildGrid() {
        let maxMines = this.getMaxMines(), grid = {}; // get the count of mines

        for (let i=0; i < this.GRID_ROWS; i++) {
            grid[i] = {};
            for (let k=0; k < this.GRID_ROWS; k+= 1) { 
                grid[i][k] = { isMine: false, opened: false, row: i, col: k, isFlagged: false};  // place an this object in each cell
            }
        }

        for (let count = 1; count <= maxMines; count++) { // cycle to count of mines

            let mineAdded = false;
            while (!mineAdded) {
                let randomRow = Math.floor(Math.random() * this.GRID_ROWS);  // assign to a variable random number [0:4]
                let randomCol = Math.floor(Math.random() * this.GRID_COLS);  // assign to a variable random number [0:4]

                if (grid[randomRow][randomCol].isMine == false) {
                    grid[randomRow][randomCol].isMine = true; // add a mine to the random cell
                    mineAdded = true;
                }
            }
        }
        this.setGrid(grid);
        console.log(grid);
    }
}