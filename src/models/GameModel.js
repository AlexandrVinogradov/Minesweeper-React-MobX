import React, {Component} from 'react';
import * as CONSTANTS from '../models/constants'
import {action, observable, computed} from "mobx";

export default class GameModel {

    @observable gameStatus = CONSTANTS.GAME_STATUS_ONGOING; //GAME_STATUS_STOP
    @observable openedMines = 0;
    @observable grid = {};


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
            this.openAdjacentCells(row, col);
    }

    checkIfWin() {
        let openedCells = 0;
        for (let r = 0; r < CONSTANTS.GRID_ROWS; r++) {
            for (let c = 0; c < CONSTANTS.GRID_COLS; c++) {
                if (this.grid[r][c].opened) openedCells++;
            }
        }

        if (openedCells == ((CONSTANTS.GRID_ROWS * CONSTANTS.GRID_COLS) - this.getMaxMines())) {
            this.gameOver(true);
        }
    }

    openAdjacentCells(row, col) {
        let rowStart = (row == 0) ? 0 : row -1,
            rowEnd = (row >= (CONSTANTS.GRID_ROWS - 1)) ? row : row + 1,
            colStart = (col == 0) ? 0 : col -1,
            colEnd = (col >= (CONSTANTS.GRID_COLS - 1)) ? col : col + 1;

        for (let r = rowStart; r <= rowEnd; r++) {
            for (let c = colStart; c <= colEnd; c++) {
                if (!this.grid[r][c].opened)
                    this.openCell(r, c);
            }
        }

    }

    getCellAdjacentMinesNumber(row, col) {
        let mines = 0,
            rowStart = (row == 0) ? 0 : row -1,
            rowEnd = (row >= (CONSTANTS.GRID_ROWS - 1)) ? row : row + 1,
            colStart = (col == 0) ? 0 : col -1,
            colEnd = (col >= (CONSTANTS.GRID_COLS - 1)) ? col : col + 1;

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
        return (CONSTANTS.GRID_ROWS * CONSTANTS.GRID_COLS) / 5 * (CONSTANTS.GAME_DIFFICULTLY);
    }

    buildGrid() {
        let maxMines = this.getMaxMines(), addedMines = 0, grid = {};

        for (let i=0; i < CONSTANTS.GRID_ROWS; i++) {
            grid[i] = {};
            for (let k=0; k < CONSTANTS.GRID_ROWS; k+= 1) {
                grid[i][k] = { isMine: false, opened: false, row: i, col: k};
            }
        }

        for (let count = 1; count <= maxMines; count++) {

            let mineAdded = false;
            while (!mineAdded) {
                let randomRow = Math.floor(Math.random() * CONSTANTS.GRID_ROWS);
                let randomCol = Math.floor(Math.random() * CONSTANTS.GRID_COLS);

                if (grid[randomRow][randomCol].isMine == false) {
                    grid[randomRow][randomCol].isMine = true;
                    mineAdded = true;
                }
            }
        }

        this.setGrid(grid);
    }


}