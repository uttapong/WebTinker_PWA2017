<template>
    <div id="nearby">
        <v-alert success="" v-model="alert_success">
            Success, Insert data.
        </v-alert>
        <v-alert error="" v-model="alert_error">
            Error, Please check data again.
        </v-alert>
        <div id="map">
        </div>
        <!-- support only mobile web screen only. -->
        <v-layout justify-center="" row="">
            <v-dialog v-model="openDialog">
                <v-card>
                    <v-card-row>
                        <v-card-title>
                            {{ dialog_title }}
                        </v-card-title>
                    </v-card-row>
                    <v-card-row class="img-container">
                        <img class="dialog_img" v-bind:src="dialog_image_url">
                        </img>
                    </v-card-row>
                    <v-card-row>
                        <v-card-text>
                            {{ dialog_detail }}
                        </v-card-text>
                    </v-card-row>
                    <v-card-row actions="">
                        <v-btn @click.native="share" class="green--text darken-1" flat="flat">
                          <i class="fa fa-facebook"></i>
                        </v-btn>
                        <v-btn :disabled="loadingFlag" :loading="loadingFlag" @click.native="addFav({dialog_key})" class="btn--dark orange white--text text--lighten-2" flat="" v-if="dialog_favAlready == false">
                            <v-icon>
                                favorite
                            </v-icon>
                        </v-btn>
                        <v-btn :disabled="true" class="btn--dark orange darken-4 white--text text--lighten-2" flat="" v-if="dialog_favAlready == true">
                            <v-icon>
                                favorite
                            </v-icon>
                        </v-btn>
                        <v-btn @click.native="openDialog = false" class="green--text darken-1" flat="flat">
                            CLOSE
                        </v-btn>
                    </v-card-row>
                </v-card>
            </v-dialog>
        </v-layout>
    </div>
</template>
<script>
import {firebase} from '../assets/js/FirebaseConfig'
import {store} from '../vuex/store'
import moment from 'moment'
var format = require('string-format')

export default {
  name: 'nearby',
  component : {
  },
  data () {
    return {
        loadingFlag: false,  
        alert_success: false,
        alert_error: false,
        openDialog: false,
        dialog_detail: "",
        dialog_title: "",
        dialog_key: "",
        dialog_uid: "",
        dialog_favAlready: false,
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

    addFav: function (key) {
      //console.log(key);
      let uid = (store.state.user!=null)?store.state.user.uid:null;
      
      if (uid!=null && uid != '' && this.loadingFlag==false) {
        this.loadingFlag = true;
        let postData = {};
        postData = {
          uid: uid,
          helpmepets_key: key.dialog_key,
          create_date: firebase.database.ServerValue.TIMESTAMP
        }

        //Insert projects  
        var objTmp = this;      
        var newPostKey = firebase.database().ref().child('helpmepets_favorite').push().key;        
        var updates = {};                
        updates['/helpmepets_favorite/' + newPostKey] = postData;
        console.log(updates);          
        
        firebase.database().ref().update(updates).then((snapshot) => {             
          objTmp.handleUpdated();
          this.loadingFlag = false;
        }).catch((error) => {              
          console.log(error);
          this.loadingFlag = false;
        });
      }
      else {
          this.loadingFlag = false;
      }
    
    },

    handleUpdated: function() {
      // this.alert_success = true
      this.loading3 = false
      setTimeout(function(){
        this.alert_success = false;
      },1000);
    },

    makeMap: function(pos){
      var map = new google.maps.Map(document.getElementById('map'), {
          center: pos,
          zoom: 17,
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: false,
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
            //console.log(snapshot.key);
            let marker = {
              position: {
                lat: value.lat, 
                lng: value.long, 
              },
              title: "", 
              type: value.type,
              contentString: value.detail,
              iconURL: catIconURL,
              img: value.img,
              uid: value.uid,
              key: snapshot.key
            }
            //console.log("marker ", marker);
            this.addMarker(map, marker);
         }, (error) => {
            console.log(error);
         });
    },

    convertTimeStampToReableDateTime: function (timestamp) {
      let ts = parseInt(timestamp) / 1000
      return moment.unix(ts).format('MMM Do YY')
    },
    //marker.position, marker.title, marker.type, marker.img, marker.contentString, marker.key,marker.uid;
    addMarker: function(map, marker) {
        var position = marker.position;
        var title = marker.title;
        var type = marker.type;
        var img = marker.img;
        var contentString = marker.contentString;
        var key = marker.key;
        var uid = marker.uid;
        var infowindow = new google.maps.InfoWindow({
          content: contentString
        });
        var objThis = this;
        var marker = new google.maps.Marker({
          position: position,
          map: map,
          title: title,
          icon: this.getIconURL(type)
        });


        google.maps.event.addListener(marker, "click", function() {
            objThis.dialog_detail = contentString;
            objThis.dialog_title = type;          
            objThis.dialog_image_url = img;
            objThis.dialog_key = key;
            objThis.dialog_uid = uid;
            objThis.dialog_favAlready = false;
            //console.log("google.maps.event.addListener click ", store.state.user);
            let uid = (store.state.user!=null)?store.state.user.uid:null;
            // var curObj = this;

            // if (uid && uid != '') {
            //     let usersFavRef = firebase.database().ref();
            //     usersFavRef.child('helpmepets_favorite').orderByChild("helpmepets_key").equalTo(key).on('value', function(snapshot) {
            //       console.log("check helpmepets_favorite",snapshot.val());  
            //       if (snapshot.val()!=null) {
            //         curObj.dialog_favAlready = true;
            //       }
            //       else {
            //         curObj.dialog_favAlready = false;
            //       }
            //       console.log('curObj', curObj);
            //     });
            // }
            //console.log("this.openDialog ", objThis.openDialog);
            objThis.openDialog = true;
            // setTimeout(function() {
            //   objThis.openDialog = true;
            // }, 500);
            // this.shareTitle = this.getshareTitle(type);
            this.shareText = '';
        
            // actually stops the event from bubbling up to the map or the document
            event.preventDefault();
        });
        // marker.addListener('click', () => {
        //   //console.log("content string ", contentString);
           
        // });
    },

    getshareTitle: function(animalType) {
      if (animalType.toLowerCase() === "cat") {
          return 'มีแมวต้องการความช่วยเหลือ';
      }
      return 'มีหมาต้องการความช่วยเหลือ';
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
    },

    share: function() {
      console.log("shere");
      FB.ui({
        display: 'popup',
        method: 'share_open_graph',
        action_type: 'og.likes',
        action_properties: JSON.stringify({
            object:window.location.href,
        })
      }, function(response){});
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped="">
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
      min-height: calc(100vh - 56px - 56px)!important;
      margin-top: -16px;
    }

    .container container--fluid {
      height: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    .dialog_img {
      min-height: 250px;
      width:100%;
      border-radius: 10px;
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
    .detail{
      margin-top: 15px;
      padding: 15px;
      background-color: rgba(255, 255, 255, 0.4);
      border-radius: 20px;
    }

    .dialog .card{
     /*background: #FFE5B6 url('/static/img/bg_light.png') no-repeat center center fixed !important;*/
     -webkit-background-size: cover;
      -moz-background-size: cover;
      -o-background-size: cover;
      background-size: cover;
     }
     .dialog .img-container{
        padding: 15px;
     }
</style>
