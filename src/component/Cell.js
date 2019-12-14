import React, { Component } from 'react'
import { inject, observer } from 'mobx-react';
import * as CONSTANTS from '../include/constants'

const cellStyle = {
    width: 40,
    height: 40,
    display: 'block',
}


@inject('mainStore') @observer
class Cell extends Component {

    openCell = () => {
        this.props.mainStore.openCell(this.props.cell.row, this.props.cell.col)
        console.log(this.props);
    }
    flaggedCell = (e) => {
        e.preventDefault();
        this.props.mainStore.flaggedCell(this.props.cell.row, this.props.cell.col)
    }

    render() {
        cellStyle.background = (this.props.cell.isFlagged) ? '#177a1e' : 
                               (this.props.cell.opened && this.props.cell.isMine)  ? '#aa0000' : 
                               (this.props.cell.isMine) ? '#aa0000' : '#ccc';
        return (
            <button style={cellStyle}
                onClick={this.openCell}
                onContextMenu={this.flaggedCell}
                disabled={this.props.cell.opened || this.props.mainStore.gameStatus != CONSTANTS.GAME_STATUS_ONGOING}>
                {this.props.cell.opened ? this.props.mainStore.getCellAdjacentMinesNumber(this.props.cell.row, this.props.cell.col) : ''}
            </button>
        )
    }
}

export default Cell;