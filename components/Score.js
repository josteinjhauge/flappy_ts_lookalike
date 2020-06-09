import React, { Component } from 'react';

export default class Score extends Component{
    constructor(){
        super();
        this.setState = {count : 0}
    }

    incrementCount = () => this.setState(
        prevState => ({count: prevState.count + 1})
    )

    render(){
        const {count} = this.state;
        return(
            <text>Your score: {count} </text>
        );
    }
} 