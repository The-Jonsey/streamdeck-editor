import React, {Component} from "react";

class HandlerInputs extends Component {

    constructor(props) {
        super(props);
        this.state = this.props.cell;
    }

    render() {
        let children = [];
        if (this.props.handler === undefined && this.props.type === "icon") {
            children = [
                <input className="inp" data-type="text" type="text" placeholder="Text" value={this.state.text}
                       onChange={this.props.listener}/>,
                <div className="flex justify-between">
                    <button className="btn" id="choose-icon" onClick={e => this.icon.click()}>Choose Icon</button>
                    <button className="btn" id="remove-icon" onClick={() => {
                        this.icon.value = "";
                        this.props.fileChange("icon", "")
                    }}>Remove Icon
                    </button>
                </div>,
                <input ref={ref => this.icon = ref} data-type="icon" id="icon" className="hidden" type="file"
                       accept=".jpg,.jpeg,.png" onInput={() => {
                    if (this.icon.files.length === 1)
                        this.props.fileChange("icon", this.icon.files[0].path);
                }}/>
            ]
        } else if (this.props.handler && this.props.handler.hasOwnProperty(this.props.type + "Fields")) {
            let fields = this.props.handler[this.props.type + "Fields"];
            Object.keys(fields).forEach(field => {
                if (fields[field].type === "text") {
                    children.push(<input className="inp" data-type={field} type={"text"} placeholder={field} value={this.state[field]} onChange={this.props.listener}/>)
                } else if (fields[field].type === "file") {
                    children.push(
                        <div className="flex justify-between">
                            <button className="btn" onClick={() => this[field].click()}>Choose Icon</button>
                            <button className="btn" onClick={() => {
                                this[field].value = "";
                                this.props.fileChange(field, "")
                            }}>Remove Icon
                            </button>
                        </div>
                    );
                    children.push(
                        <input ref={ref => this[field] = ref} data-type={field} className="hidden" type="file"
                               accept={fields[field].accept || ".jpg,.jpeg,.png"} onInput={() => {
                            if (this[field].files.length === 1)
                                this.props.fileChange(field, this[field].files[0].path);
                        }}/>
                    )
                }
            });
        }
        return <div className={"flex flex-col"}>{children}</div>;
    }
}

export default HandlerInputs;
