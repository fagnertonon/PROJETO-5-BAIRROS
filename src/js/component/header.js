import React, { Component } from 'react';

export default class Header extends Component {

    render() {
        return (
            <header className='topbar'>
                <a href="#" className="menu" onClick={this.props.onToggle}>&#9776;</a>
                <h1 className='title'>ES</h1>
            </header>
        )
    }
}
