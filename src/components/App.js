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
        this.cellDataUpdate = this.cellDataUpdate.bind(this);
        this.previewChanges = this.previewChanges.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.reloadChanges = this.reloadChanges.bind(this);
        this.addPage = this.addPage.bind(this);
        this.clearPage = this.clearPage.bind(this);
    }

    selectUpdate(e) {
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

    cellDataUpdate(cell) {
        let config = this.state.config;
        config.pages[this.state.page][parseInt(this.state.cell)] = cell;
        this.setState({config});
    }

    previewChanges() {
        ipcRenderer.send("set-config", JSON.stringify(this.state.config));
    }

    saveChanges() {
        ipcRenderer.send("commit-config");
    }

    reloadChanges() {
        ipcRenderer.send("reload");
    }

    addPage() {
        let config = this.state.config;
        let newPage = [];
        for (let i = 0; i < this.props.deckInfo.cols * this.props.deckInfo.rows; i++) {
            newPage.push({});
        }
        config.pages.push(newPage);
        this.setState(config);
    }

    clearPage() {
        let config = this.state.config;
        for (let i = 0; i < config.pages[this.state.page].length; i++) {
            config.pages[this.state.page][i] = {};
        }
        this.setState(config);
    }

    render() {
        return (
            <div className="flex w-full h-full justify-between">
                <div className="flex flex-col w-3/12 bg-gray-800 p-4 bg-dark shadow-2xl">
                    <div className="flex flex-col">
                        <button className="btn" id="add-page" onClick={this.addPage}>Add Page</button>
                        <button className="btn" id="clear-page" onClick={this.clearPage}>Clear active page</button>
                    </div>
                    <Select listener={this.selectUpdate} config={this.props.config}/>
                    <div className={"flex flex-col"}>
                        <button className={"btn"} onClick={this.previewChanges}>Preview Changes</button>
                        <button className={"btn"} onClick={this.saveChanges}>Save Changes</button>
                        <button className={"btn"} onClick={this.reloadChanges}>Reset changes on Deck</button>
                    </div>
                </div>
                <Table key={this.state.page} listener={this.cellUpdate} page={this.props.config.pages[this.state.page]}
                       deckInfo={this.props.deckInfo}/>
                <div className="flex flex-col w-3/12 bg-gray-800 p-4 bg-dark shadow-2xl">
                    <Inputs key={this.state.page + "-" + this.state.cell}
                        cell={this.props.config.pages[parseInt(this.state.page)][parseInt(this.state.cell)]}
                        handlers={this.props.config.handlers} listener={this.cellDataUpdate}/>
                </div>
            </div>
        );
    }
}

export default App;
