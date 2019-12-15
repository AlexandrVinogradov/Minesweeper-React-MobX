import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import * as CONSTANTS from '../models/constants';

const cellStyle = {
    width: 40,
    height: 40,
    display: 'block',
    border: 0,
    boxShadow: '0 0 10px rgba(0,0,0,0.3)',
    color: '#000000',
}

@inject('mainStore') @observer
class Cell extends Component {

    openCell = () => {
        this.props.mainStore.openCell(this.props.cell.row, this.props.cell.col)
    }
    flaggedCell = (e) => {
        e.preventDefault(); // turn off the context menu
        this.props.mainStore.flaggedCell(this.props.cell.row, this.props.cell.col)
    }

    render() {
        cellStyle.background = (this.props.cell.isFlagged) ? '#000000' :
                               (this.props.cell.opened && this.props.cell.isMine) ? '#e35260' : 
                               '#52dae3'; // if you want to see mines - remove this line of code (28)
                               (this.props.cell.isMine) ? '#aa0000' : '#52dae3';

        return <button style={cellStyle}
            onClick={this.openCell}
            onContextMenu={this.flaggedCell}
            disabled={this.props.cell.opened || this.props.mainStore.gameStatus != CONSTANTS.GAME_STATUS_ONGOING}>
            {this.props.cell.opened ? this.props.mainStore.getCellAdjacentMinesNumber(this.props.cell.row, this.props.cell.col) : ''}
        </button>
    }
}
export default Cell;