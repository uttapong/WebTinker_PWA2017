<template>
<div id="nearby">
  <div id="gmap"></div>


</div>
</template>

<script async defer
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD9_ksgcjjKLkpQZUdKsY9Djm7nkJjx2uw&callback=initMap">
</script>
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
    this.getCurrentLocation()
  },
  methods: {
    initMap: function(){
        console.log("heloo fuck")
    },

    getCurrentLocation: function(){
      // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            console.log('position', pos)
          }, function() {
            this.handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          this.handleLocationError(false, infoWindow, map.getCenter());
        }
    },

    handleLocationError: function(browserHasGeolocation, infoWindow, pos) {
        // default position.
        console.log("handleLocationError")
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
      height: 100%;
    }
    /* Optional: Makes the sample page fill the window. */
    html, body {
      height: 100%;
      margin: 0;
      padding: 0;
    }
</style>
