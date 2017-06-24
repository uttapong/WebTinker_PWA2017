<template>
<div id="nearby">
  <div id="map"></div>
</div>
</template>
<script>
import {firebase} from '../assets/js/FirebaseConfig'
var format = require('string-format')

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
          this.makeMap();
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

      this.makeMarkers(map);
    },

    makeMarkers: function(map) {
      var catIconURL = "https://firebasestorage.googleapis.com/v0/b/webtinker-c0bd8.appspot.com/o/cat-marker.png?alt=media&token=2903f888-50d3-49e8-8d85-cab61d8ea3cd";
      var dogIconURL = "https://firebasestorage.googleapis.com/v0/b/webtinker-c0bd8.appspot.com/o/dog-marker.png?alt=media&token=af45219c-6a27-4b53-9a1f-7b754b849346";
      var windowContentTemplate = '<div id="content">'+
          '<div id="siteNotice">'+
          '</div>'+
          '<div id="bodyContent">'+
          '<p>{}{}</p>'+
          '</div>'+
          '</div>';

      let listener = firebase.database().ref("helpmepets");
      listener
         .on('child_added', (snapshot) => {
            let value = snapshot.val();
            let marker = {
              position: {
                lat: value.lat, 
                lng: value.long, 
              },
              title: "", 
              type: value.type,
              contentString: format(windowContentTemplate, value.detail, " what!!!"),
              iconURL: catIconURL
            }
            console.log("marker ", marker);
            this.addMarker(map, marker.position, marker.title, marker.type, marker.contentString);
         });

      // let markers = [
      //     { 
      //       position: {
      //         lat: 13.770626, 
      //         lng: 100.5760677, 
      //       },
      //       title: "cat1", 
      //       type: "cat", 
      //       contentString: contentString,
      //       iconURL: catIconURL
      //     },
      //     {
      //       position: {
      //         lat: 13.770131,
      //         lng: 100.574055
      //       },
      //       title: "dog1",
      //       type: "dog",
      //       contentString: contentString,
      //       iconURL: dogIconURL
      //     },
      //     {
      //       position: {
      //         lat: 13.773086,
      //         lng: 100.572306
      //       },
      //       title: "dog2",
      //       type: "dog",
      //       contentString: contentString,
      //       iconURL: dogIconURL
      //     },
      //     { 
      //       position: {
      //         lat: 13.771054, 
      //         lng: 100.572451
      //       },
      //       title: "cat1", 
      //       type: "cat", 
      //       contentString: contentString,
      //       iconURL: catIconURL
      //     },
      //     {
      //       position: {
      //         lat: 13.769783,
      //         lng: 100.571904
      //       },
      //       title: "dog3",
      //       type: "dog",
      //       contentString: contentString,
      //       iconURL: dogIconURL
      //     }
      //   ];

      //   console.log("markers ", markers);

      //   markers.forEach((marker) => {
      //     console.log("marker ", marker);
      //     this.addMarker(map, marker.position, marker.title, marker.iconURL, marker.contentString);
      //   });
    },

    addMarker: function(map, position, title, type, contentString) {
        var infowindow = new google.maps.InfoWindow({
          content: contentString
        });
        var marker = new google.maps.Marker({
          position: position,
          map: map,
          title: title,
          icon: this.getIconURL(type)
        });

        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });
    },

    getIconURL: function(type) {
      if (type.toLowerCase() === "cat") {
        return "https://firebasestorage.googleapis.com/v0/b/webtinker-c0bd8.appspot.com/o/cat-marker.png?alt=media&token=2903f888-50d3-49e8-8d85-cab61d8ea3cd";
      }
      return "https://firebasestorage.googleapis.com/v0/b/webtinker-c0bd8.appspot.com/o/dog-marker.png?alt=media&token=af45219c-6a27-4b53-9a1f-7b754b849346";
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
