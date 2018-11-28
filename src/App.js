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
      alllocations: places_data,
      map: '',
      infowindow: '',
      prevmarker: ''
    };

    //captura a instância do objeto quando usada na função
    this.onSideBarToggle = this.onSideBarToggle.bind(this);
    this.initMap = this.initMap.bind(this);
    this.openInfoWindow = this.openInfoWindow.bind(this);
    this.closeInfoWindow = this.closeInfoWindow.bind(this);
  }

  componentDidMount() {
    // Conecte a função initMap () dentro desta classe ao contexto da janela global,
    // para que o Google Maps possa invocá-lo
    window.initMap = this.initMap;
    // Carrega de forma assíncrona o script do Google Maps, passando a referência de retorno de chamada
    loadMapJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyBI-ESl0gKLZ3yYBLiTZ1CuQ0svL-NkNKE&callback=initMap')
  }

  /**
   * Inicialize o mapa quando o script do Google for carregado
   */
  initMap() {
    let self = this;

    let mapview = document.getElementById('map');
    mapview.style.height = window.innerHeight + "px";
    let map = new window.google.maps.Map(mapview, {
      center: { lat: -20.3175257, lng: -40.3314534 },
      zoom: 12,
      mapTypeControl: false
    });

    let InfoWindow = new window.google.maps.InfoWindow({});

    window.google.maps.event.addListener(InfoWindow, 'closeclick', function () {
      self.closeInfoWindow();
    });

    this.setState({
      'map': map,
      'infowindow': InfoWindow
    });

    window.google.maps.event.addDomListener(window, "resize", function () {
      let center = map.getCenter();
      window.google.maps.event.trigger(map, "resize");
      self.state.map.setCenter(center);
    });

    window.google.maps.event.addListener(map, 'click', function () {
      self.closeInfoWindow();
    });

    let alllocations = [];

    this.state.alllocations.forEach(function (location) {
      let longname = location.name;

      let marker = new window.google.maps.Marker({
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

  /**
   * Carrega os dados junto com foursquare para visualizar infoWindow.
   */
  getMarkerInfo(marker) {
    var self = this;
    var clientId = "03HL4BOILJP2WN5H2141ALC5N2NBJHYGBDH0QHRMG2B50VOU";
    var clientSecret = "LU3TBY1JI2RMZZDVBWXXQG42O05VO24MLKDL403QUGB2DYXJ";
    var url = "https://api.foursquare.com/v2/venues/search?client_id=" + clientId + "&client_secret=" + clientSecret + "&v=20130815&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng() + "&limit=1";
    fetch(url)
      .then(
        function (response) {
          if (response.status !== 200) {
            self.state.infowindow.setContent("Sorry data can't be loaded");
            return;
          }

          response.json().then(function (data) {
            var location_data = data.response.venues[0];

            var title = '<h2>Nome: </b>' + location_data.name + '</h3>';
            var endereco = '<h3>Endereço: ' + location_data.location.address + '</h3>';
            var link = '<a href="https://foursquare.com/v/' + location_data.id + '" target="_blank">visite!</a>'
            self.state.infowindow.setContent(title + endereco + link);

          });
        }
      )
      .catch(function (err) {
        self.state.infowindow.setContent("Sorry data can't be loaded");
      });
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

          <div role="application" id="map"></div>

        </section>
      </div>

    );
  }
}

export default App;

function loadMapJS(src) {
  let ref = window.document.getElementsByTagName("script")[0];
  let script = window.document.createElement("script");
  script.src = src;
  script.async = true;
  script.onerror = function () {
    document.write("Google Maps can't be loaded");
  };
  ref.parentNode.insertBefore(script, ref);

  window.gm_authFailure = () => {
    let mapview = document.getElementById('map');
    mapview.innerHTML ='<p class="erro"><strong>Não foi possível carregar o Google Maps.<br> Por favor, recarregue a página.</strong></p>';
  };

}
