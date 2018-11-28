import React, { Component } from 'react';
import LocationItem from '../component/locationitem';

export default class LocationList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            'locations': '',
            'query': '',
            'suggestions': true,
        };

        this.filterLocations = this.filterLocations.bind(this);
    }
    /**
     * Filtra os locais
     */
    filterLocations(event) {
        this.props.closeInfoWindow();
        const { value } = event.target;
        let locations = [];
        this.props.alllocations.forEach(function (location) {
            if (location.longname.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                location.marker.setVisible(true);
                locations.push(location);
            } else {
                location.marker.setVisible(false);
            }
        });

        this.setState({
            'locations': locations,
            'query': value
        });
    }

    componentWillMount() {
        this.setState({
            'locations': this.props.alllocations
        });
    }


    render() {
        const hide = this.props.show ? ' sidebar-show' : ' sidebar-hide';

        let locationlist = this.state.locations.map(function (listItem, index) {
            return (
                <LocationItem openInfoWindow={this.props.openInfoWindow.bind(this)} data={listItem} />
            );
        }, this);

        return (
            <nav role='navigation' className={'sidebar' + hide}>

                <form className="filter-container">
                    <input className="filter"
                        role="search"
                        aria-label="filter"
                        id="search-field"
                        type="text"
                        placeholder="Busca"
                        value={this.state.query}
                        onChange={this.filterLocations} />
                </form>
                <ul role='filter-list' className='places'>
                    {this.state.suggestions && locationlist}
                </ul>

            </nav>
        );
    }
}