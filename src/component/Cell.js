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

    constructor(props) {
        super(props);
        this.state = {
            stripBg: '',
            flag: false
        };
    }

    handleClick = (e) => {
        e.preventDefault();

        this.setState({ flag: !this.state.flag });
        console.log(this.state.flag);
    }


    openCell = () => {
        this.props.mainStore.openCell(this.props.cell.row, this.props.cell.col)
    }

    render() {
        cellStyle.background = (this.props.cell.opened && this.props.cell.isMine) ? '#aa0000' : '#ccc';
        // cellStyle.background = this.props.cell.opened ? '#32a852' :  '#ccc'

        const style = {
            backgroundColor: this.state.flag ? '#32a890' : '#ccc',
            width: 40,
            height: 40,
            display: 'block',
        };
        return (
            <button style={style}
                onClick={this.openCell}
                onContextMenu={this.handleClick}
                disabled={this.props.cell.opened || this.props.mainStore.gameStatus != CONSTANTS.GAME_STATUS_ONGOING}>
                {this.props.cell.opened ? this.props.mainStore.getCellAdjacentMinesNumber(this.props.cell.row, this.props.cell.col) : ''}
            </button>
        )
    }
}

export default Cell;