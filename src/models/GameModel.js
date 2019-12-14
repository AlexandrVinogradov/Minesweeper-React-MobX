import * as CONSTANTS from '../include/constants'
import {action, observable, computed} from "mobx";

export default class GameModel {

    @observable gameStatus = CONSTANTS.GAME_STATUS_ONGOING; //GAME_STATUS_STOP
    @observable openedMines = 0; //нужно только для вывода тайьла
    @observable grid = {};
    @observable gameDifficulty = 1;


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
        console.log(cell);

        cell.opened = true;
        this.openedMines++;

        if (cell.isMine) {
            this.gameOver(false);
        }

        this.checkIfWin();

        if (this.getCellAdjacentMinesNumber(row, col) === 0) // только если прилегающих мин 0, мы открываем прилегающие клетки
            this.openAdjacentCells(row, col);
    }

    @action flaggedCell(row, col) {
        let cell = this.grid[row][col];


        cell.isFlagged = !cell.isFlagged;
        console.log(cell.isFlagged);
    }

    @action increaseDifficulty() {
        (this.gameDifficulty < 4) ? this.gameDifficulty++ : this.gameDifficulty;

        this.buildGrid();
    }
    @action reduceDifficulty() {
        (this.gameDifficulty >= 2) ? this.gameDifficulty-- : this.gameDifficulty;

        this.buildGrid();
    }

    checkIfWin() {
        let openedCells = 0;
        for (let r = 0; r < CONSTANTS.GRID_ROWS; r++) {
            for (let c = 0; c < CONSTANTS.GRID_COLS; c++) {
                if (this.grid[r][c].opened) openedCells++;
            }
        }
        // как только счетчик открытых клеток доходит до 20 игра закончена(тру)
        if (openedCells == ((CONSTANTS.GRID_ROWS * CONSTANTS.GRID_COLS) - this.getMaxMines())) {
            this.gameOver(true);
        }
    }

    openAdjacentCells(row, col) { // 1:1   => rowStart=0 rowEnd=2 colStart=0 colEnd=2
        // опреелем диапазон прилегающих строк
        let rowStart = (row == 0) ? 0 : row -1, // перескакивает на одну строку выше
            rowEnd = (row >= (CONSTANTS.GRID_ROWS - 1)) ? row : row + 1, // перескакиваем на одну строку ниже
        // опреелем диапазон прилегающих колонок
            colStart = (col == 0) ? 0 : col -1, // перескакивае на одну колонку левее 
            colEnd = (col >= (CONSTANTS.GRID_COLS - 1)) ? col : col + 1; // перескакивае на одну колонку правее 

        for (let r = rowStart; r <= rowEnd; r++) {
            for (let c = colStart; c <= colEnd; c++) {
                if (!this.grid[r][c].opened)
                    this.openCell(r, c); // но ведь она не будет опенед пока я не нажму
            }
        }

    }

    getCellAdjacentMinesNumber(row, col) {
        let mines = 0,
            rowStart = (row == 0) ? 0 : row -1,
            rowEnd = (row >= (CONSTANTS.GRID_ROWS - 1)) ? row : row + 1,
            colStart = (col == 0) ? 0 : col -1,
            colEnd = (col >= (CONSTANTS.GRID_COLS - 1)) ? col : col + 1;
        // если в прилегающих клетках есть хоть одна мина mines != 0
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
        return (CONSTANTS.GRID_ROWS * CONSTANTS.GRID_COLS) / 5 * (this.gameDifficulty);
    }

    buildGrid() {
        let maxMines = this.getMaxMines(), addedMines = 0, grid = {}; //получаем количество мин (5)

        for (let i=0; i < CONSTANTS.GRID_ROWS; i++) {
            grid[i] = {};
            for (let k=0; k < CONSTANTS.GRID_ROWS; k+= 1) { 
                grid[i][k] = { isMine: false, opened: false, row: i, col: k, isFlagged: false};  //  в каждую ячейку помещаяем объект
            }
        }

        for (let count = 1; count <= maxMines; count++) { // цикл до количества мин

            let mineAdded = false;
            while (!mineAdded) {
                let randomRow = Math.floor(Math.random() * CONSTANTS.GRID_ROWS);  // записываем в переменную рандомное чисо [0:4]
                let randomCol = Math.floor(Math.random() * CONSTANTS.GRID_COLS);  // записываем в переменную рандомное чисо [0:4]

                if (grid[randomRow][randomCol].isMine == false) {
                    grid[randomRow][randomCol].isMine = true; // в рандомную клетку добавляем мину
                    mineAdded = true;
                }
            }
        }

        this.setGrid(grid);
        console.log(grid);
    }


}