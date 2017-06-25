<template>
    <div id="resgister">
        <v-layout justify-center="" row="">
            <v-dialog v-model="dialog">
                <v-card>
                    <v-card-row>
                        <v-card-title>
                            Photo posted
                        </v-card-title>
                    </v-card-row>
                    <v-card-row>
                        <v-card-text>
                            Thank you for your love, this post would definitely help us.
                        </v-card-text>
                    </v-card-row>
                    <v-card-row actions="">
                        <v-btn @click.native="goToHome" class="green--text darken-1" flat="flat">
                            OK
                        </v-btn>
                    </v-card-row>
                </v-card>
            </v-dialog>
        </v-layout>
        <v-alert success="" v-model="alert_success">
            Your animal'photo has been posted.
        </v-alert>
        <v-alert error="" v-model="alert_error">
            Error, Please check data again.
        </v-alert>
        <v-layout row="">
            <v-flex xs6="">
                <v-subheader>
                    <img :src="selectImage" class="type-image"/>
                </v-subheader>
            </v-flex>
            <v-flex order-xs2="" xs6="">
                <v-select dark="" item-value="text" v-bind:items="items" v-model="selectType">
                </v-select>
            </v-flex>
        </v-layout>
        <v-layout row="">
            <v-flex order-xs2="" xs12="">
                <v-text-field hint="How animal(s) look like or how pity they are?" id="detail" multi-line="" name="input-7-1" placeholder="Founded animal(s) description" v-model="detail">
                </v-text-field>
            </v-flex>
        </v-layout>
        <v-layout row="">
            <v-flex order-xs2="" xs12="">
                <!--<input type="file" accept="image/*" capture="camera" id="imageUrl" @change="onFileChange"  />
            <img id="frame"><br/>-->
                <input @change="onFileChange" accept="image/*" class="file-upload" id="imageUrl" name="imageUrl" type="file" v-if="imageUrl == ''">
                    <template v-if="imageUrl">
                        <img class="upload-preview" v-bind:src="imageUrl"/>
                        <v-btn @click.native="clearPhoto" class="white--text deep-orange" icon="">
                            <v-icon>
                                clear
                            </v-icon>
                        </v-btn>
                    </template>
                </input>
            </v-flex>
        </v-layout>
        <v-layout row="">
            <v-flex order-xs2="" xs12="">
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
                        <v-btn :disabled="loading3" :loading="loading3" @click.native="submitform" class="deep-orange" large="" light="" round="">
                            <v-icon left="" light="">
                                favorite
                            </v-icon>
                            Help this animal
                        </v-btn>
                    </div>
                </v-card-text>
            </v-flex>
        </v-layout>
    </div>
</template>
<script async="" defer="" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD9_ksgcjjKLkpQZUdKsY9Djm7nkJjx2uw&callback=initMap">
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
      dialog: false,
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
    if(!store.state.user) this.$router.push('/signin')
    else{
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
    }
  },
  watch: {
    selectType: function () {
      // `this` points to the vm instance
      if(this.selectType=="Dog")this.selectImage ='/static/img/icons/dog.png';
      else this.selectImage= '/static/img/icons/cat.png';
    }

  },
  methods: {
    goToHome(){
      this.dialog = false;
      this.$router.push('/');
    },
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
      this.clearPhoto()
      this.dialog=true;
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
<style scoped="">
    #resgister{
  padding: 0px 20px;

      min-height: calc(100vh - 56px - 56px)!important;
      margin: -10px;
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
