<template>
<div id="FavoritePage">
  <v-layout row justify-center>
    
    <v-flex xs12 sm6 offset-sm3>
      <v-card>       
        <v-list three-line>
          <template v-for="item in items">
            
              <v-list-tile  @click.native="showDetail(item)" avatar>
                <v-list-tile-avatar>
                  <img v-bind:src="item.avatar"/>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title v-html="item.title"></v-list-tile-title>
                  <v-list-tile-sub-title v-html="item.subtitle"></v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            
          </template>
        </v-list>
      </v-card>
    </v-flex>

    <v-dialog v-model="dialog" fullscreen transition="v-dialog-bottom-transition" :overlay=false>
      <v-card>
        <v-card-row>
          <v-toolbar class="orange" light>
            <v-btn icon="icon" @click.native="dialog = false" light>
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>{{ dialog_title }}</v-toolbar-title>
            
          </v-toolbar>
        </v-card-row> 
        <v-layout row wrap>
          <v-flex xs10 offset-xs1>
            
                <img class="dialog_img"  v-bind:src="dialog_image_url">
          </v-flex>
          <v-flex xs10 offset-xs1>
           
              <v-card-text class="detail">{{ dialog_detail }}</v-card-text>
            
          </v-flex>
        </v-layout>
      </v-card>
    </v-dialog>
  </v-layout>
  <!-- support only mobile web screen only. -->

</div>
</template>

<script>
import {firebase} from '@/assets/js/FirebaseConfig'
import {store} from '../vuex/store'

//   { avatar: '/static/doc-images/lists/1.jpg', title: 'Brunch this weekend?', subtitle: "<span class='grey--text text--darken-2'>Ali Connors</span> — I'll be in your neighborhood doing errands this weekend. Do you want to hang out?" },          
//   { avatar: '/static/doc-images/lists/2.jpg', title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>', subtitle: "<span class='grey--text text--darken-2'>to Alex, Scott, Jennifer</span> — Wish I could come, but I'm out of town this weekend." },          
//   { avatar: '/static/doc-images/lists/3.jpg', title: 'Oui oui', subtitle: "<span class='grey--text text--darken-2'>Sandra Adams</span> — Do you have Paris recommendations? Have you ever been?" }
export default {
  name: 'signin',
  data () {
      return {
        items: [],
        dialog: false,
        dialog_detail: "",
        dialog_title: "",
        dialog_key: "",
        dialog_uid: "",
        dialog_image_url: 'https://firebasestorage.googleapis.com/v0/b/webtinker-c0bd8.appspot.com/o/images%2Fhelpmepets%2F1423749169-image-o.jpg?alt=media&token=a2ec52ce-7196-4c77-81fd-bccdb298286c'
      }
  },
  created: function(){
    this.loadUserFav();
  },

  methods: {
    showDetail: function(dataPet) {
        console.log('showDetail', dataPet);
        this.dialog_detail = dataPet.subtitle;
        this.dialog_title = dataPet.title;
        
        this.dialog_image_url = dataPet.avatar;
        this.dialog_key = dataPet.key;
        this.dialog_uid = dataPet.uid;
        this.dialog = true;
    },
    loadUserFav: function() {
        let uid = store.state.user.uid;
        let curObj = this;
        //console.log("uid", uid);
        if (uid && uid != '') {
            let usersFavRef = firebase.database().ref();
            usersFavRef.child('helpmepets_favorite').orderByChild("uid").equalTo(uid).on('child_added', function(snapshot) {
                console.log(snapshot.val());   
                let fav = snapshot.val();
                usersFavRef.child('helpmepets/'+fav.helpmepets_key).once('value', function(petSnap) {
                    console.log('child', petSnap.val());
                    let pet = petSnap.val();
                    // show( extend({}, userSnap.val(), mediaSnap.val()) );
                    let favData = {                
                        uid: fav.uid,
                        helpmepets_key: fav.helpmepets_key,
                        create_date: fav.create_date,
                        key: snapshot.key,
                        avatar: pet.img,
                        title: pet.type,
                        subtitle: pet.detail
                    }
                    curObj.items.push(favData);
                });             
            });
        }
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
   
    /* Optional: Makes the sample page fill the window. */
    html, body {
      height: 100%;
      margin: 0;
      padding: 0;
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
 background: #FFE5B6 url('/static/img/bg_light.png') no-repeat center center fixed !important;
 -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
 }
 #FavoritePage{
  
      min-height: calc(100vh - 56px - 56px)!important;
      margin: -10px;
    
 }
</style>