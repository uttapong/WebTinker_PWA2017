<template>
  <div id="resgister">
        <v-alert success  v-model="alert_success">
          Success, Insert data.
        </v-alert>

        <v-alert error  v-model="alert_error">
          Error, Please check data again.
        </v-alert>


    <v-layout row>
        
        <v-flex xs6 order-xs1>
          Pic.
          
        </v-flex>
        <v-flex xs6 order-xs2>
          <!--<input type="file" accept="image/*" capture="camera" id="imageUrl" @change="onFileChange"  />
            <img id="frame"><br/>-->

            <input v-if="imageUrl == ''" type="file" name="imageUrl" class="" id="imageUrl" accept="image/*" @change="onFileChange" >
            <img v-if="imageUrl" class="user-avatar" v-bind:src="imageUrl" width="100px" />

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
          <!--<v-btn
            light
            secondary
            :loading="loading"
            @click.native="loader = 'loading'"
            :disabled="loading"
          >
            Accept Terms|submitform
          </v-btn> -->

          <v-btn 
          primary 
          light 
          :loading="loading3"
          @click.native="submitform"
          :disabled="loading3"
          >Send</v-btn>
          <v-btn dark default
          @click.native="goHome"
          >Cannel</v-btn>
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
import {store} from '../vuex/store'

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
      alert_success: false,
      alert_error: false,
      loader: null,
      loading3: false,
      items: [
          { text: 'Dog' },
          { text: 'Cat' }
        ],
    }
  },

  created: function(){
    //this.alert_success = true
   //console.log(firebase.database.ServerValue.TIMESTAMP)
   console.log('User:', store.state.user.uid)
  },
  watch: {},
  methods: {
     onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length)
        return;

      this.imageUrl = '../static/img/loading.gif'
      this.uploadFile(
                  files[0],
                  'images/helpmepets/'+store.state.user.uid+'/'+files[0].name,
                  (imgURL)=>{
                    console.log("upload complete callback avatarFile >>", imgURL);
                        this.imageUrl = imgURL;
                  }
                );  
      //this.imageUrl = files[0];
      // console.log('Img : ', files[0]);
    },
    goHome: function () {
     this.$router.go(-1)
    },
    uploadFile: function (file, url, callback) {
        let metadata = {'contentType': file.type};
        let storageRef = firebase.storage().ref();
        // console.log('url ' + url);
        storageRef
          .child(url)
          .put(file, metadata)
          .then((snapshot) => {
            //console.log("upload complete url  >> " + snapshot.downloadURL);
            callback(snapshot.downloadURL);
//            firebase.database().ref(fbField).set(url);
          })
          .catch((error) => {
            this.isShowRegisteringProgress = false;
            this.error = error;
            console.log(error)
          });
    },

    submitform: function () {
      this.alert_success  = false
      this.alert_error = false
      this.loading3 =true
      
      // console.log('Submit');
      // console.log('detail:', this.detail);
      // console.log('Type:', this.selectType);
      // console.log('Img : ', this.imageUrl);
      // console.log('**********************');
      //this.loader = null
      
      if (this.imageUrl === '' || this.selectType === '' || this.detail === '') {
        this.loading3 = false
        this.alert_error = true
        return false;
      }    

      let postData = {};
      postData = {
        uid: store.state.user.uid,
        img: this.imageUrl,
        detail: this.detail,
        type: this.selectType,
        create_date: firebase.database.ServerValue.TIMESTAMP
      }
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          // console.log(position);
          postData['lat'] = position.coords.latitude
          postData['long'] = position.coords.longitude
          
        }, function() {
          // this.handleLocationError(true, infoWindow, map.getCenter());
        });
      } else {
        // Browser doesn't support Geolocation
        this.handleLocationError(false, infoWindow, map.getCenter());
      }
      

        console.log(postData)
        var newPostKey = firebase.database().ref().child('helpmepets').push().key;
        //console.log("Key :", newPostKey)
        var updates = {};
        //Insert projects
        updates['/helpmepets/' + newPostKey] = postData;
        firebase.database().ref().update(updates).then((snapshot) => {
           this.alert_success = true
           this.loading3 = false
          }).catch((error) => {
            
            this.error = error;
            alert(error)
          });


     /* console.log($('#camera')[0].files[0])*/
    },

    handleLocationError: function(browserHasGeolocation, infoWindow, pos) {
        // default position.
      console.log("handleLocationError");    
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

.custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
