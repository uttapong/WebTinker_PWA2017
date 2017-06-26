<template>
      <div id="signin">
          <div class="text-xs-center">
              <h2>
                  Sign In
              </h2>
          </div>
          
          <div class="text-xs-center">
              <v-btn @click.native='signIn("fb")' large class="indigo"  light="" round="">
                  Facebook
              </v-btn>
          </div>
          <div class="text-xs-center">
              <v-btn @click.native='signIn("google")' large class="red darken-2" light="" round="">
                   Google 
              </v-btn>
          </div>
      </div>
</template>
<script>
import {firebase} from '@/assets/js/FirebaseConfig'
import {store} from '../vuex/store'
export default {
  name: 'signin',
  data () {
    return {}
  }, 
  created: function(){
    //console.log('init created Singin.vue');
    firebase.auth().getRedirectResult().then(function(result) {             
      // console.log("getRedirectResult result.credential ", result.credential);   
      if (result.credential) {              
        let token = result.credential.accessToken;             
        // console.log('Current token: ',token);
        
      }    
      var user = result.user;        
    }).catch(function (error) {
      // console.log('signIn signInWithRedirect fail: ');
      // Handle Errors here.
      let errorCode = error.code;
      let errorMessage = error.message;            
      let email = error.email;          
      let credential = error.credential;
      
      if (errorCode === 'auth/account-exists-with-different-credential') {
        alert('You have already signed up with a different auth provider for that email.');
        // If you are using multiple auth providers on your app you should handle linking
        // the user's accounts here.
      } else {
        console.error(error);
      }            
    });

  }, 
  methods: {
      signIn(type) {
          var loginType = type;
          var provider;
          if(loginType=='fb') {
            provider= new firebase.auth.FacebookAuthProvider();
          }
          else {
            provider = new firebase.auth.GoogleAuthProvider();
          }
          // console.log('loginType: ',type);
          firebase.auth().signInWithRedirect(provider);          
      },
    

      toggleSignIn(provider){
        if (firebase.auth().currentUser) {
                         
          firebase.auth().signOut();
          
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
    #signin{
      min-height: calc(100vh - 56px - 56px)!important;
      margin: -10px;
    }
</style>
