import React from 'react';

export default class LocationItem extends React.Component {
    render() {
        return (
            <li role="button"
                className="place"
                tabIndex="0"
                onKeyPress={this.props.openInfoWindow.bind(this, this.props.data.marker)}
                onClick={this.props.openInfoWindow.bind(this, this.props.data.marker)}>
                <p
                    className='place-link'>
                    {this.props.data.name}
                </p>
            </li>
        );
    }
}