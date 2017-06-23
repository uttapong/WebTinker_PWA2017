<template>
<div id="signin">
  <div class="text-xs-center">
  <h2>Member Sign In</h2>
  </div>
  <div class="text-xs-center">
    <v-btn round class="indigo" large light  @click.native='fbSignIn'> Facebook</v-btn>
  </div>
    <div class="text-xs-center">
    <v-btn round class="red darken-2" large light > Google</v-btn>
  </div>
</div>
</template>
<script>
import {firebase} from '@/assets/js/FirebaseConfig'

export default {
  name: 'signin',
  data () {
    return {
    }
  },
  created: function(){
  },

  methods: {
      fbSignIn() {
        firebase.auth().getRedirectResult().then((result) => {
          console.log(result)
          if (result.credential) {
            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            let token = result.credential.accessToken;
            // [START_EXCLUDE]
            console.log(token)
          } else {
            console.log("get token error");
            // [END_EXCLUDE]
            this.toggleSignIn()
          }
          // The signed-in user info.
          let user = result.user;
        }).catch(function (error) {
          // Handle Errors here.
          let errorCode = error.code;
          let errorMessage = error.message;
          // The email of the user's account used.
          let email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          let credential = error.credential;
          // [START_EXCLUDE]
          if (errorCode === 'auth/account-exists-with-different-credential') {
            alert('You have already signed up with a different auth provider for that email.');
            // If you are using multiple auth providers on your app you should handle linking
            // the user's accounts here.
          } else {
            console.error(error);
          }
          // [END_EXCLUDE]
        });

      },
      fbSignIn() {
        console.log("xxxxx")
        firebase.auth().getRedirectResult().then((result) => {
          console.log(result)
          if (result.credential) {
            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            let token = result.credential.accessToken;
            // [START_EXCLUDE]
            console.log(token)
          } else {
            console.log("get token error");
            // [END_EXCLUDE]
            this.toggleSignIn()
          }
          // The signed-in user info.
          let user = result.user;
        }).catch(function (error) {
          // Handle Errors here.
          let errorCode = error.code;
          let errorMessage = error.message;
          // The email of the user's account used.
          let email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          let credential = error.credential;
          // [START_EXCLUDE]
          if (errorCode === 'auth/account-exists-with-different-credential') {
            alert('You have already signed up with a different auth provider for that email.');
            // If you are using multiple auth providers on your app you should handle linking
            // the user's accounts here.
          } else {
            console.error(error);
          }
          // [END_EXCLUDE]
        });

      },
      toggleSignIn(){
        if (!firebase.auth().currentUser) {
          // [START createprovider]
          var provider = new firebase.auth.FacebookAuthProvider();
          // [END createprovider]
          // [START addscopes]
          provider.addScope('user_birthday');
          // [END addscopes]
          // [START signin]
          firebase.auth().signInWithPopup(provider).then( (result)=> {
            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            // console.log('fb user returned')
            if(user)this.$router.push('/');

          }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // [START_EXCLUDE]
            if (errorCode === 'auth/account-exists-with-different-credential') {
              console.log('You have already signed up with a different auth provider for that email.');
              // If you are using multiple auth providers on your app you should handle linking
              // the user's accounts here.
            } else {
              console.error(error);
            }
            // [END_EXCLUDE]
          });
          // [END signin]
        } else {
          // [START signout]
          firebase.auth().signOut();
          // [END signout]
        }
        // [START_EXCLUDE]
        // document.getElementById('quickstart-sign-in').disabled = true;

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
