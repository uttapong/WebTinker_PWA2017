<template>
<div id="nearby">
  <div id="map"></div>
   <v-layout row justify-center>
    <v-dialog v-model="dialog" fullscreen transition="v-dialog-bottom-transition" :overlay=false>
      <v-card>
        <v-card-row>
          <v-toolbar light>
            <v-btn icon="icon" @click.native="dialog = false" light>
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>{{ dialog_title }}</v-toolbar-title>
          </v-toolbar>
        </v-card-row>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs10 offset-xs1>
            <v-card>
              <v-card-text>
                <img width="100%" v-bind:src="dialog_image_url">
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs10 offset-xs1>
            <v-card>
              <v-card-text>{{ dialog_detail }}</v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-card>
    </v-dialog>
  </v-layout>
</div>
</template>
<script>
import {firebase} from '../assets/js/FirebaseConfig'
var format = require('string-format')
import moment from 'moment'

export default {
  name: 'nearby',
  data () {
    return {
        drawer: true,
        drawerRight: true,
        right: null,
        left: null,
        dialog: false,
        dialog_detail: "",
        dialog_title: "",
        dialog_image_url: 'https://firebasestorage.googleapis.com/v0/b/webtinker-c0bd8.appspot.com/o/images%2Fhelpmepets%2F1423749169-image-o.jpg?alt=media&token=a2ec52ce-7196-4c77-81fd-bccdb298286c'
    }
  },
  created: function(){
    this.handleCache();
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
          this.makeMap({lat: 13.770626, lng: 100.5760677});
      };

      // Add the script to the window object
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = this.map_lib + this.map_key + this.map_callback;
      document.body.appendChild(script);
    },

    handleCache: function() {
      
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
      var catIconURL = "/static/img/cat-marker.png";
      var dogIconURL = "/static/img/dog-marker.png";
      var windowContentTemplate = '<div class="columns"> <div id="box1"> <img height="100px" src="{}" /> </div> <div id="box2"> <strong>{}</strong><br /> <i>{}</i> </div> </div>';

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
              // contentString: format(windowContentTemplate, value.img, value.detail, this.convertTimeStampToReableDateTime(value.create_date)),
              contentString: value.detail,
              iconURL: catIconURL,
              img: value.img
            }
            //console.log("marker ", marker);
            this.addMarker(map, marker.position, marker.title, marker.type, marker.img, marker.contentString);
         }, (error) => {
            console.log(error);
         });
    },

    convertTimeStampToReableDateTime: function (timestamp) {
      let ts = parseInt(timestamp) / 1000
      return moment.unix(ts).format('MMM Do YY')
    },

    addMarker: function(map, position, title, type, img, contentString) {
        var infowindow = new google.maps.InfoWindow({
          content: contentString
        });
        var marker = new google.maps.Marker({
          position: position,
          map: map,
          title: title,
          icon: this.getIconURL(type)
        });

        marker.addListener('click', () => {
          console.log("content string ", contentString);
          this.dialog_detail = contentString;
          this.dialog_title = type;
          this.dialog = true;
          this.dialog_image_url = img;
          // infowindow.open(map, marker);
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
            //console.log('position', pos);
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
        this.makeMap({lat: 13.770626, lng: 100.5760677})
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
    #columns {
        width:100px
    }
    #columns div {
        float:left;
        width:50%;
        outline:1px solid red;
        height:100px;
    }
    #columns:after {
        content:"";
        display:block;
        clear:both;
    }
</style>
