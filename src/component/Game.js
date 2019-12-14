import React, { Component } from 'react';
import Board from './Board';
import { inject, observer } from 'mobx-react';
import * as CONSTANTS from '../include/constants';
import Navigation from "react-toolbox/lib/navigation";
import Button from "react-toolbox/lib/button";

const buttonsListStyle = {
    marginBottom: 30
}

@inject('mainStore') @observer
class Game extends Component {

    gameStatus() {
        if (this.props.mainStore.gameStatus == CONSTANTS.GAME_STATUS_STOP_WON) {
            return (
                <h2>You have won!</h2>
            )
        }
        if (this.props.mainStore.gameStatus == CONSTANTS.GAME_STATUS_STOP_LOSE) {
            return (
                <h2>You have Lose!</h2>
            )
        }
    }

    startGame = () => {
        this.props.mainStore.startGame();
    }
    increaseDifficulty = () => {
        this.props.mainStore.increaseDifficulty();
        console.log(this.props.mainStore.openedMines);
    }
    reduceDifficulty = () => {
        this.props.mainStore.reduceDifficulty();
        console.log(this.props.mainStore.openedMines);
    }


    setGrid5x5 = () => {
        this.props.mainStore.setGrid5x5();
    }
    setGrid10x10 = () => {
        this.props.mainStore.setGrid10x10();
    }
    setGrid15x15 = () => {
        this.props.mainStore.setGrid15x15();
    }

    gameButtons() {

        let buttons = [];

        switch (this.props.mainStore.gameStatus) {
            case CONSTANTS.GAME_STATUS_STOP_LOSE:
            case CONSTANTS.GAME_STATUS_STOP_WON:
                buttons.push(
                    (<Button raised label="Restart Game" onClick={this.startGame} key={this.index} />)
                );
                break;

            default:
                break;
        }
        return (buttons.length > 0) ? (<Navigation type='horizontal'>{buttons}</Navigation>) : null;
    }

    gameBoard() {
        return (this.props.mainStore.gameStatus == CONSTANTS.GAME_STATUS_STOP) ? null : (
            <div>
                <Board />
                <h3>Opened fields: {this.props.mainStore.openedMines}</h3>
                <h3>Total mines: {this.props.mainStore.getMaxMines()}</h3>

                <button onClick={this.increaseDifficulty}>+</button>

                Game Difficulty: {this.props.mainStore.gameDifficulty}/4

                <button onClick={this.reduceDifficulty}>-</button>

                <div>
                    <button onClick={this.setGrid5x5}>5/5</button>
                    <button onClick={this.setGrid10x10}>10/10</button>
                    <button onClick={this.setGrid15x15}>15/15</button>
                </div>


            </div>);
    }

    render() {
        return <div className="game">
            {this.gameStatus()}
            <div style={buttonsListStyle}>
                {this.gameButtons()}
            </div>
            {this.gameBoard()}
        </div>
    }
}

export default Game;