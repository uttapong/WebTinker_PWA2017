<template>
    <div id="FavoritePage">
        <div id="signin" v-if="uid == null">
            <div class="text-xs-center">
                <h2>
                    Please Sign In
                </h2>
            </div>
            <div class="text-xs-center">
                <v-btn @click.native="gotoSignIn" class="deep-orange" large="" light="" round="">
                    Sign-In
                </v-btn>
            </div>
        </div>
        <v-layout justify-center="" row="" v-if="uid != null">
            <v-flex offset-sm3="" sm6="" xs12="">
                <v-card>
                    <v-list three-line="">
                        <template v-for="item in items">
                            <v-list-tile avatar="">
                                <v-list-tile-avatar>
                                    <img v-bind:src="item.avatar"/>
                                </v-list-tile-avatar>
                                <v-list-tile-content>
                                    <v-list-tile-title v-html="item.title">
                                    </v-list-tile-title>
                                    <v-list-tile-sub-title v-html="item.subtitle">
                                    </v-list-tile-sub-title>
                                    <v-flex offset-xs8="" xs5="">
                                        <v-btn @click.native="share" class="green--text darken-1" flat="flat">
                                            <network class="text-xs-right" network="facebook">
                                                <i class="fa fa-facebook">
                                                </i>
                                            </network>
                                        </v-btn>
                                    </v-flex>
                                </v-list-tile-content>
                            </v-list-tile>
                        </template>
                    </v-list>
                </v-card>
            </v-flex>
        </v-layout>
        <!-- support only mobile web screen only. -->
        <v-layout justify-center="" row="">
            <v-dialog v-model="dialog">
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
                            <i class="fa fa-facebook">
                            </i>
                        </v-btn>
                        <v-btn @click.native="dialog = false" class="green--text darken-1" flat="flat">
                            CLOSE
                        </v-btn>
                    </v-card-row>
                </v-card>
            </v-dialog>
        </v-layout>
    </div>
</template>
<script>
    import {firebase} from '@/assets/js/FirebaseConfig'
import {store} from '../vuex/store'
var SocialSharing = require('vue-social-sharing');

//   { avatar: '/static/doc-images/lists/1.jpg', title: 'Brunch this weekend?', subtitle: "<span class='grey--text text--darken-2'>Ali Connors</span> — I'll be in your neighborhood doing errands this weekend. Do you want to hang out?" },          
//   { avatar: '/static/doc-images/lists/2.jpg', title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>', subtitle: "<span class='grey--text text--darken-2'>to Alex, Scott, Jennifer</span> — Wish I could come, but I'm out of town this weekend." },          
//   { avatar: '/static/doc-images/lists/3.jpg', title: 'Oui oui', subtitle: "<span class='grey--text text--darken-2'>Sandra Adams</span> — Do you have Paris recommendations? Have you ever been?" }
export default {
  name: 'signin',
  component : {
  },
  data () {
      return {
        items: [],
        uid: null,
        dialog: false,
        dialog_detail: "test test",
        dialog_title: "Dog",
        dialog_key: "",
        dialog_uid: "",
        dialog_image_url: 'https://firebasestorage.googleapis.com/v0/b/webtinker-c0bd8.appspot.com/o/images%2Fhelpmepets%2F1423749169-image-o.jpg?alt=media&token=a2ec52ce-7196-4c77-81fd-bccdb298286c',
        dialog_favAlready: false,
        loadingFlag: false
      }
  },
  created: function(){
    this.loadUserFav();    
  },

  methods: {
    gotoSignIn: function() {
        this.$router.push('/signin');
    },
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
        let uid = (store.state.user!=null)?store.state.user.uid:null;
        let curObj = this;
        //console.log("uid", uid);
        if (uid!=null && uid != '') {
            this.uid = uid;
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
     /*background: #FFE5B6 url('/static/img/bg_light.png') no-repeat center center fixed !important;*/
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