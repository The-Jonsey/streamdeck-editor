import React, { Component } from 'react';

class Table extends Component {

    constructor(props) {
        super(props);
        this.tableClick = this.tableClick.bind(this);
        this.state = {
            activeCell: null
        }
    }

    tableClick(e) {
        if (e.target.tagName === "TD") {
            this.setState({activeCell: e.target.getAttribute("data-id")});
            this.props.listener(e.target.getAttribute("data-id"));
        } else if (e.target.tagName === "svg") {
            this.setState({activeCell: e.target.parentNode.getAttribute("data-id")});
            this.props.listener(e.target.parentNode.getAttribute("data-id"))
        } else if (e.target.tagName === "text") {
            this.setState({activeCell: e.target.parentNode.parentNode.getAttribute("data-id")});
            this.props.listener(e.target.parentNode.parentNode.getAttribute("data-id"))
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (nextState.hasOwnProperty("activeCell")) {
            return true;
        }
    }

    render() {
        let rows = [];
        for (let i = 0; i < this.props.deckInfo.rows; i++) {
            let cols = [];
            for (let j = 0; j < this.props.deckInfo.cols; j++) {
                let cell = this.props.page[(i * this.props.deckInfo.cols) + j];
                let style = {

                };
                if (cell.hasOwnProperty("icon")) {
                    style.backgroundImage = `url('file:///${cell.icon}')`;
                }
                if (this.state.activeCell === (i * 5) + j + "") {
                    style.borderColor = "red";
                    style.borderWidth = "1px";
                    style.borderStyle = "solid";
                }
                let innerHTML = "";
                if (cell.hasOwnProperty("text")) {
                    innerHTML = <svg width="72" height="72" viewBox="0 0 72 72">
        <text x="50%" y="50%" textLength="72px" dominant-baseline="central" text-anchor="middle" alignment-baseline="central"
        style={{fontSize: this.calculateFontSize(cell.text) + "%"}}>{cell.text}</text>
        </svg>;
                }
                cols.push(<td data-id={(i * this.props.deckInfo.cols) + j} style={style}>{innerHTML}</td>);
            }
            rows.push(<tr>{cols}</tr>);
        }
        return <table className={"deck-table"} onClick={this.tableClick}><tbody>{rows}</tbody></table>;
    }

    calculateFontSize(text) {
        let fontFamily = "16px sans-serif";
        let canvas = document.createElement('canvas');
        canvas.width = 72;
        canvas.height = 72;
        let ctx = canvas.getContext('2d');
        ctx.font = fontFamily;
        let width = ctx.measureText(text).width;
        let size = (1 / (width / 72)) * 100;
        return size < 500 ? size > 50 ? size : 50 : 500;
    }
}

export default Table
