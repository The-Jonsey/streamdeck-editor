import React, { Component } from 'react';

class Inputs extends Component {

    constructor(props) {
        super(props);
        this.state = this.props.cell;
    }


    render() {

        if (!this.props.cell) {
            return <div className="w-full h-full flex justify-center items-center"><h4>Select a cell to start inputting values</h4></div>
        }
        let iconHandlers = [<option value="">Default</option>];
        Object.keys(this.props.handlers).forEach(handler => {
            if (this.props.handlers[handler].types.includes("icon")) {
                let iconHandler;
                if (this.state.hasOwnProperty("icon_handler") && this.state.icon_handler === handler) {
                    iconHandler = <option value={handler} selected="selected">{handler}</option>
                } else {
                    iconHandler = <option value={handler}>{handler}</option>
                }
                iconHandlers.push(iconHandler);
            }
        });
        let keyHandlers = [<option value="">Default</option>];
        Object.keys(this.props.handlers).forEach(handler => {
            if (this.props.handlers[handler].types.includes("key")) {
                let keyHandler;
                if (this.state.hasOwnProperty("key_handler") && this.state.key_handler === handler) {
                    keyHandler = <option value={handler} selected="selected">{handler}</option>
                } else {
                    keyHandler = <option value={handler}>{handler}</option>
                }
                keyHandlers.push(keyHandler);
            }
        });

        return (
            <div className="flex flex-col flex-grow">
                <select className={"select"}>{iconHandlers}</select>
                <select className={"select"}>{keyHandlers}</select>
            </div>
        )
    }
}

export default Inputs;
