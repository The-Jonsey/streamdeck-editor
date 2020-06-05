import React, {Component} from 'react';
import HandlerInputs from "./HandlerInputs";

class Inputs extends Component {

    constructor(props) {
        super(props);
        this.state = this.props.cell;
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
    }

    handleSelectChange(e) {
        let state = {};
        state[e.target.getAttribute("data-type") + "_handler"] = e.target.value;
        this.setState(state, () => {
            this.props.listener(this.state);
        });
    }

    handleInputChange(e) {
        let state = {};
        state[e.target.getAttribute("data-type")] = e.target.value;
        this.setState(state, () => {
            this.props.listener(this.state);
        });
    }

    handleFileChange(key, value) {
        let state = {};
        state[key] = value;
        this.setState(state, () => {
            this.props.listener(this.state);
        })
    }

    render() {

        if (!this.props.cell) {
            return <div className="w-full h-full flex justify-center items-center"><h4>Select a cell to start inputting
                values</h4></div>
        }
        let iconHandlers = [<option value="">Default</option>];
        Object.keys(this.props.handlers).forEach(handler => {
            if (this.props.handlers[handler].types.includes("icon")) {
                let iconHandler;
                iconHandler = <option value={handler}>{handler}</option>;
                iconHandlers.push(iconHandler);
            }
        });
        let keyHandlers = [<option value="">Default</option>];
        Object.keys(this.props.handlers).forEach(handler => {
            if (this.props.handlers[handler].types.includes("key")) {
                let keyHandler;
                keyHandler = <option value={handler}>{handler}</option>;
                keyHandlers.push(keyHandler);
            }
        });

        return (
            <div className={"flex flex-col flex-grow"}>
                <div className="flex flex-col flex-grow">
                    <label>Icon Handler</label>
                    <select data-type="icon" className={"select"} value={this.state.icon_handler}
                        onChange={this.handleSelectChange}>{iconHandlers}</select>
                    <HandlerInputs handler={this.props.handlers[this.state.icon_handler]} cell={this.props.cell}
                                   type={"icon"} listener={this.handleInputChange} fileChange={this.handleFileChange}/>

                    <input onChange={this.handleInputChange} data-type={"switch_page"} className="inp" type="number"
                           placeholder="Set Page" value={this.state.switch_page}/>
                    <input onChange={this.handleInputChange} data-type={"command"} className="inp" type="text"
                           placeholder="Set Command" value={this.state.command}/>
                    <input onChange={this.handleInputChange} data-type={"keybind"} className="inp" type="text"
                           placeholder="Set Keybind" value={this.state.keybind}/>
                    <input onChange={this.handleInputChange} data-type={"url"} className="inp" type="text"
                           placeholder="Set URL" value={this.state.url}/>
                    <input onChange={this.handleInputChange} data-type={"brightness"} className="inp" type="number"
                           min={0} max={100} step={1} placeholder="Set Brightness" value={this.state.brightness}/>
                    <input onChange={this.handleInputChange} data-type={"write"} className="inp" type="text"
                           placeholder="Set Text to write" value={this.state.write}/>
                    <label>Key Handler</label>
                    <select data-type="key" className={"select"} value={this.state.key_handler}
                        onChange={this.handleSelectChange}>{keyHandlers}</select>
                    <HandlerInputs handler={this.props.handlers[this.state.key_handler]} cell={this.props.cell}
                                   type={"key"} listener={this.handleInputChange} fileChange={this.handleFileChange}/>
                </div>
            </div>
        )
    }
}

export default Inputs;
