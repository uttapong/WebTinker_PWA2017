<template>
      <div id="signin">
          <div class="text-xs-center">
              <h2>
                  Sign In
              </h2>
          </div>
          <!--<div class="text-xs-center">
              <v-btn @click.native='signIn("fb")' large class="indigo"  light="" round="">
                  Facebook
              </v-btn>
          </div>-->
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
    let uid = (store.state.user!=null)?store.state.user.uid:null;
    if (uid!=null && uid != '') {
      this.$router.push('/');
    }
    else {

    }
  },

  methods: {
      signIn(type) {
          var loginType = type;
          firebase.auth().getRedirectResult().then((result) => {
            console.log(result)
            if (result.credential) {
              // This gives you a Facebook Access Token. You can use it to access the Facebook API.
              let token = result.credential.accessToken;
              // [START_EXCLUDE]
              console.log('Current token: ',token)
            } else {
              //console.log("get token error");
              // [END_EXCLUDE]
              console.log("loginType is ", loginType);
              let provider;
              if(loginType=='fb') {
                provider= new firebase.auth.FacebookAuthProvider();
              }
              else {
                provider = new firebase.auth.GoogleAuthProvider();
              }
              provider.addScope('profile');
              provider.addScope('email');

              this.toggleSignIn(provider)
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
      /*+
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
      */
      toggleSignIn(provider){
        if (!firebase.auth().currentUser) {
         
          firebase.auth().signInWithRedirect(provider).then( (result)=> {
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
