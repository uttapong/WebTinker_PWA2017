<template>
  <div id="resgister">
        <v-alert success  v-model="alert_success">
          Success, Insert data.
        </v-alert>

        <v-alert error  v-model="alert_error">
          Error, Please check data again.
        </v-alert>

     <v-layout row>
     
        <v-flex xs6>
            <v-subheader><img class="type-image" :src="selectImage"></img></v-subheader>
         </v-flex>
        <v-flex xs6 order-xs2>
          <v-select
              v-bind:items="items"
              v-model="selectType"
              dark
              item-value="text"
            ></v-select>
        </v-flex>


      </v-layout>
      <v-layout row>
        
        <v-flex xs12 order-xs2>
          <v-text-field
              name="input-7-1"
              multi-line
              v-model="detail"
              id="detail"
              hint="How animal(s) look like or how pity they are?"
              placeholder="Founded animal(s) description"
            ></v-text-field>
        </v-flex>


      </v-layout>
    <v-layout row>
        
   
        <v-flex xs12 order-xs2>
          <!--<input type="file" accept="image/*" capture="camera" id="imageUrl" @change="onFileChange"  />
            <img id="frame"><br/>-->
            <input v-if="imageUrl == ''" type="file" name="imageUrl" class="file-upload" id="imageUrl" accept="image/*" @change="onFileChange" >
      
            <template v-if="imageUrl">
            <img  class="upload-preview" v-bind:src="imageUrl"/>
            <v-btn icon class="white--text deep-orange"  @click.native="clearPhoto">
              <v-icon>clear</v-icon>
            </v-btn>
            </template>

        </v-flex>
    </v-layout>
    
   

      <v-layout row>
        <v-flex xs12 order-xs2>
          <!--<v-btn
            light
            secondary
            :loading="loading"
            @click.native="loader = 'loading'"
            :disabled="loading"
          >
            Accept Terms|submitform
          </v-btn> -->
          <v-card-text>
          <div>
          <v-btn 
          large
          class="deep-orange" 
          light 
          round
          :loading="loading3"
          @click.native="submitform"
          :disabled="loading3"
          ><v-icon left light>favorite</v-icon> Help this animal</v-btn>
         </div>
         </v-card-text>

         
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
  store,
  data () {
    return {
      drawer: true,
      drawerRight: true,
      right: null,
      left: null,
      detail:'',
      imageUrl:'',
      selectType:'Dog',
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
      selectImage:'/static/img/icons/dog.png'
      
    }
  },

  created: function(){
    if(store.state.uploadPhoto){
      this.imageUrl=store.state.uploadPhoto

      this.uploadFileBase64(
                  'images/helpmepets/'+store.state.user.uid+'/',
                  (imgURL)=>{
                    console.log("upload complete callback avatarFile >>", imgURL);
                        this.imageUrl = imgURL;
                  }
                ); 
    }
    //this.alert_success = true
   //console.log(firebase.database.ServerValue.TIMESTAMP)
   console.log('User:', store.state.user.uid)
  },
  watch: {
    selectType: function () {
      // `this` points to the vm instance
      if(this.selectType=="Dog")this.selectImage ='/static/img/icons/dog.png';
      else this.selectImage= '/static/img/icons/cat.png';
    }

  },
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
        storageRef
          .child(url)
          .put(file, metadata)
          .then((snapshot) => {          
            callback(snapshot.downloadURL);
          })
          .catch((error) => {
            this.isShowRegisteringProgress = false;
            this.error = error;
            console.log(error)
          });
    },
    uploadFileBase64: function ( url,callback) {
      let metadata = {'contentType': 'image/jpeg'};
        let storageRef = firebase.storage().ref();        
        storageRef
          .child(url)
          .putString(store.state.uploadPhoto, 'data_url')
          .then((snapshot) => {          
            callback(snapshot.downloadURL);
//            firebase.database().ref(fbField).set(url);
          })
          .catch((error) => {
            this.isShowRegisteringProgress = false;
            this.error = error;
            console.log(error)
          });
    },
    clearPhoto(){
      this.imageUrl='';
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
      var objTmp = this;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          // console.log(position);
          postData['lat'] = position.coords.latitude
          postData['long'] = position.coords.longitude
          
          //Insert projects        
          var newPostKey = firebase.database().ref().child('helpmepets').push().key;        
          var updates = {};                
          updates['/helpmepets/' + newPostKey] = postData;
          console.log(updates);          
          
          firebase.database().ref().update(updates).then((snapshot) => {             
            objTmp.handleUpdated();
          }).catch((error) => {              
            console.log(error);
          });
        }, function() {
          // this.handleLocationError(true, infoWindow, map.getCenter());
          console.log("fail get geolocation");
        });
      } else {
        // Browser doesn't support Geolocation
        this.handleLocationError(false, infoWindow, map.getCenter());
      }
     /* console.log($('#camera')[0].files[0])*/
    },

    handleUpdated: function() {
      this.alert_success = true
      this.loading3 = false
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
#resgister{
  padding: 0px 20px;
}
.type-image{
  height: 64px;
}
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

 #app {
 background: #FFE5B6 url('/static/img/bg_light.png') no-repeat center center fixed !important;
 -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
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


.file-upload {
    display: block;
    position: relative;
    width: 200px;
    margin: auto;
    cursor: pointer;
    border: 0;
    height: 60px;
    border-radius: 5px;
    outline: 0;
}
.file-upload:hover:after {
   /* background: #444;*/
}
.file-upload:after {
        transition: 200ms all ease;
    background: #aaa;
    text-shadow: 0 2px 0 rgba(0,0,0,.2);
    color: #fff;
    font-size: 1.4rem;
    text-align: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: block;
    content: 'Upload Photo';
    line-height: 60px;
    border-radius: 5px;
}

.upload-preview{
  width: 120px;
  border-radius: 10px;
}
</style>
