import React, { Component } from 'react';

class Select extends Component {


    componentDidMount() {
        this.elem.addEventListener("input", this.props.listener);
    }

    componentWillUnmount() {
        this.elem.removeEventListener("input", this.props.listener);
    }

    render() {
        let children = [];
        for (let i = 0; i < this.props.config.pages.length; i++) {
            children.push(<option value={i}>Page {i + 1}</option> );
        }
        return (<select className={"select"} size={"100"} ref={elem => this.elem = elem}>{children}</select>)
    }
}

export default Select;
