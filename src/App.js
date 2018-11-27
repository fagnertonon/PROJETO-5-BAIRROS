import React, { Component } from 'react';
import './App.scss';
import places_data from './js/data/places';
import LocationList from './js/component/locationlist';
import Header from './js/component/header';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showSideBar: false,
      'alllocations': places_data,
      'map': '',
      'infowindow': '',
      'prevmarker': ''
    };

    this.onSideBarToggle = this.onSideBarToggle.bind(this);

    this.initMap = this.initMap.bind(this);
    this.openInfoWindow = this.openInfoWindow.bind(this);
    this.closeInfoWindow = this.closeInfoWindow.bind(this);
  }

  componentDidMount() {
    window.initMap = this.initMap;
    loadMapJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyBI-ESl0gKLZ3yYBLiTZ1CuQ0svL-NkNKE&callback=initMap')
  }

  initMap() {
    var self = this;

    var mapview = document.getElementById('map');
    mapview.style.height = window.innerHeight + "px";
    var map = new window.google.maps.Map(mapview, {
      center: { lat: -20.3175257, lng: -40.3314534 },
      zoom: 12,
      mapTypeControl: false
    });

    var InfoWindow = new window.google.maps.InfoWindow({});

    window.google.maps.event.addListener(InfoWindow, 'closeclick', function () {
      self.closeInfoWindow();
    });

    this.setState({
      'map': map,
      'infowindow': InfoWindow
    });

    window.google.maps.event.addDomListener(window, "resize", function () {
      var center = map.getCenter();
      window.google.maps.event.trigger(map, "resize");
      self.state.map.setCenter(center);
    });

    window.google.maps.event.addListener(map, 'click', function () {
      self.closeInfoWindow();
    });

    var alllocations = [];

    this.state.alllocations.forEach(function (location) {
      var longname = location.name;
      var marker = new window.google.maps.Marker({
        position: new window.google.maps.LatLng(location.position.lat, location.position.lng),
        animation: window.google.maps.Animation.DROP,
        map: map,
        title: longname,
      });

      location.longname = longname;
      location.marker = marker;
      location.display = true;

      marker.addListener('click', function () {
        self.openInfoWindow(marker);
      });

      alllocations.push(location);
    });
    this.setState({
      'alllocations': alllocations
    });
  }

  onSideBarToggle() {
    this.setState(function (prevState, props) {
      return {
        showSideBar: (prevState.showSideBar ? false : true)
      };
    });
  }

  openInfoWindow(marker) {
    this.closeInfoWindow();
    this.state.infowindow.open(this.state.map, marker);
    marker.setAnimation(window.google.maps.Animation.BOUNCE);
    this.setState({
      'prevmarker': marker
    });
    this.state.infowindow.setContent('Loading Data...');
    this.state.map.setCenter(marker.getPosition());
    this.getMarkerInfo(marker);
  }

  getMarkerInfo(marker) {
    var self = this;
    let title = `<h3>${marker.title}</h3>`

    self.state.infowindow.setContent(title);
  }

  closeInfoWindow() {
    if (this.state.prevmarker) {
      this.state.prevmarker.setAnimation(null);
    }
    this.setState({
      'prevmarker': ''
    });
    this.state.infowindow.close();
  }

  render() {
    return (
      <div className="App">
        <section className='container'>

          <Header onToggle={this.onSideBarToggle} ></Header>

          <LocationList show={this.state.showSideBar}
            key="100" alllocations={this.state.alllocations}
            openInfoWindow={this.openInfoWindow}
            closeInfoWindow={this.closeInfoWindow} />

          <div id="map"></div>
          
        </section>
      </div>

    );
  }
}

export default App;

function loadMapJS(src) {
  var ref = window.document.getElementsByTagName("script")[0];
  var script = window.document.createElement("script");
  script.src = src;
  script.async = true;
  script.onerror = function () {
    document.write("Google Maps can't be loaded");
  };
  ref.parentNode.insertBefore(script, ref);
}