import React, { Component } from 'react'
import { inject, observer } from 'mobx-react';
import * as CONSTANTS from '../include/constants'

const cellStyle = {
    width: 40,
    height: 40,
    display: 'block',
    border: 'solid 2px #7d8485',
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
                               (this.props.cell.opened && this.props.cell.isMine) ? '#aa0000' :
                               (this.props.cell.isMine) ? '#aa0000' : '#cad8d9';

        return <button style={cellStyle}
            onClick={this.openCell}
            onContextMenu={this.flaggedCell}
            disabled={this.props.cell.opened || this.props.mainStore.gameStatus != CONSTANTS.GAME_STATUS_ONGOING}>
            {this.props.cell.opened ? this.props.mainStore.getCellAdjacentMinesNumber(this.props.cell.row, this.props.cell.col) : ''}
        </button>
    }
}
export default Cell;