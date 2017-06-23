<template>
  <div id="resgister">
    <v-layout row>
        <v-flex xs6 order-xs1>
          Pic.
          
        </v-flex>
        <v-flex xs6 order-xs2>
          <input type="file" accept="image/*" capture="camera" id="imageUrl"  />
            <img id="frame"><br/>
        </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs6 order-xs1>
          Detail 
          
        </v-flex>
        <v-flex xs6 order-xs2>
          <v-text-field
              name="input-7-1"
              multi-line
              v-model="detail"
              id="detail"
            ></v-text-field>
        </v-flex>


      </v-layout>
    <v-layout row>
      <v-flex xs6 order-xs1>
          Type 
        </v-flex>
        <v-flex xs6 order-xs2>
          <v-select
              v-bind:items="items"
              v-model="selectType"
              class="input-group--focused"
              dark
              item-value="text"
            ></v-select>
        </v-flex>


      </v-layout>

      <v-layout row>
        <v-flex xs6 order-xs1></v-flex>
        <v-flex xs6 order-xs2>
          <v-btn primary light @click.native="submitform">Send</v-btn>
          <v-btn dark default>Cannel</v-btn>
        </v-flex>
      </v-layout>
  </div>
  
  
</template>

<script async defer
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD9_ksgcjjKLkpQZUdKsY9Djm7nkJjx2uw&callback=initMap">
</script>
<script>
import Vue from 'vue'
import Vuetify from 'vuetify'
import {firebase} from '../assets/js/FirebaseConfig'

Vue.use(Vuetify)

export default {
  name: 'resgister',
  data () {
    return {
      drawer: true,
      drawerRight: true,
      right: null,
      left: null,
      detail:'',
      imageUrl:'',
      selectType:'',
      latitude:'',
      longitude:'',
      pos:'',
      items: [
          { text: 'Dog' },
          { text: 'Cat' }
        ],
    }
  },
  created: function(){
   
  },
  methods: {
    uploadAvatarFile: function () {
      console.log('Avatar:')
    },
    submitform: function () {
      console.log('Submit')
      console.log(this.detail)
      console.log(this.selectType)
      
      console.log('**********************')
      let postData = {}
      postData = {
          detail: this.detail,
          type: this.selectType,
          create_date:''
        }
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            //let lat = position.coords.latitude;
            //let long = position.coords.longitude;
             var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            //console.log('position', pos)
            //console.log('latitude', pos.lat)
            postData['latitude'] = position.coords.latitude
            postData['latlongitudeitude'] = position.coords.longitude

          }, function() {
           // this.handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
         // this.handleLocationError(false, infoWindow, map.getCenter());
        }

      
        console.log(postData)
        var newPostKey = firebase.database().ref().child('helpmepets').push().key;
        console.log("Key :", newPostKey)
        var updates = {};
        //Insert projects
        updates['/helpmepets/' + newPostKey] = postData;
        firebase.database().ref().update(updates).then((snapshot) => {
           console.log('add data:Ok');
          }).catch((error) => {
            
            this.error = error;
            alert(error)
          });


     /* console.log($('#camera')[0].files[0])*/
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
</style>
