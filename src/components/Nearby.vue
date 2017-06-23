<template>
<div id="nearby">
  <div id="map"></div>
</div>
</template>
<script>

function initMap() {
  alert("test")
}

export default {
  name: 'nearby',
  data () {
    return {
        drawer: true,
        drawerRight: true,
        right: null,
        left: null
        }
  },
  created: function(){
    this.getCurrentLocation();
    this.initialMap();
  },

  methods: {
    initialMap: function(){
      // Google API url segments
      this.map_lib = 'https://maps.googleapis.com/maps/api/js?key=';
      this.map_key = 'AIzaSyD9_ksgcjjKLkpQZUdKsY9Djm7nkJjx2uw';
      this.map_callback = '&callback=initMap';

      // Googleapi callback
      window.initMap = () => {
          // Trigger an event on the vm instance
          this.makeMap()
      };

      // Add the script to the window object
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = this.map_lib + this.map_key + this.map_callback;
      document.body.appendChild(script);
    },

    makeMap: function(pos){
      var map = new google.maps.Map(document.getElementById('map'), {
          center: pos,
          zoom: 17
        });

      var infoWindow = new google.maps.InfoWindow;
      // console.log("markers ", this.markers)
      // this.markers.forEach((marker) => {
      //   this.addMarker(map, pos, marker.title, marker.iconURL, marker.contentString);
      // })
    },

    addMarker: function(map, position, title, iconURL, contentString) {
        var infowindow = new google.maps.InfoWindow({
          content: contentString
        });
        var marker = new google.maps.Marker({
          position: position,
          map: map,
          title: title,
          icon: iconURL
          // shape: shape,
        });

        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });
    },

    getCurrentLocation: function(){
      // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            this.makeMap(pos);
            console.log('position', pos);
          }, () => {
            this.handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          this.handleLocationError(false, infoWindow, map.getCenter());
        }
    },

    handleLocationError: function(browserHasGeolocation, infoWindow, pos) {
        // default position.
        console.log("handleLocationError");
        self.makeMap({lat: 13.770626, lng: 100.5760677})
      }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

  /* Always set the map height explicitly to define the size of the div
     * element that contains the map. */
    #map {
      height: 700px;
      width: 100%;
    }
    /* Optional: Makes the sample page fill the window. */
    html, body {
      height: 100%;
      margin: 0;
      padding: 0;
    }
</style>
