import React, {Component} from 'react';
import Select from "./Select";
import Table from "./Table";
import Inputs from "./Inputs";
const ipcRenderer = window.require('electron').ipcRenderer;

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            config: this.props.config,
            page: this.props.deckInfo.page,
            cell: null
        };
        this.selectUpdate = this.selectUpdate.bind(this);
        this.cellUpdate = this.cellUpdate.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
    }

    selectUpdate(e) {
        console.log(e);
        this.setState({page: e.target.value});
        this.setState({cell: null});
        ipcRenderer.send("set-page", parseInt(e.target.value));
    }

    cellUpdate(index) {
        this.setState({cell: index});
    }

    handlePageChange(page) {
        this.setState({page});
        this.setState({cell: null});
    }

    componentDidMount() {
        ipcRenderer.on("page-updated", (event, args) => {
            this.setState({page: args});
        })
    }

    render() {
        return (
            <div className="flex w-full h-full justify-between">
                <div className="flex flex-col w-3/12 bg-gray-800 p-4 bg-dark shadow-2xl">
                    <div className="flex flex-col">
                        <button className="btn" id="add-page">Add Page</button>
                        <button className="btn" id="clear-page">Clear active page</button>
                    </div>
                    <Select listener={this.selectUpdate} config={this.props.config}/>
                </div>
                <Table key={this.state.page} listener={this.cellUpdate} page={this.props.config.pages[this.state.page]}
                       deckInfo={this.props.deckInfo}/>
                <div className="flex flex-col w-3/12 bg-gray-800 p-4 bg-dark shadow-2xl">
                    <Inputs key={this.state.page + "-" + this.state.cell}
                        cell={this.props.config.pages[parseInt(this.state.page)][parseInt(this.state.cell)]}
                        handlers={this.props.config.handlers}/>
                </div>
            </div>
        );
    }
}

export default App;
