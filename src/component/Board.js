import React, {Component} from 'react';
import { inject, observer } from 'mobx-react';
import Cell from './Cell';

const boardStyle = {
    display: 'inline-flex',
    flexWrap: 'wrap',
}

@inject('mainStore') @observer class Board extends Component {
    render() {
        let cols = [];

        for (let i = 0; i < this.props.mainStore.GRID_ROWS; i++) {
            for (let k = 0; k < this.props.mainStore.GRID_COLS; k++) {
                cols.push(<Cell key={this.index} cell={this.props.mainStore.grid[i][k]}/>);
            }
        }
        boardStyle.width = 40 * this.props.mainStore.GRID_COLS;

        return (
            <div className="board" style={boardStyle} >
                { cols }
            </div>
        );
    }
};

export default Board;